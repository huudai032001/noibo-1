<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import type {
  ConfirmSmsScheduleItem,
  ConfirmSmsTestInputData,
  ConfirmValidationState,
} from '../models/confirm-sms-test-input.model'
import AppointmentInfoCard from './AppointmentInfoCard.vue'
import ResultMessage from './ResultMessage.vue'

const props = defineProps<{
  item: ConfirmSmsTestInputData
  testInputScheduleItem: ConfirmSmsScheduleItem
  validationState: ConfirmValidationState
  confirming: boolean
}>()

const emit = defineEmits<{
  confirm: [value: boolean]
}>()

const showCancelError = computed(
  () => props.validationState.checkCancel || Boolean(props.testInputScheduleItem.checkCancel),
)

const showConfirmError = computed(
  () => props.validationState.checkConfirm || Boolean(props.testInputScheduleItem.checkConfirm),
)

function onConfirm(value: boolean): void {
  emit('confirm', value)
}
</script>

<template>
  <div class="content-confirm">
    <ResultMessage
      v-if="showCancelError"
      type="error"
      title="Không thể hủy lịch khi đã tới giờ test!"
    >
      <p>Lịch test đã bắt đầu hoặc đã qua. Vui lòng liên hệ quản lý nếu cần hỗ trợ.</p>
    </ResultMessage>

    <ResultMessage
      v-else-if="showConfirmError"
      type="warning"
      title="Ca test đã hết hiệu lực xác nhận!"
    >
      <p>Chỉ có thể xác nhận trước giờ test ít nhất 1 tiếng.</p>
    </ResultMessage>

    <template v-else>
      <AppointmentInfoCard
        :name="item.name"
        :phone="item.phone"
        :schedule="testInputScheduleItem.schedule"
      />

      <p class="content-confirm__hint">
        Vui lòng xác nhận nếu đã chắc chắn tình trạng tham gia của khách hàng.
      </p>

      <div class="content-confirm__actions">
        <Button
          type="button"
          label="Xác nhận tham gia"
          icon="pi pi-check"
          class="content-confirm__btn content-confirm__btn--primary"
          :loading="confirming"
          :disabled="confirming"
          @click="onConfirm(true)"
        />
        <Button
          type="button"
          label="Hủy lịch"
          icon="pi pi-times"
          class="content-confirm__btn content-confirm__btn--danger"
          :loading="confirming"
          :disabled="confirming"
          @click="onConfirm(false)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.content-confirm {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-confirm__hint {
  margin: 0;
  padding: 0.75rem 0.875rem;
  border-radius: 0.625rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: #64748b;
  text-align: center;
}

.content-confirm__actions {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.content-confirm__btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-radius: 9999px;
}

.content-confirm__btn--primary {
  border: none !important;
  background: linear-gradient(135deg, #65558f, #7c6aad) !important;
  color: #fff !important;
}

.content-confirm__btn--primary:hover:not(:disabled) {
  filter: brightness(1.06);
}

.content-confirm__btn--danger {
  background: #fff !important;
  border: 2px solid #e11d48 !important;
  color: #e11d48 !important;
}

.content-confirm__btn--danger:hover:not(:disabled) {
  background: #fff1f2 !important;
}
</style>
