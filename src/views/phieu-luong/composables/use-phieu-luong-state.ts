import { ref } from 'vue'
import type { PayslipData } from '../models/phieu-luong.model'
import { getLastMonthDate, getStartOfMonth } from '../utils/payslip-helpers'

export function usePhieuLuongState() {
  const selectedDate = ref<Date>(getLastMonthDate())
  const startOfMonth = ref<string>(getStartOfMonth(getLastMonthDate()))
  const payslipData = ref<PayslipData>({})
  const loading = ref(false)
  const errorMessage = ref('')
  const linkManage = ref(false)

  function setPayslipData(data: PayslipData): void {
    payslipData.value = data
  }

  function clearPayslipData(): void {
    payslipData.value = {}
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function setError(message: string): void {
    errorMessage.value = message
  }

  function clearError(): void {
    errorMessage.value = ''
  }

  function setSelectedDate(date: Date): void {
    selectedDate.value = date
  }

  function setStartOfMonth(value: string): void {
    startOfMonth.value = value
  }

  function setLinkManage(value: boolean): void {
    linkManage.value = value
  }

  return {
    selectedDate,
    startOfMonth,
    payslipData,
    loading,
    errorMessage,
    linkManage,
    setPayslipData,
    clearPayslipData,
    setLoading,
    setError,
    clearError,
    setSelectedDate,
    setStartOfMonth,
    setLinkManage,
  }
}
