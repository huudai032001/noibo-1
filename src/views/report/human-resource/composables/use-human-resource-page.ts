import { computed } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useHumanResourceFilters } from './use-human-resource-filters'
import { useHumanResourceData } from './use-human-resource-data'
import { useHumanResourceUi } from './use-human-resource-ui'
import { useHumanResourceChart } from './use-human-resource-chart'
import type { HumanResourceFilters } from './use-human-resource-filters'
import { ACCOUNT_TYPES } from '../constants'

export function useHumanResourcePage() {
  const authStore = useAuthStore()
  const { currentUser } = storeToRefs(authStore)

  const filterState = useHumanResourceFilters()
  const dataState = useHumanResourceData(filterState.form as Ref<HumanResourceFilters>)
  const uiState = useHumanResourceUi()
  const { chartConfig, chartDatatest } = useHumanResourceChart(dataState.chartData, filterState.form.year)

  // Get keyAccount from accountType.id (6 for regional account)
  const keyAccount = computed(() => currentUser.value?.accountType?.id ?? null)

  const isGDKVUser = computed(() => {
    if (!currentUser.value?.accountType?.id) return false
    const accountTypeId = currentUser.value.accountType.id
    return (
      accountTypeId === ACCOUNT_TYPES.GDKV || accountTypeId === ACCOUNT_TYPES.HANH_CHINH_KHU_VUC
    )
  })

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
    await dataState.fetchReport()
  }

  const handleMechanismChange = async () => {
    await dataState.fetchReport()
  }

  const handleYearChange = async () => {
    await dataState.fetchReport()
  }

  const initializePage = async () => {
    // Load regions if keyAccount === 6 (Regional account)
    
    if (keyAccount.value === 6) {
      const areas = await dataState.fetchAreasList()
      filterState.areas.value = areas
    }

    
    // If user is GDKV, load branches first and auto-fetch report
    if (isGDKVUser.value) {
      const branches = await dataState.fetchBranchesList()
      filterState.branches.value = branches
      if (branches.length > 0 && !filterState.form.value.branchId) {
        filterState.form.value.branchId = branches[0].id
        await dataState.fetchReport()
      }
    } else {
      // Non-GDKV users: fetch report data if branch already selected
      if (filterState.form.value.branchId) {
        await dataState.fetchReport()
      }
    }
  }

  return {
    // State
    filters: filterState.form,
    branches: filterState.branches,
    areas: filterState.areas,
    mechanisms: filterState.mechanisms,
    loading: dataState.loading,
    reportData: dataState.reportData,
    chartData: dataState.chartData,
    chartConfig,
    chartDatatest,
    isValidBranch: filterState.isValidBranch,
    isFullTree: uiState.isFullTree,
    isFullDetail: uiState.isFullDetail,
    pickerOptions: uiState.pickerOptions,
    keyAccount,
    isGDKVUser,

    // Methods
    getStaffCount: dataState.getStaffCount,
    getTotalLevel: dataState.getTotalLevel,
    handleAreaChange,
    handleBranchChange,
    handleMechanismChange,
    handleYearChange,
    toggleFullTree: uiState.toggleFullTree,
    toggleFullDetail: uiState.toggleFullDetail,
    initializePage,
  }
}
