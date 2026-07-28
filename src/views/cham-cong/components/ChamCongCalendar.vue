<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import type { AttendanceStatus } from '../constants'
import { ATTENDANCE_STATUS } from '../constants'
import type { ChamCongStatusCounts } from '../composables/use-cham-cong-calendar'
import {
  attendanceCellSurface,
  attendanceGridCellSurface,
  attendanceStatusAccent,
  attendanceStatusDot,
  attendanceStatusLabel,
  attendanceStatusTone,
  buildMonthGrid,
  isSameCalendarDay,
  monthYearLongLabel,
  WEEKDAY_LABELS,
  type CalendarGridDay,
} from '../utils/cham-cong-helpers'

interface DayCellInfo {
  status: AttendanceStatus
  checkIn: string
  checkOut: string
  hasData: boolean
  timeLabel?: string
}

const props = defineProps<{
  modelValue: Date
  loading?: boolean
  hasAttendance?: boolean
  statusCounts?: ChamCongStatusCounts
  getDayCellInfo: (year: number, month: number, day: number) => DayCellInfo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date]
  'month-change': [event: { month: number; year: number }]
  'date-select': [value: Date]
}>()

const today = new Date()

const monthTitle = computed(() => monthYearLongLabel(props.modelValue))
const year = computed(() => props.modelValue.getFullYear())
const month = computed(() => props.modelValue.getMonth())

interface GridCellView extends CalendarGridDay {
  info: DayCellInfo
  today: boolean
  weekend: boolean
}

const gridDays = computed<GridCellView[]>(() =>
  buildMonthGrid(year.value, month.value).map((cell) => {
    const weekday = new Date(cell.year, cell.month, cell.day).getDay()
    const info = cell.outside
      ? { status: ATTENDANCE_STATUS.none, checkIn: '', checkOut: '', hasData: false }
      : props.getDayCellInfo(cell.year, cell.month, cell.day)

    return {
      ...cell,
      info,
      today: isSameCalendarDay(today, cell.year, cell.month, cell.day),
      weekend: weekday === 0 || weekday === 6,
    }
  }),
)

const attendanceDays = computed(() =>
  gridDays.value
    .filter((cell) => !cell.outside && cell.info.hasData)
    .map((cell) => ({
      ...cell.info,
      day: cell.day,
      year: cell.year,
      month: cell.month,
      dateKey: cell.dateKey,
      today: cell.today,
    })),
)

const isCurrentMonth = computed(
  () => year.value === today.getFullYear() && month.value === today.getMonth(),
)

const canGoNext = computed(() => {
  const next = new Date(year.value, month.value + 1, 1)
  const max = new Date(today.getFullYear(), today.getMonth(), 1)
  return next.getTime() <= max.getTime()
})

const legendItems = computed(() => [
  {
    key: 'success',
    label: 'Đúng giờ',
    count: props.statusCounts?.success ?? 0,
    dot: 'bg-[#472f92]',
    tone: 'border-[#472f92]/15 bg-[#472f92]/[0.05]',
  },
  {
    key: 'warning',
    label: 'Đi muộn',
    count: props.statusCounts?.warning ?? 0,
    dot: 'bg-[#950000]',
    tone: 'border-[#950000]/15 bg-[#950000]/[0.05]',
  },
  {
    key: 'danger',
    label: 'Thiếu giờ',
    count: props.statusCounts?.danger ?? 0,
    dot: 'bg-[#fdb913]',
    tone: 'border-[#fdb913]/40 bg-[#fdb913]/10',
  },
])

function weekdayLabel(y: number, m: number, d: number): string {
  const index = (new Date(y, m, d).getDay() + 6) % 7
  return WEEKDAY_LABELS[index] ?? ''
}

function shiftMonth(delta: number): void {
  const next = new Date(year.value, month.value + delta, 1)
  const max = new Date(today.getFullYear(), today.getMonth(), 1)
  if (next.getTime() > max.getTime()) return
  emit('update:modelValue', next)
  emit('month-change', { month: next.getMonth() + 1, year: next.getFullYear() })
}

function goThisMonth(): void {
  const next = new Date(today.getFullYear(), today.getMonth(), 1)
  emit('update:modelValue', next)
  emit('month-change', { month: next.getMonth() + 1, year: next.getFullYear() })
}

function onSelectDay(cell: GridCellView): void {
  if (cell.outside || !cell.info.hasData) return
  emit('date-select', new Date(cell.year, cell.month, cell.day))
}

function onSelectListDay(y: number, m: number, d: number): void {
  emit('date-select', new Date(y, m, d))
}

function cellClasses(cell: GridCellView): string {
  if (cell.outside) {
    return 'bg-slate-50/80 opacity-40 pointer-events-none'
  }

  if (cell.info.hasData) {
    return `${attendanceGridCellSurface(cell.info.status)} cursor-pointer`
  }

  if (cell.today) {
    return 'border border-dashed border-[#472f92]/35 bg-[#472f92]/[0.04]'
  }

  if (cell.weekend) {
    return 'bg-slate-50'
  }

  return 'bg-white hover:bg-slate-50'
}

function dayNumberClass(cell: GridCellView): string {
  if (cell.outside) return 'text-slate-400'
  if (cell.today) return 'bg-[#472f92] text-white shadow-sm shadow-[#472f92]/25'
  if (cell.info.hasData) return attendanceStatusAccent(cell.info.status)
  if (cell.weekend) return 'text-slate-400'
  return 'text-slate-700'
}
</script>

<template>
  <div class="relative">
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/90 backdrop-blur-[1px]"
    >
      <i class="pi pi-spin pi-spinner text-xl text-[#472f92]" />
      <p class="text-sm text-slate-500">Đang tải lịch chấm công...</p>
    </div>

    <!-- Status overview -->
    <div class="mb-4 grid grid-cols-3 gap-2">
      <div
        v-for="item in legendItems"
        :key="item.key"
        class="rounded-xl border px-2.5 py-2.5 sm:px-3"
        :class="item.tone"
      >
        <div class="flex items-center gap-1.5">
          <span class="h-2 w-2 shrink-0 rounded-full" :class="item.dot" />
          <span class="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
            {{ item.label }}
          </span>
        </div>
        <p class="mt-1 text-lg font-bold tabular-nums text-slate-800 sm:text-xl">
          {{ item.count }}
        </p>
      </div>
    </div>

    <!-- Month nav -->
    <div class="mb-3 flex items-center gap-2">
      <button
        type="button"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Tháng trước"
        :disabled="loading"
        @click="shiftMonth(-1)"
      >
        <i class="pi pi-chevron-left text-xs" />
      </button>

      <div class="min-w-0 flex-1 text-center">
        <p class="text-sm font-semibold text-slate-800 sm:text-base">{{ monthTitle }}</p>
      </div>

      <button
        type="button"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Tháng sau"
        :disabled="loading || !canGoNext"
        @click="shiftMonth(1)"
      >
        <i class="pi pi-chevron-right text-xs" />
      </button>

      <Button
        type="button"
        label="Tháng này"
        size="small"
        severity="secondary"
        outlined
        class="!hidden sm:!inline-flex"
        :disabled="loading || isCurrentMonth"
        @click="goThisMonth"
      />
    </div>

    <div
      v-if="!loading && hasAttendance === false"
      class="mb-4 flex items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-4"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#472f92] shadow-sm"
      >
        <i class="pi pi-calendar-times" />
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-700">Chưa có dữ liệu chấm công</p>
        <p class="mt-1 text-sm leading-relaxed text-slate-500">
          {{ monthTitle }} chưa ghi nhận giờ vào/ra. Chọn tháng khác để xem lịch sử.
        </p>
        <Button
          v-if="!isCurrentMonth"
          type="button"
          label="Về tháng này"
          size="small"
          link
          class="!mt-1 !px-0"
          @click="goThisMonth"
        />
      </div>
    </div>

    <!-- Mobile list -->
    <div v-if="hasAttendance" class="space-y-2 lg:hidden">
      <button
        v-for="row in attendanceDays"
        :key="`list-${row.dateKey}`"
        type="button"
        class="group flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-3 text-left transition active:scale-[0.99]"
        :class="attendanceCellSurface(row.status)"
        @click="onSelectListDay(row.year, row.month, row.day)"
      >
        <div
          class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-white shadow-sm"
        >
          <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {{ weekdayLabel(row.year, row.month, row.day) }}
          </span>
          <span
            class="text-lg font-bold leading-none"
            :class="row.today ? 'text-[#472f92]' : 'text-slate-800'"
          >
            {{ row.day }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
              :class="attendanceStatusTone(row.status)"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="attendanceStatusDot(row.status)" />
              {{ attendanceStatusLabel(row.status) }}
            </span>
            <span
              v-if="row.today"
              class="rounded-full bg-[#472f92]/10 px-2 py-0.5 text-[10px] font-semibold text-[#472f92]"
            >
              Hôm nay
            </span>
          </div>
          <div class="mt-1.5 flex items-center gap-3 text-sm tabular-nums">
            <span class="inline-flex items-baseline gap-1">
              <span class="text-[11px] font-medium text-slate-400">Vào</span>
              <span class="font-semibold text-slate-800">{{ row.checkIn }}</span>
            </span>
            <span class="h-3 w-px bg-slate-200" aria-hidden="true" />
            <span class="inline-flex items-baseline gap-1">
              <span class="text-[11px] font-medium text-slate-400">Ra</span>
              <span class="font-semibold text-slate-800">{{ row.checkOut }}</span>
            </span>
          </div>
        </div>

        <i
          class="pi pi-chevron-right text-xs text-slate-300 transition group-hover:text-slate-500"
        />
      </button>
    </div>

    <!-- Desktop / tablet grid -->
    <div v-show="hasAttendance !== false || loading" class="hidden lg:block">
      <div class="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/40">
        <div class="grid grid-cols-7 border-b border-slate-200/80 bg-white">
          <div
            v-for="(label, index) in WEEKDAY_LABELS"
            :key="label"
            class="px-1 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider"
            :class="index >= 5 ? 'text-slate-300' : 'text-slate-400'"
          >
            {{ label }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-px bg-slate-200/60 p-px">
          <button
            v-for="cell in gridDays"
            :key="cell.dateKey"
            type="button"
            class="flex min-h-[6.5rem] flex-col px-2 py-2 text-left transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#472f92]/45"
            :class="cellClasses(cell)"
            :disabled="cell.outside || !cell.info.hasData"
            :title="
              cell.info.hasData
                ? `${attendanceStatusLabel(cell.info.status)} · ${cell.info.checkIn} – ${cell.info.checkOut}`
                : undefined
            "
            :aria-label="
              cell.info.hasData
                ? `Ngày ${cell.day}, ${attendanceStatusLabel(cell.info.status)}`
                : `Ngày ${cell.day}`
            "
            @click="onSelectDay(cell)"
          >
            <div class="flex items-center justify-between gap-1">
              <span
                class="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1 text-sm font-semibold leading-none"
                :class="dayNumberClass(cell)"
              >
                {{ cell.day }}
              </span>
              <span
                v-if="!cell.outside && cell.info.hasData"
                class="h-1.5 w-1.5 shrink-0 rounded-full"
                :class="attendanceStatusDot(cell.info.status)"
              />
            </div>

            <div
              v-if="!cell.outside && cell.info.hasData"
              class="mt-2 flex min-w-0 flex-1 flex-col justify-end gap-1"
            >
              <div class="flex items-center gap-1 tabular-nums">
                <span class="w-3 shrink-0 text-[9px] font-semibold uppercase text-slate-400">
                  V
                </span>
                <span class="text-xs font-semibold leading-none text-slate-800">
                  {{ cell.info.checkIn }}
                </span>
              </div>
              <div class="flex items-center gap-1 tabular-nums">
                <span class="w-3 shrink-0 text-[9px] font-semibold uppercase text-slate-400">
                  R
                </span>
                <span class="text-xs font-medium leading-none text-slate-600">
                  {{ cell.info.checkOut }}
                </span>
              </div>
            </div>

            <p
              v-else-if="!cell.outside && cell.today"
              class="mt-auto pt-2 text-[10px] font-medium text-[#472f92]/70"
            >
              Hôm nay
            </p>
          </button>
        </div>
      </div>

      <p class="mt-3 text-center text-xs text-slate-400">
        Chạm ngày có dữ liệu để xem chi tiết giờ vào / ra
      </p>
    </div>

    <div v-if="!hasAttendance && !loading" class="lg:hidden">
      <p class="text-center text-xs text-slate-400">Dùng bộ chọn tháng phía trên để xem tháng khác</p>
    </div>
  </div>
</template>
