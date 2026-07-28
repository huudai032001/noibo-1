import type { AttendanceStatus } from '../constants'

export interface ChamCongQueryParams {
  from: string
  to: string
  page?: number
}

export interface ChamCongUserInfo {
  type?: number
  office?: number
}

export interface ChamCongDayRecord {
  dateFormat: string
  in?: string | null
  out?: string | null
}

export interface ChamCongListInner {
  data?: ChamCongDayRecord[]
}

export interface ChamCongListPayload {
  days?: number
  totalHours?: number
  user?: ChamCongUserInfo
  data?: ChamCongListInner
}

export interface ChamCongApiResponse {
  data?: ChamCongListPayload
  status?: number
  message?: string
}

export interface ChamCongDayEntry {
  in?: string | null
  out?: string | null
}

export interface ChamCongDayMap {
  [dateKey: string]: ChamCongDayEntry | undefined
}

export interface ChamCongDayCell {
  dateKey: string
  day: number
  entry?: ChamCongDayEntry
  status: AttendanceStatus
  timeLabel: string
}

export interface ChamCongDetailPayload {
  dateKey: string
  in?: string | null
  out?: string | null
  status: AttendanceStatus
}
