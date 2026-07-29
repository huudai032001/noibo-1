<script setup lang="ts">
import { computed } from 'vue'
import { formatAttendanceNumber } from '../utils/cham-cong-helpers'

const props = defineProps<{
  totalHourWork: number | string
  totalDayWork: number | string
  loading?: boolean
}>()

const hoursLabel = computed(() => formatAttendanceNumber(props.totalHourWork))
const daysLabel = computed(() => formatAttendanceNumber(props.totalDayWork))
</script>

<template>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div
      class="flex items-center gap-3 rounded-xl border cc-border-primary/15 cc-bg-primary-light px-4 py-3"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg cc-bg-primary-light cc-text-primary"
      >
        <i class="pi pi-clock text-base" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-slate-500">Số giờ làm thực tế</p>
        <p v-if="loading" class="mt-1 h-6 w-16 animate-pulse rounded bg-slate-200" />
        <p v-else class="mt-0.5 text-xl font-bold tabular-nums text-slate-900">
          {{ hoursLabel }}
          <span class="text-sm font-medium text-slate-500">giờ</span>
        </p>
      </div>
    </div>

    <div
      class="flex items-center gap-3 rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white px-4 py-3"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
      >
        <i class="pi pi-calendar text-base" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-slate-500">Số ngày đi làm thực tế</p>
        <p v-if="loading" class="mt-1 h-6 w-12 animate-pulse rounded bg-slate-200" />
        <p v-else class="mt-0.5 text-xl font-bold tabular-nums text-slate-900">
          {{ daysLabel }}
          <span class="text-sm font-medium text-slate-500">ngày</span>
        </p>
      </div>
    </div>
  </div>
</template>
