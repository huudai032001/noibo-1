<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
import { useConfirmSmsTestInputPage } from './composables/use-confirm-sms-test-input-page'
import ContentConfirm from './components/ContentConfirm.vue'
import Notification from './components/Notification.vue'
import ResultMessage from './components/ResultMessage.vue'

const {
  data,
  testInputScheduleItem,
  loading,
  error,
  confirming,
  canConfirm,
  validationState,
  handleConfirm,
} = useConfirmSmsTestInputPage()
</script>

<template>
  <div class="relative z-10 flex min-h-screen items-center justify-center bg-slate-100 p-4">
    <div class="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-xl">
      <div class="flex flex-col items-center bg-[#f9c74f] px-6 py-6 text-center text-[#65558f]">
        <div
          class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <i class="pi pi-check-circle text-3xl text-[#65558f]" />
        </div>
        <h2 class="m-0 text-lg font-bold uppercase">Xác nhận ca test speaking</h2>
      </div>

      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-8">
          <ProgressSpinner
            style="width: 32px; height: 32px"
            stroke-width="4"
            fill="transparent"
            animation-duration="0.8s"
          />
        </div>

        <ResultMessage
          v-else-if="error"
          type="error"
          title="Không thể tải thông tin lịch hẹn!"
        >
          <p>Vui lòng thử lại sau ít phút.</p>
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
      </div>
    </div>
  </div>
</template>
