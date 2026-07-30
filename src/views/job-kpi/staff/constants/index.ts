export const JOB_KPI_STAFF_API = {
  kraAndMeetingByUser: '/kraManager/kraAndMeetingByUser',
  updatePersonalResult: '/kraManager/details/update/persional',
  weeklyMeetingCriteria: '/kra-manager/weekly-meeting-criteria',
} as const

export const JOB_KPI_STAFF_STATUS = {
  needInput: 0,
  inputted: 1,
} as const

export type JobKpiStaffStatus =
  (typeof JOB_KPI_STAFF_STATUS)[keyof typeof JOB_KPI_STAFF_STATUS]

export const JOB_KPI_LEADER_STATUS = {
  pending: 0,
  reviewing: 1,
  completed: 2,
} as const

export const JOB_KPI_MEETING_SCORE = {
  fail: 0,
  pass: 1,
} as const

export type JobKpiMeetingScore =
  (typeof JOB_KPI_MEETING_SCORE)[keyof typeof JOB_KPI_MEETING_SCORE]

export const JOB_KPI_STAFF_TABS = {
  kpi: 'kpi',
  meeting: 'meeting',
} as const

export type JobKpiStaffTab = (typeof JOB_KPI_STAFF_TABS)[keyof typeof JOB_KPI_STAFF_TABS]

export const JOB_KPI_STAFF_STATUS_OPTIONS = [
  { label: 'Cần nhập', value: JOB_KPI_STAFF_STATUS.needInput },
  { label: 'Đã nhập', value: JOB_KPI_STAFF_STATUS.inputted },
] as const

export const JOB_KPI_MEETING_SCORE_OPTIONS = [
  { label: 'Không đạt', value: JOB_KPI_MEETING_SCORE.fail },
  { label: 'Đạt', value: JOB_KPI_MEETING_SCORE.pass },
] as const

export const JOB_KPI_STAFF_DEFAULT_PER_PAGE = 15

export const JOB_KPI_RESULT_SAVE_DEBOUNCE_MS = 1000
