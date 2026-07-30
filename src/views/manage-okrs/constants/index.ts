export const MANAGE_OKRS_API = {
  list: '/okr',
  detail: '/okr',
  create: '/okr',
  updateStatus: '/okr/update-status',
  shareExp: '/okr/exp',
  usersFilter: '/user/filter',
} as const

export const MANAGE_OKRS_DEFAULT_PAGE_SIZE = 20

export const MANAGE_OKRS_QUARTER_OPTIONS = [
  { label: 'Quý I', value: 1 },
  { label: 'Quý II', value: 2 },
  { label: 'Quý III', value: 3 },
  { label: 'Quý IV', value: 4 },
] as const

export const MANAGE_OKRS_TYPE_OPTIONS = [
  { label: 'OKR cấp phòng ban', value: 1 },
  { label: 'OKR cấp công ty', value: 2 },
] as const

export const MANAGE_OKRS_STATUS_OPTIONS = [
  { label: 'Chưa đánh giá', value: 0 },
  { label: 'Đạt dưới 60% so với KPIs mục tiêu', value: 1 },
  { label: 'Đạt từ 60% so với KPIs mục tiêu', value: 2 },
  { label: 'Đạt từ 70% so với KPIs mục tiêu', value: 3 },
  { label: 'Đạt từ 80% so với KPIs mục tiêu', value: 4 },
  { label: 'Đạt mốc KPI tối thiểu', value: 5 },
  { label: 'Hoàn thành (Đạt KPIs mục tiêu)', value: 6 },
] as const
