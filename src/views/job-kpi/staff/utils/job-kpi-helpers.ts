import {
  JOB_KPI_LEADER_STATUS,
  JOB_KPI_MEETING_SCORE,
  JOB_KPI_MEETING_SCORE_OPTIONS,
  JOB_KPI_STAFF_DEFAULT_PER_PAGE,
  JOB_KPI_STAFF_STATUS,
  JOB_KPI_STAFF_STATUS_OPTIONS,
} from '../constants'
import type {
  JobKpiDetailsPagination,
  JobKpiKraApiItem,
  JobKpiKraItem,
  JobKpiManagerWeek,
  JobKpiMeetingScore,
  JobKpiPersonalApiData,
  JobKpiPersonalData,
  JobKpiResultFeedback,
  JobKpiWeekMeetingApiRow,
  JobKpiWeekMeetingRow,
} from '../models/job-kpi-staff.model'
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

export function getKpiStatusLabel(status: number | undefined | null): string {
  const option = JOB_KPI_STAFF_STATUS_OPTIONS.find((item) => item.value === status)
  return option?.label ?? '—'
}

export function getMeetingScoreMeta(score: number | null | undefined): {
  label: string
  tone: 'success' | 'danger' | 'neutral'
} {
  if (score === JOB_KPI_MEETING_SCORE.pass) {
    return { label: 'Đạt', tone: 'success' }
  }
  if (score === JOB_KPI_MEETING_SCORE.fail) {
    return { label: 'Không đạt', tone: 'danger' }
  }
  return { label: 'Chưa có', tone: 'neutral' }
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

export function getPercentTone(value: number | null | undefined): 'success' | 'warn' | 'danger' | 'neutral' {
  if (value === null || value === undefined || Number.isNaN(Number(value)) || value < 0) {
    return 'neutral'
  }
  if (value >= 100) return 'success'
  if (value >= 70) return 'warn'
  return 'danger'
}

export function countKraByStatus(items: JobKpiKraItem[], status: number): number {
  return items.filter((item) => item.status === status).length
}

export function extractWeekScore(weekItem: unknown): number | null {
  if (weekItem === null || weekItem === undefined) return null
  if (typeof weekItem === 'number') return weekItem
  if (typeof weekItem !== 'object') return null

  const values = Object.values(weekItem)
  if (values.length === 0) return null

  const first = values[0]
  if (typeof first === 'number') return first
  if (first === null || first === undefined || first === '') return null

  const parsed = Number(first)
  return Number.isNaN(parsed) ? null : parsed
}

export function normalizeManagerWeeks(
  weeks: JobKpiKraApiItem['kraManagerWeeks'],
): JobKpiManagerWeek[] {
  if (!weeks) return []
  if (Array.isArray(weeks)) return weeks

  return Object.values(weeks).filter((item): item is JobKpiManagerWeek => {
    return Boolean(item) && typeof item === 'object'
  })
}

export function normalizeKraItem(item: JobKpiKraApiItem): JobKpiKraItem {
  return {
    id: item.id,
    name: (item.name ?? '').trim(),
    requestResult: (item.requestResult ?? '').trim(),
    results: item.results ?? '',
    percentScore: item.percentScore ?? null,
    status: item.status ?? JOB_KPI_STAFF_STATUS.needInput,
    statusLeader: item.statusLeader ?? null,
    percentResults: item.percentResults ?? null,
    description: item.description ?? '',
    kraManagerWeeks: normalizeManagerWeeks(item.kraManagerWeeks),
  }
}

export function normalizeWeekMeetings(
  rows: JobKpiWeekMeetingApiRow[] | undefined,
): JobKpiWeekMeetingRow[] {
  if (!rows?.length) return []

  return rows.map((row) => ({
    id: row.id,
    criteriaName: row.criteriaName ?? '',
    weekScores: (row.week ?? []).map((weekItem) => extractWeekScore(weekItem)),
  }))
}

export function normalizePersonalData(
  data: JobKpiPersonalApiData | undefined,
): JobKpiPersonalData {
  const detailsSource = data?.details
  const kraItems = (detailsSource?.data ?? []).map(normalizeKraItem)
  const weekMeetings = normalizeWeekMeetings(data?.weekMeetings)
  const weekCount = weekMeetings[0]?.weekScores.length ?? 0
  const total = detailsSource?.total ?? kraItems.length
  const lastPage = detailsSource?.lastPage ?? 1
  const perPage =
    detailsSource?.perPage ??
    (lastPage > 0 ? Math.max(Math.ceil(total / lastPage), kraItems.length || 1) : JOB_KPI_STAFF_DEFAULT_PER_PAGE)

  const details: JobKpiDetailsPagination = {
    data: kraItems,
    total,
    lastPage: Math.max(lastPage, 1),
    perPage: Math.max(perPage, 1),
    currentPage: detailsSource?.currentPage ?? 1,
  }

  return {
    totalPercentKra: data?.totalPercentKra ?? null,
    totalScoreMeeting: data?.totalScoreMeeting ?? null,
    description: data?.description ?? '',
    details,
    weekMeetings,
    weekCount,
  }
}

export function canViewKraResult(item: JobKpiKraItem): boolean {
  return item.kraManagerWeeks.some((week) => week.percentResults !== null && week.percentResults !== undefined)
}

export function shouldShowCompletion(items: JobKpiKraItem[]): boolean {
  if (items.length === 0) return false
  return items.every((item) => item.statusLeader === JOB_KPI_LEADER_STATUS.completed)
}

export function isFullyCompleted(items: JobKpiKraItem[]): boolean {
  if (items.length === 0) return false
  return items.every((item) => Number(item.percentResults) === 100)
}

export function linkifyText(value: string): string {
  const urlPattern = /(https?:\/\/[^\s]+)/g
  return value.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[var(--app-primary)] underline break-all">${url}</a>`
  })
}

export function isSingleUrl(value: string): boolean {
  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
  return urlRegex.test(value.trim())
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

export function clearFeedbackMap(): Map<number, JobKpiResultFeedback> {
  return new Map()
}

export function setFeedbackEntry(
  map: Map<number, JobKpiResultFeedback>,
  kraId: number,
  feedback: JobKpiResultFeedback,
): Map<number, JobKpiResultFeedback> {
  const next = new Map(map)
  next.set(kraId, feedback)
  return next
}

export function deleteFeedbackEntry(
  map: Map<number, JobKpiResultFeedback>,
  kraId: number,
): Map<number, JobKpiResultFeedback> {
  const next = new Map(map)
  next.delete(kraId)
  return next
}

export function meetingScoreOptions() {
  return [...JOB_KPI_MEETING_SCORE_OPTIONS]
}

export type { JobKpiMeetingScore }
