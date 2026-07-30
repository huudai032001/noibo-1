import { ref } from 'vue'
import { formatJobKpiMonth, getDefaultMonthDate } from '../utils/job-kpi-teamlead-helpers'
import type { JobKpiTeamleadListQuery } from '../models/job-kpi-teamlead.model'

export function useJobKpiTeamleadFilter() {
  const keyword = ref('')
  const month = ref<Date | null>(getDefaultMonthDate())
  const departmentId = ref<number | null>(null)
  const status = ref<number | null>(null)

  function buildQueryParams(page: number): JobKpiTeamleadListQuery {
    const params: JobKpiTeamleadListQuery = {
      page,
    }

    if (keyword.value.trim()) {
      params.keyword = keyword.value.trim()
    }

    if (month.value) {
      params.month = formatJobKpiMonth(month.value)
    }

    if (departmentId.value !== null && departmentId.value !== undefined) {
      params.departmentId = departmentId.value
    }

    if (status.value !== null && status.value !== undefined) {
      params.status = status.value
    }

    return params
  }

  function getMonthString(): string {
    if (!month.value) return ''
    return formatJobKpiMonth(month.value)
  }

  function resetFilters(): void {
    keyword.value = ''
    month.value = getDefaultMonthDate()
    departmentId.value = null
    status.value = null
  }

  return {
    keyword,
    month,
    departmentId,
    status,
    buildQueryParams,
    getMonthString,
    resetFilters,
  }
}
