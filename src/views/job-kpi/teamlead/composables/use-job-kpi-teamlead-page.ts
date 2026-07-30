import { computed, onMounted, ref } from 'vue'
import { useBreadcrumb } from '@/composables/use-breadcrumb'
import { JOB_KPI_TEAMLEAD_STATUS } from '../constants'
import type {
  JobKpiCreateKraForm,
  JobKpiKraHistoryItem,
  JobKpiTeamleadListItem,
} from '../models/job-kpi-teamlead.model'
import { useJobKpiTeamleadDialog } from './use-job-kpi-teamlead-dialog'
import { useJobKpiTeamleadFetch } from './use-job-kpi-teamlead-fetch'
import { useJobKpiTeamleadFilter } from './use-job-kpi-teamlead-filter'
import { useJobKpiTeamleadPagination } from './use-job-kpi-teamlead-pagination'
import { useJobKpiTeamleadScore } from './use-job-kpi-teamlead-score'
import { useJobKpiTeamleadState } from './use-job-kpi-teamlead-state'
import { useJobKpiTeamleadUrl } from './use-job-kpi-teamlead-url'

function createEmptyKraForm(): JobKpiCreateKraForm {
  return {
    name: '',
    requestResult: '',
    numberHour: '',
    percentScore: '',
  }
}

export function useJobKpiTeamleadPage() {
  useBreadcrumb([
    { label: 'Application', to: '/' },
    { label: 'Hành chính' },
    { label: 'Chấm KPI và họp tuần', active: true },
  ])

  const state = useJobKpiTeamleadState()
  const filter = useJobKpiTeamleadFilter()
  const pagination = useJobKpiTeamleadPagination()
  const dialogs = useJobKpiTeamleadDialog()
  const fetch = useJobKpiTeamleadFetch(state, pagination, filter, dialogs)
  const score = useJobKpiTeamleadScore(state, fetch.saveKraInfo)

  const url = useJobKpiTeamleadUrl(
    {
      keyword: filter.keyword,
      month: filter.month,
      departmentId: filter.departmentId,
      status: filter.status,
      currentPage: pagination.currentPage,
    },
    {
      onFetch: () => fetch.loadList(),
    },
  )

  const createKraForm = ref<JobKpiCreateKraForm>(createEmptyKraForm())
  const selectedHistory = ref<JobKpiKraHistoryItem | null>(null)

  const needInputCount = computed(
    () =>
      state.items.value.filter(
        (item) => Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.needInput,
      ).length,
  )
  const needScoreCount = computed(
    () =>
      state.items.value.filter(
        (item) => Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.needScore,
      ).length,
  )
  const scoredCount = computed(
    () =>
      state.items.value.filter(
        (item) => Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.scored,
      ).length,
  )

  async function search(): Promise<void> {
    await fetch.loadList()
  }

  async function handlePageChange(page: number): Promise<void> {
    pagination.handlePageChange(page)
    url.syncPageToUrl()
    await search()
  }

  async function handleResetFilters(): Promise<void> {
    filter.resetFilters()
    pagination.resetPagination()
    url.syncUrl()
    await search()
  }

  async function handleOpenScore(item: JobKpiTeamleadListItem, viewOnly: boolean): Promise<void> {
    await fetch.openScoreDialog(item, viewOnly)
  }

  function handleCloseScore(): void {
    dialogs.closeScore()
    state.setDetailData(null)
    state.resetFillSuggest()
    state.resetMeetingFillSuggest()
  }

  function handleOpenConfirm(): void {
    dialogs.openConfirm()
  }

  function handleCloseConfirm(): void {
    dialogs.closeConfirm()
  }

  async function handleConfirmScore(): Promise<void> {
    await fetch.confirmScore()
  }

  function handleEnableEdit(): void {
    dialogs.enableEditMode()
  }

  function handleOpenCreateKra(item: JobKpiTeamleadListItem): void {
    createKraForm.value = createEmptyKraForm()
    dialogs.openCreateKra(item)
  }

  function handleCloseCreateKra(): void {
    dialogs.closeCreateKra()
    createKraForm.value = createEmptyKraForm()
  }

  async function handleSubmitCreateKra(): Promise<void> {
    await fetch.submitCreateKra(createKraForm.value)
  }

  async function handleOpenHistory(item: JobKpiTeamleadListItem): Promise<void> {
    dialogs.openHistory(item)
    const rows = await fetch.loadHistory(item)
    selectedHistory.value = rows[0] ?? null
  }

  function handleCloseHistory(): void {
    dialogs.closeHistory()
    selectedHistory.value = null
    fetch.historyItems.value = []
  }

  function handleSelectHistory(item: JobKpiKraHistoryItem): void {
    selectedHistory.value = item
  }

  function reload(): void {
    void search()
  }

  onMounted(async () => {
    url.initFromUrl()
    await Promise.all([fetch.loadDepartments(), search()])
  })

  return {
    ...state,
    ...filter,
    ...pagination,
    ...dialogs,
    ...score,
    historyItems: fetch.historyItems,
    createKraForm,
    selectedHistory,
    needInputCount,
    needScoreCount,
    scoredCount,
    search,
    reload,
    handlePageChange,
    handleResetFilters,
    handleOpenScore,
    handleCloseScore,
    handleOpenConfirm,
    handleCloseConfirm,
    handleConfirmScore,
    handleEnableEdit,
    handleOpenCreateKra,
    handleCloseCreateKra,
    handleSubmitCreateKra,
    handleOpenHistory,
    handleCloseHistory,
    handleSelectHistory,
  }
}
