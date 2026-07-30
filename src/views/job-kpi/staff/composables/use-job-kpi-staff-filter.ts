import { ref } from 'vue'
import { formatJobKpiMonth, getDefaultMonthDate } from '../utils/job-kpi-helpers'
import type { JobKpiStaffListQuery } from '../models/job-kpi-staff.model'

export function useJobKpiStaffFilter() {
  const month = ref<Date | null>(getDefaultMonthDate())

  function buildQueryParams(page: number, userId: number): JobKpiStaffListQuery {
    const params: JobKpiStaffListQuery = {
      page,
      userId,
    }

    if (month.value) {
      params.month = formatJobKpiMonth(month.value)
    }

    return params
  }

  function resetFilters(): void {
    month.value = getDefaultMonthDate()
  }

  return {
    month,
    buildQueryParams,
    resetFilters,
  }
}
