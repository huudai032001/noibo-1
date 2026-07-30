import type { JobKpiMeetingScore, JobKpiStaffStatus, JobKpiStaffTab } from '../constants'

export interface JobKpiManagerWeek {
  id?: number
  week?: number
  percentResults?: number | null
  description?: string | null
}

export interface JobKpiKraItem {
  id: number
  name: string
  requestResult: string
  results: string
  percentScore: number | null
  status: JobKpiStaffStatus | number
  statusLeader: number | null
  percentResults: number | null
  description: string
  kraManagerWeeks: JobKpiManagerWeek[]
}

export interface JobKpiDetailsPagination {
  data: JobKpiKraItem[]
  total: number
  lastPage: number
  perPage: number
  currentPage: number
}

export interface JobKpiWeekMeetingRow {
  id?: number
  criteriaName: string
  weekScores: Array<number | null>
}

export interface JobKpiPersonalData {
  totalPercentKra: number | null
  totalScoreMeeting: number | null
  description: string
  details: JobKpiDetailsPagination
  weekMeetings: JobKpiWeekMeetingRow[]
  weekCount: number
}

export interface JobKpiStaffListQuery {
  page?: number
  userId?: number
  month?: string
}

export interface JobKpiStaffListResponse {
  data?: JobKpiPersonalApiData
}

export interface JobKpiPersonalApiData {
  totalPercentKra?: number | null
  totalScoreMeeting?: number | null
  description?: string | null
  details?: JobKpiDetailsApiPagination
  weekMeetings?: JobKpiWeekMeetingApiRow[]
}

export interface JobKpiDetailsApiPagination {
  data?: JobKpiKraApiItem[]
  total?: number
  lastPage?: number
  perPage?: number
  currentPage?: number
}

export interface JobKpiKraApiItem {
  id: number
  name?: string
  requestResult?: string
  results?: string | null
  percentScore?: number | null
  status?: number
  statusLeader?: number | null
  percentResults?: number | null
  description?: string | null
  kraManagerWeeks?: JobKpiManagerWeek[] | object
}

export interface JobKpiWeekMeetingApiRow {
  id?: number
  criteriaName?: string
  week?: unknown[]
}

export interface JobKpiUpdateResultPayload {
  kraId: number
  result: string
}

export interface JobKpiDialogState {
  detailVisible: boolean
  completeVisible: boolean
  selectedItem: JobKpiKraItem | null
  isHappyComplete: boolean
  showFireworks: boolean
}

export interface JobKpiResultFeedback {
  error?: string
  success?: string
}

export type { JobKpiMeetingScore, JobKpiStaffStatus, JobKpiStaffTab }
