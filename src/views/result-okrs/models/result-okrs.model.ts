export interface ResultOkrsDepartmentRef {
  id: number
  name: string
}

export interface ResultOkrsLeaderRef {
  id: number
  name: string
}

export interface ResultOkrsNestedOkrApi {
  id: number
  name?: string | null
  quarter?: number | null
  year?: number | null
  type?: number | null
  status?: number | null
  completionRate?: number | null
  department?: ResultOkrsDepartmentRef | null
  leader?: ResultOkrsLeaderRef | null
}

export interface ResultOkrsItemApi {
  id: number
  exp?: number | null
  feedback?: string | null
  okr?: ResultOkrsNestedOkrApi | null
}

export interface ResultOkrsPaginationApi {
  data?: ResultOkrsItemApi[]
  total?: number
  currentPage?: number
  lastPage?: number
  perPage?: number
}

export interface ResultOkrsListResponseApi {
  data?: ResultOkrsItemApi[] | ResultOkrsPaginationApi
}

export interface ResultOkrsListQuery {
  page: number
  name?: string
  quarter: number
  year: number
}

export interface ResultOkrsListItem {
  id: number
  name: string
  departmentName: string
  quarterLabel: string
  typeLabel: string
  typeClass: string
  exp: number
  expLabel: string
  leaderName: string
  statusLabel: string
  statusClass: string
  completionRate: number | null
  completionRateLabel: string
  feedback: string
}

export interface ResultOkrsListMeta {
  rows: ResultOkrsItemApi[]
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}
