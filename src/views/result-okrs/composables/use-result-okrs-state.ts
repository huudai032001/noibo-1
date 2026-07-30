import { computed, ref } from 'vue'
import type { ResultOkrsListItem } from '../models/result-okrs.model'

export function useResultOkrsState() {
  const items = ref<ResultOkrsListItem[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  const totalExp = computed(() => items.value.reduce((sum, item) => sum + item.exp, 0))

  function setItems(nextItems: ResultOkrsListItem[]): void {
    items.value = nextItems
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function setErrorMessage(value: string): void {
    errorMessage.value = value
  }

  return {
    items,
    loading,
    errorMessage,
    totalExp,
    setItems,
    setLoading,
    setErrorMessage,
  }
}
