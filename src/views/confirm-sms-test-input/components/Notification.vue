<script setup lang="ts">
import { computed } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useFormatter } from '@/composables/use-formatter'
import type {
  ConfirmSmsScheduleItem,
  ConfirmSmsTestInputData,
} from '../models/confirm-sms-test-input.model'
import { CONFIRM_SMS_STATUS } from '../constants'
import ResultMessage from './ResultMessage.vue'

const props = defineProps<{
  item: ConfirmSmsTestInputData | null
  testInputScheduleItem: ConfirmSmsScheduleItem | null
}>()

const { formatUserLabel } = useFormatter()

const isConfirmed = computed(() => {
  const item = props.testInputScheduleItem
  return (
    item !== null &&
    Number(item.isConfirmComeTest) === 1 &&
    Number(item.status) !== CONFIRM_SMS_STATUS.cancelled
  )
})

const cancelerLabel = computed(() => {
  const scheduleItem = props.testInputScheduleItem
  if (!scheduleItem) return ''

  if (scheduleItem.canceller) {
    return formatUserLabel(scheduleItem.canceller)
  }

  return formatUserLabel(scheduleItem.userCreated)
})

const cancelledAtLabel = computed(() => {
  const scheduleItem = props.testInputScheduleItem
  if (!scheduleItem) return ''
  return scheduleItem.canceledAt || scheduleItem.timeConfirm
})
</script>

<template>
  <div>
    <ResultMessage
      v-if="item && Number(item.status) === CONFIRM_SMS_STATUS.scheduleCancelled"
      type="success"
      title="Ca test đã được hủy lịch!"
    >
      <p>Người hủy lịch: {{ cancelerLabel }}</p>
      <p>Thời gian: {{ cancelledAtLabel }}.</p>
    </ResultMessage>

    <ResultMessage
      v-else-if="isConfirmed"
      type="success"
      title="Ca test đã được xác nhận!"
    >
      <p>Người xác nhận: {{ formatUserLabel(testInputScheduleItem?.userCreated ?? null) }}</p>
      <p>Thời gian: {{ testInputScheduleItem?.timeConfirm }}.</p>
    </ResultMessage>

    <ResultMessage
      v-else-if="item && item.status"
      type="error"
      title="Ca test đã hết hiệu lực xác nhận!"
    />

    <div v-else class="flex justify-center py-4">
      <ProgressSpinner
        style="width: 32px; height: 32px"
        stroke-width="4"
        fill="transparent"
        animation-duration="0.8s"
      />
    </div>
  </div>
</template>
