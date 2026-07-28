<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import type { AttendanceStatus } from '../constants'
import { ATTENDANCE_STATUS } from '../constants'
import type { ChamCongStatusCounts } from '../composables/use-cham-cong-calendar'
import {
  attendanceCellSurface,
  attendanceGridCellSurface,
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
  duration?: string
}

interface TodayAttendanceInfo {
  isCurrentMonth: boolean
  hasData: boolean
  checkIn: string
  checkOut: string
  duration: string
  status: AttendanceStatus | null
}

const props = defineProps<{
  modelValue: Date
  loading?: boolean
  hasAttendance?: boolean
  statusCounts?: ChamCongStatusCounts
  todayAttendance?: TodayAttendanceInfo
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

const emptyInfo = (): DayCellInfo => ({
  status: ATTENDANCE_STATUS.none,
  checkIn: '',
  checkOut: '',
  hasData: false,
  duration: '',
})

const gridDays = computed<GridCellView[]>(() =>
  buildMonthGrid(year.value, month.value).map((cell) => {
    const weekday = new Date(cell.year, cell.month, cell.day).getDay()
    const info = cell.outside
      ? emptyInfo()
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

const totalDays = computed(() => props.statusCounts?.total ?? 0)
const legendItems = computed(() => [
  {
    key: ATTENDANCE_STATUS.success,
    label: attendanceStatusLabel(ATTENDANCE_STATUS.success),
    hint: 'Đã chấm công đầy đủ và đúng giờ',
    count: props.statusCounts?.success ?? 0,
  },
  {
    key: ATTENDANCE_STATUS.warning,
    label: attendanceStatusLabel(ATTENDANCE_STATUS.warning),
    hint: 'Vào từ 08:45 đến trước 12:00 hoặc sau 13:30',
    count: props.statusCounts?.warning ?? 0,
  },
  {
    key: ATTENDANCE_STATUS.danger,
    label: attendanceStatusLabel(ATTENDANCE_STATUS.danger),
    hint: 'Thiếu giờ vào hoặc giờ ra trong ngày',
    count: props.statusCounts?.danger ?? 0,
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
    return 'bg-slate-50/70 opacity-35 pointer-events-none'
  }

  if (cell.info.hasData) {
    return `${attendanceGridCellSurface(cell.info.status)} cursor-pointer`
  }

  if (cell.today) {
    return 'border border-dashed border-[#472f92]/30 bg-[#472f92]/[0.03]'
  }

  if (cell.weekend) {
    return 'bg-slate-50/90'
  }

  return 'bg-white hover:bg-slate-50/80'
}

function dayNumberClass(cell: GridCellView): string {
  if (cell.outside) return 'text-slate-400'
  if (cell.today && cell.info.hasData) return 'bg-white/80 text-slate-900 shadow-sm'
  if (cell.today) return 'bg-[#472f92] text-white shadow-sm shadow-[#472f92]/20'
  if (cell.info.hasData) return 'bg-white/75 text-slate-900'
  if (cell.weekend) return 'text-slate-400'
  return 'text-slate-700'
}
</script>

<template>
  <div class="relative">
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/85 backdrop-blur-[1px]"
    >
      <i class="pi pi-spin pi-spinner text-xl text-[#472f92]" />
      <p class="text-sm text-slate-500">Đang tải lịch chấm công...</p>
    </div>

    <div class="attendance-calendar">
      <div class="attendance-calendar__toolbar">
          <button
            type="button"
            class="attendance-calendar__nav"
            aria-label="Tháng trước"
            :disabled="loading"
            @click="shiftMonth(-1)"
          >
            <i class="pi pi-chevron-left text-xs" />
          </button>

          <div class="attendance-calendar__month">
            <p class="attendance-calendar__month-title">{{ monthTitle }}</p>
            <p v-if="!loading && totalDays > 0" class="attendance-calendar__month-meta">
              {{ totalDays }} ngày có dữ liệu
            </p>
          </div>

          <button
            type="button"
            class="attendance-calendar__nav"
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
            class="attendance-calendar__current-btn !hidden !bg-white sm:!inline-flex"
            :disabled="loading || isCurrentMonth"
            @click="goThisMonth"
          />
        </div>

        <div v-if="props.todayAttendance?.isCurrentMonth" class="attendance-calendar__today">
          <div
            class="attendance-calendar__today-badge"
          >
            <span
              class="attendance-calendar__today-dot"
              :class="
                props.todayAttendance?.status
                  ? attendanceStatusDot(props.todayAttendance.status)
                  : 'bg-slate-300'
              "
            />
            Hôm nay
          </div>
          <template v-if="props.todayAttendance?.hasData">
            <p class="attendance-calendar__today-item">
              <span class="text-slate-400">Vào:</span>
              <span class="font-semibold text-slate-900">{{ props.todayAttendance.checkIn }}</span>
            </p>
            <p class="attendance-calendar__today-item">
              <span class="text-slate-400">Ra:</span>
              <span class="font-semibold text-slate-900">{{ props.todayAttendance.checkOut }}</span>
            </p>
            <p
              v-if="props.todayAttendance.duration"
              class="attendance-calendar__today-item"
            >
              <span class="text-slate-400">Tổng:</span>
              <span class="font-semibold text-slate-900">{{ props.todayAttendance.duration }}</span>
            </p>
          </template>
          <p v-else class="attendance-calendar__today-empty">Hôm nay chưa có dữ liệu chấm công.</p>
        </div>
      </div>

    <div
      v-if="hasAttendance"
      class="mb-3 grid grid-cols-1 gap-2.5 md:grid-cols-3"
    >
      <div
        v-for="item in legendItems"
        :key="item.key"
        class="rounded-2xl border bg-white px-4 py-3 shadow-sm"
        :class="attendanceStatusTone(item.key)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="inline-flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full" :class="attendanceStatusDot(item.key)" />
              <p class="text-sm font-semibold">{{ item.label }}</p>
            </div>
            <p class="mt-1 text-xs leading-5 opacity-80">{{ item.hint }}</p>
          </div>
          <span class="rounded-full bg-white/80 px-2.5 py-1 text-sm font-bold shadow-sm">
            {{ item.count }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && hasAttendance === false"
      class="mb-3 flex items-start gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-4"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#472f92] shadow-sm"
      >
        <i class="pi pi-calendar-times" />
      </div>
      <div class="min-w-0">
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
    <div v-if="hasAttendance" class="space-y-2.5 lg:hidden">
      <button
        v-for="row in attendanceDays"
        :key="`list-${row.dateKey}`"
        type="button"
        class="group flex w-full items-center gap-3 rounded-2xl border bg-white px-3.5 py-3.5 text-left shadow-sm transition active:scale-[0.99]"
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
            <span
              v-if="row.duration"
              class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-slate-600"
            >
              {{ row.duration }}
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
          <p class="mt-1.5 text-xs text-slate-500">
            {{
              row.status === ATTENDANCE_STATUS.warning
                ? 'Đi muộn theo khung giờ quy định'
                : row.status === ATTENDANCE_STATUS.danger
                  ? 'Thiếu giờ vào hoặc giờ ra'
                  : 'Nhấn để xem chi tiết ngày công'
            }}
          </p>
        </div>

        <i
          class="pi pi-chevron-right text-xs text-slate-300 transition group-hover:text-slate-500"
        />
      </button>
    </div>

    <div class="hidden lg:block">
      <div class="attendance-calendar__desktop">
        <div class="attendance-calendar__weekday-row">
          <div
            v-for="(label, index) in WEEKDAY_LABELS"
            :key="label"
            class="attendance-calendar__weekday"
            :class="index >= 5 ? 'text-slate-300' : 'text-slate-500'"
          >
            {{ index === 6 ? 'Chủ nhật' : `Thứ ${index + 2}` }}
          </div>
        </div>

        <div class="attendance-calendar__grid">
          <button
            v-for="cell in gridDays"
            :key="cell.dateKey"
            type="button"
            class="attendance-calendar__cell"
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
            <div class="attendance-calendar__cell-head">
              <span
                class="attendance-calendar__day-number"
                :class="dayNumberClass(cell)"
              >
                {{ String(cell.day).padStart(2, '0') }}
              </span>
              <div class="flex items-center gap-1.5">
                <span
                  v-if="cell.info.hasData"
                  class="h-2.5 w-2.5 rounded-full shadow-sm"
                  :class="attendanceStatusDot(cell.info.status)"
                />
                <span
                  v-if="cell.today"
                  class="attendance-calendar__today-pill"
                  :class="
                    cell.info.hasData
                      ? 'bg-white/80 text-slate-800'
                      : 'bg-[#472f92]/10 text-[#472f92]'
                  "
                >
                  Hôm nay
                </span>
              </div>
            </div>

            <div
              v-if="!cell.outside && cell.info.hasData"
              class="attendance-calendar__cell-body"
            >
              <p class="attendance-calendar__status-chip">
                {{ attendanceStatusLabel(cell.info.status) }}
              </p>
              <p
                class="attendance-calendar__time-range"
                :class="cell.today ? 'text-slate-800' : 'text-slate-800'"
              >
                {{ cell.info.checkIn }} - {{ cell.info.checkOut }}
              </p>
              <p
                v-if="cell.info.duration"
                class="attendance-calendar__duration"
                :class="cell.today ? 'text-slate-500' : 'text-slate-500'"
              >
                {{ cell.info.duration }}
              </p>
            </div>

            <p
              v-else-if="!cell.outside"
              class="attendance-calendar__cell-empty"
              :class="cell.today ? 'font-medium text-[#472f92]/75' : 'text-slate-300'"
            >
              {{ cell.today ? 'Chưa chấm công' : 'Chưa có dữ liệu' }}
            </p>
          </button>
        </div>
      </div>

      <p class="mt-3 text-center text-[11px] text-slate-400">
        Bấm vào ngày có dữ liệu để xem chi tiết.
      </p>
    </div>

    <div v-if="!hasAttendance && !loading" class="lg:hidden">
      <p class="text-center text-xs text-slate-400">
        Dùng bộ chọn tháng phía trên để xem tháng khác
      </p>
    </div>
  </div>
</template>

<style scoped>
.attendance-calendar {
  margin-bottom: 1rem;
}

.attendance-calendar__toolbar {
  overflow: hidden;
  border: 1px solid rgb(226 232 240 / 0.8);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.98) 0%, rgb(248 250 252 / 0.98) 100%);
  box-shadow:
    0 10px 30px -24px rgb(15 23 42 / 0.28),
    0 1px 2px rgb(15 23 42 / 0.04);
}

.attendance-calendar__toolbar > :first-child {
  border-bottom: 1px solid rgb(226 232 240 / 0.75);
}

.attendance-calendar__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  background: #fff;
  color: #64748b;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.attendance-calendar__nav:hover:not(:disabled) {
  border-color: rgb(71 47 146 / 0.24);
  background: #f8f7fd;
  color: #472f92;
  transform: translateY(-1px);
}

.attendance-calendar__nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.attendance-calendar__month {
  min-width: 0;
  flex: 1;
  text-align: center;
}

.attendance-calendar__month-title {
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
}

.attendance-calendar__month-meta {
  margin-top: 0.15rem;
  font-size: 0.73rem;
  color: #94a3b8;
}

.attendance-calendar__current-btn:deep(.p-button) {
  border-color: #dbe2f0;
  color: #475569;
}

.attendance-calendar__today {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 0.85rem 1rem;
  background:
    linear-gradient(180deg, rgb(248 250 252 / 0.9) 0%, rgb(255 255 255 / 0.95) 100%);
}

.attendance-calendar__today-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.attendance-calendar__today-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
}

.attendance-calendar__today-item {
  font-size: 0.92rem;
  color: #475569;
  font-variant-numeric: tabular-nums;
}

.attendance-calendar__today-empty {
  font-size: 0.92rem;
  color: #64748b;
}

.attendance-calendar__desktop {
  overflow: hidden;
  border: 1px solid rgb(226 232 240 / 0.8);
  border-radius: 1rem;
  background: #f8fafc;
  box-shadow:
    0 10px 30px -24px rgb(15 23 42 / 0.3),
    0 1px 2px rgb(15 23 42 / 0.05);
}

.attendance-calendar__weekday-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid rgb(226 232 240 / 0.85);
  background: #fff;
}

.attendance-calendar__weekday {
  padding: 0.85rem 0.25rem;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
}

.attendance-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  padding: 1px;
  background: rgb(226 232 240 / 0.9);
}

.attendance-calendar__cell {
  display: flex;
  flex-direction: column;
  min-height: 7.15rem;
  padding: 0.8rem 0.85rem;
  text-align: left;
  color: #0f172a;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
}

.attendance-calendar__cell:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.16);
  filter: saturate(1.03);
}

.attendance-calendar__cell-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.attendance-calendar__day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.9rem;
  padding: 0 0.25rem;
  border-radius: 0.45rem;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
}

.attendance-calendar__today-pill {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 700;
}

.attendance-calendar__cell-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.65rem;
}

.attendance-calendar__status-chip {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.78);
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1.2;
  color: #334155;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.75);
}

.attendance-calendar__time-range {
  font-size: 0.82rem;
  line-height: 1.45;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.attendance-calendar__duration {
  margin-top: auto;
  font-size: 0.68rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.attendance-calendar__cell-empty {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.72rem;
  line-height: 1.4;
}

@media (min-width: 1280px) {
  .attendance-calendar__cell {
    min-height: 7.5rem;
  }

  .attendance-calendar__time-range {
    font-size: 0.86rem;
  }
}
</style>
