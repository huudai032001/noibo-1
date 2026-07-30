import { ref } from 'vue'
import type { ManageOkrsListItem } from '../models/manage-okrs.model'

export function useManageOkrsDialogs() {
  const createVisible = ref(false)
  const editVisible = ref(false)
  const shareExpVisible = ref(false)
  const selectedItem = ref<ManageOkrsListItem | null>(null)

  function openCreate(): void {
    createVisible.value = true
  }

  function closeCreate(): void {
    createVisible.value = false
  }

  function openEdit(item: ManageOkrsListItem): void {
    selectedItem.value = item
    editVisible.value = true
  }

  function closeEdit(): void {
    editVisible.value = false
    selectedItem.value = null
  }

  function openShareExp(item: ManageOkrsListItem): void {
    selectedItem.value = item
    shareExpVisible.value = true
  }

  function closeShareExp(): void {
    shareExpVisible.value = false
    selectedItem.value = null
  }

  return {
    createVisible,
    editVisible,
    shareExpVisible,
    selectedItem,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    openShareExp,
    closeShareExp,
  }
}
