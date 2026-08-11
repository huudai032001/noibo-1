import { computed, watch, onMounted } from 'vue'
import { useBreadcrumb } from '@/composables/use-breadcrumb'
import { useErrorTargetProgressState } from './use-error-target-progress-state'
import { useErrorTargetProgressFilter } from './use-error-target-progress-filter'
import { useErrorTargetProgressFetch } from './use-error-target-progress-fetch'
import { getExportUrl } from '../services/error-target-progress.service'

// Debounce helper
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function useErrorTargetProgressPageV2() {
  useBreadcrumb([
    { label: 'Báo cáo', to: '/' },
    { label: 'Báo lỗi tiến độ mục tiêu', active: true },
  ])

  const state = useErrorTargetProgressState()
  const filter = useErrorTargetProgressFilter(state)
  const fetch = useErrorTargetProgressFetch(state)

  // Computed properties
  const pagination = computed(() => ({
    currentPage: state.currentPage.value,
    pageSize: state.pageSize.value,
    total: state.totalRecords.value,
    lastPage: Math.ceil(state.totalRecords.value / state.pageSize.value),
  }))

  const isValidBranch = computed(() => {
    return state.filters.branchId !== null && state.filters.branchId !== undefined
  })

  // Event handlers
  const handleAreaChange = async () => {
    if (state.filters.areaId) {
      await fetch.loadBranches(state.filters.areaId)
      if (state.branches.value.length > 0) {
        state.filters.branchId = state.branches.value[0].id
      }
    }
  }

  const handleBranchChange = async () => {
    await fetch.loadChildUsers(state.filters.branchId)
    state.filters.saleId = null
    filter.resetPagination()
    await fetch.loadData()
  }

  const handleSaleChange = async () => {
    filter.resetPagination()
    await fetch.loadData()
  }

  const handleFilterChange = async () => {
    filter.resetPagination()
    await fetch.loadData()
  }

  const handlePageChange = (page: number) => {
    state.currentPage.value = page
    void fetch.loadList()
  }

  const handleExport = () => {
    const url = getExportUrl(state.filters)
    window.open(url, '_blank')
  }

  const reload = async () => {
    await fetch.loadData()
  }

  // Auto-filtering with debounce
  const debouncedRefresh = debounce(async () => {
    filter.resetPagination()
    await fetch.loadData()
  }, 500)

  // Setup watchers
  const setupAutoFilter = () => {
    watch(
      () => ({
        saleId: state.filters.saleId,
        viewAs: state.filters.viewAs,
        accountTypeId: state.filters.accountTypeId,
        typeError: state.filters.typeError,
        goalType: state.filters.goalType,
        dateRange: state.filters.dateRange,
      }),
      () => {
        debouncedRefresh()
      },
      { deep: true }
    )
  }

  // Initialize page
  onMounted(async () => {
    // Set default date range first
    filter.initializeDateRange()

    // Setup auto-filter watcher
    setupAutoFilter()

    // Load areas if needed
    if (filter.canSelectArea.value) {
      await fetch.loadAreas()
    }

    // Load branches if needed
    if (filter.canSelectBranch.value) {
      await fetch.loadBranches()
      if (state.branches.value.length > 0 && !state.filters.branchId) {
        state.filters.branchId = state.branches.value[0].id
      }
    }

    // Load child users for selected branch
    if (state.filters.branchId) {
      await fetch.loadChildUsers(state.filters.branchId)
    }

    // Initial data fetch with current filters
    if (state.filters.branchId) {
      console.log('Loading initial data with filters:', {
        ...state.filters,
        page: state.currentPage.value,
      })
      await fetch.loadData()
    }
  })

  return {
    // State
    ...state,
    // Filters & options
    ...filter,
    // Computed
    pagination,
    isValidBranch,
    // Handlers
    handleAreaChange,
    handleBranchChange,
    handleSaleChange,
    handleFilterChange,
    handlePageChange,
    handleExport,
    reload,
  }
}
