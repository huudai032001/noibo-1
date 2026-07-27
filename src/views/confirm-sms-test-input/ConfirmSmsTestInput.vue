<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import { useConfirmSmsTestInputPage } from './composables/use-confirm-sms-test-input-page'
import ConfirmSmsLayout from './components/ConfirmSmsLayout.vue'
import ContentConfirm from './components/ContentConfirm.vue'
import Notification from './components/Notification.vue'
import ResultMessage from './components/ResultMessage.vue'
import type { ConfirmSmsPageState } from './components/ConfirmSmsLayout.vue'
import { CONFIRM_SMS_STATUS } from './constants'

const {
  data,
  testInputScheduleItem,
  loading,
  error,
  errorMessage,
  confirming,
  canConfirm,
  validationState,
  handleConfirm,
  reload,
} = useConfirmSmsTestInputPage()

const pageState = computed<ConfirmSmsPageState>(() => {
  if (loading.value) return 'loading'
  if (error.value) return 'error'
  if (canConfirm.value && data.value && testInputScheduleItem.value) return 'confirm'

  const item = data.value
  const scheduleItem = testInputScheduleItem.value

  if (item && Number(item.status) === CONFIRM_SMS_STATUS.scheduleCancelled) return 'success'
  if (
    scheduleItem &&
    Number(scheduleItem.isConfirmComeTest) === 1 &&
    Number(scheduleItem.status) !== CONFIRM_SMS_STATUS.cancelled
  ) {
    return 'success'
  }
  if (item && item.status) return 'warning'

  return 'result'
})
</script>

<template>
  <ConfirmSmsLayout :page-state="pageState">
    <div v-if="loading" class="space-y-4">
      <div class="overflow-hidden rounded-2xl border border-slate-100">
        <Skeleton height="5rem" class="!rounded-none" />
        <div class="space-y-0 divide-y divide-slate-100 p-1">
          <Skeleton height="4rem" class="!rounded-none" />
          <Skeleton height="4rem" class="!rounded-none" />
        </div>
      </div>
      <Skeleton height="3rem" class="!rounded-xl" />
      <Skeleton height="3rem" class="!rounded-xl" />
      <p class="text-center text-sm text-slate-400">Đang tải thông tin lịch hẹn...</p>
    </div>

    <ResultMessage
      v-else-if="error"
      type="error"
      title="Không thể tải thông tin lịch hẹn"
    >
      <p>
        {{
          errorMessage ||
            'Liên kết có thể đã hết hạn hoặc máy chủ đang bận. Vui lòng thử lại sau ít phút.'
        }}
      </p>
      <template #actions>
        <Button
          type="button"
          label="Thử lại"
          icon="pi pi-refresh"
          class="confirm-sms-retry-btn"
          @click="reload"
        />
      </template>
    </ResultMessage>

    <ContentConfirm
      v-else-if="canConfirm && data && testInputScheduleItem"
      :item="data"
      :test-input-schedule-item="testInputScheduleItem"
      :validation-state="validationState"
      :confirming="confirming"
      @confirm="handleConfirm"
    />

    <Notification
      v-else
      :item="data"
      :test-input-schedule-item="testInputScheduleItem"
    />
  </ConfirmSmsLayout>
</template>

<style scoped>
.confirm-sms-retry-btn {
  min-width: 10rem;
  border-radius: 9999px;
  border: none !important;
  background: linear-gradient(135deg, #65558f, #7c6aad) !important;
  color: #fff !important;
  font-weight: 600;
}
</style>
