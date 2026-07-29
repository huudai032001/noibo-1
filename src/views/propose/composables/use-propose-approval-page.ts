import { computed, onMounted, ref } from 'vue'
import { useProposeDialog } from './use-propose-dialog'
import { useProposeFetch } from './use-propose-fetch'
import { useProposeFilter } from './use-propose-filter'
import { useProposeForm } from './use-propose-form'
import { useProposePagination } from './use-propose-pagination'
import { useProposeState } from './use-propose-state'
import { useProposeUrl } from './use-propose-url'
import { useProposeValidation } from './use-propose-validation'
import { getCategoryLabel } from '../utils/propose-helpers'
import { PROPOSE_CATEGORY } from '../constants'
import type { ProposeApprovalRoleFlags, ProposeItem } from '../models/propose.model'

export function useProposeApprovalPage() {
  const state = useProposeState()
  const filter = useProposeFilter()
  const pagination = useProposePagination()
  const dialogs = useProposeDialog()
  const roleFlags = ref<ProposeApprovalRoleFlags>({
    isBod: false,
    isTbp: false,
    isLeader: false,
    canCreate: true,
  })

  const fetch = useProposeFetch(state, pagination, filter)
  const form = useProposeForm({
    formState: state.formState,
    profileUser: state.profileUser,
    editPhoneNumber: state.editPhoneNumber,
  })
  const validation = useProposeValidation({
    formState: state.formState,
    formErrors: state.formErrors,
  })

  const url = useProposeUrl(
    {
      month: filter.month,
      category: filter.category,
      status: filter.status,
      keyword: filter.keyword,
      department: filter.department,
      currentPage: pagination.currentPage,
    },
    {
      includeKeyword: true,
      includeDepartment: true,
      onFetch: () => fetch.loadApprovalList(),
    },
  )

  const categoryTitle = computed(() => getCategoryLabel(state.formState.value.category))

  async function search(): Promise<void> {
    await fetch.loadApprovalList()
  }

  async function handlePageChange(page: number): Promise<void> {
    pagination.handlePageChange(page)
    url.syncPageToUrl()
    await fetch.loadApprovalList()
  }

  async function handleOpenDetail(item: ProposeItem): Promise<void> {
    dialogs.openDetail(item)
    const fingerprint = await fetch.loadFingerprint(item)
    dialogs.setFingerprint(fingerprint.start, fingerprint.end)
  }

  function handleOpenApprove(item: ProposeItem): void {
    if (item.category === PROPOSE_CATEGORY.overtime) {
      dialogs.openOvertimeType()
      dialogs.dialog.value.selectedItem = item
      dialogs.dialog.value.pendingDecideId = item.id
      dialogs.dialog.value.pendingDecideApproved = true
      return
    }
    dialogs.openApprove(item)
  }

  function handleOpenReject(item: ProposeItem): void {
    dialogs.openReject(item)
  }

  async function handleConfirmApprove(): Promise<void> {
    const id = dialogs.dialog.value.pendingDecideId
    if (!id) return

    const typeArise =
      dialogs.dialog.value.selectedItem?.category === PROPOSE_CATEGORY.overtime
        ? state.formState.value.typeArise
        : undefined

    const success = await fetch.submitDecide({
      id,
      status: true,
      typeArise,
    })

    if (!success) return

    dialogs.closeApprove()
    dialogs.closeOvertimeType()
    dialogs.closeDetail()
    await search()
  }

  async function handleConfirmReject(): Promise<void> {
    const id = dialogs.dialog.value.pendingDecideId
    const reason = dialogs.dialog.value.reasonForRefusal.trim()

    if (!id) return
    if (!reason) {
      fetch.showWarning('Vui lòng nhập lý do từ chối')
      return
    }

    const success = await fetch.submitDecide({
      id,
      status: false,
      reasonForRefusal: reason,
    })

    if (!success) return

    dialogs.closeReject()
    dialogs.closeDetail()
    await search()
  }

  function handleOpenCreate(): void {
    state.resetFormState()
    dialogs.openCreate()
  }

  async function handleCreate(): Promise<void> {
    if (!form.isCreateFormValid() || validation.hasFormErrors()) {
      validation.showWarning('Vui lòng nhập đủ các trường!')
      return
    }

    const success = await fetch.submitCreate(form.buildCreatePayload())
    if (!success) return

    state.resetFormState()
    dialogs.closeCreate()
    await search()
  }

  function handleCategoryChange(category: number): void {
    form.changeCategory(category)
  }

  function reload(): void {
    void search()
  }

  async function handleResetFilters(): Promise<void> {
    filter.resetFilters()
    pagination.resetPagination()
    url.syncUrl()
    await search()
  }

  onMounted(async () => {
    url.initFromUrl()
    roleFlags.value = await fetch.loadProfile()
    await fetch.loadDepartments()
    await search()
  })

  return {
    ...state,
    ...filter,
    ...pagination,
    ...dialogs,
    roleFlags,
    categoryTitle,
    search,
    handlePageChange,
    handleOpenDetail,
    handleOpenApprove,
    handleOpenReject,
    handleConfirmApprove,
    handleConfirmReject,
    handleOpenCreate,
    handleCreate,
    handleCategoryChange,
    reload,
    handleResetFilters,
    validateGeneralLeave: validation.validateGeneralLeave,
    validateDateRange: validation.validateDateRange,
    validateTimeRange: validation.validateTimeRange,
    validateShiftChange: validation.validateShiftChange,
    validatePhone: validation.validatePhone,
  }
}
