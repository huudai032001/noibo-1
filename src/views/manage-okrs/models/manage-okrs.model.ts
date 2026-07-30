export interface ManageOkrsDepartmentRef {
  id: number
  name: string
}

export interface ManageOkrsLeaderRef {
  id: number
  name: string
}

export interface ManageOkrsHumanPivot {
  userId: number
  exp: number | null
  feedback: string | null
}

export interface ManageOkrsHuman {
  id: number
  name: string
  phone?: string | null
  displayName?: string
  pivot?: ManageOkrsHumanPivot
}

export interface ManageOkrsItemApi {
  id: number
  name?: string
  quarter?: number
  year?: number
  type?: number
  status?: number
  completionRate?: number
  expTarget?: number
  department?: ManageOkrsDepartmentRef | null
  leader?: ManageOkrsLeaderRef | null
  okrUsers?: ManageOkrsHuman[]
}

export interface ManageOkrsListPaginationApi {
  data?: ManageOkrsItemApi[]
  total?: number
  currentPage?: number
  lastPage?: number
  perPage?: number
}

export interface ManageOkrsListResponseApi {
  data?: ManageOkrsListPaginationApi
}

export interface ManageOkrsListQuery {
  page: number
  name?: string
  quarter: number
  year: number
}

export interface ManageOkrsUpdateStatusPayload {
  id: number
  status: number
}

export interface ManageOkrsShareExpRowPayload {
  userId: number
  exp: number | null
  feedback: string | null
}

export interface ManageOkrsShareExpPayload {
  id: number
  data: ManageOkrsShareExpRowPayload[]
}

export interface ManageOkrsUpsertPayload {
  name: string
  type: number
  kpiTarget: string
  kpiMin: string
  userIds: number[]
  expTarget: string
  result: string
}

export interface ManageOkrsUpdatePayload extends ManageOkrsUpsertPayload {
  id: number
}

export interface ManageOkrsDetailResponseApi {
  data?: {
    id: number
    name?: string
    type?: number
    kpiMin?: string | number | null
    expTarget?: string | number | null
    kpiTarget?: string | number | null
    result?: string | null
    okrUsers?: ManageOkrsHuman[]
  }
}

export interface ManageOkrsFilterUserQuery {
  keyword: string
}

export interface ManageOkrsFilterUserResponseApi {
  data?: ManageOkrsHuman[]
}

export interface ManageOkrsListItem {
  id: number
  name: string
  departmentName: string
  quarterLabel: string
  typeLabel: string
  typeValue: number
  typeClass: string
  humans: ManageOkrsHuman[]
  humanSummary: string
  expText: string
  totalExp: number
  expTarget: number
  leaderName: string
  status: number
  completionRate: number | null
}

export interface ManageOkrsTablePagination {
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}

export interface ManageOkrsFormData {
  name: string
  type: number
  kpiTarget: string
  kpiMin: string
  userIds: number[]
  expTarget: string
  result: string
}

export interface ManageOkrsShareExpRow {
  id: number
  name: string
  userId: number
  exp: number | null
  feedback: string
}
