const MONTH_NAMES = [
  'tháng 1',
  'tháng 2',
  'tháng 3',
  'tháng 4',
  'tháng 5',
  'tháng 6',
  'tháng 7',
  'tháng 8',
  'tháng 9',
  'tháng 10',
  'tháng 11',
  'tháng 12',
] as const

export function toCamelCaseKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, letter: string) => letter.toUpperCase())
}

export function normalizeLabel(value: string | null | undefined): string {
  return (value || '')
    .toString()
    .replace(/\(\s*\d+\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function getLastMonthDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() - 1, 1)
}

export function getMonthYearLabel(date: Date | null): string {
  const target = date ?? new Date()
  return `${target.getMonth() + 1}/${target.getFullYear()}`
}

export function getMonthYearLongLabel(date: Date | null): string {
  const target = date ?? new Date()
  const monthName = MONTH_NAMES[target.getMonth()]
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}, ${target.getFullYear()}`
}

export function getStartOfMonth(date: Date): string {
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const monthStr = month < 10 ? `0${month}` : String(month)
  return `${year}-${monthStr}-01`
}

export function getRangeMonthLabel(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  return `Từ ${firstDay.getDate()}/${month}/${year} - ${lastDay.getDate()}/${month}/${year}`
}

export function isSectionRow(rowKey?: string): boolean {
  return rowKey === 'none'
}
