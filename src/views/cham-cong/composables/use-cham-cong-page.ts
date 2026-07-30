import { onMounted } from 'vue'
import { useBreadcrumb } from '@/composables/use-breadcrumb'
import { useChamCongCalendar } from './use-cham-cong-calendar'
import { useChamCongDialog } from './use-cham-cong-dialog'
import { useChamCongFetch } from './use-cham-cong-fetch'
import { useChamCongFilter } from './use-cham-cong-filter'
import { useChamCongKeyboard } from './use-cham-cong-keyboard'
import { useChamCongLocale } from './use-cham-cong-locale'
import { useChamCongPagination } from './use-cham-cong-pagination'
import { useChamCongState } from './use-cham-cong-state'
import { useChamCongUrl } from './use-cham-cong-url'

export function useChamCongPage() {
  useBreadcrumb([
    { label: 'Application', to: '/' },
    { label: 'Hành chính' },
    { label: 'Chấm công', active: true },
  ])

  const state = useChamCongState()
  const filter = useChamCongFilter(state)
  const fetch = useChamCongFetch(state)
  const calendar = useChamCongCalendar(state)
  const dialog = useChamCongDialog()
  const pagination = useChamCongPagination()
  const url = useChamCongUrl(state.selectedDate, (date) => {
    void handleMonthChange(date, { syncUrl: false })
  })

  useChamCongLocale()

  async function loadForDate(date: Date, options: { syncUrl?: boolean } = {}): Promise<void> {
    const { syncUrl = true } = options
    pagination.resetPagination()
    const params = filter.applySelectedMonth(date)
    if (syncUrl) {
      url.syncUrl(new Date(date.getFullYear(), date.getMonth(), 1))
    }
    await fetch.loadAttendance({ ...params, page: pagination.currentPage.value })
  }

  async function handleMonthChange(
    date: Date,
    options: { syncUrl?: boolean } = {},
  ): Promise<void> {
    const { syncUrl = true } = options
    const next = new Date(date.getFullYear(), date.getMonth(), 1)
    state.setSelectedDate(next)
    pagination.resetPagination()
    const params = filter.applySelectedMonth(next)
    if (syncUrl) {
      url.syncUrl(next)
    }
    await fetch.loadAttendance({ ...params, page: pagination.currentPage.value })
  }

  /** PrimeVue DatePicker month-change emits 1-based month */
  async function handleCalendarMonthChange(event: { month: number; year: number }): Promise<void> {
    await handleMonthChange(new Date(event.year, event.month - 1, 1))
  }

  function handleSelectedDateChange(date: Date | Date[] | null | undefined): void {
    if (!date || Array.isArray(date)) return

    const dateKey = calendar.getDateKey(date.getFullYear(), date.getMonth(), date.getDate())
    if (!calendar.hasAttendance(dateKey)) return

    const entry = calendar.getEntry(dateKey)
    dialog.openDialog({
      dateKey,
      in: entry?.in ?? null,
      out: entry?.out ?? null,
      status: calendar.resolveStatus(entry, state.userType.value),
    })
  }

  async function handlePageChange(page: number): Promise<void> {
    pagination.handlePageChange(page)
    await fetch.loadAttendance({
      ...filter.buildQueryParams(),
      page: pagination.currentPage.value,
    })
  }

  function reload(): void {
    void fetch.loadAttendance({
      ...filter.buildQueryParams(),
      page: pagination.currentPage.value,
    })
  }

  useChamCongKeyboard(
    state.selectedDate,
    (date) => {
      void handleMonthChange(date)
    },
    { disabled: state.loading },
  )

  onMounted(() => {
    const initialDate = url.initDateFromUrl()
    void loadForDate(initialDate)
  })

  return {
    ...state,
    ...calendar,
    ...dialog,
    ...pagination,
    handleMonthChange,
    handleCalendarMonthChange,
    handleSelectedDateChange,
    handlePageChange,
    reload,
  }
}
