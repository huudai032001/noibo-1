import { ref } from 'vue'

export function useChamCongPagination() {
  const currentPage = ref(1)
  const perPage = ref(15)
  const total = ref(0)

  function setPage(page: number): void {
    currentPage.value = page > 0 ? page : 1
  }

  function setTotal(value: number): void {
    total.value = value >= 0 ? value : 0
  }

  function resetPagination(): void {
    currentPage.value = 1
    total.value = 0
  }

  function handlePageChange(page: number): void {
    setPage(page)
  }

  return {
    currentPage,
    perPage,
    total,
    setPage,
    setTotal,
    resetPagination,
    handlePageChange,
  }
}
