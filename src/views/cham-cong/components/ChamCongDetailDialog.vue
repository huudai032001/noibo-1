<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useFormatter } from '@/composables/use-formatter'
import { ATTENDANCE_STATUS } from '../constants'
import type { ChamCongDetailPayload } from '../models/cham-cong.model'
import {
  attendanceStatusDot,
  attendanceStatusLabel,
  attendanceStatusTone,
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
const statusTone = computed(() => attendanceStatusTone(status.value))
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
    class="w-full max-w-lg"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="space-y-4">
      <div
        class="relative flex items-start justify-between gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white px-4 py-4"
      >
        <div
          class="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full bg-[#472f92]/10 blur-2xl"
          aria-hidden="true"
        />
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Ngày chấm công</p>
          <p class="mt-1 text-lg font-semibold text-slate-900">{{ dateLabel }}</p>
          <p v-if="weekdayLabel" class="mt-0.5 text-sm capitalize text-slate-500">
            {{ weekdayLabel }}
          </p>
        </div>
        <span
          class="relative inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm"
          :class="statusTone"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="attendanceStatusDot(status)" />
          {{ statusLabel }}
        </span>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="card in detailCards"
          :key="card.key"
          class="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 text-center shadow-sm shadow-slate-200/50"
        >
          <div
            class="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#472f92]/10 text-[#472f92]"
          >
            <i :class="card.icon" class="text-sm" />
          </div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {{ card.label }}
          </p>
          <p class="mt-2 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {{ card.value }}
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3.5">
        <p class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Ghi chú</p>
        <p class="mt-1.5 text-sm leading-6 text-slate-600">
          {{ noteLabel }}
        </p>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Đóng" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>
