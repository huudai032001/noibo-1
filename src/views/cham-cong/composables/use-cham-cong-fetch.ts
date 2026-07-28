import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { OFFICE_LABEL } from '../constants'
import { fetchTimeKeeping } from '../services/cham-cong.service'
import type { ChamCongDayMap, ChamCongQueryParams } from '../models/cham-cong.model'
import { useChamCongCalendar } from './use-cham-cong-calendar'

interface ChamCongFetchState {
  loading: Ref<boolean>
  dayMap: Ref<ChamCongDayMap>
  userType: Ref<number | null>
  setLoading: (value: boolean) => void
  setError: (message: string) => void
  clearError: () => void
  setSummary: (days: number, hours: number) => void
  setUserType: (type: number | null) => void
  setOfficeLabel: (label: string) => void
  setDayMap: (map: ChamCongDayMap) => void
  clearAttendanceData: () => void
}

function resolveOfficeLabel(office?: number): string {
  if (office === undefined || office === null) return ''
  return office === 0 ? OFFICE_LABEL.headOffice : OFFICE_LABEL.tranDaiNghia
}

export function useChamCongFetch(state: ChamCongFetchState) {
  const toast = useToast()
  const calendar = useChamCongCalendar(state)

  async function loadAttendance(params: ChamCongQueryParams): Promise<void> {
    state.setLoading(true)
    state.clearError()

    try {
      const response = await fetchTimeKeeping(params)

      if (response.status === 422) {
        const message = response.message || 'Không thể tải dữ liệu chấm công.'
        state.clearAttendanceData()
        state.setError(message)
        toast.add({
          severity: 'warn',
          summary: 'Thông báo',
          detail: message,
          life: 5000,
        })
        return
      }

      const payload = response.data
      const records = payload?.data?.data ?? []
      const userType = payload?.user?.type ?? null

      state.setUserType(userType)
      state.setSummary(
        Number(Number(payload?.days ?? 0).toFixed(2)),
        Number(Number(payload?.totalHours ?? 0).toFixed(2)),
      )
      state.setOfficeLabel(resolveOfficeLabel(payload?.user?.office))
      state.setDayMap(calendar.convertRecordsToDayMap(records))
    } catch (error) {
      state.clearAttendanceData()

      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tải dữ liệu chấm công. Vui lòng thử lại sau.'

      state.setError(message)
      toast.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: message,
        life: 5000,
      })
    } finally {
      state.setLoading(false)
    }
  }

  return {
    loadAttendance,
  }
}
