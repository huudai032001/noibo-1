<script setup lang="ts">
import { computed } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useFormatter } from '@/composables/use-formatter'
import type {
  ConfirmSmsScheduleItem,
  ConfirmSmsTestInputData,
} from '../models/confirm-sms-test-input.model'
import { CONFIRM_SMS_STATUS } from '../constants'
import DetailRow from './DetailRow.vue'
import ResultMessage from './ResultMessage.vue'

const props = defineProps<{
  item: ConfirmSmsTestInputData | null
  testInputScheduleItem: ConfirmSmsScheduleItem | null
}>()

const { formatUserLabel } = useFormatter()

const isCancelled = computed(
  () => props.item !== null && Number(props.item.status) === CONFIRM_SMS_STATUS.scheduleCancelled,
)

const isConfirmed = computed(() => {
  const item = props.testInputScheduleItem
  return (
    item !== null &&
    Number(item.isConfirmComeTest) === 1 &&
    Number(item.status) !== CONFIRM_SMS_STATUS.cancelled
  )
})

const isExpired = computed(
  () =>
    props.item !== null &&
    Boolean(props.item.status) &&
    !isCancelled.value &&
    !isConfirmed.value,
)

const cancelerLabel = computed(() => {
  const scheduleItem = props.testInputScheduleItem
  if (!scheduleItem) return '—'

  if (scheduleItem.canceller) {
    return formatUserLabel(scheduleItem.canceller)
  }

  return formatUserLabel(scheduleItem.userCreated)
})

const cancelledAtLabel = computed(() => {
  const scheduleItem = props.testInputScheduleItem
  if (!scheduleItem) return '—'
  return scheduleItem.canceledAt || scheduleItem.timeConfirm || '—'
})
</script>

<template>
  <div class="notification">
    <ResultMessage
      v-if="isCancelled"
      type="success"
      title="Ca test đã được hủy lịch!"
    >
      <div class="notification__details">
        <DetailRow icon="pi pi-user" label="Người hủy lịch" :value="cancelerLabel" />
        <DetailRow icon="pi pi-clock" label="Thời gian" :value="cancelledAtLabel" />
      </div>
    </ResultMessage>

    <ResultMessage
      v-else-if="isConfirmed"
      type="success"
      title="Ca test đã được xác nhận!"
    >
      <div class="notification__details">
        <DetailRow
          icon="pi pi-user"
          label="Người xác nhận"
          :value="formatUserLabel(testInputScheduleItem?.userCreated ?? null) || '—'"
        />
        <DetailRow
          icon="pi pi-clock"
          label="Thời gian"
          :value="testInputScheduleItem?.timeConfirm || '—'"
        />
      </div>
    </ResultMessage>

    <ResultMessage
      v-else-if="isExpired"
      type="warning"
      title="Ca test đã hết hiệu lực xác nhận!"
    >
      <p>Liên kết xác nhận không còn khả dụng hoặc đã quá thời hạn.</p>
    </ResultMessage>

    <ResultMessage
      v-else-if="!item"
      type="error"
      title="Không có thông tin lịch hẹn"
    >
      <p>Không tìm thấy dữ liệu lịch hẹn. Vui lòng kiểm tra lại liên kết từ SMS.</p>
    </ResultMessage>

    <div v-else class="notification__loading">
      <ProgressSpinner
        style="width: 36px; height: 36px"
        stroke-width="3"
        fill="transparent"
        animation-duration="0.8s"
      />
      <p>Đang kiểm tra trạng thái...</p>
    </div>
  </div>
</template>

<style scoped>
.notification__details {
  margin-top: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.8125rem;
}

.notification__loading p {
  margin: 0;
}
</style>
