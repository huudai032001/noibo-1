import { computed, ref } from 'vue'
import { JOB_KPI_STAFF_DEFAULT_PER_PAGE } from '../constants'

export function useJobKpiStaffPagination(defaultPerPage = JOB_KPI_STAFF_DEFAULT_PER_PAGE) {
  const currentPage = ref(1)
  const perPage = ref(defaultPerPage)
  const total = ref(0)
  const lastPage = ref(1)

  const pageCount = computed(() => Math.max(lastPage.value, 1))

  function setPage(page: number): void {
    currentPage.value = page > 0 ? page : 1
  }

  function setTotal(value: number): void {
    total.value = value >= 0 ? value : 0
  }

  function setLastPage(value: number): void {
    lastPage.value = value > 0 ? value : 1
  }

  function setPerPage(value: number): void {
    perPage.value = value > 0 ? value : defaultPerPage
  }

  function resetPagination(): void {
    currentPage.value = 1
    total.value = 0
    lastPage.value = 1
  }

  function handlePageChange(page: number): void {
    setPage(page)
  }

  return {
    currentPage,
    perPage,
    total,
    lastPage,
    pageCount,
    setPage,
    setTotal,
    setLastPage,
    setPerPage,
    resetPagination,
    handlePageChange,
  }
}
