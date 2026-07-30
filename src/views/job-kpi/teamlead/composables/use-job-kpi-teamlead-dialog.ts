import { ref } from 'vue'
import type {
  JobKpiTeamleadDialogState,
  JobKpiTeamleadListItem,
} from '../models/job-kpi-teamlead.model'

function createDefaultDialogState(): JobKpiTeamleadDialogState {
  return {
    scoreVisible: false,
    confirmVisible: false,
    createKraVisible: false,
    historyVisible: false,
    isViewOnly: false,
    selectedItem: null,
    userName: '',
    userId: null,
    departmentId: null,
  }
}

export function useJobKpiTeamleadDialog() {
  const dialog = ref<JobKpiTeamleadDialogState>(createDefaultDialogState())

  function openScore(item: JobKpiTeamleadListItem, isViewOnly: boolean): void {
    dialog.value.selectedItem = item
    dialog.value.userId = item.user?.id ?? item.userId
    dialog.value.userName = item.user?.name ?? ''
    dialog.value.departmentId = item.departmentId
    dialog.value.isViewOnly = isViewOnly
    dialog.value.scoreVisible = true
  }

  function closeScore(): void {
    dialog.value.scoreVisible = false
    dialog.value.confirmVisible = false
  }

  function openConfirm(): void {
    dialog.value.confirmVisible = true
  }

  function closeConfirm(): void {
    dialog.value.confirmVisible = false
  }

  function openCreateKra(item: JobKpiTeamleadListItem): void {
    dialog.value.selectedItem = item
    dialog.value.createKraVisible = true
  }

  function closeCreateKra(): void {
    dialog.value.createKraVisible = false
  }

  function openHistory(item: JobKpiTeamleadListItem): void {
    dialog.value.selectedItem = item
    dialog.value.historyVisible = true
  }

  function closeHistory(): void {
    dialog.value.historyVisible = false
  }

  function enableEditMode(): void {
    dialog.value.isViewOnly = false
  }

  return {
    dialog,
    openScore,
    closeScore,
    openConfirm,
    closeConfirm,
    openCreateKra,
    closeCreateKra,
    openHistory,
    closeHistory,
    enableEditMode,
  }
}
