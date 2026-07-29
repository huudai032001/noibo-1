export const PROPOSE_API = {
  listByDepartment: '/propose-management/get-propose-by-department',
  listBod: '/propose-management/get-all-list-bod',
  create: '/propose-management/proposes',
  delete: '/propose-management/proposes',
  showDetail: '/propose-management/show-detail',
  decide: '/propose-management/decided-propose',
  profile: '/profile',
  departments: '/profile/get-department',
} as const

export const PROPOSE_CATEGORY = {
  leave: 0,
  overtime: 1,
  shiftChange: 2,
  offSiteHours: 3,
} as const

export type ProposeCategory = (typeof PROPOSE_CATEGORY)[keyof typeof PROPOSE_CATEGORY]

export const PROPOSE_STATUS = {
  pending: 0,
  approved: 1,
  rejected: 2,
} as const

export type ProposeStatus = (typeof PROPOSE_STATUS)[keyof typeof PROPOSE_STATUS]

export const PROPOSE_LEAVE_TYPE = {
  paid: 0,
  unpaid: 1,
} as const

export const PROPOSE_SHIFT_OFF = {
  morning: 1,
  afternoon: 2,
  evening: 3,
} as const

export const PROPOSE_OVERTIME_TYPE = {
  workHours: 0,
  newWork: 1,
} as const

export const PROPOSE_WORK_SHIFT = {
  morningAfternoon: 1,
  afternoonEvening: 2,
  morningEvening: 3,
  morning: 4,
  afternoon: 5,
  evening: 6,
} as const

export const PROPOSE_ACCOUNT_ROLES = {
  bod: 'BOD',
  teamLead: 'Trưởng phòng',
  departmentHead: 'Trưởng bộ phận',
} as const

export const PROPOSE_CATEGORY_OPTIONS = [
  { label: 'Nghỉ phép', value: PROPOSE_CATEGORY.leave },
  { label: 'Tăng ca', value: PROPOSE_CATEGORY.overtime },
  { label: 'Xin đổi ca làm việc', value: PROPOSE_CATEGORY.shiftChange },
  { label: 'Bổ sung giờ làm việc ngoài văn phòng', value: PROPOSE_CATEGORY.offSiteHours },
] as const

export const PROPOSE_STATUS_OPTIONS = [
  { label: 'Đang chờ duyệt', value: PROPOSE_STATUS.pending },
  { label: 'Đã duyệt', value: PROPOSE_STATUS.approved },
  { label: 'Đã từ chối', value: PROPOSE_STATUS.rejected },
] as const

export const PROPOSE_LEAVE_TYPE_OPTIONS = [
  { label: 'Nghỉ dùng phép', value: PROPOSE_LEAVE_TYPE.paid },
  { label: 'Nghỉ không lương', value: PROPOSE_LEAVE_TYPE.unpaid },
] as const

export const PROPOSE_SHIFT_OFF_OPTIONS = [
  { label: 'Ca sáng', value: PROPOSE_SHIFT_OFF.morning },
  { label: 'Ca chiều', value: PROPOSE_SHIFT_OFF.afternoon },
  { label: 'Ca tối', value: PROPOSE_SHIFT_OFF.evening },
] as const

export const PROPOSE_OVERTIME_TYPE_OPTIONS = [
  { label: 'Phát sinh giờ làm', value: PROPOSE_OVERTIME_TYPE.workHours },
  { label: 'Phát sinh công việc', value: PROPOSE_OVERTIME_TYPE.newWork },
] as const

export const PROPOSE_WORK_SHIFT_OPTIONS = [
  { label: 'Sáng - chiều', value: PROPOSE_WORK_SHIFT.morningAfternoon },
  { label: 'Chiều - tối', value: PROPOSE_WORK_SHIFT.afternoonEvening },
  { label: 'Sáng - tối', value: PROPOSE_WORK_SHIFT.morningEvening },
  { label: 'Sáng', value: PROPOSE_WORK_SHIFT.morning },
  { label: 'Chiều', value: PROPOSE_WORK_SHIFT.afternoon },
  { label: 'Tối', value: PROPOSE_WORK_SHIFT.evening },
] as const

export const PROPOSE_TYPE_APPLICATION_OPTIONS = [
  { id: PROPOSE_CATEGORY.leave, type: 'Nghỉ phép' },
  { id: PROPOSE_CATEGORY.overtime, type: 'Tăng ca' },
  { id: PROPOSE_CATEGORY.shiftChange, type: 'Xin đổi ca làm việc' },
  { id: PROPOSE_CATEGORY.offSiteHours, type: 'Bổ sung giờ làm việc ngoài văn phòng' },
] as const

export const PROPOSE_MAX_LEAVE_DAYS = 30
export const PROPOSE_MAX_PAST_DAYS = 4
export const PROPOSE_DEFAULT_PER_PAGE = 15
