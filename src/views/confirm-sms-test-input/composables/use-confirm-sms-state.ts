import { computed, ref } from 'vue'
import type {
  ConfirmSmsScheduleItem,
  ConfirmSmsTestInputData,
} from '../models/confirm-sms-test-input.model'
import { CONFIRM_SMS_SCHEDULE_TYPE, CONFIRM_SMS_STATUS } from '../constants'

export function useConfirmSmsState() {
  const data = ref<ConfirmSmsTestInputData | null>(null)
  const testInputScheduleItem = ref<ConfirmSmsScheduleItem | null>(null)
  const loading = ref(true)
  const error = ref(false)
  const confirming = ref(false)

  const canConfirm = computed(() => {
    const item = testInputScheduleItem.value

    return (
      item !== null &&
      Number(item.isConfirmComeTest) === 0 &&
      Number(item.status) !== CONFIRM_SMS_STATUS.cancelled &&
      data.value !== null &&
      Number(data.value.status) !== CONFIRM_SMS_STATUS.scheduleCancelled
    )
  })

  function setScheduleItem(item: ConfirmSmsScheduleItem | null): void {
    testInputScheduleItem.value = item
  }

  function findSpeakingScheduleItem(
    scheduleItems: ConfirmSmsScheduleItem[],
  ): ConfirmSmsScheduleItem | null {
    return (
      scheduleItems.find(
        (item) => Number(item.typeItemId) === CONFIRM_SMS_SCHEDULE_TYPE.speaking,
      ) ?? null
    )
  }

  function setLocalConfirmFlags(value: boolean): void {
    if (!testInputScheduleItem.value) return

    if (value) {
      testInputScheduleItem.value.checkConfirm = 1
    } else {
      testInputScheduleItem.value.checkCancel = 1
    }
  }

  return {
    data,
    testInputScheduleItem,
    loading,
    error,
    confirming,
    canConfirm,
    setScheduleItem,
    findSpeakingScheduleItem,
    setLocalConfirmFlags,
  }
}
