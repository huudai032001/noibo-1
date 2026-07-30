import { ref } from 'vue'
import type { JobKpiDialogState, JobKpiKraItem } from '../models/job-kpi-staff.model'

function createDefaultDialogState(): JobKpiDialogState {
  return {
    detailVisible: false,
    completeVisible: false,
    selectedItem: null,
    isHappyComplete: false,
    showFireworks: false,
  }
}

export function useJobKpiStaffDialog() {
  const dialog = ref<JobKpiDialogState>(createDefaultDialogState())

  function openDetail(item: JobKpiKraItem): void {
    dialog.value.selectedItem = item
    dialog.value.detailVisible = true
  }

  function closeDetail(): void {
    dialog.value.detailVisible = false
    dialog.value.selectedItem = null
  }

  function openComplete(isHappy: boolean): void {
    dialog.value.isHappyComplete = isHappy
    dialog.value.showFireworks = true
    dialog.value.completeVisible = true
  }

  function closeComplete(): void {
    dialog.value.completeVisible = false
    window.setTimeout(() => {
      dialog.value.showFireworks = false
    }, 2000)
    window.setTimeout(() => {
      dialog.value.isHappyComplete = false
    }, 300)
  }

  return {
    dialog,
    openDetail,
    closeDetail,
    openComplete,
    closeComplete,
  }
}
