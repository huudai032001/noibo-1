export interface Area {
  id: number
  name: string
}

export interface Branch {
  id: number
  name: string
  nameAlias?: string
  name_alias?: string
}

export interface ErrorType {
  id: number
  name: string
}

export interface GoalType {
  id: number
  name: string
}

export interface Position {
  id: number | string
  name: string
}

export interface User {
  id: number
  name: string
  profileAccountTypeId?: number
}

// Summary statistics model
export interface ErrorSummaryItem {
  title: string
  type: number | null
  totalError: number
  totalErrorToday: number
  totalErrorForgetFill: number
  totalErrorNotFill: number
  totalErrorNotAchieve: number
  totalErrorTodayForgetFill: number
  totalErrorTodayNotFill: number
  totalErrorTodayNotAchieve: number
}

// Individual error record model
export interface ErrorTargetProgressItem {
  id: number
  name: string
  userId: string
  user_id?: string
  process: number
  processType: number
  process_type?: number
  accountType: string
  account_type?: string
  areaName: string
  area_name?: string
  branchName: string | null
  branch_name?: string | null
  boss: string
  isCTV: string
  is_ctv?: string
  dateAppear: string
  date_appear?: string
  message: string
  status: string
  createdAt?: string
  created_at?: string
  openDate?: string | null
  open_date?: string | null
}

export interface ErrorCard {
  id?: number
  count?: number
  type?: string
  name?: string
}

export interface ErrorTargetProgressFilters {
  areaId?: number
  area_id?: number
  branchId?: number
  branch_id?: number
  saleId?: number | null
  sale?: number | null
  viewAs?: number
  view_as?: number
  accountTypeId?: number
  account_type_id?: number
  typeError?: number
  type_error?: number
  goalType?: number
  goal_type?: number
  dateRange?: [string, string]
  date_range?: string[]
}

export interface Pagination {
  currentPage: number
  current_page?: number
  perPage: number
  per_page?: number
  total: number
  lastPage?: number
  last_page?: number
  count?: number
}

export interface ErrorTargetProgressListResponse {
  error?: boolean
  message?: string | null
  data: ErrorTargetProgressItem[]
  pagination?: Pagination
}

export interface ErrorCardListResponse {
  data: ErrorCard[]
}

export interface ChildUser {
  id: number
  name: string
  profile?: {
    accountTypeId?: number
    account_type_id?: number
    accountType?: {
      id: number
      name: string
    }
  }
}

export interface WatchAsOption {
  id: number
  value: string
  label: string
}

export interface TableColumn {
  key: string
  label: string
  style?: string
}

// Error statistics by type
export interface ErrorStatsByType {
  forgetFill: number
  notFill: number
  notAchieve: number
}
