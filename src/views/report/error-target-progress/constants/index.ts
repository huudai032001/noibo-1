export const ERROR_TARGET_PROGRESS_API = {
  list: '/report-error-target-progress-list',
  total: '/get-total-error-target-progress',
  export: '/export-error-target-progress',
  regions: '/regions-by-user',
  branch_list: '/branches',
  child_users: '/child-users',
}

export const ACCOUNT_TYPE_MAP: Record<number, string[]> = {
  7: [26, 6, 5, 1, 2, 3, 4], // BOD
  6: [6, 5, 1, 2, 3, 4, 26], // Giám đốc vùng
  5: [5, 1, 2, 3, 4, 6], // Giám đốc khu vực
  4: [1, 2, 3, 4, 5], // Giám đốc văn phòng
  3: [1, 2, 3, 4], // Sales Leader
}

export const ACCOUNT_TYPES = {
  BOD: 7,
  GDKV: 6,
  GDKHU_VUC: 5,
  GDVP: 4,
  SALE_LEADER: 3,
  SALE_MEMBER: 2,
  SALE_INTERN: 1,
}

export const ERROR_TYPES = [
  { id: 5, name: 'Quên điền mục tiêu' },
  { id: 6, name: 'Không điền mục tiêu' },
  { id: 7, name: 'Không đạt mục tiêu' },
]

export const GOAL_TYPES = [
  { id: 0, name: 'Mục tiêu ngày' },
  { id: 1, name: 'Mục tiêu tuần' },
  { id: 2, name: 'Mục tiêu tháng' },
]

export const WATCH_AS_OPTIONS = [
  { id: 1, value: 'Đội kinh doanh', label: 'Đội' },
  { id: 2, value: 'Cá nhân', label: 'Cá nhân' },
]

export const TYPE_GOAL_DEFINE: Record<number, string> = {
  5: 'Quên điền mục tiêu',
  6: 'Không điền mục tiêu',
  7: 'Điền sai mục tiêu',
  8: 'Không đạt mục tiêu',
}

export const PROCESS_TYPE_DEFINE: Record<number, string> = {
  0: 'ngày',
  1: 'tuần',
  2: 'tháng',
}

export const DEFAULT_POSITIONS = [
  { id: 1, name: 'Sales Leader' },
  { id: 2, name: 'Sales Expert' },
  { id: 3, name: 'Sales' },
  { id: 4, name: 'Sales Intern' },
  { id: 5, name: 'Giám đốc văn phòng' },
  { id: 6, name: 'Giám đốc khu vực' },
  { id: 26, name: 'Giám đốc vùng' },
  { id: 'ctv', name: 'Công tác viên' },
]

export const TABLE_COLUMNS = [
  { key: 'userId', label: 'Mã nhân sự' },
  { key: 'name', label: 'Họ và tên' },
  { key: 'accountType', label: 'Vị trí' },
  { key: 'process', label: 'Loại lỗi' },
  { key: 'branchName', label: 'Văn phòng' },
  { key: 'areaName', label: 'Khu vực' },
  { key: 'message', label: 'Nội dung' },
  { key: 'boss', label: 'Cấp trên' },
  { key: 'isCTV', label: 'Cộng tác viên' },
  { key: 'dateAppear', label: 'Thời gian lỗi' },
]

export const PAGE_SIZE = 25
