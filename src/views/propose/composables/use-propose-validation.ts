import { useToast } from 'primevue/usetoast'
import type { Ref } from 'vue'
import { PROPOSE_MAX_LEAVE_DAYS } from '../constants'
import type { ProposeFormErrors, ProposeFormState } from '../models/propose.model'

interface ProposeValidationDeps {
  formState: Ref<ProposeFormState>
  formErrors: Ref<ProposeFormErrors>
}

export function useProposeValidation({ formState, formErrors }: ProposeValidationDeps) {
  const toast = useToast()

  function showWarning(message: string): void {
    toast.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: message,
      life: 4000,
    })
  }

  function validateGeneralLeave(): boolean {
    formErrors.value.generalLeave = false
    const value = formState.value.generalLeave

    if (value === null || value === undefined) {
      return true
    }

    const remainder = value % 0.5
    if (remainder !== 0 || value <= 0) {
      showWarning('Nhập số công nghỉ phép không hợp lệ')
      formErrors.value.generalLeave = true
      formState.value.generalLeave = null
      return false
    }

    if (value > PROPOSE_MAX_LEAVE_DAYS) {
      showWarning(`Tổng số công có thể nghỉ tối đa là ${PROPOSE_MAX_LEAVE_DAYS}`)
      formErrors.value.generalLeave = true
      formState.value.generalLeave = null
      return false
    }

    return true
  }

  function validateDateRange(): boolean {
    const { startDate, endDate } = formState.value
    if (!startDate || !endDate) {
      return true
    }

    formErrors.value.dateRest = false
    const timeDifference = endDate.getTime() - startDate.getTime()
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

    if (endDate < startDate) {
      showWarning('Ngày kết thúc không hợp lệ')
      formErrors.value.dateRest = true
      formState.value.endDate = null
      return false
    }

    if (daysDifference > PROPOSE_MAX_LEAVE_DAYS) {
      showWarning(`Xin nghỉ phép không quá ${PROPOSE_MAX_LEAVE_DAYS} ngày`)
      formErrors.value.dateRest = true
      formState.value.endDate = null
      return false
    }

    return true
  }

  function validateTimeRange(): boolean {
    const { timeCheckin, timeCheckout } = formState.value
    if (!timeCheckin || !timeCheckout) {
      return true
    }

    formErrors.value.timecheckRest = false
    if (timeCheckout <= timeCheckin) {
      showWarning('Nhập thời gian không hợp lệ')
      formErrors.value.timecheckRest = true
      formState.value.timeCheckout = null
      return false
    }

    return true
  }

  function validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phone)) {
      showWarning('Số điện thoại không hợp lệ')
      formErrors.value.checkphone = true
      return false
    }
    formErrors.value.checkphone = false
    return true
  }

  function validateShiftChange(): boolean {
    const { currentWorkingHours, currentWorkingChange } = formState.value
    if (
      currentWorkingHours !== null &&
      currentWorkingChange !== null &&
      currentWorkingHours === currentWorkingChange
    ) {
      showWarning('Nhập ca thay đổi không hợp lệ')
      formState.value.currentWorkingChange = null
      return false
    }
    return true
  }

  function hasFormErrors(): boolean {
    const errors = formErrors.value
    return (
      errors.generalLeave ||
      errors.dateRest ||
      errors.timecheckRest ||
      errors.checkphone ||
      errors.today
    )
  }

  return {
    validateGeneralLeave,
    validateDateRange,
    validateTimeRange,
    validatePhone,
    validateShiftChange,
    hasFormErrors,
    showWarning,
  }
}
