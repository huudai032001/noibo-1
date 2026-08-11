import { ref } from 'vue'
import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  fetchHumanResourceReport,
  fetchBranches,
  fetchAreas,
} from '../services/human-resource.service'
import { ACCOUNT_TYPES } from '../constants'
import type {
  HumanResourceReportResponse,
  StaffCountsByPosition,
  TotalLevelItem,
} from '../models/human-resource.model'
import type { HumanResourceFilters } from './use-human-resource-filters'

export function useHumanResourceData(filters: Ref<HumanResourceFilters>) {
  const toast = useToast()
  const loading = ref(false)
  const reportData: Ref<HumanResourceReportResponse> = ref({})
  const staffCounts: Ref<StaffCountsByPosition> = ref({})
  const totalLevels: Ref<TotalLevelItem> = ref({})

  const chartData: Ref<{
    startInYear: number[]
    offInYear: number[]
    totalInYear: number[]
    percentInYear: number[]
  }> = ref({
    startInYear: Array(12).fill(0),
    offInYear: Array(12).fill(0),
    totalInYear: Array(12).fill(0),
    percentInYear: Array(12).fill(0),
  })

  const fetchReport = async () => {
    try {
      loading.value = true
      const response = await fetchHumanResourceReport({
        branchId: filters.value.branchId ?? undefined,
        salaryMechanismId: filters.value.salaryMechanismId ?? undefined,
        year: filters.value.year ?? undefined,
      })

      reportData.value = response
      staffCounts.value = response.total_accounts ?? response.totalAccounts ?? {}
      totalLevels.value = response.total_level ?? response.totalLevel ?? {}

      // Calculate total staff count (sum of all positions)
      const totalStaff =
        (totalLevels.value[ACCOUNT_TYPES.GDVP] ?? 0) +
        (totalLevels.value[ACCOUNT_TYPES.SALE_LEADER] ?? 0) +
        (totalLevels.value[ACCOUNT_TYPES.SALE_MEMBER] ?? 0) +
        (typeof staffCounts.value[ACCOUNT_TYPES.SALE_INTERN] === 'number'
          ? staffCounts.value[ACCOUNT_TYPES.SALE_INTERN]
          : 0)

          
      chartData.value = {
        startInYear: response.data_start ?? response.dataStart ?? Array(12).fill(0),
        offInYear: response.data_off ?? response.dataOff ?? Array(12).fill(0),
        totalInYear: response.data_total ?? response.dataTotal ?? Array(12).fill(0),
        percentInYear: response.data_percent ?? response.dataPercent ?? Array(12).fill(0),
      }
      console.log(chartData.value, 'chartData');

    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải báo cáo nhân sự',
        life: 3000,
      })
      console.error('Failed to fetch human resource report:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchAreasList = async () => {
    try {
      const response = await fetchAreas()
      return response.data ?? []
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải danh sách khu vực',
        life: 3000,
      })
      console.error('Failed to fetch areas:', error)
      return []
    }
  }

  const fetchBranchesList = async (areaId?: number) => {
    try {
      const response = await fetchBranches(areaId ? { areaId } : undefined)
      return response.data ?? []
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tải danh sách văn phòng',
        life: 3000,
      })
      console.error('Failed to fetch branches:', error)
      return []
    }
  }

  const getStaffCount = (position: string): number | Record<string, number> => {
    return staffCounts.value[position] ?? 0
  }

  const getTotalLevel = (position: string): number => {
    return totalLevels.value[position] ?? 0
  }

  return {
    loading,
    reportData,
    staffCounts,
    totalLevels,
    chartData,
    fetchReport,
    fetchAreasList,
    fetchBranchesList,
    getStaffCount,
    getTotalLevel,
  }
}
