import { ref } from 'vue'
import { useFormatter } from '@/composables/use-formatter'
import type {
  ConfirmSmsScheduleItem,
  ConfirmValidationState,
} from '../models/confirm-sms-test-input.model'
import { CONFIRM_MIN_HOURS_BEFORE, CONFIRM_SMS_DATE_FORMAT } from '../constants'
import { confirmSmsTestInput } from '../services/confirm-sms-test-input.service'

export function useConfirmSmsActions(
  testInputScheduleItem: { value: ConfirmSmsScheduleItem | null },
  options: {
    onConfirmSuccess: () => Promise<void>
    setLocalConfirmFlags: (value: boolean) => void
    confirming: { value: boolean }
  },
) {
  const { parseStringToDateTime } = useFormatter()
  const validationState = ref<ConfirmValidationState>({
    checkCancel: false,
    checkConfirm: false,
  })

  function validateConfirmAction(value: boolean): boolean {
    const scheduleItem = testInputScheduleItem.value
    if (!scheduleItem) return false

    const now = new Date()
    const schedule = parseStringToDateTime(scheduleItem.schedule, CONFIRM_SMS_DATE_FORMAT)

    if (!schedule) return false

    if (now > schedule && !value) {
      validationState.value.checkCancel = true
      return false
    }

    const hoursUntilSchedule = (schedule.getTime() - now.getTime()) / (1000 * 60 * 60)
    if (hoursUntilSchedule < CONFIRM_MIN_HOURS_BEFORE) {
      validationState.value.checkConfirm = true
      return false
    }

    return true
  }

  async function handleConfirm(value: boolean): Promise<void> {
    const scheduleItem = testInputScheduleItem.value
    if (!scheduleItem || options.confirming.value) return

    if (!validateConfirmAction(value)) return

    try {
      options.confirming.value = true
      const response = await confirmSmsTestInput({
        id: scheduleItem.id,
        value,
      })

      if (!response.data) {
        options.setLocalConfirmFlags(value)
        return
      }

      await options.onConfirmSuccess()
    } catch (confirmError) {
      console.error('Có lỗi xảy ra khi xác nhận:', confirmError)
    } finally {
      options.confirming.value = false
    }
  }

  return {
    validationState,
    handleConfirm,
  }
}
