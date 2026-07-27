import { onMounted } from 'vue'
import { usePhieuLuongDialog } from './use-phieu-luong-dialog'
import { usePhieuLuongFetch } from './use-phieu-luong-fetch'
import { usePhieuLuongFilter } from './use-phieu-luong-filter'
import { usePhieuLuongRows } from './use-phieu-luong-rows'
import { usePhieuLuongState } from './use-phieu-luong-state'
import { usePhieuLuongUrl } from './use-phieu-luong-url'

export function usePhieuLuongPage() {
  const state = usePhieuLuongState()
  const filter = usePhieuLuongFilter(state)
  const fetch = usePhieuLuongFetch(state)
  const rows = usePhieuLuongRows(state)
  const dialog = usePhieuLuongDialog()

  function applyMonthAndFetch(date: Date): void {
    filter.applySelectedMonth(date)
    url.syncUrl(date)
    void fetch.loadPayslip()
  }

  const url = usePhieuLuongUrl(state.selectedDate, applyMonthAndFetch)

  function handleMonthChange(date: Date | null): void {
    if (!date) return
    applyMonthAndFetch(date)
  }

  onMounted(() => {
    filter.initializeLinkManage()
    applyMonthAndFetch(url.initDateFromUrl())
  })

  return {
    ...state,
    ...filter,
    ...rows,
    ...dialog,
    handleMonthChange,
    reload: fetch.loadPayslip,
  }
}
