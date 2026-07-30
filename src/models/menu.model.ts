import type { AccountPositionGroup } from '@/constants/account-position'
import type { PermissionValue } from '@/constants/permission'

export interface MenuItem {
  title: string
  icon: string
  to?: string
  name?: string
  auth?: PermissionValue | 'all' | ''
  position?: AccountPositionGroup
  subMenu?: MenuItem[]
  divider?: boolean
  open?: boolean
}

export interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}
