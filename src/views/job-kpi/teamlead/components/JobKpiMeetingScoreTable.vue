<script setup lang="ts">
import { computed, ref } from 'vue'
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

type MeetingViewMode = 'week' | 'all'

const props = withDefaults(
  defineProps<{
    detail: JobKpiDetailData
    disabled: boolean
    meetingFillSuggest: JobKpiMeetingFillSuggestState
    compactHeader?: boolean
  }>(),
  { compactHeader: false },
)

const emit = defineEmits<{
  'change-score': [row: JobKpiWeekMeetingRow, weekNumber: number, score: number | null]
  'update-description': [value: string]
  'fill-all': []
  'dismiss-fill': []
}>()

// Mặc định hiển thị "Tất cả tuần" theo yêu cầu UX.
const viewMode = ref<MeetingViewMode>('all')
const activeWeekIndex = ref(0)

const weekCount = computed(() => props.detail.weekCount)
const criteriaTotal = computed(() => props.detail.weekMeetings.length)
const isWeekMode = computed(() => viewMode.value === 'week')
const activeWeekScoredCount = computed(() => scoredCountForWeek(activeWeekIndex.value))

function isPass(score: number | null): boolean {
  return score === JOB_KPI_MEETING_SCORE.pass
}

function scoredCountForWeek(weekIndex: number): number {
  const weekNumber = weekIndex + 1
  return props.detail.weekMeetings.filter((row) => {
    const week = row.weeks.find((item) => item.weekNumber === weekNumber)
    return week?.score !== null && week?.score !== undefined
  }).length
}

function weekPillClass(weekIndex: number): string {
  const scored = scoredCountForWeek(weekIndex)
  const isActive = activeWeekIndex.value === weekIndex
  if (isActive) return 'bg-[var(--app-primary)] text-white shadow-sm'
  if (scored === criteriaTotal.value && criteriaTotal.value > 0) {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800'
  }
  if (scored > 0) {
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800'
  }
  return 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
}

const completedWeeksCount = computed(() => {
  let total = 0
  for (let i = 0; i < weekCount.value; i += 1) {
    if (scoredCountForWeek(i) === criteriaTotal.value && criteriaTotal.value > 0) total += 1
  }
  return total
})

function meetingCellWrapClass(score: number | null): string {
  if (score === JOB_KPI_MEETING_SCORE.pass) {
    return 'bg-emerald-50/70 ring-1 ring-emerald-100 dark:bg-emerald-950/20 dark:ring-emerald-900/40'
  }
  if (score === JOB_KPI_MEETING_SCORE.fail) {
    return 'bg-red-50/70 ring-1 ring-red-100 dark:bg-red-950/20 dark:ring-red-900/40'
  }
  return 'bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700'
}

function getWeekCell(row: JobKpiWeekMeetingRow, weekIndex: number) {
  const weekNumber = weekIndex + 1
  return row.weeks.find((item) => item.weekNumber === weekNumber)
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

function goPrevWeek(): void {
  if (activeWeekIndex.value > 0) activeWeekIndex.value -= 1
}

function goNextWeek(): void {
  if (activeWeekIndex.value < weekCount.value - 1) activeWeekIndex.value += 1
}
</script>

<template>
  <section v-if="detail.weekMeetings.length > 0" class="space-y-3">
    <div
      v-if="!compactHeader"
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">
          II. Kết quả họp tuần
        </h3>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Bật = Đạt · Tắt = Không đạt
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-3.5 py-1.5 text-sm font-semibold tabular-nums text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.2)]"
      >
        <i class="pi pi-users text-xs" />
        Điểm họp tuần
        <span class="text-base">{{ formatScoreOrEmpty(detail.totalScoreMeeting) }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        class="inline-flex w-full rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 sm:w-auto dark:border-slate-700 dark:bg-slate-800/80"
      >
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none"
          :class="
            isWeekMode
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900'
              : 'text-slate-500 dark:text-slate-400'
          "
          @click="viewMode = 'week'"
        >
          <i class="pi pi-calendar text-[10px]" />
          Chấm theo tuần
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none"
          :class="
            !isWeekMode
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900'
              : 'text-slate-500 dark:text-slate-400'
          "
          @click="viewMode = 'all'"
        >
          <i class="pi pi-table text-[10px]" />
          Tất cả tuần
        </button>
      </div>

    </div>

    <p class="text-xs text-slate-500 dark:text-slate-400">
      <template v-if="isWeekMode">
        Đang chấm
        <span class="font-semibold text-slate-700 dark:text-slate-200"
          >Tuần {{ activeWeekIndex + 1 }}</span
        >
        · {{ activeWeekScoredCount }}/{{ criteriaTotal }} tiêu chí đã chấm — Bật = Đạt, Tắt = Không đạt
      </template>
      <template v-else> Xem toàn bộ tuần trong bảng. </template>
    </p>

    <div v-if="isWeekMode" class="space-y-2">
      <div
        class="sticky top-0 z-20 -mx-0.5 rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
      >
        <div class="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            icon="pi pi-chevron-left"
            severity="secondary"
            outlined
            size="small"
            :disabled="activeWeekIndex === 0"
            @click="goPrevWeek"
          />
          <button
            v-for="weekIndex in weekCount"
            :key="weekIndex"
            type="button"
            class="inline-flex min-w-[2.75rem] flex-col items-center rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors"
            :class="weekPillClass(weekIndex - 1)"
            @click="activeWeekIndex = weekIndex - 1"
          >
            <span>T{{ weekIndex }}</span>
            <span class="text-[9px] font-medium opacity-80">
              {{ scoredCountForWeek(weekIndex - 1) }}/{{ criteriaTotal }}
            </span>
          </button>
          <Button
            type="button"
            icon="pi pi-chevron-right"
            severity="secondary"
            outlined
            size="small"
            :disabled="activeWeekIndex >= weekCount - 1"
            @click="goNextWeek"
          />
        </div>
        <p class="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          Tuần {{ activeWeekIndex + 1 }} · {{ activeWeekScoredCount }}/{{ criteriaTotal }}
          tiêu chí đã chấm · Bật = Đạt · Tắt = Không đạt
        </p>
      </div>

      <article
        v-for="(row, rowIndex) in detail.weekMeetings"
        :key="row.criteriaId ?? row.id ?? row.criteriaName"
        class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex min-w-0 items-start gap-2.5">
          <span
            class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--app-primary-rgb),0.12)] text-[11px] font-bold text-[var(--app-primary)]"
          >
            {{ rowIndex + 1 }}
          </span>
          <p class="text-sm leading-5 text-slate-700 dark:text-slate-200">{{ row.criteriaName }}</p>
        </div>

        <div
          v-if="getWeekCell(row, activeWeekIndex)"
          class="relative shrink-0"
          :class="isSuggestFor(row, activeWeekIndex + 1) ? 'z-30' : ''"
        >
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="
                isPass(getWeekCell(row, activeWeekIndex)!.score)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600'
              "
              :disabled="disabled"
              @click="onToggle(row, activeWeekIndex + 1, true)"
            >
              Đạt
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              :class="
                !isPass(getWeekCell(row, activeWeekIndex)!.score)
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-red-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600'
              "
              :disabled="disabled"
              @click="onToggle(row, activeWeekIndex + 1, false)"
            >
              Không đạt
            </button>
          </div>

          <div
            v-if="isSuggestFor(row, activeWeekIndex + 1)"
            class="absolute right-0 top-[calc(100%+0.25rem)] z-40 w-64"
            role="dialog"
            aria-label="Tự động điền"
          >
            <div
              class="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              <div class="space-y-2.5">
                <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">Tự động điền</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Chấm tất cả tiêu chí là
                  <span class="font-semibold">{{ meetingFillSuggest.label }}</span
                  >?
                </p>
                <div class="flex gap-1.5">
                  <Button
                    type="button"
                    label="Đồng ý"
                    icon="pi pi-check"
                    size="small"
                    class="flex-1"
                    @click="emit('fill-all')"
                  />
                  <Button
                    type="button"
                    label="Không"
                    severity="secondary"
                    outlined
                    size="small"
                    class="flex-1"
                    @click="emit('dismiss-fill')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="space-y-2">
      <div
        class="rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Tiến độ từng tuần
            </span>
            <span class="text-[11px] text-slate-400 dark:text-slate-500">
              {{ completedWeeksCount }}/{{ weekCount }} tuần hoàn thành
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">Đạt</span>
            <span class="rounded-full bg-red-50 px-2 py-0.5 text-red-700 dark:bg-red-950/30 dark:text-red-300">Không đạt</span>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Chưa chấm</span>
          </div>
        </div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="weekIndex in weekCount"
            :key="weekIndex"
            class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
            :class="weekPillClass(weekIndex - 1)"
          >
            <span>Tuần {{ weekIndex }}</span>
            <span class="opacity-80">{{ scoredCountForWeek(weekIndex - 1) }}/{{ criteriaTotal }}</span>
          </span>
        </div>
      </div>

      <div
        class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
      <table class="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr class="bg-[var(--app-primary)] text-white">
            <th
              class="sticky left-0 z-10 min-w-[260px] bg-[var(--app-primary)] px-4 py-3 text-xs font-semibold tracking-wide"
            >
              Tiêu chí
            </th>
            <th
              v-for="weekIndex in weekCount"
              :key="weekIndex"
              class="min-w-[110px] px-3 py-3 text-center text-xs font-semibold"
            >
              Tuần {{ weekIndex }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in detail.weekMeetings"
            :key="row.criteriaId ?? row.id ?? row.criteriaName"
            class="border-b border-slate-100 transition-colors hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-700/70 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
            :class="
              rowIndex % 2 === 0
                ? 'bg-white dark:bg-slate-900'
                : 'bg-slate-50/70 dark:bg-slate-800/40'
            "
          >
            <td
              class="sticky left-0 z-10 px-4 py-3.5 text-xs leading-5 text-slate-700 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)] dark:text-slate-200"
              :class="
                rowIndex % 2 === 0
                  ? 'bg-white dark:bg-slate-900'
                  : 'bg-slate-50 dark:bg-slate-800'
              "
            >
              {{ row.criteriaName }}
            </td>
            <td
              v-for="week in row.weeks"
              :key="`${row.criteriaId}-${week.weekNumber}`"
              class="relative px-3 py-3.5 text-center"
              :class="isSuggestFor(row, week.weekNumber) ? 'z-30' : ''"
            >
              <div
                class="inline-flex flex-col items-center gap-1.5 rounded-lg px-2 py-1 transition-shadow"
                :class="
                  `${meetingCellWrapClass(week.score)} ${
                    isSuggestFor(row, week.weekNumber)
                      ? 'ring-2 ring-[var(--app-primary)] ring-offset-1 dark:ring-offset-slate-900'
                      : ''
                  }`
                "
              >
                <ToggleSwitch
                  :model-value="isPass(week.score)"
                  :disabled="disabled"
                  @update:model-value="onToggle(row, week.weekNumber, Boolean($event))"
                />
                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  :class="
                    isPass(week.score)
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                  "
                >
                  {{ isPass(week.score) ? 'Đạt' : 'Không đạt' }}
                </span>
              </div>

              <div
                v-if="isSuggestFor(row, week.weekNumber)"
                class="absolute left-1/2 top-[calc(100%-0.15rem)] z-40 w-[13.5rem] -translate-x-1/2 pt-2 text-left"
                role="dialog"
                aria-label="Tự động điền"
              >
                <div
                  class="relative rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
                >
                  <span
                    class="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
                  />
                  <div class="relative space-y-2.5">
                    <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      Tự động điền
                    </p>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">
                      Chấm tất cả tiêu chí là
                      <span class="font-semibold">{{ meetingFillSuggest.label }}</span
                      >?
                    </p>
                    <div class="flex gap-1.5">
                      <Button
                        type="button"
                        label="Đồng ý"
                        icon="pi pi-check"
                        size="small"
                        class="flex-1"
                        @click="emit('fill-all')"
                      />
                      <Button
                        type="button"
                        label="Không"
                        severity="secondary"
                        outlined
                        size="small"
                        class="flex-1"
                        @click="emit('dismiss-fill')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

    <div
      class="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-700 dark:bg-slate-800/40"
    >
      <label
        class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        Nhận xét họp tuần
      </label>
      <Textarea
        :model-value="detail.description"
        :disabled="disabled"
        rows="3"
        auto-resize
        placeholder="Nhập nhận xét chung cho phần họp tuần..."
        class="w-full text-sm"
        @update:model-value="emit('update-description', String($event ?? ''))"
      />
    </div>
  </section>
</template>
