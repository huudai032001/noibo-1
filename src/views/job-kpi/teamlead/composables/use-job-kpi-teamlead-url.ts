import { type Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatJobKpiMonth, parseJobKpiMonth } from '../utils/job-kpi-teamlead-helpers'

interface JobKpiTeamleadUrlRefs {
  keyword: Ref<string>
  month: Ref<Date | null>
  departmentId: Ref<number | null>
  status: Ref<number | null>
  currentPage: Ref<number>
}

interface JobKpiTeamleadUrlOptions {
  onFetch: () => void | Promise<void>
}

function parseQueryNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null
  const num = Number(value)
  return Number.isInteger(num) ? num : null
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

export function useJobKpiTeamleadUrl(
  refs: JobKpiTeamleadUrlRefs,
  options: JobKpiTeamleadUrlOptions,
) {
  const route = useRoute()
  const router = useRouter()
  let applyingFromRoute = false
  let keywordTimer: ReturnType<typeof setTimeout> | null = null

  function buildQuery(): Record<string, string> {
    const query: Record<string, string> = {}

    if (refs.month.value) {
      query.month = formatJobKpiMonth(refs.month.value)
    }
    if (refs.keyword.value.trim()) {
      query.keyword = refs.keyword.value.trim()
    }
    if (refs.departmentId.value !== null && refs.departmentId.value !== undefined) {
      query.departmentId = String(refs.departmentId.value)
    }
    if (refs.status.value !== null && refs.status.value !== undefined) {
      query.status = String(refs.status.value)
    }
    if (refs.currentPage.value > 1) {
      query.page = String(refs.currentPage.value)
    }

    return query
  }

  function applyFromRoute(): void {
    applyingFromRoute = true

    const monthValue = route.query.month
    if (typeof monthValue === 'string' && monthValue) {
      const parsed = parseJobKpiMonth(monthValue)
      if (parsed) refs.month.value = parsed
    }

    refs.keyword.value =
      typeof route.query.keyword === 'string' ? route.query.keyword : ''
    refs.departmentId.value = parseQueryNumber(route.query.departmentId)
    refs.status.value = parseQueryNumber(route.query.status)

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
    () => [refs.month.value, refs.departmentId.value, refs.status.value] as const,
    () => {
      if (applyingFromRoute) return
      refs.currentPage.value = 1
      syncUrl()
      triggerFetch()
    },
  )

  watch(
    () => refs.keyword.value,
    () => {
      if (applyingFromRoute) return
      scheduleKeywordFetch()
    },
  )

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
