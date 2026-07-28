import type { Ref } from 'vue'
import { useFormatter } from '@/composables/use-formatter'
import type { ChamCongQueryParams } from '../models/cham-cong.model'

interface ChamCongFilterState {
  selectedDate: Ref<Date>
  setSelectedDate: (date: Date) => void
}

export function useChamCongFilter(state: ChamCongFilterState) {
  const { formatDate } = useFormatter()

  function getMonthRange(date: Date): { from: string; to: string } {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    return {
      from: formatDate(start, 'dateStartByYear'),
      to: formatDate(end, 'dateStartByYear'),
    }
  }

  function buildQueryParams(date: Date = state.selectedDate.value): ChamCongQueryParams {
    return getMonthRange(date)
  }

  function applySelectedMonth(date: Date): ChamCongQueryParams {
    const next = new Date(date.getFullYear(), date.getMonth(), 1)
    state.setSelectedDate(next)
    return buildQueryParams(next)
  }

  function applyMonthChange(month: number, year: number): ChamCongQueryParams {
    // PrimeVue DatePicker month-change emits 1-based month
    return applySelectedMonth(new Date(year, month - 1, 1))
  }

  return {
    buildQueryParams,
    applySelectedMonth,
    applyMonthChange,
  }
}
