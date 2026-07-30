<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import type { JobKpiDetailData } from '../models/job-kpi-teamlead.model'
import { formatPercentOrEmpty, formatScoreOrEmpty } from '../utils/job-kpi-teamlead-helpers'

defineProps<{
  visible: boolean
  detail: JobKpiDetailData | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  confirm: []
}>()

function onHide(): void {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    header="Chấm điểm nhân sự"
    class="w-full max-w-md"
    :style="{ width: '92vw', maxWidth: '28rem' }"
    @update:visible="emit('update:visible', $event)"
    @hide="onHide"
  >
    <div class="space-y-3 text-sm text-slate-700 dark:text-slate-200">
      <p>
        Tổng điểm KPI:
        <span class="font-semibold text-[var(--app-primary)]">
          {{ formatPercentOrEmpty(detail?.totalPercentKra) }}
        </span>
      </p>
      <p>
        Điểm tích họp tuần:
        <span class="font-semibold text-[var(--app-primary)]">
          {{ formatScoreOrEmpty(detail?.totalScoreMeeting) }}đ
        </span>
      </p>
      <p>Bạn có chắc chắn muốn lưu điểm của nhân sự không?</p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Huỷ bỏ" severity="secondary" outlined @click="onHide" />
        <Button
          type="button"
          label="Xác nhận"
          icon="pi pi-check"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>
