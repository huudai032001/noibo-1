import { computed, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { MANAGEMENT_ACCOUNT_TYPE_IDS } from '../constants'
import { getMonthYearLabel, getMonthYearLongLabel, getStartOfMonth } from '../utils/payslip-helpers'

interface PhieuLuongFilterState {
  selectedDate: Ref<Date>
  startOfMonth: Ref<string>
  setSelectedDate: (date: Date) => void
  setStartOfMonth: (value: string) => void
  setLinkManage: (value: boolean) => void
}

export function usePhieuLuongFilter(state: PhieuLuongFilterState) {
  const authStore = useAuthStore()

  function initializeLinkManage(): void {
    const accountTypeId = authStore.currentUser?.accountType?.id
    const isManagement =
      accountTypeId !== undefined &&
      MANAGEMENT_ACCOUNT_TYPE_IDS.includes(
        accountTypeId as (typeof MANAGEMENT_ACCOUNT_TYPE_IDS)[number],
      )

    state.setLinkManage(!isManagement)
  }

  function applySelectedMonth(date: Date): void {
    state.setSelectedDate(date)
    state.setStartOfMonth(getStartOfMonth(date))
  }

  const monthYearLabel = computed(() => getMonthYearLabel(state.selectedDate.value))

  const monthYearLongLabel = computed(() => getMonthYearLongLabel(state.selectedDate.value))

  return {
    monthYearLabel,
    monthYearLongLabel,
    initializeLinkManage,
    applySelectedMonth,
  }
}
