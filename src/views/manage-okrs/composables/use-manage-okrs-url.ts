import { type Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface ManageOkrsUrlRefs {
  name: Ref<string>
  quarter: Ref<number | null>
  year: Ref<Date | null>
  currentPage: Ref<number>
}

interface ManageOkrsUrlOptions {
  onFetch: () => void | Promise<void>
}

function parseQueryNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

function queryYearToDate(value: unknown): Date | null {
  const year = parseQueryNumber(value)
  if (!year) return null
  return new Date(year, 0, 1)
}

function normalizeQuery(query: Record<string, unknown>): Record<string, string> {
  const normalized: Record<string, string> = {}
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    normalized[key] = String(value)
  })
  return normalized
}

function queriesEqual(left: Record<string, unknown>, right: Record<string, string>): boolean {
  const a = normalizeQuery(left)
  const b = normalizeQuery(right)
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if ((a[key] ?? '') !== (b[key] ?? '')) return false
  }
  return true
}

export function useManageOkrsUrl(refs: ManageOkrsUrlRefs, options: ManageOkrsUrlOptions) {
  const route = useRoute()
  const router = useRouter()
  let applyingFromRoute = false
  let keywordTimer: ReturnType<typeof setTimeout> | null = null

  function buildQuery(): Record<string, string> {
    const query: Record<string, string> = {}
    const name = refs.name.value.trim()
    if (name) query.name = name
    if (refs.quarter.value !== null) query.quarter = String(refs.quarter.value)
    if (refs.year.value) query.year = String(refs.year.value.getFullYear())
    if (refs.currentPage.value > 1) query.page = String(refs.currentPage.value)
    return query
  }

  function applyFromRoute(): void {
    applyingFromRoute = true
    refs.name.value = typeof route.query.name === 'string' ? route.query.name : ''
    refs.quarter.value = parseQueryNumber(route.query.quarter)
    refs.year.value = queryYearToDate(route.query.year)

    const page = Number(route.query.page)
    refs.currentPage.value = page > 0 ? page : 1
    applyingFromRoute = false
  }

  function syncUrl(): void {
    const nextQuery = buildQuery()
    if (queriesEqual(route.query, nextQuery)) return
    void router.replace({ query: nextQuery })
  }

  function fetchNow(): void {
    void options.onFetch()
  }

  function initFromUrl(): void {
    applyFromRoute()
  }

  function scheduleNameFetch(): void {
    if (keywordTimer) clearTimeout(keywordTimer)
    keywordTimer = setTimeout(() => {
      if (applyingFromRoute) return
      refs.currentPage.value = 1
      syncUrl()
      fetchNow()
    }, 400)
  }

  watch(
    () => [refs.quarter.value, refs.year.value?.getFullYear() ?? null] as const,
    () => {
      if (applyingFromRoute) return
      refs.currentPage.value = 1
      syncUrl()
      fetchNow()
    },
  )

  watch(
    () => refs.name.value,
    () => {
      if (applyingFromRoute) return
      scheduleNameFetch()
    },
  )

  watch(
    () => refs.currentPage.value,
    () => {
      if (applyingFromRoute) return
      syncUrl()
      fetchNow()
    },
  )

  watch(
    () => route.query,
    () => {
      if (queriesEqual(route.query, buildQuery())) return
      applyFromRoute()
      fetchNow()
    },
    { deep: true },
  )

  return {
    initFromUrl,
    syncUrl,
  }
}
