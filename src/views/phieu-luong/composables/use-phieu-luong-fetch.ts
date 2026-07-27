import { computed, type Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { fetchPayslip } from '../services/phieu-luong.service'
import type { PayslipData } from '../models/phieu-luong.model'

interface PhieuLuongFetchState {
  selectedDate: Ref<Date>
  startOfMonth: Ref<string>
  payslipData: Ref<PayslipData>
  loading: Ref<boolean>
  setPayslipData: (data: PayslipData) => void
  clearPayslipData: () => void
  setLoading: (value: boolean) => void
  setError: (message: string) => void
  clearError: () => void
  setStartOfMonth: (value: string) => void
}

export function usePhieuLuongFetch(state: PhieuLuongFetchState) {
  const toast = useToast()

  const queryParams = computed(() => ({
    month: state.selectedDate.value.getMonth() + 1,
    year: state.selectedDate.value.getFullYear(),
  }))

  async function loadPayslip(): Promise<void> {
    state.setLoading(true)
    state.clearError()
    state.clearPayslipData()

    try {
      const response = await fetchPayslip(queryParams.value)
      state.setPayslipData(response.data ?? {})
    } catch (error) {
      state.clearPayslipData()

      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tải phiếu lương. Vui lòng thử lại sau.'

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
    queryParams,
    loadPayslip,
  }
}
