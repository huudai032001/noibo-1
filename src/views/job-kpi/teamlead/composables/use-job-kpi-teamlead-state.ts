import { ref } from 'vue'
import type {
  JobKpiDepartmentOption,
  JobKpiDetailData,
  JobKpiDetailKraItem,
  JobKpiFillSuggestState,
  JobKpiMeetingFillSuggestState,
  JobKpiTeamleadListItem,
  JobKpiWeekMeetingRow,
} from '../models/job-kpi-teamlead.model'

function createFillSuggest(): JobKpiFillSuggestState {
  return {
    visible: false,
    kraId: null,
    week: null,
    percent: null,
  }
}

function createMeetingFillSuggest(): JobKpiMeetingFillSuggestState {
  return {
    visible: false,
    criteriaId: null,
    weekNumber: null,
    score: null,
    label: '',
  }
}

export function useJobKpiTeamleadState() {
  const items = ref<JobKpiTeamleadListItem[]>([])
  const departments = ref<JobKpiDepartmentOption[]>([])
  const detailData = ref<JobKpiDetailData | null>(null)
  const loading = ref(false)
  const loadingSearch = ref(false)
  const loadingDetail = ref(false)
  const loadingConfirm = ref(false)
  const loadingCreateKra = ref(false)
  const loadingHistory = ref(false)
  const errorMessage = ref('')
  const fillSuggest = ref<JobKpiFillSuggestState>(createFillSuggest())
  const meetingFillSuggest = ref<JobKpiMeetingFillSuggestState>(createMeetingFillSuggest())

  function setItems(value: JobKpiTeamleadListItem[]): void {
    items.value = value
  }

  function setDepartments(value: JobKpiDepartmentOption[]): void {
    departments.value = value
  }

  function setDetailData(value: JobKpiDetailData | null): void {
    detailData.value = value
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function setLoadingSearch(value: boolean): void {
    loadingSearch.value = value
  }

  function setLoadingDetail(value: boolean): void {
    loadingDetail.value = value
  }

  function setLoadingConfirm(value: boolean): void {
    loadingConfirm.value = value
  }

  function setLoadingCreateKra(value: boolean): void {
    loadingCreateKra.value = value
  }

  function setLoadingHistory(value: boolean): void {
    loadingHistory.value = value
  }

  function setError(message: string): void {
    errorMessage.value = message
  }

  function clearError(): void {
    errorMessage.value = ''
  }

  function updateDetailKra(kraId: number, patch: Partial<JobKpiDetailKraItem>): void {
    if (!detailData.value) return
    detailData.value = {
      ...detailData.value,
      details: detailData.value.details.map((item) =>
        item.id === kraId ? { ...item, ...patch } : item,
      ),
    }
  }

  function setDetailDescription(value: string): void {
    if (!detailData.value) return
    detailData.value = {
      ...detailData.value,
      description: value,
    }
  }

  function setDetailTotals(params: {
    totalPercentKra?: number | null
    totalScoreMeeting?: number | null
  }): void {
    if (!detailData.value) return
    detailData.value = {
      ...detailData.value,
      ...(params.totalPercentKra !== undefined
        ? { totalPercentKra: params.totalPercentKra }
        : {}),
      ...(params.totalScoreMeeting !== undefined
        ? { totalScoreMeeting: params.totalScoreMeeting }
        : {}),
    }
  }

  function setWeekMeetings(rows: JobKpiWeekMeetingRow[]): void {
    if (!detailData.value) return
    detailData.value = {
      ...detailData.value,
      weekMeetings: rows,
    }
  }

  function setFillSuggest(value: JobKpiFillSuggestState): void {
    fillSuggest.value = value
  }

  function resetFillSuggest(): void {
    fillSuggest.value = createFillSuggest()
  }

  function setMeetingFillSuggest(value: JobKpiMeetingFillSuggestState): void {
    meetingFillSuggest.value = value
  }

  function resetMeetingFillSuggest(): void {
    meetingFillSuggest.value = createMeetingFillSuggest()
  }

  return {
    items,
    departments,
    detailData,
    loading,
    loadingSearch,
    loadingDetail,
    loadingConfirm,
    loadingCreateKra,
    loadingHistory,
    errorMessage,
    fillSuggest,
    meetingFillSuggest,
    setItems,
    setDepartments,
    setDetailData,
    setLoading,
    setLoadingSearch,
    setLoadingDetail,
    setLoadingConfirm,
    setLoadingCreateKra,
    setLoadingHistory,
    setError,
    clearError,
    updateDetailKra,
    setDetailDescription,
    setDetailTotals,
    setWeekMeetings,
    setFillSuggest,
    resetFillSuggest,
    setMeetingFillSuggest,
    resetMeetingFillSuggest,
  }
}
