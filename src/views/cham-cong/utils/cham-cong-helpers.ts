import type { AttendanceStatus } from '../constants'
import { ATTENDANCE_STATUS } from '../constants'

export function formatFullTime(value?: string | null, empty = '—'): string {
  if (!value) return empty
  return value.length >= 8 ? value.slice(0, 8) : value
}

export function formatShortTime(value?: string | null): string {
  if (!value) return '—'
  return value.slice(0, 5)
}

export function formatAttendanceNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0'
  const amount = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(amount)) return '0'
  return Number(amount.toFixed(2)).toString()
}

export function attendanceStatusLabel(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) return 'Đúng giờ'
  if (status === ATTENDANCE_STATUS.warning) return 'Đi muộn'
  if (status === ATTENDANCE_STATUS.danger) return 'Chưa chấm công đủ'
  return 'Chưa chấm công'
}

export function attendanceStatusTone(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) {
    return 'bg-[#472f92]/[0.08] text-[#472f92] border-[#472f92]/20'
  }
  if (status === ATTENDANCE_STATUS.warning) {
    return 'bg-amber-50 text-amber-800 border-amber-200'
  }
  if (status === ATTENDANCE_STATUS.danger) {
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }
  return 'bg-slate-50 text-slate-500 border-slate-200'
}

/** Mobile list row — left accent + soft fill */
export function attendanceCellSurface(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) {
    return 'border border-[#472f92]/20 border-l-[3px] border-l-[#472f92] bg-[#472f92]/[0.04] hover:bg-[#472f92]/[0.08]'
  }
  if (status === ATTENDANCE_STATUS.warning) {
    return 'border border-amber-200/80 border-l-[3px] border-l-amber-500 bg-amber-50 hover:bg-amber-100/80'
  }
  if (status === ATTENDANCE_STATUS.danger) {
    return 'border border-rose-200/80 border-l-[3px] border-l-rose-500 bg-rose-50 hover:bg-rose-100/80'
  }
  return 'border border-slate-100 bg-slate-50/60'
}

/**
 * Dense calendar grid — solid fills for fast scanning
 * (brand purple = đúng giờ, amber = muộn, rose = thiếu giờ).
 */
export function attendanceGridCellSurface(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) {
    return 'is-filled is-success'
  }
  if (status === ATTENDANCE_STATUS.warning) {
    return 'is-filled is-warning'
  }
  if (status === ATTENDANCE_STATUS.danger) {
    return 'is-filled is-danger'
  }
  return ''
}

export function attendanceStatusDot(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) return 'bg-[#472f92]'
  if (status === ATTENDANCE_STATUS.warning) return 'bg-amber-500'
  if (status === ATTENDANCE_STATUS.danger) return 'bg-rose-500'
  return 'bg-transparent'
}

/** Legend swatch matching solid calendar cells */
export function attendanceLegendSwatch(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) return 'bg-[#472f92]'
  if (status === ATTENDANCE_STATUS.warning) return 'bg-amber-600'
  if (status === ATTENDANCE_STATUS.danger) return 'bg-rose-600'
  return 'bg-slate-200'
}

export function attendanceStatusAccent(status: AttendanceStatus): string {
  if (status === ATTENDANCE_STATUS.success) return 'text-[#472f92]'
  if (status === ATTENDANCE_STATUS.warning) return 'text-amber-700'
  if (status === ATTENDANCE_STATUS.danger) return 'text-rose-700'
  return 'text-slate-500'
}

/** Parse "HH:mm:ss" / "HH:mm" → minutes from midnight */
export function timeToMinutes(value?: string | null): number | null {
  if (!value) return null
  const parts = value.split(':')
  const hours = Number.parseInt(parts[0] ?? '', 10)
  const minutes = Number.parseInt(parts[1] ?? '', 10)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

/** Work duration label, e.g. "8g 15p" */
export function formatWorkDuration(
  checkIn?: string | null,
  checkOut?: string | null,
  empty = '—',
): string {
  const start = timeToMinutes(checkIn)
  const end = timeToMinutes(checkOut)
  if (start === null || end === null || end < start) return empty

  const total = end - start
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (hours === 0) return `${minutes}p`
  if (minutes === 0) return `${hours}g`
  return `${hours}g ${minutes}p`
}

export function isSameCalendarDay(a: Date, year: number, month: number, day: number): boolean {
  return a.getFullYear() === year && a.getMonth() === month && a.getDate() === day
}

export function monthYearLongLabel(date: Date): string {
  return `Tháng ${date.getMonth() + 1} Năm ${date.getFullYear()}`
}

export const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const

export interface CalendarGridDay {
  year: number
  month: number
  day: number
  outside: boolean
  dateKey: string
}

export function toDateKey(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

/** Monday-first month grid (5–6 weeks). */
export function buildMonthGrid(year: number, month: number): CalendarGridDay[] {
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)
  const cells: CalendarGridDay[] = []

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    const cellYear = date.getFullYear()
    const cellMonth = date.getMonth()
    const cellDay = date.getDate()
    cells.push({
      year: cellYear,
      month: cellMonth,
      day: cellDay,
      outside: cellMonth !== month,
      dateKey: toDateKey(cellYear, cellMonth, cellDay),
    })
  }

  const lastWeek = cells.slice(35)
  if (lastWeek.every((cell) => cell.outside)) {
    return cells.slice(0, 35)
  }

  return cells
}

export const CHAM_CONG_LOCALE = {
  firstDayOfWeek: 1,
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Thg 1',
    'Thg 2',
    'Thg 3',
    'Thg 4',
    'Thg 5',
    'Thg 6',
    'Thg 7',
    'Thg 8',
    'Thg 9',
    'Thg 10',
    'Thg 11',
    'Thg 12',
  ],
  today: 'Tháng này',
  clear: 'Xóa',
}
