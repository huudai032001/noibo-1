const DATE_FORMATS = {
  date: 'DD-MM-YYYY',
  dateStartByYear: 'YYYY-MM-DD',
  datetime: 'HH:mm:ss DD-MM-YYYY',
  schedule: 'HH:mm DD-MM-YYYY',
  timedate: 'YYYY-MM-DD HH:mm:ss',
  timeDateNoSecond: 'YYYY-MM-DD HH:mm',
  monthYear: 'YYYY-MM',
  time: 'HH:mm:ss',
} as const

type DateFormatKey = keyof typeof DATE_FORMATS

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatDateValue(date: Date, format: string): string {
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = String(date.getFullYear())

  return format
    .replace('YYYY', year)
    .replace('DD', day)
    .replace('MM', month)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function parseDateInput(value: string): Date | null {
  const scheduleMatch = value.match(/^(\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4})$/)
  if (scheduleMatch) {
    const hours = Number(scheduleMatch[1])
    const minutes = Number(scheduleMatch[2])
    const day = Number(scheduleMatch[3])
    const month = Number(scheduleMatch[4])
    const year = Number(scheduleMatch[5])
    const date = new Date(year, month - 1, day, hours, minutes)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function useFormatter() {
  const formatEmployeeCode = (employeeId: number | string): number => {
    const id = typeof employeeId === 'string' ? Number.parseInt(employeeId, 10) : employeeId

    if (Number.isNaN(id)) {
      return 0
    }

    return id + 100000
  }

  const formatDate = (
    date: string | Date | null | undefined,
    format: DateFormatKey | string = 'date',
  ): string => {
    if (!date) return ''

    const parsedDate = typeof date === 'string' ? parseDateInput(date) : date
    if (!parsedDate || Number.isNaN(parsedDate.getTime())) return ''

    const formatString =
      format in DATE_FORMATS ? DATE_FORMATS[format as DateFormatKey] : format

    return formatDateValue(parsedDate, formatString)
  }

  const parseStringToDateTime = (value: string, format: string): Date | null => {
    if (!value.trim()) {
      return null
    }

    if (format === DATE_FORMATS.schedule) {
      return parseDateInput(value)
    }

    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const formatUserLabel = (user: { id: number | string; name: string } | null | undefined): string => {
    if (!user) return ''
    return `${formatEmployeeCode(user.id)} - ${user.name}`
  }

  return {
    formatEmployeeCode,
    formatDate,
    parseStringToDateTime,
    formatUserLabel,
  }
}
