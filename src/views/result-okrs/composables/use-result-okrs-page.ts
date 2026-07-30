import { useToast } from 'primevue/usetoast'
import { computed, onMounted } from 'vue'
import { useBreadcrumb } from '@/composables/use-breadcrumb'
import { useFormatter } from '@/composables/use-formatter'
import { RESULT_OKRS_STATUS_LABELS } from '../constants'
import type {
  ResultOkrsItemApi,
  ResultOkrsListItem,
  ResultOkrsListMeta,
  ResultOkrsListResponseApi,
} from '../models/result-okrs.model'
import { fetchResultOkrsList } from '../services/result-okrs.service'
import { useResultOkrsFilters } from './use-result-okrs-filters'
import { useResultOkrsPagination } from './use-result-okrs-pagination'
import { useResultOkrsState } from './use-result-okrs-state'
import { useResultOkrsUrl } from './use-result-okrs-url'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const maybeResponse = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return (
    maybeResponse.data?.message ||
    maybeResponse.response?.data?.message ||
    maybeResponse.message ||
    fallback
  )
}

function getQuarterLabel(quarter: number | null | undefined, year: number | null | undefined): string {
  if (!quarter || !year) return ''
  return `Quý ${quarter}/${year}`
}

function getTypeLabel(type: number | null | undefined): string {
  if (type === 1) return 'Cấp phòng ban'
  if (type === 2) return 'Cấp công ty'
  return ''
}

function getTypeClass(type: number | null | undefined): string {
  if (type === 1) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  if (type === 2) return 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
}

function getStatusLabel(status: number | null | undefined): string {
  const option = RESULT_OKRS_STATUS_LABELS.find((item) => item.value === (status ?? 0))
  return option?.label ?? 'Chưa được đánh giá'
}

function getStatusClass(status: number | null | undefined): string {
  if (status === 1) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  if (status === 2) return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
}

function readRowsMeta(
  response: ResultOkrsListResponseApi,
  currentPage: number,
  fallbackPerPage: number,
): ResultOkrsListMeta {
  const rawData = response.data
  if (Array.isArray(rawData)) {
    return {
      rows: rawData,
      total: rawData.length,
      currentPage,
      lastPage: 1,
      perPage: fallbackPerPage,
    }
  }

  return {
    rows: rawData?.data ?? [],
    total: rawData?.total ?? 0,
    currentPage: rawData?.currentPage ?? currentPage,
    lastPage: rawData?.lastPage ?? 1,
    perPage: rawData?.perPage ?? fallbackPerPage,
  }
}

function toListItem(
  item: ResultOkrsItemApi,
  formatPercent: (value: string | number | null | undefined, fractionDigits?: number) => string,
): ResultOkrsListItem {
  const exp = item.exp ?? 0
  const completionRate = item.okr?.completionRate ?? null
  return {
    id: item.id,
    name: item.okr?.name ?? '',
    departmentName: item.okr?.department?.name ?? '',
    quarterLabel: getQuarterLabel(item.okr?.quarter, item.okr?.year),
    typeLabel: getTypeLabel(item.okr?.type),
    typeClass: getTypeClass(item.okr?.type),
    exp,
    expLabel: `${exp.toLocaleString('vi-VN')} EXP`,
    leaderName: item.okr?.leader?.name ?? '',
    statusLabel: getStatusLabel(item.okr?.status),
    statusClass: getStatusClass(item.okr?.status),
    completionRate,
    completionRateLabel: completionRate === null ? 'Chưa có tiến độ' : formatPercent(completionRate, 0),
    feedback: item.feedback ?? '',
  }
}

export function useResultOkrsPage() {
  useBreadcrumb([
    { label: 'Application', to: '/' },
    { label: 'Hành chính' },
    { label: 'Kết quả OKRs', active: true },
  ])

  const toast = useToast()
  const { formatPercent } = useFormatter()
  const state = useResultOkrsState()
  const filters = useResultOkrsFilters()
  const pagination = useResultOkrsPagination()

  const url = useResultOkrsUrl(
    {
      name: filters.name,
      quarter: filters.quarter,
      year: filters.year,
      currentPage: pagination.currentPage,
    },
    {
      onFetch: async () => {
        await fetchList()
      },
    },
  )

  function showError(detail: string): void {
    toast.add({ severity: 'error', summary: 'Lỗi', detail, life: 5000 })
  }

  const totalExpLabel = computed(() => `${state.totalExp.value.toLocaleString('vi-VN')} EXP`)

  async function fetchList(): Promise<void> {
    state.setLoading(true)
    state.setErrorMessage('')
    try {
      const response = await fetchResultOkrsList({
        page: pagination.currentPage.value,
        name: filters.name.value.trim() || undefined,
        quarter: filters.quarterForQuery.value,
        year: filters.yearForQuery.value,
      })
      const meta = readRowsMeta(response, pagination.currentPage.value, pagination.perPage.value)
      state.setItems(meta.rows.map((item) => toListItem(item, formatPercent)))
      pagination.setMeta({
        total: meta.total,
        currentPage: meta.currentPage,
        lastPage: meta.lastPage,
        perPage: meta.perPage,
      })
    } catch (error) {
      state.setItems([])
      state.setErrorMessage(getApiErrorMessage(error, 'Không thể tải kết quả OKRs'))
      showError(state.errorMessage.value)
    } finally {
      state.setLoading(false)
    }
  }

  function handleResetFilters(): void {
    filters.resetFilters()
    pagination.resetPage()
  }

  function handlePageChange(page: number): void {
    pagination.setPage(page)
  }

  onMounted(() => {
    url.initFromUrl()
    void fetchList()
  })

  return {
    filters,
    pagination,
    items: state.items,
    loading: state.loading,
    errorMessage: state.errorMessage,
    totalExp: state.totalExp,
    totalExpLabel,
    fetchList,
    handleResetFilters,
    handlePageChange,
  }
}
