export const CHAM_CONG_API = {
  timeKeeping: '/okr/get-list',
} as const

export const OFFICE_LABEL = {
  headOffice: 'Trụ sở chính',
  tranDaiNghia: 'Trần Đại Nghĩa',
} as const

export const ATTENDANCE_STATUS = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  none: 'none',
} as const

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS]

/** User type that skips late-check-in warning */
export const ATTENDANCE_TYPE_NO_WARNING = 1

export const WORK_TIME = {
  morningStart: '08:00:00',
  morningLate: '08:45:00',
  noon: '12:00:00',
  afternoonStart: '13:30:00',
  afternoonLate: '13:30:00',
  eveningEnd: '19:00:00',
} as const
