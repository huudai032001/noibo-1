import type { JobKpiMeetingScore, JobKpiTeamleadStatus } from '../constants'

export interface JobKpiUserRef {
  id: number
  name: string
}

export interface JobKpiDepartmentRef {
  id: number
  name: string
}

export interface JobKpiTeamleadListItem {
  id?: number
  userId: number
  user: JobKpiUserRef | null
  departmentId: number | null
  department: JobKpiDepartmentRef | null
  totalPointKra: number | null
  totalPointMeeting: number | null
  assessor: JobKpiUserRef | null
  status: JobKpiTeamleadStatus | number
  year: number | null
  month: number | null
}

export interface JobKpiManagerWeek {
  id?: number
  week?: number
  percentResults?: number | null
  description?: string | null
}

export interface JobKpiDetailKraItem {
  id: number
  kraId?: number
  name: string
  requestResult: string
  results: string
  percentScore: number | null
  percentResults: number | null
  description: string
  month: number | null
  kraManagerWeeks: JobKpiManagerWeek[]
}

export interface JobKpiMeetingWeekCell {
  weekNumber: number
  score: number | null
}

export interface JobKpiWeekMeetingRow {
  id?: number
  criteriaId?: number
  criteriaName: string
  weeks: JobKpiMeetingWeekCell[]
}

export interface JobKpiDetailData {
  totalPercentKra: number | null
  totalScoreMeeting: number | null
  description: string
  details: JobKpiDetailKraItem[]
  weekMeetings: JobKpiWeekMeetingRow[]
  weekCount: number
}

export interface JobKpiDepartmentOption {
  id: number
  name: string
}

export interface JobKpiTeamleadListQuery {
  page?: number
  keyword?: string
  month?: string
  departmentId?: number | null
  status?: number | null
}

export interface JobKpiTeamleadPaginationMeta {
  data?: JobKpiTeamleadListApiItem[]
  total?: number
  lastPage?: number
  perPage?: number
  currentPage?: number
}

export interface JobKpiTeamleadListResponse {
  data?: JobKpiTeamleadListApiItem[] | JobKpiTeamleadPaginationMeta
  total?: number
  lastPage?: number
  perPage?: number
  currentPage?: number
}

export interface JobKpiTeamleadListApiItem {
  id?: number
  userId?: number
  user?: JobKpiUserRef | null
  departmentId?: number | null
  department?: JobKpiDepartmentRef | null
  totalPointKra?: number | null
  totalPointMeeting?: number | null
  assessor?: JobKpiUserRef | null
  status?: number
  year?: number | null
  month?: number | null
}

export interface JobKpiDetailQuery {
  userId: number
  month: string
  departmentId: number | null
}

export interface JobKpiDetailResponse {
  data?: JobKpiDetailApiData
}

export interface JobKpiDetailApiData {
  totalPercentKra?: number | null
  totalScoreMeeting?: number | null
  description?: string | null
  details?: JobKpiDetailKraApiItem[] | { data?: JobKpiDetailKraApiItem[] }
  weekMeetings?: JobKpiWeekMeetingApiRow[]
}

export interface JobKpiDetailKraApiItem {
  id: number
  kraId?: number
  name?: string
  requestResult?: string
  results?: string | null
  percentScore?: number | null
  percentResults?: number | null
  description?: string | null
  month?: number | null
  kraManagerWeeks?: JobKpiManagerWeek[] | object
}

export interface JobKpiWeekMeetingApiRow {
  id?: number
  criteriaId?: number
  criteriaName?: string
  week?: unknown[]
}

export interface JobKpiUpdateTeamLeadPayload {
  departmentId: number | null
  userId: number
  month: string
  details: JobKpiDetailKraItem[]
  weekMeetings: JobKpiWeekMeetingUpdateRow[]
  description: string
}

export interface JobKpiWeekMeetingUpdateRow {
  id?: number
  criteriaId?: number
  criteriaName: string
  week: JobKpiMeetingWeekPayloadCell[]
}

export interface JobKpiMeetingWeekPayloadCell {
  weekKey: string
  score: number | null
}

export interface JobKpiUpdateKraPayload {
  id: number
  name: string
  requestResult: string
}

export interface JobKpiCreateKraPayload {
  userId: number
  name: string
  requestResult: string
  numberHour: string | number
  percentScore: string | number
}

export interface JobKpiCreateKraForm {
  name: string
  requestResult: string
  numberHour: string
  percentScore: string
}

export interface JobKpiKraHistoryQuery {
  userId: number
  year: number | null
  month: number | null
}

export interface JobKpiKraHistoryContent {
  name?: string
  requestResult?: string
}

export interface JobKpiKraHistoryItem {
  id: number
  updatedAt: string
  oldContent: JobKpiKraHistoryContent | null
  newContent: JobKpiKraHistoryContent | null
}

export interface JobKpiKraHistoryResponse {
  data?: JobKpiKraHistoryItem[]
}

export interface JobKpiTeamleadDialogState {
  scoreVisible: boolean
  confirmVisible: boolean
  createKraVisible: boolean
  historyVisible: boolean
  isViewOnly: boolean
  selectedItem: JobKpiTeamleadListItem | null
  userName: string
  userId: number | null
  departmentId: number | null
}

export interface JobKpiFillSuggestState {
  visible: boolean
  kraId: number | null
  week: number | null
  percent: number | null
}

export interface JobKpiMeetingFillSuggestState {
  visible: boolean
  criteriaId: number | null
  weekNumber: number | null
  score: JobKpiMeetingScore | null
  label: string
}

export type { JobKpiMeetingScore, JobKpiTeamleadStatus }
