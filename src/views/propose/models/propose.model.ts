import type { ProposeCategory, ProposeStatus } from '../constants'

export interface ProposeUserAccountType {
  id?: number
  name?: string
}

export interface ProposeUserProfile {
  accountType?: ProposeUserAccountType
  accountTypeId?: number
}

export interface ProposeUser {
  id: number
  name?: string
  email?: string
  profile?: ProposeUserProfile
}

export interface ProposeHandler {
  id?: number
  name?: string
}

export interface ProposeItem {
  id: number
  category: ProposeCategory
  status: ProposeStatus
  reason: string
  createdAt?: string
  startDate?: string
  endDate?: string
  generalLeave?: number
  startShiftOff?: number
  typeLeave?: number
  phone?: string
  timeCheckin?: string
  timeCheckout?: string
  overtimeResults?: string
  typeArise?: number
  currentWorkingHours?: number
  currentWorkingChange?: number
  reasonForRefusal?: string
  parentDepartment?: string
  user?: ProposeUser
  userHandler?: ProposeHandler
}

export interface ProposeListQuery {
  month?: string
  category?: ProposeCategory | ''
  status?: ProposeStatus | ''
  keyword?: string
  department?: number | ''
  page?: number
}

export interface ProposeEmployeeListInner {
  data?: ProposeItem[]
  total?: number
  lastPage?: number
}

export interface ProposeEmployeeListResponse {
  data?: ProposeEmployeeListInner
}

export interface ProposeApprovalListPagination {
  total?: number
  lastPage?: number
}

export interface ProposeApprovalListResponse {
  data?: ProposeItem[]
  pagination?: ProposeApprovalListPagination
}

export interface ProposeCreatePayload {
  category: ProposeCategory
  startDate: string
  endDate?: string
  reason: string
  phone?: string
  generalLeave?: number | string
  startShiftOff?: number | string
  typeLeave?: number
  timeCheckin?: string
  timeCheckout?: string
  currentWorkingHours?: number | string
  currentWorkingChange?: number | string
  dateRange?: string[]
  month?: string
  overtimeResults?: string
  typeArise?: number
}

export interface ProposeDecidePayload {
  id: number
  status: boolean
  reasonForRefusal?: string
  typeArise?: number
}

export interface ProposeDetailFingerprint {
  fingerprintAttendanceStart?: string
  fingerprintAttendanceEnd?: string
}

export interface ProposeDepartment {
  id: number
  name: string
}

export interface ProposeUserDepartmentInfo {
  department?: {
    id?: number
    name?: string
    type?: number
  }
  userProfileAccount?: {
    type?: number
  }
}

export interface ProposeProfileUser {
  id: number
  name?: string
  phone?: string
  profile?: ProposeUserProfile
  department?: ProposeUserDepartmentInfo
  useDepartment?: ProposeUserDepartmentInfo[]
}

export interface ProposeProfileResponse {
  data?: ProposeProfileUser
}

export interface ProposeFormState {
  category: ProposeCategory
  startDate: Date | null
  endDate: Date | null
  reason: string
  phone: string
  generalLeave: number | null
  startShiftOff: number | null
  typeLeave: number
  timeCheckin: Date | null
  timeCheckout: Date | null
  currentWorkingHours: number | null
  currentWorkingChange: number | null
  overtimeResults: string
  typeArise: number
  month: string
  dateRange: Date[]
}

export interface ProposeFormErrors {
  generalLeave: boolean
  dateRest: boolean
  timecheckRest: boolean
  checkphone: boolean
  today: boolean
}

export interface ProposeApprovalRoleFlags {
  isBod: boolean
  isTbp: boolean
  isLeader: boolean
  canCreate: boolean
}

export interface ProposeDialogState {
  detailVisible: boolean
  createVisible: boolean
  deleteVisible: boolean
  approveVisible: boolean
  rejectVisible: boolean
  overtimeTypeVisible: boolean
  selectedItem: ProposeItem | null
  deleteId: number | null
  reasonForRefusal: string
  pendingDecideId: number | null
  pendingDecideApproved: boolean
}
