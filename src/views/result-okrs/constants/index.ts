export const RESULT_OKRS_API = {
  list: '/okr/result',
} as const

export const RESULT_OKRS_DEFAULT_PAGE_SIZE = 20

export const RESULT_OKRS_QUARTER_OPTIONS = [
  { label: 'Quý I', value: 1 },
  { label: 'Quý II', value: 2 },
  { label: 'Quý III', value: 3 },
  { label: 'Quý IV', value: 4 },
] as const

export const RESULT_OKRS_STATUS_LABELS = [
  { value: 0, label: 'Chưa được đánh giá' },
  { value: 1, label: 'Thành công' },
  { value: 2, label: 'Thất bại' },
] as const
