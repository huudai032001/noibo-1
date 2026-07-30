import { computed, onMounted } from 'vue'
import { useBreadcrumb } from '@/composables/use-breadcrumb'
import { JOB_KPI_STAFF_STATUS, JOB_KPI_STAFF_TABS, type JobKpiStaffTab } from '../constants'
import type { JobKpiKraItem } from '../models/job-kpi-staff.model'
import { useJobKpiStaffDialog } from './use-job-kpi-staff-dialog'
import { useJobKpiStaffFetch } from './use-job-kpi-staff-fetch'
import { useJobKpiStaffFilter } from './use-job-kpi-staff-filter'
import { useJobKpiStaffPagination } from './use-job-kpi-staff-pagination'
import { useJobKpiStaffResult } from './use-job-kpi-staff-result'
import { useJobKpiStaffState } from './use-job-kpi-staff-state'

export function useJobKpiStaffPage() {
  useBreadcrumb([
    { label: 'Application', to: '/' },
    { label: 'Hành chính' },
    { label: 'KPI công việc', active: true },
  ])

  const state = useJobKpiStaffState()
  const filter = useJobKpiStaffFilter()
  const pagination = useJobKpiStaffPagination()
  const dialogs = useJobKpiStaffDialog()
  const fetch = useJobKpiStaffFetch(state, pagination, filter, dialogs)
  const resultHandlers = useJobKpiStaffResult({
    kraItems: state.kraItems,
    resultFeedback: state.resultFeedback,
    setResultFeedback: state.setResultFeedback,
    updateKraItem: state.updateKraItem,
    saveKraResult: fetch.saveKraResult,
  })

  const totalPercentKra = computed(() => state.personalData.value?.totalPercentKra ?? null)
  const totalScoreMeeting = computed(() => state.personalData.value?.totalScoreMeeting ?? null)
  const meetingDescription = computed(() => state.personalData.value?.description ?? '')
  const weekMeetings = computed(() => state.personalData.value?.weekMeetings ?? [])
  const weekCount = computed(() => state.personalData.value?.weekCount ?? 0)
  const inputtedCount = computed(
    () => state.kraItems.value.filter((item) => item.status === JOB_KPI_STAFF_STATUS.inputted).length,
  )
  const pendingCount = computed(
    () =>
      state.kraItems.value.filter((item) => item.status !== JOB_KPI_STAFF_STATUS.inputted).length,
  )

  async function search(): Promise<void> {
    await fetch.loadPersonalKpi()
  }

  async function handlePageChange(page: number): Promise<void> {
    pagination.handlePageChange(page)
    await search()
  }

  async function handleMonthChange(value: Date | null): Promise<void> {
    filter.month.value = value
    pagination.resetPagination()
    pagination.setPage(1)
    await search()
  }

  function handleTabChange(tab: string | number | JobKpiStaffTab): void {
    const nextTab = String(tab) as JobKpiStaffTab
    if (nextTab === JOB_KPI_STAFF_TABS.kpi || nextTab === JOB_KPI_STAFF_TABS.meeting) {
      state.setActiveTab(nextTab)
    }
  }

  function handleOpenDetail(item: JobKpiKraItem): void {
    dialogs.openDetail(item)
  }

  function handleCloseDetail(): void {
    dialogs.closeDetail()
  }

  function handleCloseComplete(): void {
    dialogs.closeComplete()
  }

  function reload(): void {
    void search()
  }

  async function handleResetFilters(): Promise<void> {
    filter.resetFilters()
    pagination.resetPagination()
    await search()
  }

  onMounted(async () => {
    await search()
  })

  return {
    ...state,
    ...filter,
    ...pagination,
    ...dialogs,
    totalPercentKra,
    totalScoreMeeting,
    meetingDescription,
    weekMeetings,
    weekCount,
    inputtedCount,
    pendingCount,
    search,
    reload,
    handlePageChange,
    handleMonthChange,
    handleTabChange,
    handleOpenDetail,
    handleCloseDetail,
    handleCloseComplete,
    handleResetFilters,
    onResultInput: resultHandlers.onResultInput,
  }
}
