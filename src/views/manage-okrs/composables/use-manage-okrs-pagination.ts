import { computed, ref } from 'vue'
import { MANAGE_OKRS_DEFAULT_PAGE_SIZE } from '../constants'

export function useManageOkrsPagination() {
  const currentPage = ref(1)
  const total = ref(0)
  const lastPage = ref(1)
  const perPage = ref(MANAGE_OKRS_DEFAULT_PAGE_SIZE)

  const first = computed(() => (currentPage.value - 1) * perPage.value)

  function resetPage(): void {
    currentPage.value = 1
  }

  function setMeta(meta: {
    total?: number
    currentPage?: number
    lastPage?: number
    perPage?: number
  }): void {
    total.value = meta.total ?? 0
    currentPage.value = meta.currentPage ?? 1
    lastPage.value = meta.lastPage ?? 1
    perPage.value = meta.perPage ?? MANAGE_OKRS_DEFAULT_PAGE_SIZE
  }

  return {
    currentPage,
    total,
    lastPage,
    perPage,
    first,
    resetPage,
    setMeta,
  }
}
