import { ref } from 'vue'
import type { ChamCongDetailPayload } from '../models/cham-cong.model'

export function useChamCongDialog() {
  const visible = ref(false)
  const detail = ref<ChamCongDetailPayload | null>(null)

  function openDialog(payload: ChamCongDetailPayload): void {
    detail.value = payload
    visible.value = true
  }

  function closeDialog(): void {
    visible.value = false
  }

  return {
    visible,
    detail,
    openDialog,
    closeDialog,
  }
}
