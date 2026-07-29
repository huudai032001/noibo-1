import { type Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatMonthYear, parseMonthYear } from '../utils/propose-helpers'

interface ProposeUrlRefs {
  month: Ref<Date | null>
  category: Ref<number | ''>
  status: Ref<number | ''>
  keyword: Ref<string>
  department: Ref<number | ''>
  currentPage: Ref<number>
}

interface ProposeUrlOptions {
  includeKeyword?: boolean
  includeDepartment?: boolean
  onFetch: () => void | Promise<void>
}

function parseQueryNumber(value: unknown): number | '' {
  if (value === undefined || value === null || value === '') return ''
  const num = Number(value)
  return Number.isInteger(num) ? num : ''
}

function normalizeQuery(query: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    normalized[key] = String(value)
  }
  return normalized
}

function queriesEqual(
  left: Record<string, unknown>,
  right: Record<string, string>,
): boolean {
  const a = normalizeQuery(left)
  const b = normalizeQuery(right)
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if ((a[key] ?? '') !== (b[key] ?? '')) return false
  }
  return true
}

export function useProposeUrl(refs: ProposeUrlRefs, options: ProposeUrlOptions) {
  const route = useRoute()
  const router = useRouter()
  let applyingFromRoute = false
  let keywordTimer: ReturnType<typeof setTimeout> | null = null

  function buildQuery(): Record<string, string> {
    const query: Record<string, string> = {}

    if (refs.month.value) {
      query.month = formatMonthYear(refs.month.value)
    }
    if (refs.category.value !== '') {
      query.category = String(refs.category.value)
    }
    if (refs.status.value !== '') {
      query.status = String(refs.status.value)
    }
    if (options.includeKeyword && refs.keyword.value.trim()) {
      query.keyword = refs.keyword.value.trim()
    }
    if (options.includeDepartment && refs.department.value !== '') {
      query.department = String(refs.department.value)
    }
    if (refs.currentPage.value > 1) {
      query.page = String(refs.currentPage.value)
    }

    return query
  }

  function applyFromRoute(): void {
    applyingFromRoute = true

    const monthValue = route.query.month
    refs.month.value =
      typeof monthValue === 'string' && monthValue ? parseMonthYear(monthValue) : null
    refs.category.value = parseQueryNumber(route.query.category)
    refs.status.value = parseQueryNumber(route.query.status)

    if (options.includeKeyword) {
      refs.keyword.value =
        typeof route.query.keyword === 'string' ? route.query.keyword : ''
    }
    if (options.includeDepartment) {
      refs.department.value = parseQueryNumber(route.query.department)
    }

    const page = Number(route.query.page)
    refs.currentPage.value = page > 0 ? page : 1

    applyingFromRoute = false
  }

  function syncUrl(): void {
    const nextQuery = buildQuery()
    if (queriesEqual(route.query, nextQuery)) return

    void router.replace({ query: nextQuery })
  }

  function initFromUrl(): void {
    applyFromRoute()
  }

  function triggerFetch(): void {
    void options.onFetch()
  }

  function scheduleKeywordFetch(): void {
    if (keywordTimer) clearTimeout(keywordTimer)
    keywordTimer = setTimeout(() => {
      if (applyingFromRoute) return
      refs.currentPage.value = 1
      syncUrl()
      triggerFetch()
    }, 400)
  }

  watch(
    () => [refs.month.value, refs.category.value, refs.status.value, refs.department.value] as const,
    () => {
      if (applyingFromRoute) return
      refs.currentPage.value = 1
      syncUrl()
      triggerFetch()
    },
  )

  if (options.includeKeyword) {
    watch(
      () => refs.keyword.value,
      () => {
        if (applyingFromRoute) return
        scheduleKeywordFetch()
      },
    )
  }

  watch(
    () => route.query,
    () => {
      if (queriesEqual(route.query, buildQuery())) return
      applyFromRoute()
      triggerFetch()
    },
    { deep: true },
  )

  return {
    initFromUrl,
    syncUrl,
    syncPageToUrl(): void {
      syncUrl()
    },
  }
}
