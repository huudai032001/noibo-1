import { PERMISSION } from '@/constants/permission'

export const CANDIDATE_AUTH = PERMISSION.CANDIDATE

export const HONOR_MENU_NAME = 'honor'

export const SPECIAL_MENU_USER_IDS = [295391, 266029] as const

export const ADMINISTRATION_MENU_TITLE = 'Hành chính'

export interface SpecialMenuLink {
  name: string
  title: string
  to: string
  icon?: string
}

export const SPECIAL_ADMINISTRATION_LINKS: SpecialMenuLink[] = [
  {
    name: 'important-work',
    title: 'Công việc quan trọng',
    to: '/important-work',
    icon: 'Star',
  },
  {
    name: 'sales-input',
    title: 'Tiến độ đạt mục tiêu',
    to: '/sales-input',
    icon: 'Target',
  },
  {
    name: 'report-error-target-progress',
    title: 'Bảng báo lỗi tiến độ mục tiêu',
    to: '/report-error-target-progress',
    icon: 'AlertTriangle',
  },
]
