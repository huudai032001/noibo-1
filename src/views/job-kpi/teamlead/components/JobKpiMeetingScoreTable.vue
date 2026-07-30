<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import ToggleSwitch from 'primevue/toggleswitch'
import { JOB_KPI_MEETING_SCORE } from '../constants'
import type {
  JobKpiDetailData,
  JobKpiMeetingFillSuggestState,
  JobKpiWeekMeetingRow,
} from '../models/job-kpi-teamlead.model'
import { formatScoreOrEmpty } from '../utils/job-kpi-teamlead-helpers'

const props = defineProps<{
  detail: JobKpiDetailData
  disabled: boolean
  meetingFillSuggest: JobKpiMeetingFillSuggestState
}>()

const emit = defineEmits<{
  'change-score': [row: JobKpiWeekMeetingRow, weekNumber: number, score: number | null]
  'update-description': [value: string]
  'fill-all': []
  'dismiss-fill': []
}>()

const weekCount = computed(() => props.detail.weekCount)

function scoreLabel(score: number | null): string {
  if (score === JOB_KPI_MEETING_SCORE.pass) return 'Đạt'
  return 'Không đạt'
}

function isSuggestFor(row: JobKpiWeekMeetingRow, weekNumber: number): boolean {
  return (
    props.meetingFillSuggest.visible &&
    props.meetingFillSuggest.criteriaId === (row.criteriaId ?? null) &&
    props.meetingFillSuggest.weekNumber === weekNumber
  )
}

function onToggle(row: JobKpiWeekMeetingRow, weekNumber: number, checked: boolean): void {
  emit(
    'change-score',
    row,
    weekNumber,
    checked ? JOB_KPI_MEETING_SCORE.pass : JOB_KPI_MEETING_SCORE.fail,
  )
}
</script>

<template>
  <section v-if="detail.weekMeetings.length > 0" class="mt-4 space-y-3">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">
        II. Kết quả họp tuần
      </h3>
      <div
        class="inline-flex items-center gap-2 rounded-xl bg-[rgba(var(--app-primary-rgb),0.08)] px-3 py-2 text-xs font-semibold text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]"
      >
        <i class="pi pi-users text-sm" />
        Điểm tích họp tuần: {{ formatScoreOrEmpty(detail.totalScoreMeeting) }}
      </div>
    </div>

    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table class="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr class="bg-[var(--app-primary)] text-white">
            <th class="min-w-[280px] px-4 py-3 font-semibold">Tiêu chí</th>
            <th
              v-for="weekIndex in weekCount"
              :key="weekIndex"
              class="min-w-[120px] px-4 py-3 text-center font-semibold"
            >
              Tuần {{ weekIndex }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in detail.weekMeetings"
            :key="row.criteriaId ?? row.id ?? row.criteriaName"
            class="border-b border-slate-100 dark:border-slate-700/80"
          >
            <td class="px-4 py-3.5 leading-6 text-slate-700 dark:text-slate-200">
              {{ row.criteriaName }}
            </td>
            <td
              v-for="week in row.weeks"
              :key="`${row.criteriaId}-${week.weekNumber}`"
              class="relative px-4 py-3.5 text-center"
            >
              <div class="inline-flex flex-col items-center gap-1">
                <ToggleSwitch
                  :model-value="week.score === JOB_KPI_MEETING_SCORE.pass"
                  :disabled="disabled"
                  @update:model-value="onToggle(row, week.weekNumber, Boolean($event))"
                />
                <span
                  class="text-xs font-medium"
                  :class="
                    week.score === JOB_KPI_MEETING_SCORE.pass
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  "
                >
                  {{ scoreLabel(week.score) }}
                </span>
              </div>

              <div
                v-if="isSuggestFor(row, week.weekNumber)"
                class="absolute left-1/2 top-14 z-20 w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tự động điền</p>
                <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Chấm tất cả tiêu chí của các tuần là
                  <b>{{ meetingFillSuggest.label }}</b>?
                </p>
                <div class="mt-2 flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    icon="pi pi-check-circle"
                    severity="success"
                    text
                    rounded
                    @click="emit('fill-all')"
                  />
                  <Button
                    type="button"
                    icon="pi pi-times-circle"
                    severity="danger"
                    text
                    rounded
                    @click="emit('dismiss-fill')"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Nhận xét
      </label>
      <Textarea
        :model-value="detail.description"
        :disabled="disabled"
        rows="3"
        auto-resize
        placeholder="Nhập nhận xét"
        class="w-full text-sm"
        @update:model-value="emit('update-description', String($event ?? ''))"
      />
    </div>
  </section>
</template>
