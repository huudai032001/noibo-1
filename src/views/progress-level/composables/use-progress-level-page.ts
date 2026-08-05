import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { ProgressLevelItemApi } from '../models/progress-level.model'
import {
  fetchProgressLevelList,
  fetchProgressLevelMinusPointDetail,
} from '../services/progress-level.service'

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

export function useProgressLevelPage() {
  const toast = useToast()

  const items = ref<ProgressLevelItemApi[]>([])
  const loading = ref(false)
  const yearFilter = ref(new Date().getFullYear())

  const years = computed(() => {
    const now = new Date().getFullYear()
    const startYear = 2025
    return Array.from(
      { length: Math.max(1, now - startYear + 1) },
      (_, i) => startYear + i,
    )
  })

  async function fetchList(): Promise<void> {
    loading.value = true
    try {
      const response = await fetchProgressLevelList({ year: yearFilter.value })
      items.value = response.data || []
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải dữ liệu')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
    } finally {
      loading.value = false
    }
  }

  async function loadDetailMinusPoint(item: ProgressLevelItemApi): Promise<void> {
    if (!item.user_id || !item.year || item.quarter === undefined) return

    item._minusLoading = true
    try {
      const response = await fetchProgressLevelMinusPointDetail({
        user_id: item.user_id,
        year: item.year,
        quarter: item.quarter,
      })
      item.minus_point = response.data
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải chi tiết trừ điểm')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
    } finally {
      item._minusLoading = false
    }
  }

  return {
    items,
    loading,
    yearFilter,
    years,
    fetchList,
    loadDetailMinusPoint,
  }
}
