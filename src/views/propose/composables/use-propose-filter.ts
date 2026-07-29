import { ref } from 'vue'
import type { ProposeListQuery } from '../models/propose.model'
import { formatMonthYear } from '../utils/propose-helpers'

export function useProposeFilter() {
  const month = ref<Date | null>(null)
  const category = ref<number | ''>('')
  const status = ref<number | ''>('')
  const keyword = ref('')
  const department = ref<number | ''>('')

  function buildQueryParams(page: number): ProposeListQuery {
    const params: ProposeListQuery = { page }

    if (month.value) {
      params.month = formatMonthYear(month.value)
    }
    if (category.value !== '') {
      params.category = category.value as ProposeListQuery['category']
    }
    if (status.value !== '') {
      params.status = status.value as ProposeListQuery['status']
    }
    if (keyword.value.trim()) {
      params.keyword = keyword.value.trim()
    }
    if (department.value !== '') {
      params.department = department.value
    }

    return params
  }

  function resetFilters(): void {
    month.value = null
    category.value = ''
    status.value = ''
    keyword.value = ''
    department.value = ''
  }

  return {
    month,
    category,
    status,
    keyword,
    department,
    buildQueryParams,
    resetFilters,
  }
}
