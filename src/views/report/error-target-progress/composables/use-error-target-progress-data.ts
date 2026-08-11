import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import {
  fetchErrorTargetProgressList,
  fetchErrorSummary,
  fetchBranches,
  fetchAreas,
  fetchChildUsers,
} from '../services/error-target-progress.service'
import type {
  ErrorTargetProgressItem,
  Branch,
  Area,
  ChildUser,
  ErrorTargetProgressFilters,
} from '../models/error-target-progress.model'

export function useErrorTargetProgressData(filterForm: Ref<ErrorTargetProgressFilters>) {
  const loading = ref(false)
  const tableData = ref<ErrorTargetProgressItem[]>([])
  const summaryData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(25)
  const totalRecords = ref(0)

  const pagination = computed(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    total: totalRecords.value,
    lastPage: Math.ceil(totalRecords.value / pageSize.value),
  }))

  const fetchReport = async () => {
    console.log(1111);
    
    try {
      loading.value = true
      const params = {
        ...filterForm.value,
        page: currentPage.value,
      }
      const response = await fetchErrorTargetProgressList(params)
      tableData.value = response.data || []
      if (response.pagination) {
        totalRecords.value = response.pagination.total || 0
        pageSize.value = response.pagination.perPage || 25
      }
    } catch (error) {
      console.error('Error fetching error target progress:', error)
      tableData.value = []
      totalRecords.value = 0
    } finally {
      loading.value = false
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await fetchErrorSummary(filterForm.value)
      summaryData.value = response.data || []
    } catch (error) {
      console.error('Error fetching summary:', error)
      summaryData.value = []
    }
  }

  const fetchBranchesList = async (areaId?: number): Promise<Branch[]> => {
    try {
      const response = await fetchBranches(areaId ? { areaId } : undefined)
      return response.data || []
    } catch (error) {
      console.error('Error fetching branches:', error)
      return []
    }
  }

  const fetchAreasList = async (): Promise<Area[]> => {
    try {
      const response = await fetchAreas()
      return response.data || []
    } catch (error) {
      console.error('Error fetching areas:', error)
      return []
    }
  }

  const fetchChildUsersList = async (branchId?: number): Promise<ChildUser[]> => {
    try {
      const response = await fetchChildUsers(branchId)
      const users = response.data || []
      return users.map(user => ({
        ...user,
        label: user.name,
      }))
    } catch (error) {
      console.error('Error fetching child users:', error)
      return []
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  const goToPage = (page: number) => {
    currentPage.value = page
    fetchReport()
  }

  const refreshData = async () => {
    resetPagination()
    await Promise.all([fetchReport(), fetchSummary()])
  }

  return {
    loading,
    tableData,
    summaryData,
    currentPage,
    pageSize,
    totalRecords,
    pagination,
    fetchReport,
    fetchSummary,
    fetchBranchesList,
    fetchAreasList,
    fetchChildUsersList,
    resetPagination,
    goToPage,
    refreshData,
  }
}
