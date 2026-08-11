import {
  fetchErrorTargetProgressList,
  fetchErrorSummary,
  fetchBranches,
  fetchAreas,
  fetchChildUsers,
} from '../services/error-target-progress.service'
import type { ErrorTargetProgressState } from './use-error-target-progress-state'

export function useErrorTargetProgressFetch(state: ReturnType<any>) {
  const loadSummary = async () => {
    try {
      const response = await fetchErrorSummary(state.filters)
      state.summaryData.value = response.data || []
    } catch (error) {
      console.error('Error fetching summary:', error)
      state.summaryData.value = []
    }
  }

  const loadList = async () => {
    try {
      state.loading.value = true
      const params = {
        ...state.filters,
        page: state.currentPage.value,
      }
      const response = await fetchErrorTargetProgressList(params)
      state.tableData.value = response.data || []
      if (response.pagination) {
        state.totalRecords.value = response.pagination.total || 0
        state.pageSize.value = response.pagination.perPage || 25
      }
    } catch (error) {
      console.error('Error fetching list:', error)
      state.tableData.value = []
      state.totalRecords.value = 0
    } finally {
      state.loading.value = false
    }
  }

  const loadAreas = async () => {
    try {
      const response = await fetchAreas()
      state.areas.value = response.data || []
    } catch (error) {
      console.error('Error fetching areas:', error)
      state.areas.value = []
    }
  }

  const loadBranches = async (areaId?: number) => {
    try {
      const response = await fetchBranches(areaId ? { areaId } : undefined)
      state.branches.value = response.data || []
    } catch (error) {
      console.error('Error fetching branches:', error)
      state.branches.value = []
    }
  }

  const loadChildUsers = async (branchId?: number) => {
    try {
      const response = await fetchChildUsers(branchId)
      state.childUsers.value = response.data || []
    } catch (error) {
      console.error('Error fetching child users:', error)
      state.childUsers.value = []
    }
  }

  const loadData = async () => {
    await loadList()
    await loadSummary()
  }

  return {
    loadData,
    loadList,
    loadSummary,
    loadAreas,
    loadBranches,
    loadChildUsers,
  }
}
