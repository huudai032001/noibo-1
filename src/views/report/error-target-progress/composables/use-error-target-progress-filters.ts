import { ref, computed } from 'vue'
import {
  ACCOUNT_TYPE_MAP,
  DEFAULT_POSITIONS,
  ERROR_TYPES,
  GOAL_TYPES,
  WATCH_AS_OPTIONS,
} from '../constants'
import type {
  Area,
  Branch,
  ErrorTargetProgressFilters,
  Position,
  GoalType,
  ErrorType,
  WatchAsOption,
} from '../models/error-target-progress.model'

export interface HumanResourceFilters extends ErrorTargetProgressFilters {}

export function useErrorTargetProgressFilters(currentUserAccountType?: number) {
  const form = ref<ErrorTargetProgressFilters>({
    areaId: undefined,
    branchId: undefined,
    saleId: null,
    viewAs: undefined,
    accountTypeId: undefined,
    typeError: undefined,
    goalType: undefined,
    dateRange: undefined,
  })

  const areas = ref<Area[]>([])
  const branches = ref<Branch[]>([])
  const childUsers = ref<any[]>([])
  const errorTypes = ref<ErrorType[]>(ERROR_TYPES)
  const goalTypes = ref<GoalType[]>(GOAL_TYPES)
  const watchAsOptions = ref<WatchAsOption[]>(WATCH_AS_OPTIONS)
  const positions = ref<Position[]>(DEFAULT_POSITIONS)

  const mechanisms = ref([
    { id: 1, name: 'Lương cứng' },
    { id: 2, name: 'Lương mềm' },
    { id: 3, name: 'Lương cứng theo bậc' },
    { id: 4, name: 'Lương cứng cố định' },
    { id: 5, name: 'Lương cứng partime' },
  ])

  const isValidBranch = computed(() => {
    return form.value.branchId !== null && form.value.branchId !== undefined
  })

  const filteredPositions = computed(() => {
    if (!currentUserAccountType) return positions.value
    const allowedIds = ACCOUNT_TYPE_MAP[currentUserAccountType] || []
    return positions.value.filter((p) => allowedIds.includes(p.id as number))
  })

  const canSelectArea = computed(() => {
    return currentUserAccountType === 6 || currentUserAccountType === 7
  })

  const canSelectBranch = computed(() => {
    return [5, 6, 7].includes(currentUserAccountType || 0)
  })

  const showGoalTypeFilter = computed(() => {
    return form.value.typeError !== null && form.value.typeError !== undefined
  })

  const resetFilters = () => {
    form.value = {
      areaId: undefined,
      branchId: undefined,
      saleId: null,
      viewAs: undefined,
      accountTypeId: undefined,
      typeError: undefined,
      goalType: undefined,
      dateRange: undefined,
    }
  }

  const setDateRangeToCurrentMonth = () => {
    const today = new Date()
    const year = today.getFullYear()
    const monthIndex = today.getMonth()
    const mm = String(monthIndex + 1).padStart(2, '0')
    const startOfMonth = `${year}-${mm}-01`
    const lastDay = new Date(year, monthIndex + 1, 0).getDate()
    const endOfMonth = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`
    form.value.dateRange = [startOfMonth, endOfMonth]
  }

  return {
    form,
    areas,
    branches,
    childUsers,
    errorTypes,
    goalTypes,
    watchAsOptions,
    positions,
    mechanisms,
    isValidBranch,
    filteredPositions,
    canSelectArea,
    canSelectBranch,
    showGoalTypeFilter,
    resetFilters,
    setDateRangeToCurrentMonth,
  }
}
