import {
  PROPOSE_CATEGORY,
  PROPOSE_CATEGORY_OPTIONS,
  PROPOSE_OVERTIME_TYPE_OPTIONS,
  PROPOSE_SHIFT_OFF_OPTIONS,
  PROPOSE_STATUS,
  PROPOSE_STATUS_OPTIONS,
  PROPOSE_WORK_SHIFT_OPTIONS,
  type ProposeCategory,
  type ProposeStatus,
} from '../constants'

export function getCategoryLabel(category: ProposeCategory | number | undefined): string {
  if (category === undefined || category === null) return ''
  const option = PROPOSE_CATEGORY_OPTIONS.find((item) => item.value === category)
  return option?.label ?? ''
}

export function getStatusLabel(status: ProposeStatus | number | undefined): string {
  if (status === undefined || status === null) return ''
  const option = PROPOSE_STATUS_OPTIONS.find((item) => item.value === status)
  return option?.label ?? ''
}

export function getStatusSeverity(
  status: ProposeStatus | number | undefined,
): 'secondary' | 'success' | 'danger' {
  if (status === PROPOSE_STATUS.approved) return 'success'
  if (status === PROPOSE_STATUS.rejected) return 'danger'
  return 'secondary'
}

export function getShiftOffLabel(value: number | undefined): string {
  if (value === undefined || value === null) return ''
  const option = PROPOSE_SHIFT_OFF_OPTIONS.find((item) => item.value === value)
  return option?.label ?? ''
}

export function getWorkShiftLabel(value: number | undefined): string {
  if (value === undefined || value === null) return ''
  const option = PROPOSE_WORK_SHIFT_OPTIONS.find((item) => item.value === value)
  return option?.label ?? ''
}

export function getOvertimeTypeLabel(value: number | undefined): string {
  if (value === undefined || value === null) return ''
  const option = PROPOSE_OVERTIME_TYPE_OPTIONS.find((item) => item.value === value)
  return option?.label ?? ''
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export function formatDateToApi(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatTimeToApi(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return ''
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function formatMonthYear(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}-${year}`
}

export function parseMonthYear(value: string | undefined): Date | null {
  if (!value) return null
  const match = value.match(/^(\d{2})-(\d{4})$/)
  if (!match) return null
  const month = Number(match[1])
  const year = Number(match[2])
  if (month < 1 || month > 12) return null
  return new Date(year, month - 1, 1)
}

export function isStartDateDisabled(date: Date, today: Date = new Date()): boolean {
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return target < minDate
}

export function getLeaveTypeLabel(typeLeave: number | undefined): string {
  if (typeLeave === 0) return 'Nghỉ dùng phép'
  if (typeLeave === 1) return 'Nghỉ không lương'
  return ''
}

export function canDeletePropose(status: ProposeStatus | number | undefined): boolean {
  return status === PROPOSE_STATUS.pending
}

export function canApprovePropose(status: ProposeStatus | number | undefined): boolean {
  return status === PROPOSE_STATUS.pending
}

export function isOvertimeCategory(category: ProposeCategory | number | undefined): boolean {
  return category === PROPOSE_CATEGORY.overtime
}

export function getDepartmentLabel(
  departmentType: number | undefined,
  fallback: string,
): string {
  if (departmentType === 3) return 'Phòng ban'
  return fallback || 'Nhóm'
}

export interface ProposeCategoryMeta {
  icon: string
  shortLabel: string
  badgeClass: string
  iconClass: string
}

export function getCategoryMeta(category: ProposeCategory | number | undefined): ProposeCategoryMeta {
  switch (category) {
    case PROPOSE_CATEGORY.leave:
      return {
        icon: 'pi pi-calendar-minus',
        shortLabel: 'Nghỉ phép',
        badgeClass: 'bg-violet-50 text-violet-700 ring-violet-200/80',
        iconClass: 'text-violet-600',
      }
    case PROPOSE_CATEGORY.overtime:
      return {
        icon: 'pi pi-clock',
        shortLabel: 'Tăng ca',
        badgeClass: 'bg-amber-50 text-amber-800 ring-amber-200/80',
        iconClass: 'text-amber-600',
      }
    case PROPOSE_CATEGORY.shiftChange:
      return {
        icon: 'pi pi-sync',
        shortLabel: 'Đổi ca',
        badgeClass: 'bg-sky-50 text-sky-700 ring-sky-200/80',
        iconClass: 'text-sky-600',
      }
    case PROPOSE_CATEGORY.offSiteHours:
      return {
        icon: 'pi pi-map-marker',
        shortLabel: 'Bổ sung giờ',
        badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
        iconClass: 'text-emerald-600',
      }
    default:
      return {
        icon: 'pi pi-file',
        shortLabel: 'Khác',
        badgeClass: 'bg-slate-50 text-slate-700 ring-slate-200/80',
        iconClass: 'text-slate-500',
      }
  }
}

export interface ProposeStatusMeta {
  dotClass: string
  badgeClass: string
  icon: string
}

export function getStatusMeta(status: ProposeStatus | number | undefined): ProposeStatusMeta {
  if (status === PROPOSE_STATUS.approved) {
    return {
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
      icon: 'pi pi-check-circle',
    }
  }
  if (status === PROPOSE_STATUS.rejected) {
    return {
      dotClass: 'bg-red-500',
      badgeClass: 'bg-red-50 text-red-700 ring-red-200/80',
      icon: 'pi pi-times-circle',
    }
  }
  return {
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-slate-100 text-slate-700 ring-slate-200/80',
    icon: 'pi pi-hourglass',
  }
}

export function countProposeByStatus(
  items: { status?: ProposeStatus | number }[],
  status: ProposeStatus,
): number {
  return items.filter((item) => item.status === status).length
}

export function hasActiveFilters(filters: {
  month: Date | null
  category: number | ''
  status: number | ''
  keyword?: string
  department?: number | ''
}): boolean {
  return Boolean(
    filters.month ||
      filters.category !== '' ||
      filters.status !== '' ||
      filters.keyword?.trim() ||
      filters.department !== '',
  )
}
