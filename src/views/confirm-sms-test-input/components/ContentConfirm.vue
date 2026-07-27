<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import type {
  ConfirmSmsScheduleItem,
  ConfirmSmsTestInputData,
  ConfirmValidationState,
} from '../models/confirm-sms-test-input.model'
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
  <div class="text-[15px] leading-relaxed text-slate-700">
    <ResultMessage
      v-if="showCancelError"
      type="error"
      title="Không thể hủy lịch khi đã tới giờ test!"
    />

    <ResultMessage
      v-else-if="showConfirmError"
      type="error"
      title="Ca test đã hết hiệu lực xác nhận!"
    />

    <div v-else>
      <p class="mb-4">
        Bạn có 01 lịch hẹn test speaking của khách hàng
        <span class="font-bold">{{ item.phone }} - {{ item.name }}</span>.
      </p>
      <p class="mb-4">
        Vào lúc
        <span class="font-bold">{{ testInputScheduleItem.schedule }}</span>.
      </p>
      <p class="mb-0">Vui lòng xác nhận nếu đã chắc chắn tình trạng của khách hàng.</p>

      <div class="mt-8 flex flex-col justify-end gap-2 sm:flex-row">
        <Button
          type="button"
          label="Hủy lịch"
          severity="secondary"
          outlined
          rounded
          class="w-full sm:w-auto"
          :loading="confirming"
          :disabled="confirming"
          @click="onConfirm(false)"
        />
        <Button
          type="button"
          label="Xác nhận tham gia"
          rounded
          class="w-full sm:w-auto !border-[#65558f] !bg-[#65558f]"
          :loading="confirming"
          :disabled="confirming"
          @click="onConfirm(true)"
        />
      </div>
    </div>
  </div>
</template>
