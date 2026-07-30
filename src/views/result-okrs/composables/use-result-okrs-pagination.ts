import { computed, ref } from 'vue'
import { RESULT_OKRS_DEFAULT_PAGE_SIZE } from '../constants'

interface ResultOkrsPaginationMeta {
  total?: number
  currentPage?: number
  lastPage?: number
  perPage?: number
}

export function useResultOkrsPagination() {
  const currentPage = ref(1)
  const total = ref(0)
  const lastPage = ref(1)
  const perPage = ref(RESULT_OKRS_DEFAULT_PAGE_SIZE)

  const first = computed(() => (currentPage.value - 1) * perPage.value)

  function resetPage(): void {
    currentPage.value = 1
  }

  function setMeta(meta: ResultOkrsPaginationMeta): void {
    total.value = meta.total ?? 0
    currentPage.value = meta.currentPage ?? 1
    lastPage.value = meta.lastPage ?? 1
    perPage.value = meta.perPage ?? RESULT_OKRS_DEFAULT_PAGE_SIZE
  }

  function setPage(page: number): void {
    currentPage.value = page > 0 ? page : 1
  }

  return {
    currentPage,
    total,
    lastPage,
    perPage,
    first,
    resetPage,
    setMeta,
    setPage,
  }
}
