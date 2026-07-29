import { ref } from 'vue'
import type { ProposeDialogState, ProposeItem } from '../models/propose.model'

function createDefaultDialogState(): ProposeDialogState {
  return {
    detailVisible: false,
    createVisible: false,
    deleteVisible: false,
    approveVisible: false,
    rejectVisible: false,
    overtimeTypeVisible: false,
    selectedItem: null,
    deleteId: null,
    reasonForRefusal: '',
    pendingDecideId: null,
    pendingDecideApproved: false,
  }
}

export function useProposeDialog() {
  const dialog = ref<ProposeDialogState>(createDefaultDialogState())
  const fingerprintStart = ref('')
  const fingerprintEnd = ref('')

  function openDetail(item: ProposeItem): void {
    dialog.value.selectedItem = item
    dialog.value.detailVisible = true
  }

  function closeDetail(): void {
    dialog.value.detailVisible = false
    dialog.value.selectedItem = null
    fingerprintStart.value = ''
    fingerprintEnd.value = ''
  }

  function openCreate(): void {
    dialog.value.createVisible = true
  }

  function closeCreate(): void {
    dialog.value.createVisible = false
  }

  function openDelete(item: ProposeItem): void {
    dialog.value.deleteId = item.id
    dialog.value.selectedItem = item
    dialog.value.deleteVisible = true
  }

  function closeDelete(): void {
    dialog.value.deleteVisible = false
    dialog.value.deleteId = null
  }

  function openApprove(item: ProposeItem): void {
    dialog.value.selectedItem = item
    dialog.value.pendingDecideId = item.id
    dialog.value.pendingDecideApproved = true
    dialog.value.approveVisible = true
  }

  function closeApprove(): void {
    dialog.value.approveVisible = false
    dialog.value.pendingDecideId = null
  }

  function openReject(item: ProposeItem): void {
    dialog.value.selectedItem = item
    dialog.value.pendingDecideId = item.id
    dialog.value.pendingDecideApproved = false
    dialog.value.reasonForRefusal = ''
    dialog.value.rejectVisible = true
  }

  function closeReject(): void {
    dialog.value.rejectVisible = false
    dialog.value.pendingDecideId = null
    dialog.value.reasonForRefusal = ''
  }

  function openOvertimeType(): void {
    dialog.value.overtimeTypeVisible = true
  }

  function closeOvertimeType(): void {
    dialog.value.overtimeTypeVisible = false
  }

  function setFingerprint(start: string, end: string): void {
    fingerprintStart.value = start
    fingerprintEnd.value = end
  }

  function setReasonForRefusal(value: string): void {
    dialog.value.reasonForRefusal = value
  }

  return {
    dialog,
    fingerprintStart,
    fingerprintEnd,
    openDetail,
    closeDetail,
    openCreate,
    closeCreate,
    openDelete,
    closeDelete,
    openApprove,
    closeApprove,
    openReject,
    closeReject,
    openOvertimeType,
    closeOvertimeType,
    setFingerprint,
    setReasonForRefusal,
  }
}
