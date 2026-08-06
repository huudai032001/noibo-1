export const THONG_BAO_API = {
  list: 'information/thong-bao',
  detail: 'information/detail',
} as const

export const THONG_BAO_DEFAULT_PAGE = 1
export const THONG_BAO_DEFAULT_PER_PAGE = 20

export const THONG_BAO_IS_SPECIAL_OPTIONS = [
  { label: 'Thông báo nổi bật', value: '1' },
  { label: 'Thông báo thường', value: '0' },
] as const
