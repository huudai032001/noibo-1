import { computed, onMounted } from 'vue'
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
import type { ProposeItem } from '../models/propose.model'

export function useProposePage() {
  const state = useProposeState()
  const filter = useProposeFilter()
  const pagination = useProposePagination()
  const dialogs = useProposeDialog()

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
    { onFetch: () => fetch.loadEmployeeList() },
  )

  const categoryTitle = computed(() => getCategoryLabel(state.formState.value.category))

  const showOvertimeTypeField = computed(() => {
    const accountTypeId = state.profileUser.value?.profile?.accountTypeId
    return accountTypeId === 16
  })

  async function search(): Promise<void> {
    await fetch.loadEmployeeList()
  }

  async function handlePageChange(page: number): Promise<void> {
    pagination.handlePageChange(page)
    url.syncPageToUrl()
    await fetch.loadEmployeeList()
  }

  function handleOpenCreate(): void {
    state.resetFormState()
    dialogs.openCreate()
  }

  function handleOpenDetail(item: ProposeItem): void {
    dialogs.openDetail(item)
  }

  function handleOpenDelete(item: ProposeItem): void {
    dialogs.openDelete(item)
  }

  async function handleConfirmDelete(): Promise<void> {
    const id = dialogs.dialog.value.deleteId
    if (!id) return

    const success = await fetch.submitDelete(id)
    if (!success) return

    dialogs.closeDelete()
    dialogs.closeDetail()
    await search()
  }

  async function handleCreate(): Promise<void> {
    if (!form.isCreateFormValid() || validation.hasFormErrors()) {
      validation.showWarning('Vui lòng nhập đủ các trường!')
      return
    }

    const payload = form.buildCreatePayload()
    const success = await fetch.submitCreate(payload)
    if (!success) return

    state.resetFormState()
    dialogs.closeCreate()
    await search()
  }

  function handleCreateOvertime(): void {
    if (state.formState.value.category === PROPOSE_CATEGORY.overtime && showOvertimeTypeField.value) {
      dialogs.openOvertimeType()
      return
    }
    void handleCreate()
  }

  async function handleConfirmOvertimeType(): Promise<void> {
    dialogs.closeOvertimeType()
    await handleCreate()
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
    await fetch.loadProfile()
    await search()
  })

  return {
    ...state,
    ...filter,
    ...pagination,
    ...dialogs,
    categoryTitle,
    showOvertimeTypeField,
    search,
    handlePageChange,
    handleOpenCreate,
    handleOpenDetail,
    handleOpenDelete,
    handleConfirmDelete,
    handleCreate,
    handleCreateOvertime,
    handleConfirmOvertimeType,
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
