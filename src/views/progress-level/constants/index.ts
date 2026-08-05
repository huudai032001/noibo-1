export const PROGRESS_LEVEL_API = {
  list: 'level-approval-request/progress-personal',
  minusPointDetail: '/progress-level/minus-point-detail',
} as const

export const PROGRESS_LEVEL_DEFAULT_YEAR = new Date().getFullYear()

export const PROGRESS_LEVEL_APPROVE_TYPE_MAP = {
  0: '',
  1: 'Tăng Level',
  2: 'Giảm Level',
  3: 'Giữ Nguyên Level',
} as const

export const PROGRESS_LEVEL_APPROVE_TYPE_COLOR = {
  0: '',
  1: 'text-green-600 dark:text-green-400',
  2: 'text-red-600 dark:text-red-400',
  3: 'text-amber-600 dark:text-amber-400',
} as const

export const PROGRESS_LEVEL_APPROVE_TYPE_ICON = {
  0: '',
  1: 'el-icon-top',
  2: 'el-icon-bottom',
  3: 'fas fa-square',
} as const
