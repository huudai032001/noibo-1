import { computed, ref } from 'vue'
import { RESULT_OKRS_QUARTER_OPTIONS } from '../constants'

function getCurrentQuarter(today: Date = new Date()): number {
  const month = today.getMonth() + 1
  return Math.ceil(month / 3)
}

export function useResultOkrsFilters() {
  const name = ref('')
  const quarter = ref<number | null>(null)
  const year = ref<Date | null>(new Date())

  const quarterForQuery = computed(() => quarter.value ?? getCurrentQuarter())
  const yearForQuery = computed(() => (year.value ? year.value.getFullYear() : new Date().getFullYear()))

  function resetFilters(): void {
    name.value = ''
    quarter.value = null
    year.value = new Date()
  }

  return {
    name,
    quarter,
    year,
    quarterOptions: RESULT_OKRS_QUARTER_OPTIONS,
    quarterForQuery,
    yearForQuery,
    resetFilters,
  }
}
