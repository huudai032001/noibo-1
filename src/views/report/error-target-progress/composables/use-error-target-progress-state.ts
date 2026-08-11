import { ref } from 'vue'
import type { ErrorTargetProgressItem } from '../models/error-target-progress.model'

export interface ErrorTargetProgressFilters {
  areaId?: number
  branchId?: number
  saleId?: number | null
  viewAs?: number
  accountTypeId?: number
  typeError?: number
  goalType?: number
  dateRange?: [string, string]
}

export function useErrorTargetProgressState() {
  // Filter state
  const filters = ref<ErrorTargetProgressFilters>({
    areaId: undefined,
    branchId: undefined,
    saleId: null,
    viewAs: undefined,
    accountTypeId: undefined,
    typeError: undefined,
    goalType: undefined,
    dateRange: undefined,
  })

  // Data state
  const summaryData = ref<any[]>([])
  const tableData = ref<ErrorTargetProgressItem[]>([])
  const childUsers = ref<any[]>([])

  // UI state
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(25)
  const totalRecords = ref(0)

  // Options state
  const areas = ref<any[]>([])
  const branches = ref<any[]>([])

  return {
    filters,
    summaryData,
    tableData,
    childUsers,
    loading,
    currentPage,
    pageSize,
    totalRecords,
    areas,
    branches,
  }
}
