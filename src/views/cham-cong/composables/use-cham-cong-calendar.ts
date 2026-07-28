import type { Ref } from 'vue'
import { computed } from 'vue'
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_TYPE_NO_WARNING,
  WORK_TIME,
  type AttendanceStatus,
} from '../constants'
import type {
  ChamCongDayEntry,
  ChamCongDayMap,
  ChamCongDayRecord,
} from '../models/cham-cong.model'
import { formatShortTime, toDateKey } from '../utils/cham-cong-helpers'

interface ChamCongCalendarState {
  dayMap: Ref<ChamCongDayMap>
  userType: Ref<number | null>
}

export interface ChamCongDayCellInfo {
  status: AttendanceStatus
  checkIn: string
  checkOut: string
  hasData: boolean
  timeLabel: string
}

export interface ChamCongStatusCounts {
  success: number
  warning: number
  danger: number
  total: number
}

function isLateCheckIn(checkIn: string, userType: number | null): boolean {
  if (userType === ATTENDANCE_TYPE_NO_WARNING) return false
  if (checkIn >= WORK_TIME.morningLate && checkIn < WORK_TIME.noon) return true
  if (checkIn >= WORK_TIME.afternoonLate) return true
  return false
}

function resolveStatus(entry: ChamCongDayEntry | undefined, userType: number | null): AttendanceStatus {
  if (!entry) return ATTENDANCE_STATUS.none

  const hasIn = Boolean(entry.in)
  const hasOut = Boolean(entry.out)

  if (!hasIn || !hasOut) return ATTENDANCE_STATUS.danger
  if (entry.in && isLateCheckIn(entry.in, userType)) return ATTENDANCE_STATUS.warning
  return ATTENDANCE_STATUS.success
}

function buildShortCheckIn(entry: ChamCongDayEntry | undefined): string {
  if (!entry?.in) return entry ? '...' : ''
  return formatShortTime(entry.in)
}

function buildShortCheckOut(entry: ChamCongDayEntry | undefined): string {
  if (!entry) return ''
  if (!entry.out) return entry.in ? '...' : ''
  return formatShortTime(entry.out)
}

function buildTimeLabel(entry: ChamCongDayEntry | undefined): string {
  if (!entry || (!entry.in && !entry.out)) return ''
  return `${buildShortCheckIn(entry)} – ${buildShortCheckOut(entry)}`
}

export function useChamCongCalendar(state: ChamCongCalendarState) {
  const statusCounts = computed<ChamCongStatusCounts>(() => {
    let success = 0
    let warning = 0
    let danger = 0

    for (const entry of Object.values(state.dayMap.value)) {
      if (!entry) continue
      const status = resolveStatus(entry, state.userType.value)
      if (status === ATTENDANCE_STATUS.success) success += 1
      else if (status === ATTENDANCE_STATUS.warning) warning += 1
      else if (status === ATTENDANCE_STATUS.danger) danger += 1
    }

    return {
      success,
      warning,
      danger,
      total: success + warning + danger,
    }
  })

  function convertRecordsToDayMap(records: ChamCongDayRecord[]): ChamCongDayMap {
    const map: ChamCongDayMap = {}

    for (const record of records) {
      if (!record.dateFormat) continue
      map[record.dateFormat] = {
        in: record.in ?? null,
        out: record.out ?? null,
      }
    }

    return map
  }

  function getEntry(dateKey: string): ChamCongDayEntry | undefined {
    return state.dayMap.value[dateKey]
  }

  function getDayCellInfo(year: number, month: number, day: number): ChamCongDayCellInfo {
    const entry = getEntry(toDateKey(year, month, day))
    return {
      status: resolveStatus(entry, state.userType.value),
      checkIn: buildShortCheckIn(entry),
      checkOut: buildShortCheckOut(entry),
      hasData: Boolean(entry),
      timeLabel: buildTimeLabel(entry),
    }
  }

  function getStatusForDate(year: number, month: number, day: number): AttendanceStatus {
    return getDayCellInfo(year, month, day).status
  }

  function getTimeLabelForDate(year: number, month: number, day: number): string {
    return getDayCellInfo(year, month, day).timeLabel
  }

  function getCheckInForDate(year: number, month: number, day: number): string {
    return getDayCellInfo(year, month, day).checkIn
  }

  function getCheckOutForDate(year: number, month: number, day: number): string {
    return getDayCellInfo(year, month, day).checkOut
  }

  function getDateKey(year: number, month: number, day: number): string {
    return toDateKey(year, month, day)
  }

  function hasAttendance(dateKey: string): boolean {
    return Boolean(state.dayMap.value[dateKey])
  }

  return {
    statusCounts,
    convertRecordsToDayMap,
    getEntry,
    getDayCellInfo,
    getStatusForDate,
    getTimeLabelForDate,
    getCheckInForDate,
    getCheckOutForDate,
    getDateKey,
    hasAttendance,
    resolveStatus,
  }
}
