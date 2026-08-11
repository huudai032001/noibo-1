import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import {
  ACCOUNT_TYPE_MAP,
  DEFAULT_POSITIONS,
  ERROR_TYPES,
  GOAL_TYPES,
  WATCH_AS_OPTIONS,
  ACCOUNT_TYPES,
} from '../constants'

export function useErrorTargetProgressFilter(state: any) {
  const authStore = useAuthStore()
  const { currentUser } = storeToRefs(authStore)

  const keyAccount = computed(() => currentUser.value?.accountType?.id ?? null)

  const errorTypes = ERROR_TYPES
  const goalTypes = GOAL_TYPES
  const watchAsOptions = WATCH_AS_OPTIONS
  const positions = DEFAULT_POSITIONS

  const filteredPositions = computed(() => {
    if (!keyAccount.value) return positions
    const allowedIds = ACCOUNT_TYPE_MAP[keyAccount.value] || []
    return positions.filter((p) => allowedIds.includes(p.id as number))
  })

  const canSelectArea = computed(() => {
    return keyAccount.value === ACCOUNT_TYPES.BOD || keyAccount.value === ACCOUNT_TYPES.GDKV
  })

  const canSelectBranch = computed(() => {
    return [ACCOUNT_TYPES.GDKV, ACCOUNT_TYPES.GDKHU_VUC, ACCOUNT_TYPES.GDVP].includes(
      keyAccount.value || 0,
    )
  })

  const showGoalTypeFilter = computed(() => {
    return state.filters.typeError !== null && state.filters.typeError !== undefined
  })

  const showViewAsFilter = computed(() => {
    return state.filters.saleId !== null && state.filters.saleId !== undefined
  })

  const initializeDateRange = () => {
    const today = new Date()
    const year = today.getFullYear()
    const monthIndex = today.getMonth()
    const mm = String(monthIndex + 1).padStart(2, '0')
    const startOfMonth = `${year}-${mm}-01`
    const lastDay = new Date(year, monthIndex + 1, 0).getDate()
    const endOfMonth = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`
    state.filters.dateRange = [startOfMonth, endOfMonth]
  }

  const resetPagination = () => {
    state.currentPage.value = 1
  }

  const resetFilters = () => {
    state.filters.areaId = undefined
    state.filters.branchId = undefined
    state.filters.saleId = null
    state.filters.viewAs = undefined
    state.filters.accountTypeId = undefined
    state.filters.typeError = undefined
    state.filters.goalType = undefined
  }

  return {
    keyAccount,
    errorTypes,
    goalTypes,
    watchAsOptions,
    positions,
    filteredPositions,
    canSelectArea,
    canSelectBranch,
    showGoalTypeFilter,
    showViewAsFilter,
    initializeDateRange,
    resetPagination,
    resetFilters,
  }
}
