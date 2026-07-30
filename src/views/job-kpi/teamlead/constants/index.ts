export const JOB_KPI_TEAMLEAD_API = {
  listPersonal: '/kraMonthlyResults',
  detail: '/kraManager/details',
  updateTeamLead: '/kraManager/details/update/team-lead',
  updateKra: '/kra-manager/update-kra',
  createKra: '/kra-manager/add-kra',
  kraHistory: '/kra-manager/history',
  departmentsByHead: '/profile/get-department-by-department-head',
} as const

export const JOB_KPI_TEAMLEAD_STATUS = {
  needInput: 0,
  needScore: 1,
  scored: 2,
} as const

export type JobKpiTeamleadStatus =
  (typeof JOB_KPI_TEAMLEAD_STATUS)[keyof typeof JOB_KPI_TEAMLEAD_STATUS]

export const JOB_KPI_TEAMLEAD_STATUS_OPTIONS = [
  { label: 'Chưa nhập thành phẩm', value: JOB_KPI_TEAMLEAD_STATUS.needInput },
  { label: 'Cần chấm', value: JOB_KPI_TEAMLEAD_STATUS.needScore },
  { label: 'Đã chấm', value: JOB_KPI_TEAMLEAD_STATUS.scored },
] as const

export const JOB_KPI_PERCENT_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '30%', value: 30 },
  { label: '60%', value: 60 },
  { label: '90%', value: 90 },
  { label: '100%', value: 100 },
] as const

export const JOB_KPI_TEAMLEAD_DEFAULT_PER_PAGE = 15

export const JOB_KPI_MEETING_SCORE = {
  fail: 0,
  pass: 1,
} as const

export type JobKpiMeetingScore =
  (typeof JOB_KPI_MEETING_SCORE)[keyof typeof JOB_KPI_MEETING_SCORE]
