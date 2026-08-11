import { computed, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useErrorTargetProgressFilters } from './use-error-target-progress-filters'
import { useErrorTargetProgressData } from './use-error-target-progress-data'
import { useErrorTargetProgressUI } from './use-error-target-progress-ui'
import type { ErrorTargetProgressFilters } from './use-error-target-progress-filters'
import { ACCOUNT_TYPES, ACCOUNT_TYPE_MAP } from '../constants'

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

export function useErrorTargetProgressPage() {
  const authStore = useAuthStore()
  const { currentUser } = storeToRefs(authStore)

  const keyAccount = computed(() => currentUser.value?.accountType?.id ?? null)

  const filterState = useErrorTargetProgressFilters(keyAccount.value)
  const dataState = useErrorTargetProgressData(filterState.form as Ref<ErrorTargetProgressFilters>)
  const uiState = useErrorTargetProgressUI()

  // Initialize page - set default date range and load data
  const initializePage = async () => {
    filterState.setDateRangeToCurrentMonth()

    // Load areas if user is BOD or Regional account
    if (keyAccount.value === ACCOUNT_TYPES.BOD || keyAccount.value === ACCOUNT_TYPES.GDKV) {
      const areas = await dataState.fetchAreasList()
      filterState.areas.value = areas
    }

    // Load branches based on user type
    if (keyAccount.value && [ACCOUNT_TYPES.GDKV, ACCOUNT_TYPES.GDKHU_VUC, ACCOUNT_TYPES.GDVP].includes(keyAccount.value)) {
      const branches = await dataState.fetchBranchesList()
      filterState.branches.value = branches
      if (branches.length > 0 && !filterState.form.value.branchId) {
        filterState.form.value.branchId = branches[0].id
      }
    }

    // Load child users (staff list)
    const childUsers = await dataState.fetchChildUsersList(filterState.form.value.branchId)
    filterState.childUsers.value = childUsers

    // Initial data fetch
    if (filterState.form.value.branchId) {
      await dataState.refreshData()
    }
  }

  const handleAreaChange = async () => {
    if (filterState.form.value.areaId) {
      const branches = await dataState.fetchBranchesList(filterState.form.value.areaId)
      filterState.branches.value = branches
      if (branches.length > 0) {
        filterState.form.value.branchId = branches[0].id
      }
    }
  }

  const handleBranchChange = async () => {
    // Reload child users for selected branch
    const childUsers = await dataState.fetchChildUsersList(filterState.form.value.branchId)
    filterState.childUsers.value = childUsers
    filterState.form.value.saleId = null // Reset sale selection
    await dataState.refreshData()
  }

  const handleSaleChange = async () => {
    // When sale is selected, trigger filter
    await dataState.refreshData()
  }

  const handleFilter = async () => {
    dataState.resetPagination()
    await dataState.refreshData()
  }

  const handlePageChange = (page: number) => {
    dataState.goToPage(page)
  }

  const setupAutoFilter = () => {
    // Watch filter changes and auto-filter with debounce
    // Skip area and branch changes as they have their own handlers
    watch(
      () => ({
        saleId: filterState.form.value.saleId,
        viewAs: filterState.form.value.viewAs,
        accountTypeId: filterState.form.value.accountTypeId,
        typeError: filterState.form.value.typeError,
        goalType: filterState.form.value.goalType,
        dateRange: filterState.form.value.dateRange,
      }),
      () => {
        debouncedRefresh()
      },
      { deep: true }
    )
  }

  // Setup auto-filtering when page is initialized
  onMounted(() => {
    setupAutoFilter()
  })

  return {
    // State
    filters: filterState.form,
    branches: filterState.branches,
    areas: filterState.areas,
    childUsers: filterState.childUsers,
    errorTypes: filterState.errorTypes,
    goalTypes: filterState.goalTypes,
    watchAsOptions: filterState.watchAsOptions,
    positions: filterState.positions,
    mechanisms: filterState.mechanisms,
    loading: dataState.loading,
    tableData: dataState.tableData,
    summaryData: dataState.summaryData,
    currentPage: dataState.currentPage,
    pagination: dataState.pagination,
    isValidBranch: filterState.isValidBranch,
    filteredPositions: filterState.filteredPositions,
    canSelectArea: filterState.canSelectArea,
    canSelectBranch: filterState.canSelectBranch,
    showGoalTypeFilter: filterState.showGoalTypeFilter,
    isFullscreen: uiState.isFullscreen,
    isTableFullscreen: uiState.isTableFullscreen,
    showDialog: uiState.showDialog,
    selectedRow: uiState.selectedRow,
    keyAccount,

    // Methods
    initializePage,
    handleAreaChange,
    handleBranchChange,
    handleSaleChange,
    handleFilter,
    handlePageChange,
    toggleFullscreen: uiState.toggleFullscreen,
    toggleTableFullscreen: uiState.toggleTableFullscreen,
    openDialog: uiState.openDialog,
    closeDialog: uiState.closeDialog,
  }
}
