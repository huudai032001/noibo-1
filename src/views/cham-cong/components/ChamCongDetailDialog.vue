<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useFormatter } from '@/composables/use-formatter'
import { ATTENDANCE_STATUS } from '../constants'
import type { ChamCongDetailPayload } from '../models/cham-cong.model'
import {
  attendanceStatusDotStyle,
  attendanceStatusLabel,
  attendanceStatusToneStyle,
  formatShortTime,
  formatWorkDuration,
} from '../utils/cham-cong-helpers'

const props = defineProps<{
  visible: boolean
  detail: ChamCongDetailPayload | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const { formatDate } = useFormatter()

const dateLabel = computed(() => {
  if (!props.detail?.dateKey) return ''
  return formatDate(props.detail.dateKey, 'date')
})

const weekdayLabel = computed(() => {
  if (!props.detail?.dateKey) return ''
  const date = new Date(`${props.detail.dateKey}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN', { weekday: 'long' })
})

const checkInLabel = computed(() =>
  props.detail?.in ? formatShortTime(props.detail.in) : '—',
)
const checkOutLabel = computed(() =>
  props.detail?.out ? formatShortTime(props.detail.out) : '—',
)

const durationLabel = computed(() =>
  formatWorkDuration(props.detail?.in, props.detail?.out),
)

const hasDuration = computed(() => durationLabel.value !== '—')

const status = computed(() => props.detail?.status ?? ATTENDANCE_STATUS.none)
const statusLabel = computed(() => attendanceStatusLabel(status.value))
const badgeStyle = computed(() => attendanceStatusToneStyle(status.value))
const dotStyle = computed(() => attendanceStatusDotStyle(status.value))
const detailCards = computed(() => [
  {
    key: 'in',
    label: 'Giờ vào',
    value: checkInLabel.value,
    icon: 'pi pi-sign-in',
  },
  {
    key: 'out',
    label: 'Giờ ra',
    value: checkOutLabel.value,
    icon: 'pi pi-sign-out',
  },
  {
    key: 'duration',
    label: 'Thời lượng',
    value: hasDuration.value ? durationLabel.value : '—',
    icon: 'pi pi-clock',
  },
])
const noteLabel = computed(() => {
  if (!props.detail) return ''
  if (!props.detail.in && !props.detail.out) return 'Ngày này chưa có dữ liệu chấm công.'
  if (!props.detail.in) return 'Thiếu giờ vào. Bạn nên kiểm tra lại log chấm công của ngày này.'
  if (!props.detail.out) return 'Thiếu giờ ra. Bạn nên kiểm tra lại log chấm công của ngày này.'
  if (props.detail.status === ATTENDANCE_STATUS.warning) {
    return 'Ngày này được ghi nhận đi muộn. Khung giờ muộn áp dụng từ 08:45 đến trước 12:00 hoặc sau 13:30.'
  }
  return 'Dữ liệu ngày công đã đầy đủ. Chọn ngày khác trong lịch để tiếp tục tra cứu.'
})

function closeDialog(): void {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Chi tiết chấm công"
    class="cc-detail-dialog"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="cc-detail">
      <div class="cc-detail__date-row">
        <div class="cc-detail__date-info">
          <p class="cc-detail__date-eyebrow">Ngày chấm công</p>
          <p class="cc-detail__date-value">{{ dateLabel }}</p>
          <p v-if="weekdayLabel" class="cc-detail__weekday">{{ weekdayLabel }}</p>
        </div>
        <span class="cc-detail__badge" :style="badgeStyle">
          <span class="cc-detail__badge-dot" :style="dotStyle" />
          {{ statusLabel }}
        </span>
      </div>

      <div class="cc-detail__cards">
        <div
          v-for="card in detailCards"
          :key="card.key"
          class="cc-detail__card"
        >
          <div class="cc-detail__card-icon">
            <i :class="card.icon" />
          </div>
          <p class="cc-detail__card-label">{{ card.label }}</p>
          <p class="cc-detail__card-value">{{ card.value }}</p>
        </div>
      </div>

      <div v-if="noteLabel" class="cc-detail__note">
        <p class="cc-detail__note-title">Ghi chú</p>
        <p class="cc-detail__note-text">{{ noteLabel }}</p>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Đóng" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<style scoped>
.cc-detail-dialog {
  width: 100%;
  max-width: 28rem;
}

@media (max-width: 480px) {
  .cc-detail-dialog {
    max-width: calc(100vw - 2rem);
  }

  .cc-detail-dialog :deep(.p-dialog-content) {
    padding: 0.75rem;
  }

  .cc-detail-dialog :deep(.p-dialog-header) {
    padding: 0.75rem;
  }

  .cc-detail-dialog :deep(.p-dialog-footer) {
    padding: 0.75rem;
  }
}

.cc-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 480px) {
  .cc-detail {
    gap: 0.75rem;
  }
}

/* ── Date row ── */
.cc-detail__date-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: linear-gradient(135deg, #f8fafc, #fff);
}

@media (max-width: 480px) {
  .cc-detail__date-row {
    padding: 0.75rem 1rem;
    border-radius: 10px;
  }
}

.cc-detail__date-eyebrow {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.cc-detail__date-value {
  margin: 0.25rem 0 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
}

.cc-detail__weekday {
  margin: 0.125rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
  text-transform: capitalize;
}

.cc-detail__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.75rem;
  border: 1px solid;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.cc-detail__badge-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 999px;
  flex-shrink: 0;
}

/* ── Time cards ── */
.cc-detail__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
}

@media (max-width: 480px) {
  .cc-detail__cards {
    gap: 0.5rem;
  }

  .cc-detail__card {
    padding: 0.75rem 0.375rem;
    border-radius: 10px;
  }

  .cc-detail__card-icon {
    width: 2rem;
    height: 2rem;
    font-size: 0.8125rem;
  }

  .cc-detail__card-value {
    font-size: 1.125rem;
  }
}

.cc-detail__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.cc-detail__card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.cc-detail__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 10px;
  background: #f0ecf9;
  color: #472f92;
  font-size: 0.875rem;
}

.cc-detail__card-label {
  margin: 0.25rem 0 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.cc-detail__card-value {
  margin: 0.125rem 0 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

/* ── Note ── */
.cc-detail__note {
  padding: 0.875rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

@media (max-width: 480px) {
  .cc-detail__note {
    padding: 0.75rem 1rem;
    border-radius: 10px;
  }
}

.cc-detail__note-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.cc-detail__note-text {
  margin: 0.375rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #475569;
}

</style>
