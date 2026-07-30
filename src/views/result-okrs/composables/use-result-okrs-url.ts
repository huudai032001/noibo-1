import { type Ref, watch } from 'vue'
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router'

interface ResultOkrsUrlRefs {
  name: Ref<string>
  quarter: Ref<number | null>
  year: Ref<Date | null>
  currentPage: Ref<number>
}

interface ResultOkrsUrlOptions {
  onFetch: () => void | Promise<void>
}

interface ResultOkrsQueryState {
  name?: string
  quarter?: string
  year?: string
  page?: string
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

function normalizeQuery(query: ResultOkrsQueryState): ResultOkrsQueryState {
  const normalized: ResultOkrsQueryState = {}
  if (query.name) normalized.name = query.name
  if (query.quarter) normalized.quarter = query.quarter
  if (query.year) normalized.year = query.year
  if (query.page) normalized.page = query.page
  return normalized
}

function readStringQuery(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined
}

export function useResultOkrsUrl(refs: ResultOkrsUrlRefs, options: ResultOkrsUrlOptions) {
  const route = useRoute()
  const router = useRouter()
  let applyingFromRoute = false
  let keywordTimer: ReturnType<typeof setTimeout> | null = null

  function buildQuery(): LocationQueryRaw {
    const query: LocationQueryRaw = {}
    const name = refs.name.value.trim()
    if (name) query.name = name
    if (refs.quarter.value !== null) query.quarter = String(refs.quarter.value)
    if (refs.year.value) query.year = String(refs.year.value.getFullYear())
    if (refs.currentPage.value > 1) query.page = String(refs.currentPage.value)
    return query
  }

  function isSameQuery(): boolean {
    const currentQuery = normalizeQuery({
      name: readStringQuery(route.query.name),
      quarter: readStringQuery(route.query.quarter),
      year: readStringQuery(route.query.year),
      page: readStringQuery(route.query.page),
    })
    const nextQuery = normalizeQuery(buildQuery())
    return (
      currentQuery.name === nextQuery.name &&
      currentQuery.quarter === nextQuery.quarter &&
      currentQuery.year === nextQuery.year &&
      currentQuery.page === nextQuery.page
    )
  }

  function applyFromRoute(): void {
    applyingFromRoute = true
    refs.name.value = typeof route.query.name === 'string' ? route.query.name : ''
    refs.quarter.value = parseQueryNumber(route.query.quarter)
    refs.year.value = queryYearToDate(route.query.year)
    refs.currentPage.value = parseQueryNumber(route.query.page) ?? 1
    applyingFromRoute = false
  }

  function syncUrl(): void {
    if (isSameQuery()) return
    void router.replace({ query: buildQuery() })
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
      if (isSameQuery()) return
      applyFromRoute()
      fetchNow()
    },
    { deep: true },
  )

  return {
    initFromUrl,
  }
}
