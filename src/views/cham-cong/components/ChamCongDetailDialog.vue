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
    class="w-full max-w-md"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="space-y-4">
      <div
        class="flex items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white px-4 py-3.5"
      >
        <div class="min-w-0">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Ngày chấm công</p>
          <p class="mt-1 text-base font-semibold text-slate-800">{{ dateLabel }}</p>
          <p v-if="hasDuration" class="mt-1 text-sm text-slate-500">
            Từ vào → ra:
            <span class="font-semibold tabular-nums text-slate-700">{{ durationLabel }}</span>
          </p>
        </div>
        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
          :class="statusTone"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="attendanceStatusDot(status)" />
          {{ statusLabel }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-slate-200/80 bg-white px-4 py-4">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-md bg-[#472f92]/10 text-[#472f92]"
            >
              <i class="pi pi-sign-in text-[11px]" />
            </span>
            Giờ vào
          </div>
          <p class="mt-3 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {{ checkInLabel }}
          </p>
        </div>
        <div class="rounded-xl border border-slate-200/80 bg-white px-4 py-4">
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-md bg-[#472f92]/10 text-[#472f92]"
            >
              <i class="pi pi-sign-out text-[11px]" />
            </span>
            Giờ ra
          </div>
          <p class="mt-3 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {{ checkOutLabel }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" label="Đóng" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>
