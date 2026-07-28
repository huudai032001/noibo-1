import { ref } from 'vue'
import type { ChamCongDayMap } from '../models/cham-cong.model'

export function useChamCongState() {
  const selectedDate = ref<Date>(new Date())
  const loading = ref(false)
  const errorMessage = ref('')
  const totalDayWork = ref(0)
  const totalHourWork = ref(0)
  const userType = ref<number | null>(null)
  const officeLabel = ref('')
  const dayMap = ref<ChamCongDayMap>({})

  function setSelectedDate(date: Date): void {
    selectedDate.value = date
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

  function setSummary(days: number, hours: number): void {
    totalDayWork.value = days
    totalHourWork.value = hours
  }

  function setUserType(type: number | null): void {
    userType.value = type
  }

  function setOfficeLabel(label: string): void {
    officeLabel.value = label
  }

  function setDayMap(map: ChamCongDayMap): void {
    dayMap.value = map
  }

  function clearAttendanceData(): void {
    totalDayWork.value = 0
    totalHourWork.value = 0
    userType.value = null
    officeLabel.value = ''
    dayMap.value = {}
  }

  return {
    selectedDate,
    loading,
    errorMessage,
    totalDayWork,
    totalHourWork,
    userType,
    officeLabel,
    dayMap,
    setSelectedDate,
    setLoading,
    setError,
    clearError,
    setSummary,
    setUserType,
    setOfficeLabel,
    setDayMap,
    clearAttendanceData,
  }
}
