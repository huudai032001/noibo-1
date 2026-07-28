<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { storeToRefs } from 'pinia'
import { useFormatter } from '@/composables/use-formatter'
import { useAuthStore } from '@/stores/auth'
import { formatAttendanceNumber, monthYearLongLabel } from '../utils/cham-cong-helpers'
import ChamCongMonthPicker from './ChamCongMonthPicker.vue'

const props = defineProps<{
  modelValue: Date
  officeLabel?: string
  totalHourWork: number | string
  totalDayWork: number | string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const { formatEmployeeCode } = useFormatter()

const today = new Date()
const monthTitle = computed(() => monthYearLongLabel(props.modelValue))
const displayName = computed(() => currentUser.value?.name?.trim() || 'Nhân viên')

const employeeCode = computed(() => {
  if (!currentUser.value?.id) return '—'
  return String(formatEmployeeCode(currentUser.value.id))
})

const office = computed(() => props.officeLabel?.trim() || '—')
const hoursLabel = computed(() => formatAttendanceNumber(props.totalHourWork))
const daysLabel = computed(() => formatAttendanceNumber(props.totalDayWork))

const isCurrentMonth = computed(() => {
  return (
    props.modelValue.getFullYear() === today.getFullYear() &&
    props.modelValue.getMonth() === today.getMonth()
  )
})

function onMonthUpdate(value: Date): void {
  emit('update:modelValue', new Date(value.getFullYear(), value.getMonth(), 1))
}

function goThisMonth(): void {
  emit('update:modelValue', new Date(today.getFullYear(), today.getMonth(), 1))
}
</script>

<template>
  <header class="box overflow-visible">
    <div class="p-4 sm:p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="min-w-0 space-y-1.5">
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-[#472f92]">
              Chấm công
            </span>
            <span class="text-slate-300" aria-hidden="true">·</span>
            <h1 class="text-lg font-bold text-slate-800 sm:text-xl">{{ monthTitle }}</h1>
            <span class="text-slate-300" aria-hidden="true">·</span>
            <p class="text-sm font-medium text-slate-600 sm:text-[15px]">
              <span v-if="loading" class="inline-block h-4 w-24 animate-pulse rounded bg-slate-200" />
              <template v-else>{{ displayName }}</template>
            </p>
          </div>

          <ul class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-600">
            <li class="inline-flex items-baseline gap-1.5">
              <span class="text-slate-400">Mã NS</span>
              <span class="font-medium text-slate-800">
                <span v-if="loading" class="inline-block h-3.5 w-14 animate-pulse rounded bg-slate-200" />
                <template v-else>{{ employeeCode }}</template>
              </span>
            </li>
            <li class="inline-flex items-baseline gap-1.5">
              <span class="text-slate-400">Văn phòng</span>
              <span class="font-medium text-slate-800">
                <span v-if="loading" class="inline-block h-3.5 w-24 animate-pulse rounded bg-slate-200" />
                <template v-else>{{ office }}</template>
              </span>
            </li>
          </ul>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <ChamCongMonthPicker
            :model-value="modelValue"
            :loading="loading"
            @update:model-value="onMonthUpdate"
          />
          <Button
            type="button"
            label="Tháng này"
            size="small"
            outlined
            :disabled="loading || isCurrentMonth"
            class="!border-slate-200 !text-slate-700"
            @click="goThisMonth"
          />
        </div>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div
          class="flex items-center gap-3 rounded-xl border border-[#472f92]/15 bg-[#472f92]/[0.05] px-4 py-3.5"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#472f92]/10 text-[#472f92]"
          >
            <i class="pi pi-clock" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">Giờ làm thực tế</p>
            <p v-if="loading" class="mt-1 h-6 w-16 animate-pulse rounded bg-slate-200" />
            <p v-else class="mt-0.5 text-xl font-bold tabular-nums text-[#472f92]">
              {{ hoursLabel }}
              <span class="text-sm font-medium text-slate-500">giờ</span>
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200/70 text-slate-600"
          >
            <i class="pi pi-calendar" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium text-slate-500">Ngày công thực tế</p>
            <p v-if="loading" class="mt-1 h-6 w-12 animate-pulse rounded bg-slate-200" />
            <p v-else class="mt-0.5 text-xl font-bold tabular-nums text-slate-800">
              {{ daysLabel }}
              <span class="text-sm font-medium text-slate-500">ngày</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
