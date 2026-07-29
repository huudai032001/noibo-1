<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import type { AttendanceStatus } from '../constants'
import { ATTENDANCE_STATUS } from '../constants'
import type { ChamCongStatusCounts } from '../composables/use-cham-cong-calendar'
import {
  attendanceCellSurface,
  attendanceGridCellSurface,
  attendanceLegendSwatch,
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

const totalDays = computed(() => props.statusCounts?.total ?? 0)
const legendItems = computed(() => [
  {
    key: ATTENDANCE_STATUS.success,
    label: attendanceStatusLabel(ATTENDANCE_STATUS.success),
    hint: 'Đầy đủ và đúng giờ',
    count: props.statusCounts?.success ?? 0,
  },
  {
    key: ATTENDANCE_STATUS.warning,
    label: attendanceStatusLabel(ATTENDANCE_STATUS.warning),
    hint: 'Vào muộn theo quy định',
    count: props.statusCounts?.warning ?? 0,
  },
  {
    key: ATTENDANCE_STATUS.danger,
    label: attendanceStatusLabel(ATTENDANCE_STATUS.danger),
    hint: 'Thiếu giờ vào hoặc giờ ra',
    count: props.statusCounts?.danger ?? 0,
  },
])

function weekdayLabel(y: number, m: number, d: number): string {
  const index = (new Date(y, m, d).getDay() + 6) % 7
  return WEEKDAY_LABELS[index] ?? ''
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
  if (cell.outside) return 'is-outside'

  if (cell.today) {
    return cell.info.hasData
      ? 'is-filled is-today cursor-pointer'
      : 'is-today is-today-empty'
  }

  if (cell.info.hasData) {
    return `${attendanceGridCellSurface(cell.info.status)} cursor-pointer`
  }

  if (cell.weekend) return 'is-weekend'
  return 'is-empty'
}

function timeRangeLabel(info: DayCellInfo): string {
  if (info.timeLabel) return info.timeLabel
  if (!info.checkIn && !info.checkOut) return ''
  return `${info.checkIn || '...'} - ${info.checkOut || '...'}`
}
</script>

<template>
  <div class="attendance-calendar">
    <!-- Single header: title + today + legend -->
    <header class="attendance-calendar__header">
      <div class="attendance-calendar__heading">
        <h2 class="attendance-calendar__title">Lịch chấm công</h2>
        <template v-if="loading">
          <span class="attendance-calendar__skeleton attendance-calendar__skeleton--meta" />
        </template>
        <p v-else-if="totalDays > 0" class="attendance-calendar__meta">
          {{ totalDays }} ngày có dữ liệu
        </p>
      </div>

      <div
        v-if="loading && props.todayAttendance?.isCurrentMonth"
        class="attendance-calendar__today"
      >
        <span class="attendance-calendar__skeleton attendance-calendar__skeleton--badge" />
        <span class="attendance-calendar__skeleton attendance-calendar__skeleton--today-item" />
        <span class="attendance-calendar__skeleton attendance-calendar__skeleton--today-item" />
      </div>
      <div
        v-else-if="props.todayAttendance?.isCurrentMonth"
        class="attendance-calendar__today"
      >
        <span class="attendance-calendar__today-badge">
          <span
            class="attendance-calendar__today-dot"
            :class="
              props.todayAttendance?.status
                ? attendanceStatusDot(props.todayAttendance.status)
                : 'bg-slate-300'
            "
          />
          Hôm nay
        </span>
        <template v-if="props.todayAttendance?.hasData">
          <span class="attendance-calendar__today-item tabular-nums">
            <span class="text-slate-400">Vào</span>
            {{ props.todayAttendance.checkIn }}
          </span>
          <span class="attendance-calendar__today-sep" aria-hidden="true">·</span>
          <span class="attendance-calendar__today-item tabular-nums">
            <span class="text-slate-400">Ra</span>
            {{ props.todayAttendance.checkOut }}
          </span>
          <template v-if="props.todayAttendance.duration">
            <span class="attendance-calendar__today-sep" aria-hidden="true">·</span>
            <span class="attendance-calendar__today-item tabular-nums">
              <span class="text-slate-400">Tổng</span>
              {{ props.todayAttendance.duration }}
            </span>
          </template>
        </template>
        <span v-else class="attendance-calendar__today-empty">Chưa chấm công</span>
      </div>
    </header>

    <!-- Loading skeleton -->
    <div
      v-if="loading"
      class="attendance-calendar__body"
      aria-busy="true"
      aria-label="Đang tải lịch chấm công"
    >
      <div class="attendance-calendar__legend">
        <span
          v-for="n in 4"
          :key="`legend-skel-${n}`"
          class="attendance-calendar__skeleton attendance-calendar__skeleton--legend"
        />
      </div>

      <div class="space-y-2 lg:hidden">
        <div
          v-for="n in 5"
          :key="`list-skel-${n}`"
          class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3"
        >
          <span class="attendance-calendar__skeleton attendance-calendar__skeleton--avatar" />
          <div class="min-w-0 flex-1 space-y-2">
            <span class="attendance-calendar__skeleton attendance-calendar__skeleton--line-sm" />
            <span class="attendance-calendar__skeleton attendance-calendar__skeleton--line-md" />
          </div>
        </div>
      </div>

      <div class="hidden lg:block">
        <div class="attendance-calendar__desktop">
          <div class="attendance-calendar__weekday-row">
            <div
              v-for="(label, index) in WEEKDAY_LABELS"
              :key="`skel-wd-${label}`"
              class="attendance-calendar__weekday"
              :class="index >= 5 ? 'is-weekend-label' : ''"
            >
              {{ index === 6 ? 'Chủ nhật' : `Thứ ${index + 2}` }}
            </div>
          </div>
          <div class="attendance-calendar__grid">
            <div
              v-for="cell in gridDays"
              :key="`skel-${cell.dateKey}`"
              class="attendance-calendar__cell attendance-calendar__cell--skeleton"
              :class="cell.outside ? 'is-outside' : ''"
            >
              <span
                class="attendance-calendar__skeleton attendance-calendar__skeleton--day"
                :class="cell.outside ? 'is-muted' : ''"
              />
              <span
                v-if="!cell.outside"
                class="attendance-calendar__skeleton attendance-calendar__skeleton--time"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="attendance-calendar__body">
      <div v-if="hasAttendance" class="attendance-calendar__legend">
        <div
          v-for="item in legendItems"
          :key="item.key"
          class="attendance-calendar__legend-item"
          :title="item.hint"
        >
          <span
            class="attendance-calendar__legend-swatch"
            :class="attendanceLegendSwatch(item.key)"
          />
          <span class="attendance-calendar__legend-label">{{ item.label }}</span>
          <span class="attendance-calendar__legend-count">{{ item.count }}</span>
        </div>
        <div class="attendance-calendar__legend-item" title="Ngày hiện tại">
          <span class="attendance-calendar__legend-swatch bg-orange-500" />
          <span class="attendance-calendar__legend-label">Hôm nay</span>
        </div>
      </div>

      <div
        v-if="hasAttendance === false"
        class="attendance-calendar__empty"
      >
        <div class="attendance-calendar__empty-icon">
          <i class="pi pi-calendar-times" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-slate-700">Chưa có dữ liệu chấm công</p>
          <p class="mt-0.5 text-sm text-slate-500">
            {{ monthTitle }} chưa ghi nhận giờ vào/ra. Dùng bộ chọn tháng phía trên để xem tháng khác.
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
            class="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm"
          >
            <span class="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {{ weekdayLabel(row.year, row.month, row.day) }}
            </span>
            <span
              class="text-base font-bold leading-none"
              :class="row.today ? 'text-orange-600' : 'text-slate-800'"
            >
              {{ row.day }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5">
              <span
                class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
                :class="attendanceStatusTone(row.status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="attendanceStatusDot(row.status)" />
                {{ attendanceStatusLabel(row.status) }}
              </span>
              <span
                v-if="row.today"
                class="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700"
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
            <div class="mt-1 flex items-center gap-2.5 text-sm tabular-nums">
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

          <i class="pi pi-chevron-right text-xs text-slate-300" />
        </button>
      </div>

      <div v-if="hasAttendance" class="hidden lg:block">
        <div class="attendance-calendar__desktop">
          <div class="attendance-calendar__weekday-row">
            <div
              v-for="(label, index) in WEEKDAY_LABELS"
              :key="label"
              class="attendance-calendar__weekday"
              :class="index >= 5 ? 'is-weekend-label' : ''"
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
                  ? `${attendanceStatusLabel(cell.info.status)} · ${timeRangeLabel(cell.info)}`
                  : undefined
              "
              :aria-label="
                cell.info.hasData
                  ? `Ngày ${cell.day}, ${attendanceStatusLabel(cell.info.status)}`
                  : `Ngày ${cell.day}`
              "
              @click="onSelectDay(cell)"
            >
              <span class="attendance-calendar__day-number">
                {{ String(cell.day).padStart(2, '0') }}
              </span>
              <p
                v-if="!cell.outside && cell.info.hasData"
                class="attendance-calendar__time-range"
              >
                {{ timeRangeLabel(cell.info) }}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attendance-calendar {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.attendance-calendar__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.25rem;
}

.attendance-calendar__heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.45rem 0.75rem;
  min-width: 0;
}

.attendance-calendar__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  color: #0f172a;
}

.attendance-calendar__meta {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.attendance-calendar__today {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  min-width: 0;
}

.attendance-calendar__today-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fdb913;
}

.attendance-calendar__today-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
}

.attendance-calendar__today-item {
  font-size: 0.84rem;
  font-weight: 600;
  color: #334155;
}

.attendance-calendar__today-item .text-slate-400 {
  margin-right: 0.2rem;
  font-weight: 500;
}

.attendance-calendar__today-sep {
  color: #cbd5e1;
}

.attendance-calendar__today-empty {
  font-size: 0.84rem;
  color: #64748b;
}

.attendance-calendar__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attendance-calendar__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1rem;
}

.attendance-calendar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.attendance-calendar__legend-swatch {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 0.15rem;
  flex-shrink: 0;
}

.attendance-calendar__legend-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
}

.attendance-calendar__legend-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
  font-variant-numeric: tabular-nums;
}

.attendance-calendar__empty {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 0;
}

.attendance-calendar__empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 0.65rem;
  background: #f8fafc;
  color: var(--app-primary, #472f92);
  border: 1px solid #e2e8f0;
}

.attendance-calendar__desktop {
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.65rem;
  background: #fff;
}

.attendance-calendar__weekday-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid #e2e8f0;
  background: #fafafa;
}

.attendance-calendar__weekday {
  padding: 0.55rem 0.2rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.attendance-calendar__weekday.is-weekend-label {
  color: #cbd5e1;
}

.attendance-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  background: #e2e8f0;
}

.attendance-calendar__cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  min-height: 5.5rem;
  padding: 0.6rem 0.65rem;
  text-align: left;
  background: #fff;
  color: #334155;
  transition: filter 0.15s ease;
}

.attendance-calendar__cell:hover:not(:disabled) {
  filter: brightness(1.06);
  z-index: 1;
}

.attendance-calendar__cell:disabled {
  cursor: default;
}

.attendance-calendar__cell.is-outside {
  background: #fff;
  pointer-events: none;
}

.attendance-calendar__cell.is-outside .attendance-calendar__day-number {
  color: #cbd5e1;
}

.attendance-calendar__cell.is-weekend {
  background: #fafafa;
}

.attendance-calendar__cell.is-weekend .attendance-calendar__day-number {
  color: #94a3b8;
}

.attendance-calendar__cell.is-empty .attendance-calendar__day-number {
  color: #475569;
}

.attendance-calendar__cell.is-filled {
  color: #fff;
}

.attendance-calendar__cell.is-filled .attendance-calendar__day-number,
.attendance-calendar__cell.is-filled .attendance-calendar__time-range {
  color: #fff;
}

.attendance-calendar__cell.is-success {
  background: var(--app-primary, #472f92);
}

.attendance-calendar__cell.is-success:hover:not(:disabled) {
  background: var(--app-primary-hover, #3d2780);
}

.attendance-calendar__cell.is-warning {
  background: #b45309;
}

.attendance-calendar__cell.is-warning:hover:not(:disabled) {
  background: #9a3412;
}

.attendance-calendar__cell.is-danger {
  background: #be123c;
}

.attendance-calendar__cell.is-danger:hover:not(:disabled) {
  background: #9f1239;
}

.attendance-calendar__cell.is-today {
  background: #fdb913;
  color: #fff;
}

.attendance-calendar__cell.is-today .attendance-calendar__day-number,
.attendance-calendar__cell.is-today .attendance-calendar__time-range {
  color: #fff;
}

.attendance-calendar__cell.is-today:hover:not(:disabled) {
  background: #fdb913;
}

.attendance-calendar__cell.is-today-empty {
  background: #fff7ed;
  box-shadow: inset 0 0 0 1.5px #fb923c;
}

.attendance-calendar__cell.is-today-empty .attendance-calendar__day-number {
  color: #c2410c;
  font-weight: 800;
}

.attendance-calendar__day-number {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.attendance-calendar__time-range {
  font-size: 0.76rem;
  line-height: 1.35;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  word-break: break-word;
}

.attendance-calendar__skeleton {
  display: block;
  border-radius: 0.3rem;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: attendance-skeleton-pulse 1.2s ease-in-out infinite;
}

.attendance-calendar__skeleton--meta {
  width: 6.5rem;
  height: 0.7rem;
}

.attendance-calendar__skeleton--badge {
  width: 4rem;
  height: 0.85rem;
  border-radius: 999px;
}

.attendance-calendar__skeleton--today-item {
  width: 4.5rem;
  height: 0.8rem;
}

.attendance-calendar__skeleton--legend {
  width: 5rem;
  height: 0.8rem;
}

.attendance-calendar__skeleton--avatar {
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
}

.attendance-calendar__skeleton--line-sm {
  width: 40%;
  height: 0.65rem;
}

.attendance-calendar__skeleton--line-md {
  width: 70%;
  height: 0.8rem;
}

.attendance-calendar__cell--skeleton {
  pointer-events: none;
  cursor: default;
}

.attendance-calendar__skeleton--day {
  width: 1.4rem;
  height: 0.9rem;
}

.attendance-calendar__skeleton--day.is-muted {
  opacity: 0.4;
}

.attendance-calendar__skeleton--time {
  width: 78%;
  height: 0.65rem;
}

@keyframes attendance-skeleton-pulse {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@media (min-width: 1280px) {
  .attendance-calendar__cell {
    min-height: 5.85rem;
    padding: 0.7rem 0.75rem;
  }

  .attendance-calendar__time-range {
    font-size: 0.82rem;
  }
}

</style>
