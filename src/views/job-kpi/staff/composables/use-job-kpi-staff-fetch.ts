import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import {
  fetchKraAndMeetingByUser,
  updatePersonalKraResult,
} from '../services/job-kpi-staff.service'
import type {
  JobKpiKraItem,
  JobKpiPersonalData,
  JobKpiResultFeedback,
  JobKpiStaffListQuery,
} from '../models/job-kpi-staff.model'
import {
  getApiErrorMessage,
  isFullyCompleted,
  normalizePersonalData,
  setFeedbackEntry,
  shouldShowCompletion,
} from '../utils/job-kpi-helpers'
import { JOB_KPI_STAFF_STATUS } from '../constants'

interface JobKpiFetchState {
  kraItems: Ref<JobKpiKraItem[]>
  personalData: Ref<JobKpiPersonalData | null>
  setPersonalData: (value: JobKpiPersonalData | null) => void
  setKraItems: (items: JobKpiKraItem[]) => void
  setLoading: (value: boolean) => void
  setLoadingSearch: (value: boolean) => void
  setError: (message: string) => void
  clearError: () => void
  syncInitialResults: (items: JobKpiKraItem[]) => void
  updateKraItem: (kraId: number, patch: Partial<JobKpiKraItem>) => void
  addSavingKraId: (kraId: number) => void
  removeSavingKraId: (kraId: number) => void
  setResultFeedback: (value: Map<number, JobKpiResultFeedback>) => void
  resultFeedback: Ref<Map<number, JobKpiResultFeedback>>
  initialResults: Ref<Map<number, string>>
}

interface JobKpiFetchPagination {
  currentPage: Ref<number>
  setTotal: (value: number) => void
  setLastPage: (value: number) => void
  setPerPage: (value: number) => void
  setPage: (page: number) => void
}

interface JobKpiFetchFilter {
  buildQueryParams: (page: number, userId: number) => JobKpiStaffListQuery
}

interface JobKpiFetchDialogs {
  openComplete: (isHappy: boolean) => void
}

export function useJobKpiStaffFetch(
  state: JobKpiFetchState,
  pagination: JobKpiFetchPagination,
  filter: JobKpiFetchFilter,
  dialogs: JobKpiFetchDialogs,
) {
  const toast = useToast()
  const authStore = useAuthStore()
  const { currentUser } = storeToRefs(authStore)

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

  function maybeOpenCompletion(items: JobKpiKraItem[]): void {
    if (!shouldShowCompletion(items)) return
    dialogs.openComplete(isFullyCompleted(items))
  }

  async function loadPersonalKpi(): Promise<void> {
    const userId = currentUser.value?.id
    if (!userId) {
      showError('Không tìm thấy người dùng')
      state.setError('Không tìm thấy người dùng')
      return
    }

    const softReload = state.kraItems.value.length > 0
    if (!softReload) state.setLoading(true)
    state.setLoadingSearch(true)
    state.clearError()

    try {
      const response = await fetchKraAndMeetingByUser(
        filter.buildQueryParams(pagination.currentPage.value, userId),
      )
      const personal = normalizePersonalData(response?.data)

      state.setPersonalData(personal)
      state.setKraItems(personal.details.data)
      state.syncInitialResults(personal.details.data)
      pagination.setTotal(personal.details.total)
      pagination.setLastPage(personal.details.lastPage)
      pagination.setPerPage(personal.details.perPage)
      pagination.setPage(personal.details.currentPage || pagination.currentPage.value)
      maybeOpenCompletion(personal.details.data)
    } catch (error) {
      const message = getApiErrorMessage(error, 'Không thể tải dữ liệu KPI')
      state.setError(message)
      showError(message)
    } finally {
      state.setLoading(false)
      state.setLoadingSearch(false)
    }
  }

  async function saveKraResult(kraId: number, result: string): Promise<boolean> {
    const trimmed = result.trim()
    if (!trimmed) {
      state.setResultFeedback(
        setFeedbackEntry(state.resultFeedback.value, kraId, {
          error: 'Thành phẩm không được để trống',
        }),
      )
      return false
    }

    const originalValue = state.initialResults.value.get(kraId) ?? ''
    if (trimmed === originalValue.trim()) {
      return true
    }

    state.addSavingKraId(kraId)
    state.setResultFeedback(
      setFeedbackEntry(state.resultFeedback.value, kraId, {}),
    )

    try {
      await updatePersonalKraResult({ kraId, result: trimmed })
      const nextInitial = new Map(state.initialResults.value)
      nextInitial.set(kraId, trimmed)
      state.initialResults.value = nextInitial
      state.updateKraItem(kraId, {
        results: trimmed,
        status: JOB_KPI_STAFF_STATUS.inputted,
      })
      state.setResultFeedback(
        setFeedbackEntry(state.resultFeedback.value, kraId, {
          success: 'Nhập thành phẩm thành công',
        }),
      )
      return true
    } catch (error) {
      const message = getApiErrorMessage(error, 'Nhập thành phẩm thất bại')
      state.setResultFeedback(
        setFeedbackEntry(state.resultFeedback.value, kraId, { error: message }),
      )
      return false
    } finally {
      state.removeSavingKraId(kraId)
    }
  }

  return {
    loadPersonalKpi,
    saveKraResult,
    showSuccess,
    showError,
    showWarning,
  }
}
