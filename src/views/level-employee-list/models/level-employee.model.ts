export interface LevelEmployeeAccountType {
  id?: number
  name?: string
  image?: string
}

export interface LevelEmployeeProfile {
  id?: number
  user_id?: number
  account_type_id?: number
  account_type?: LevelEmployeeAccountType
}

export interface ScoreStandard {
  id?: number
  level?: {
    id?: number | string
    level?: string | number
    name?: string
    category_name?: string
  }
  score_standard?: number | string
}

export interface LevelEmployeeCriteria {
  id?: number
  name?: string
  task?: string
  type?: number // 1: monthly, 2: quarterly
  score_standards?: ScoreStandard[]
  _expanded?: boolean
}

export interface CurrentLevel {
  id?: number
  level?: string
  name?: string
  category_name?: string
}

export interface LatestLevelApprovalRequest {
  id?: number
  user_id?: number
  current_level?: CurrentLevel
}

export interface LevelEmployeeItemApi {
  id?: number
  name?: string
  phone?: string
  profile?: LevelEmployeeProfile
  criterias?: LevelEmployeeCriteria[]
  latest_level_approval_request?: LatestLevelApprovalRequest | null
  _expanded?: boolean
  _loading?: boolean
}

export interface LevelEmployeeListResponseApi {
  current_page?: number
  data?: LevelEmployeeItemApi[]
  last_page?: number
  total?: number
  per_page?: number
  from?: number
  to?: number
}

export interface LevelEmployeeListQuery {
  keyword?: string
  page?: number
  per_page?: number
}

export interface LevelEmployeeCreatePayload {
  user_id: string
  user_name: string
  account_name: string
  items: Array<{
    key_index: string
    [key: string]: any
  }>
}

export interface LevelEmployeeEditCriteriaPayload {
  id?: number
  user_id?: number
  name: string
  levels: Array<{
    id?: number
    score_standard: number | string
  }>
}
