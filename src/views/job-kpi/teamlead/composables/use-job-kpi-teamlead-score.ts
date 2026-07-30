import type { Ref } from 'vue'
import { JOB_KPI_MEETING_SCORE } from '../constants'
import type {
  JobKpiDetailData,
  JobKpiDetailKraItem,
  JobKpiFillSuggestState,
  JobKpiManagerWeek,
  JobKpiMeetingFillSuggestState,
  JobKpiMeetingScore,
  JobKpiWeekMeetingRow,
} from '../models/job-kpi-teamlead.model'
import {
  calculateKraPercent,
  calculateTotalMeetingScore,
  calculateTotalPercentKra,
} from '../utils/job-kpi-teamlead-helpers'

interface ScoreState {
  detailData: Ref<JobKpiDetailData | null>
  fillSuggest: Ref<JobKpiFillSuggestState>
  meetingFillSuggest: Ref<JobKpiMeetingFillSuggestState>
  updateDetailKra: (kraId: number, patch: Partial<JobKpiDetailKraItem>) => void
  setDetailDescription: (value: string) => void
  setDetailTotals: (params: {
    totalPercentKra?: number | null
    totalScoreMeeting?: number | null
  }) => void
  setWeekMeetings: (rows: JobKpiWeekMeetingRow[]) => void
  setFillSuggest: (value: JobKpiFillSuggestState) => void
  resetFillSuggest: () => void
  setMeetingFillSuggest: (value: JobKpiMeetingFillSuggestState) => void
  resetMeetingFillSuggest: () => void
}

interface ScoreSaveKra {
  (payload: { id: number; name: string; requestResult: string }): Promise<boolean>
}

export function useJobKpiTeamleadScore(state: ScoreState, saveKraInfo: ScoreSaveKra) {
  function recalculateTotals(details: JobKpiDetailKraItem[]): void {
    state.setDetailTotals({
      totalPercentKra: calculateTotalPercentKra(details),
    })
  }

  function applyKraWeekPercent(
    kra: JobKpiDetailKraItem,
    week: JobKpiManagerWeek,
    percent: number | null,
  ): void {
    if (!state.detailData.value) return

    const nextDetails = state.detailData.value.details.map((item) => {
      if (item.id !== kra.id) return item

      const nextWeeks = item.kraManagerWeeks.map((row) =>
        row.week === week.week ? { ...row, percentResults: percent } : row,
      )
      const nextItem: JobKpiDetailKraItem = {
        ...item,
        kraManagerWeeks: nextWeeks,
      }
      nextItem.percentResults = calculateKraPercent(nextItem)
      return nextItem
    })

    state.detailData.value = {
      ...state.detailData.value,
      details: nextDetails,
      totalPercentKra: calculateTotalPercentKra(nextDetails),
    }

    if (percent !== null && percent !== undefined) {
      state.setFillSuggest({
        visible: true,
        kraId: kra.id,
        week: week.week ?? null,
        percent,
      })
    } else {
      state.resetFillSuggest()
    }
  }

  function markWeekPercent(
    kra: JobKpiDetailKraItem,
    week: JobKpiManagerWeek,
    percent: number | null,
  ): void {
    applyKraWeekPercent(kra, week, percent)
  }

  function fillAllWeekPercent(): void {
    const suggest = state.fillSuggest.value
    if (!state.detailData.value || suggest.week === null || suggest.percent === null) {
      state.resetFillSuggest()
      return
    }

    const nextDetails = state.detailData.value.details.map((item) => {
      if (!item.results) return item

      const nextWeeks = item.kraManagerWeeks.map((row) =>
        row.week === suggest.week ? { ...row, percentResults: suggest.percent } : row,
      )
      const nextItem: JobKpiDetailKraItem = {
        ...item,
        kraManagerWeeks: nextWeeks,
      }
      nextItem.percentResults = calculateKraPercent(nextItem)
      return nextItem
    })

    state.detailData.value = {
      ...state.detailData.value,
      details: nextDetails,
      totalPercentKra: calculateTotalPercentKra(nextDetails),
    }
    state.resetFillSuggest()
  }

  function updateKraField(
    kra: JobKpiDetailKraItem,
    field: 'name' | 'requestResult',
    value: string,
  ): void {
    state.updateDetailKra(kra.id, { [field]: value })
  }

  async function persistKraInfo(kra: JobKpiDetailKraItem): Promise<void> {
    await saveKraInfo({
      id: kra.id,
      name: kra.name,
      requestResult: kra.requestResult,
    })
  }

  function updateKraDescription(kra: JobKpiDetailKraItem, value: string): void {
    state.updateDetailKra(kra.id, { description: value })
  }

  function updateMeetingDescription(value: string): void {
    state.setDetailDescription(value)
  }

  function changeMeetingScore(
    row: JobKpiWeekMeetingRow,
    weekNumber: number,
    score: number | null,
  ): void {
    if (!state.detailData.value) return

    const nextRows = state.detailData.value.weekMeetings.map((item) => {
      const isSame =
        (row.criteriaId !== undefined && item.criteriaId === row.criteriaId) ||
        (row.id !== undefined && item.id === row.id) ||
        item.criteriaName === row.criteriaName
      if (!isSame) return item
      return {
        ...item,
        weeks: item.weeks.map((week) =>
          week.weekNumber === weekNumber ? { ...week, score } : week,
        ),
      }
    })

    state.setWeekMeetings(nextRows)
    state.setDetailTotals({
      totalScoreMeeting: calculateTotalMeetingScore(nextRows),
    })

    const shouldSuggest = weekNumber === 1 || weekNumber === 2
    if (shouldSuggest && score !== null) {
      state.setMeetingFillSuggest({
        visible: true,
        criteriaId: row.criteriaId ?? null,
        weekNumber,
        score: score as JobKpiMeetingScore,
        label: score === JOB_KPI_MEETING_SCORE.pass ? 'Đạt' : 'Không đạt',
      })
    } else {
      state.resetMeetingFillSuggest()
    }
  }

  function fillAllMeetingScores(): void {
    const suggest = state.meetingFillSuggest.value
    if (!state.detailData.value || suggest.score === null) {
      state.resetMeetingFillSuggest()
      return
    }

    const nextRows = state.detailData.value.weekMeetings.map((item) => ({
      ...item,
      weeks: item.weeks.map((week) => ({
        ...week,
        score: suggest.score,
      })),
    }))

    state.setWeekMeetings(nextRows)
    state.setDetailTotals({
      totalScoreMeeting: calculateTotalMeetingScore(nextRows),
    })
    state.resetMeetingFillSuggest()
  }

  return {
    markWeekPercent,
    fillAllWeekPercent,
    updateKraField,
    persistKraInfo,
    updateKraDescription,
    updateMeetingDescription,
    changeMeetingScore,
    fillAllMeetingScores,
    recalculateTotals,
    resetFillSuggest: state.resetFillSuggest,
    resetMeetingFillSuggest: state.resetMeetingFillSuggest,
  }
}
