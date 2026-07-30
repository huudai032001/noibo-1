import {
  JOB_KPI_MEETING_SCORE,
  JOB_KPI_TEAMLEAD_DEFAULT_PER_PAGE,
  JOB_KPI_TEAMLEAD_STATUS,
  JOB_KPI_TEAMLEAD_STATUS_OPTIONS,
} from '../constants'
import type {
  JobKpiDetailApiData,
  JobKpiDetailData,
  JobKpiDetailKraApiItem,
  JobKpiDetailKraItem,
  JobKpiKraHistoryContent,
  JobKpiKraHistoryItem,
  JobKpiManagerWeek,
  JobKpiMeetingWeekCell,
  JobKpiTeamleadListApiItem,
  JobKpiTeamleadListItem,
  JobKpiTeamleadListResponse,
  JobKpiTeamleadPaginationMeta,
  JobKpiUpdateTeamLeadPayload,
  JobKpiWeekMeetingApiRow,
  JobKpiWeekMeetingRow,
  JobKpiWeekMeetingUpdateRow,
} from '../models/job-kpi-teamlead.model'
import { useFormatter } from '@/composables/use-formatter'

export function getDefaultMonthDate(today: Date = new Date()): Date {
  if (today.getDate() <= 10) {
    return new Date(today.getFullYear(), today.getMonth() - 1, 1)
  }
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

export function formatJobKpiMonth(date: Date): string {
  const { formatDate } = useFormatter()
  return formatDate(date, 'monthYear')
}

export function parseJobKpiMonth(value: string | undefined): Date | null {
  if (!value) return null
  const match = value.match(/^(\d{4})-(\d{2})$/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null
  return new Date(year, month - 1, 1)
}

export function hasActiveFilters(filters: {
  keyword: string
  departmentId: number | null
  status: number | null
}): boolean {
  return (
    Boolean(filters.keyword.trim()) ||
    filters.departmentId !== null ||
    filters.status !== null
  )
}

export function formatPercentOrEmpty(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'Chưa có'
  }
  if (value < 0) return 'Chưa có'
  return `${value}%`
}

export function formatScoreOrEmpty(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'Chưa có'
  }
  return String(value)
}

export function getPercentTone(
  value: number | null | undefined,
): 'success' | 'warn' | 'danger' | 'neutral' {
  if (value === null || value === undefined || Number.isNaN(Number(value)) || value < 0) {
    return 'neutral'
  }
  if (value >= 100) return 'success'
  if (value >= 90) return 'success'
  if (value >= 30) return 'warn'
  return 'danger'
}

export function getWeekPercentTone(
  value: number | null | undefined,
): 'success' | 'warn' | 'danger' | 'neutral' {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'neutral'
  }
  if (value === 0) return 'danger'
  if (value === 100) return 'success'
  if (value >= 30 && value < 100) return 'warn'
  return 'neutral'
}

export interface JobKpiTeamleadStatusMeta {
  label: string
  tone: 'success' | 'warn' | 'danger' | 'info'
  icon: string
  dotClass: string
  badgeClass: string
}

function statusVisualMeta(
  tone: JobKpiTeamleadStatusMeta['tone'],
): Pick<JobKpiTeamleadStatusMeta, 'icon' | 'dotClass' | 'badgeClass'> {
  switch (tone) {
    case 'success':
      return {
        icon: 'pi pi-check-circle',
        dotClass: 'bg-emerald-500',
        badgeClass:
          'bg-emerald-50 text-emerald-700 ring-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800/60',
      }
    case 'danger':
      return {
        icon: 'pi pi-exclamation-circle',
        dotClass: 'bg-red-500',
        badgeClass:
          'bg-red-50 text-red-700 ring-red-200/80 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800/60',
      }
    case 'info':
      return {
        icon: 'pi pi-pencil',
        dotClass: 'bg-sky-500',
        badgeClass:
          'bg-sky-50 text-sky-700 ring-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-800/60',
      }
    default:
      return {
        icon: 'pi pi-hourglass',
        dotClass: 'bg-amber-500',
        badgeClass:
          'bg-amber-50 text-amber-800 ring-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800/60',
      }
  }
}

export function getTeamleadStatusMeta(item: JobKpiTeamleadListItem): JobKpiTeamleadStatusMeta {
  const hasKra = item.totalPointKra !== null && item.totalPointKra !== undefined
  const hasMeeting =
    item.totalPointMeeting !== null && item.totalPointMeeting !== undefined

  if (hasKra && hasMeeting) {
    return { label: 'Đã chấm', tone: 'success', ...statusVisualMeta('success') }
  }

  const option = JOB_KPI_TEAMLEAD_STATUS_OPTIONS.find((row) => row.value === item.status)
  let label = option?.label ?? '—'

  if (Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.needScore) {
    const parts: string[] = []
    if (!hasKra) parts.push('KPI')
    if (!hasMeeting) parts.push('Điểm họp tuần')
    if (parts.length > 0) {
      label = `${label}: ${parts.join(', ')}`
    }
  }

  if (Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.needInput) {
    return { label, tone: 'danger', ...statusVisualMeta('danger') }
  }
  if (Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.needScore) {
    return { label, tone: 'info', ...statusVisualMeta('info') }
  }
  if (Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.scored) {
    return { label, tone: 'success', ...statusVisualMeta('success') }
  }
  return { label, tone: 'warn', ...statusVisualMeta('warn') }
}

export function getEmployeeInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0] ?? '?'
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? first
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export function isNeedScoreItem(item: JobKpiTeamleadListItem): boolean {
  return Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.needScore
}

export function linkifyText(value: string): string {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  return value.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[var(--app-primary)] underline break-all">${url}</a>`
  })
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback

  const maybeResponse = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }

  return (
    maybeResponse.data?.message ||
    maybeResponse.response?.data?.message ||
    maybeResponse.message ||
    fallback
  )
}

export function roundDecimal(value: number, decimals: number): number {
  if (value % 1 !== 0) {
    return Number.parseFloat(value.toFixed(decimals))
  }
  return value
}

function isPaginationMeta(value: unknown): value is JobKpiTeamleadPaginationMeta {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function extractWeekScore(weekItem: unknown, fallbackIndex: number): JobKpiMeetingWeekCell {
  if (weekItem === null || weekItem === undefined) {
    return { weekNumber: fallbackIndex + 1, score: null }
  }

  if (typeof weekItem === 'number') {
    return { weekNumber: fallbackIndex + 1, score: weekItem }
  }

  if (typeof weekItem !== 'object') {
    return { weekNumber: fallbackIndex + 1, score: null }
  }

  const entries = Object.entries(weekItem as object)
  if (entries.length === 0) {
    return { weekNumber: fallbackIndex + 1, score: null }
  }

  const [key, raw] = entries[0]
  const weekMatch = key.match(/(\d+)/)
  const weekNumber = weekMatch ? Number(weekMatch[1]) : fallbackIndex + 1
  if (raw === null || raw === undefined || raw === '') {
    return { weekNumber, score: null }
  }
  const parsed = Number(raw)
  return { weekNumber, score: Number.isNaN(parsed) ? null : parsed }
}

function normalizeManagerWeeks(
  weeks: JobKpiDetailKraApiItem['kraManagerWeeks'],
): JobKpiManagerWeek[] {
  if (!weeks) return []
  if (Array.isArray(weeks)) return weeks

  return Object.values(weeks).filter((item): item is JobKpiManagerWeek => {
    return Boolean(item) && typeof item === 'object'
  })
}

export function normalizeDetailKraItem(item: JobKpiDetailKraApiItem): JobKpiDetailKraItem {
  return {
    id: item.id,
    kraId: item.kraId,
    name: (item.name ?? '').trim(),
    requestResult: (item.requestResult ?? '').trim(),
    results: item.results ? linkifyText(String(item.results)) : '',
    percentScore: item.percentScore ?? null,
    percentResults: item.percentResults ?? null,
    description: item.description ?? '',
    month: item.month ?? null,
    kraManagerWeeks: normalizeManagerWeeks(item.kraManagerWeeks),
  }
}

export function normalizeWeekMeetings(
  rows: JobKpiWeekMeetingApiRow[] | undefined,
): JobKpiWeekMeetingRow[] {
  if (!rows?.length) return []

  return rows.map((row) => ({
    id: row.id,
    criteriaId: row.criteriaId,
    criteriaName: row.criteriaName ?? '',
    weeks: (row.week ?? []).map((weekItem, index) => extractWeekScore(weekItem, index)),
  }))
}

export function normalizeDetailData(data: JobKpiDetailApiData | undefined): JobKpiDetailData {
  const rawDetails = data?.details
  const detailRows = Array.isArray(rawDetails)
    ? rawDetails
    : Array.isArray((rawDetails as { data?: JobKpiDetailKraApiItem[] } | undefined)?.data)
      ? ((rawDetails as { data?: JobKpiDetailKraApiItem[] }).data ?? [])
      : []

  const details = detailRows.map(normalizeDetailKraItem)
  const weekMeetings = normalizeWeekMeetings(data?.weekMeetings)
  const weekCount = weekMeetings[0]?.weeks.length ?? 0

  return {
    totalPercentKra: data?.totalPercentKra ?? null,
    totalScoreMeeting: data?.totalScoreMeeting ?? null,
    description: data?.description ?? '',
    details,
    weekMeetings,
    weekCount,
  }
}

export function normalizeListItem(item: JobKpiTeamleadListApiItem): JobKpiTeamleadListItem {
  const userId = item.userId ?? item.user?.id ?? 0
  return {
    id: item.id,
    userId,
    user: item.user ?? null,
    departmentId: item.departmentId ?? item.department?.id ?? null,
    department: item.department ?? null,
    totalPointKra: item.totalPointKra ?? null,
    totalPointMeeting: item.totalPointMeeting ?? null,
    assessor: item.assessor ?? null,
    status: item.status ?? JOB_KPI_TEAMLEAD_STATUS.needInput,
    year: item.year ?? null,
    month: item.month ?? null,
  }
}

export function normalizeListResponse(response: JobKpiTeamleadListResponse): {
  items: JobKpiTeamleadListItem[]
  total: number
  lastPage: number
  perPage: number
  currentPage: number
} {
  const source = response?.data

  if (Array.isArray(source)) {
    return {
      items: source.map(normalizeListItem),
      total: response.total ?? source.length,
      lastPage: response.lastPage ?? 1,
      perPage: response.perPage ?? JOB_KPI_TEAMLEAD_DEFAULT_PER_PAGE,
      currentPage: response.currentPage ?? 1,
    }
  }

  if (isPaginationMeta(source)) {
    const rows = source.data ?? []
    return {
      items: rows.map(normalizeListItem),
      total: source.total ?? response.total ?? rows.length,
      lastPage: source.lastPage ?? response.lastPage ?? 1,
      perPage: source.perPage ?? response.perPage ?? JOB_KPI_TEAMLEAD_DEFAULT_PER_PAGE,
      currentPage: source.currentPage ?? response.currentPage ?? 1,
    }
  }

  return {
    items: [],
    total: 0,
    lastPage: 1,
    perPage: JOB_KPI_TEAMLEAD_DEFAULT_PER_PAGE,
    currentPage: 1,
  }
}

export function calculateKraPercent(kra: JobKpiDetailKraItem): number | null {
  let totalPercent = 0
  let lengthMarked = 0

  kra.kraManagerWeeks.forEach((week) => {
    if (week.percentResults !== null && week.percentResults !== undefined) {
      totalPercent += week.percentResults
      lengthMarked += 1
    }
  })

  return lengthMarked > 0 ? roundDecimal(totalPercent / lengthMarked, 2) : null
}

export function calculateTotalPercentKra(details: JobKpiDetailKraItem[]): number | null {
  let totalPercentUser = 0
  let hasMarked = false

  details.forEach((item) => {
    if (item.percentResults !== null && item.percentResults !== undefined) {
      hasMarked = true
      totalPercentUser += (item.percentResults * (item.percentScore ?? 0)) / 100
    }
  })

  return hasMarked ? roundDecimal(totalPercentUser, 2) : null
}

export function calculateTotalMeetingScore(rows: JobKpiWeekMeetingRow[]): number {
  let count = 0
  rows.forEach((row) => {
    row.weeks.forEach((week) => {
      if (week.score === JOB_KPI_MEETING_SCORE.pass) {
        count += 1
      }
    })
  })
  return count
}

export function toUpdateWeekMeetings(
  rows: JobKpiWeekMeetingRow[],
): JobKpiWeekMeetingUpdateRow[] {
  return rows.map((row) => ({
    id: row.id,
    criteriaId: row.criteriaId,
    criteriaName: row.criteriaName,
    week: row.weeks.map((cell) => ({
      weekKey: `week-${cell.weekNumber}`,
      score: cell.score,
    })),
  }))
}

export function buildUpdatePayload(params: {
  departmentId: number | null
  userId: number
  month: string
  detail: JobKpiDetailData
}): JobKpiUpdateTeamLeadPayload {
  return {
    departmentId: params.departmentId,
    userId: params.userId,
    month: params.month,
    details: params.detail.details,
    weekMeetings: toUpdateWeekMeetings(params.detail.weekMeetings),
    description: params.detail.description,
  }
}

/**
 * Convert weekMeetings payload cells into API-compatible objects `{ "week-n": score }`.
 * ApiService camel→snake keeps hyphen keys intact.
 */
export function serializeUpdatePayload(
  payload: JobKpiUpdateTeamLeadPayload,
): object {
  return {
    departmentId: payload.departmentId,
    userId: payload.userId,
    month: payload.month,
    details: payload.details,
    description: payload.description,
    weekMeetings: payload.weekMeetings.map((row) => ({
      id: row.id,
      criteriaId: row.criteriaId,
      criteriaName: row.criteriaName,
      week: row.week.map((cell) => {
        const entry: { [key: string]: number | null } = {}
        entry[cell.weekKey] = cell.score
        return entry
      }),
    })),
  }
}

export function showWarningComment(kra: JobKpiDetailKraItem): boolean {
  const hasMarkedWeek = kra.kraManagerWeeks.some(
    (week) => week.percentResults !== null && week.percentResults !== undefined,
  )
  return (
    Number(kra.percentResults) < 100 &&
    (kra.description ?? '').trim().length === 0 &&
    hasMarkedWeek
  )
}

export function normalizeHistoryItem(item: {
  id?: number
  updatedAt?: string
  oldContent?: JobKpiKraHistoryContent | null
  newContent?: JobKpiKraHistoryContent | null
}): JobKpiKraHistoryItem {
  return {
    id: item.id ?? 0,
    updatedAt: item.updatedAt ?? '',
    oldContent: item.oldContent ?? null,
    newContent: item.newContent ?? null,
  }
}

export function escapeHtml(str: string | null | undefined): string {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface DiffPart {
  value: string
  added?: boolean
  removed?: boolean
}

function diffWords(oldText: string, newText: string): DiffPart[] {
  const a = oldText.split(/(\s+)/).filter(Boolean)
  const b = newText.split(/(\s+)/).filter(Boolean)
  const result: DiffPart[] = []
  let i = 0
  let j = 0

  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      result.push({ value: a[i] })
      i += 1
      j += 1
      continue
    }

    if (j < b.length && (i >= a.length || !a.slice(i).includes(b[j]))) {
      result.push({ value: b[j], added: true })
      j += 1
      continue
    }

    if (i < a.length) {
      result.push({ value: a[i], removed: true })
      i += 1
    }
  }

  return result
}

export function renderHistoryDiff(
  history: JobKpiKraHistoryItem | null,
  field: 'name' | 'requestResult',
  mode: 'old' | 'new',
): string {
  if (!history) return ''

  const oldContent = history.oldContent
  const newContent = history.newContent
  const oldTextRaw = oldContent?.[field] ?? ''
  const newTextRaw = newContent?.[field] ?? ''

  if (!oldContent && newContent) {
    return mode === 'new'
      ? `<span class="text-emerald-600 dark:text-emerald-400">${escapeHtml(newTextRaw)}</span>`
      : ''
  }

  if (!newContent && oldContent) {
    return mode === 'old'
      ? `<span class="text-red-600 dark:text-red-400">${escapeHtml(oldTextRaw)}</span>`
      : ''
  }

  const parts = diffWords(oldTextRaw.normalize(), newTextRaw.normalize())
  return parts
    .map((part) => {
      if (part.removed && mode === 'old') {
        return `<span class="text-red-600 dark:text-red-400">${escapeHtml(part.value)}</span>`
      }
      if (part.added && mode === 'new') {
        return `<span class="text-emerald-600 dark:text-emerald-400">${escapeHtml(part.value)}</span>`
      }
      if (!part.added && !part.removed) {
        return escapeHtml(part.value)
      }
      return ''
    })
    .join('')
}

export function currentCalendarMonth(): number {
  return new Date().getMonth() + 1
}
