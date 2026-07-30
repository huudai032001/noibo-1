import { ref, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  createKra,
  fetchDepartmentsByHead,
  fetchKpiDetail,
  fetchKpiPersonalList,
  fetchKraHistory,
  updateKpiTeamLead,
  updateKraInfo,
} from '../services/job-kpi-teamlead.service'
import type {
  JobKpiCreateKraForm,
  JobKpiDepartmentOption,
  JobKpiDetailData,
  JobKpiKraHistoryItem,
  JobKpiTeamleadDialogState,
  JobKpiTeamleadListItem,
  JobKpiTeamleadListQuery,
  JobKpiUpdateKraPayload,
} from '../models/job-kpi-teamlead.model'
import {
  buildUpdatePayload,
  getApiErrorMessage,
  normalizeDetailData,
  normalizeHistoryItem,
  normalizeListResponse,
} from '../utils/job-kpi-teamlead-helpers'

interface TeamleadFetchState {
  items: Ref<JobKpiTeamleadListItem[]>
  departments: Ref<JobKpiDepartmentOption[]>
  detailData: Ref<JobKpiDetailData | null>
  setItems: (items: JobKpiTeamleadListItem[]) => void
  setDepartments: (items: JobKpiDepartmentOption[]) => void
  setDetailData: (value: JobKpiDetailData | null) => void
  setLoading: (value: boolean) => void
  setLoadingSearch: (value: boolean) => void
  setLoadingDetail: (value: boolean) => void
  setLoadingConfirm: (value: boolean) => void
  setLoadingCreateKra: (value: boolean) => void
  setLoadingHistory: (value: boolean) => void
  setError: (message: string) => void
  clearError: () => void
}

interface TeamleadFetchPagination {
  currentPage: Ref<number>
  setTotal: (value: number) => void
  setLastPage: (value: number) => void
  setPerPage: (value: number) => void
  setPage: (page: number) => void
}

interface TeamleadFetchFilter {
  buildQueryParams: (page: number) => JobKpiTeamleadListQuery
  getMonthString: () => string
}

interface TeamleadFetchDialogs {
  dialog: Ref<JobKpiTeamleadDialogState>
  openScore: (item: JobKpiTeamleadListItem, isViewOnly: boolean) => void
  closeScore: () => void
  closeConfirm: () => void
  closeCreateKra: () => void
}

export function useJobKpiTeamleadFetch(
  state: TeamleadFetchState,
  pagination: TeamleadFetchPagination,
  filter: TeamleadFetchFilter,
  dialogs: TeamleadFetchDialogs,
) {
  const toast = useToast()
  const authStore = useAuthStore()
  const { currentUser } = storeToRefs(authStore)
  const historyItems = ref<JobKpiKraHistoryItem[]>([])

  function showSuccess(message: string): void {
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 4000,
    })
  }

  function showError(message: string): void {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 5000,
    })
  }

  function showWarning(message: string): void {
    toast.add({
      severity: 'warn',
      summary: 'Cảnh báo',
      detail: message,
      life: 4000,
    })
  }

  async function loadDepartments(): Promise<void> {
    const userId = currentUser.value?.id
    if (!userId) return

    try {
      const departments = await fetchDepartmentsByHead(userId)
      state.setDepartments(departments)
    } catch (error) {
      showError(getApiErrorMessage(error, 'Không thể tải danh sách đơn vị'))
    }
  }

  async function loadList(): Promise<void> {
    const softReload = state.items.value.length > 0
    if (!softReload) state.setLoading(true)
    state.setLoadingSearch(true)
    state.clearError()

    try {
      const response = await fetchKpiPersonalList(
        filter.buildQueryParams(pagination.currentPage.value),
      )
      const normalized = normalizeListResponse(response)
      state.setItems(normalized.items)
      pagination.setTotal(normalized.total)
      pagination.setLastPage(normalized.lastPage)
      pagination.setPerPage(normalized.perPage)
      pagination.setPage(normalized.currentPage || pagination.currentPage.value)
    } catch (error) {
      const message = getApiErrorMessage(error, 'Không thể tải danh sách KPI')
      state.setError(message)
      showError(message)
    } finally {
      state.setLoading(false)
      state.setLoadingSearch(false)
    }
  }

  async function openScoreDialog(
    item: JobKpiTeamleadListItem,
    isViewOnly: boolean,
  ): Promise<void> {
    if (!filter.getMonthString()) {
      showWarning('Vui lòng chọn tháng để tiếp tục')
      return
    }

    if (!item.user) {
      showError('Không tìm thấy user')
      return
    }

    state.setDetailData(null)
    state.resetFillSuggest()
    state.resetMeetingFillSuggest()
    dialogs.openScore(item, isViewOnly)
    state.setLoadingDetail(true)

    try {
      const response = await fetchKpiDetail({
        userId: item.user.id,
        month: filter.getMonthString(),
        departmentId: item.departmentId,
      })
      if (!dialogs.dialog.value.scoreVisible) return
      const detail = normalizeDetailData(response?.data)
      state.setDetailData(detail)
    } catch (error) {
      if (!dialogs.dialog.value.scoreVisible) return
      showError(getApiErrorMessage(error, 'Không thể tải chi tiết KPI'))
    } finally {
      state.setLoadingDetail(false)
    }
  }

  async function confirmScore(): Promise<boolean> {
    const userId = dialogs.dialog.value.userId
    const departmentId = dialogs.dialog.value.departmentId
    const detail = state.detailData.value
    const month = filter.getMonthString()

    if (!userId || !detail || !month) {
      showError('Thiếu dữ liệu để lưu điểm')
      return false
    }

    state.setLoadingConfirm(true)
    try {
      await updateKpiTeamLead(
        buildUpdatePayload({
          departmentId,
          userId,
          month,
          detail,
        }),
      )
      showSuccess('Chấm thành phẩm thành công!')
      dialogs.closeConfirm()
      dialogs.closeScore()
      state.setDetailData(null)
      await loadList()
      return true
    } catch (error) {
      showError(getApiErrorMessage(error, 'Chấm thành phẩm thất bại!'))
      return false
    } finally {
      state.setLoadingConfirm(false)
    }
  }

  async function saveKraInfo(payload: JobKpiUpdateKraPayload): Promise<boolean> {
    try {
      await updateKraInfo(payload)
      showSuccess(`Cập nhật KRA ${payload.name} thành công`)
      return true
    } catch (error) {
      showError(getApiErrorMessage(error, 'Cập nhật KRA thất bại'))
      return false
    }
  }

  async function submitCreateKra(form: JobKpiCreateKraForm): Promise<boolean> {
    const selected = dialogs.dialog.value.selectedItem
    if (!selected) {
      showError('Không tìm thấy nhân sự')
      return false
    }

    if (
      !form.name.trim() ||
      !form.requestResult.trim() ||
      !form.numberHour.trim() ||
      !form.percentScore.trim()
    ) {
      showWarning('Vui lòng nhập đầy đủ thông tin KRA')
      return false
    }

    state.setLoadingCreateKra(true)
    try {
      await createKra({
        userId: selected.userId,
        name: form.name.trim(),
        requestResult: form.requestResult.trim(),
        numberHour: form.numberHour.trim(),
        percentScore: form.percentScore.trim(),
      })
      showSuccess('Tạo KRA thành công')
      dialogs.closeCreateKra()
      await loadList()
      return true
    } catch (error) {
      showError(getApiErrorMessage(error, 'Tạo KRA thất bại'))
      return false
    } finally {
      state.setLoadingCreateKra(false)
    }
  }

  async function loadHistory(item: JobKpiTeamleadListItem): Promise<JobKpiKraHistoryItem[]> {
    state.setLoadingHistory(true)
    try {
      const response = await fetchKraHistory({
        userId: item.userId,
        year: item.year,
        month: item.month,
      })
      const rows = (response?.data ?? []).map(normalizeHistoryItem)
      historyItems.value = rows
      return rows
    } catch (error) {
      showError(getApiErrorMessage(error, 'Không thể tải lịch sử thay đổi'))
      historyItems.value = []
      return []
    } finally {
      state.setLoadingHistory(false)
    }
  }

  return {
    historyItems,
    loadDepartments,
    loadList,
    openScoreDialog,
    confirmScore,
    saveKraInfo,
    submitCreateKra,
    loadHistory,
    showSuccess,
    showError,
    showWarning,
  }
}
