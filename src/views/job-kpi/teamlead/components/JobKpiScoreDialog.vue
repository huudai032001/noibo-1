<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import type {
  JobKpiDetailData,
  JobKpiDetailKraItem,
  JobKpiFillSuggestState,
  JobKpiManagerWeek,
  JobKpiMeetingFillSuggestState,
  JobKpiWeekMeetingRow,
} from '../models/job-kpi-teamlead.model'
import {
  formatPercentOrEmpty,
  formatScoreOrEmpty,
} from '../utils/job-kpi-teamlead-helpers'
import JobKpiKraResultTable from './JobKpiKraResultTable.vue'
import JobKpiMeetingScoreTable from './JobKpiMeetingScoreTable.vue'
import JobKpiScoreDialogSkeleton from './JobKpiScoreDialogSkeleton.vue'

type ScoreDialogTab = 'kpi' | 'meeting'

const props = defineProps<{
  visible: boolean
  userName: string
  isViewOnly: boolean
  loading?: boolean
  detail: JobKpiDetailData | null
  fillSuggest: JobKpiFillSuggestState
  meetingFillSuggest: JobKpiMeetingFillSuggestState
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  confirm: []
  edit: []
  'update-kra-field': [kra: JobKpiDetailKraItem, field: 'name' | 'requestResult', value: string]
  'persist-kra': [kra: JobKpiDetailKraItem]
  'mark-week': [kra: JobKpiDetailKraItem, week: JobKpiManagerWeek, percent: number | null]
  'update-kra-description': [kra: JobKpiDetailKraItem, value: string]
  'fill-all-week': []
  'dismiss-week-fill': []
  'change-meeting-score': [row: JobKpiWeekMeetingRow, weekNumber: number, score: number | null]
  'update-meeting-description': [value: string]
  'fill-all-meeting': []
  'dismiss-meeting-fill': []
}>()

const isMaximized = ref(false)
const activeTab = ref<ScoreDialogTab>('kpi')

const dialogStyle = computed(() => {
  if (isMaximized.value) {
    return {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    }
  }
  return { width: '98vw', maxWidth: '96rem' }
})

const contentStyle = computed(() => {
  if (isMaximized.value) {
    return { flexGrow: 1, maxHeight: 'none', overflow: 'auto', paddingTop: '0.25rem' }
  }
  return { maxHeight: 'calc(100vh - 8.5rem)', overflow: 'auto', paddingTop: '0.25rem' }
})

const userInitials = computed(() => {
  const parts = props.userName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
})

const hasMeetingSection = computed(() => (props.detail?.weekMeetings.length ?? 0) > 0)
const kraTotal = computed(() => props.detail?.details.length ?? 0)

const kraScoredCount = computed(() => {
  if (!props.detail) return 0
  return props.detail.details.filter((kra) => {
    if (kra.percentResults === null || kra.percentResults === undefined) return false
    return Number(kra.percentResults) >= 0
  }).length
})

const kraProgressPercent = computed(() => {
  if (!kraTotal.value) return 0
  return Math.min(100, Math.round((kraScoredCount.value / kraTotal.value) * 100))
})

const meetingCriteriaTotal = computed(() => props.detail?.weekMeetings.length ?? 0)
const meetingWeekTotal = computed(() => props.detail?.weekCount ?? 0)
const meetingCellTotal = computed(() => meetingCriteriaTotal.value * meetingWeekTotal.value)
const meetingScoredCount = computed(() => {
  if (!props.detail) return 0
  return props.detail.weekMeetings.reduce((total, row) => {
    const marked = row.weeks.filter((cell) => cell.score !== null && cell.score !== undefined).length
    return total + marked
  }, 0)
})
const meetingProgressPercent = computed(() => {
  if (!meetingCellTotal.value) return 0
  return Math.min(100, Math.round((meetingScoredCount.value / meetingCellTotal.value) * 100))
})

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      isMaximized.value = false
      activeTab.value = 'kpi'
    }
  },
)

watch(hasMeetingSection, (hasMeeting) => {
  if (!hasMeeting && activeTab.value === 'meeting') activeTab.value = 'kpi'
})

function onHide(): void {
  isMaximized.value = false
  activeTab.value = 'kpi'
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    maximizable
    :draggable="false"
    class="job-kpi-score-dialog w-full"
    :style="dialogStyle"
    :content-style="contentStyle"
    @update:visible="emit('update:visible', $event)"
    @maximize="isMaximized = true"
    @unmaximize="isMaximized = false"
    @hide="onHide"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-3 pr-2">
        <span
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--app-primary-rgb),0.12)] text-sm font-bold text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.22)]"
        >
          {{ userInitials }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
            Chấm KPI · {{ userName }}
          </p>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {{
              isViewOnly
                ? 'Chế độ xem — bấm Sửa để chỉnh điểm'
                : 'Chọn tuần → chấm nhanh → chuyển sang họp tuần'
            }}
          </p>
        </div>
        <span
          v-if="isViewOnly"
          class="hidden shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 sm:inline-flex dark:bg-amber-950/40 dark:text-amber-300"
        >
          <i class="pi pi-eye text-[10px]" />
          Chỉ xem
        </span>
      </div>
    </template>

    <JobKpiScoreDialogSkeleton v-if="loading" />

    <template v-else-if="detail">
      <div
        class="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/50"
      >
        <div class="flex items-center gap-2">
          <i class="pi pi-chart-line text-xs text-[var(--app-primary)]" />
          <span class="text-xs text-slate-500 dark:text-slate-400">KPI</span>
          <span class="text-sm font-bold tabular-nums text-[var(--app-primary)]">
            {{ formatPercentOrEmpty(detail.totalPercentKra) }}
          </span>
        </div>
        <span class="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-600" />
        <div class="flex items-center gap-2">
          <i class="pi pi-users text-xs text-slate-500" />
          <span class="text-xs text-slate-500 dark:text-slate-400">Họp tuần</span>
          <span class="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {{ formatScoreOrEmpty(detail.totalScoreMeeting) }}
          </span>
        </div>
        <span class="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-600" />
        <div class="flex min-w-[10rem] flex-1 items-center gap-2">
          <span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
            {{ kraScoredCount }}/{{ kraTotal }} KRA
          </span>
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              class="h-full rounded-full bg-[var(--app-primary)] transition-all"
              :style="{ width: `${kraProgressPercent}%` }"
            />
          </div>
          <span class="shrink-0 text-[11px] font-semibold tabular-nums text-slate-600 dark:text-slate-300">
            {{ kraProgressPercent }}%
          </span>
        </div>
      </div>

      <div
        v-if="hasMeetingSection"
        class="mb-3 flex w-full rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-800/80"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'kpi'"
          class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
          :class="
            activeTab === 'kpi'
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900'
              : 'text-slate-500 dark:text-slate-400'
          "
          @click="activeTab = 'kpi'"
        >
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            :class="
              activeTab === 'kpi'
                ? 'bg-[rgba(var(--app-primary-rgb),0.15)] text-[var(--app-primary)]'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
            "
          >
            1
          </span>
          Kết quả KPI
          <span
            class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
            :class="
              activeTab === 'kpi'
                ? 'bg-[rgba(var(--app-primary-rgb),0.15)] text-[var(--app-primary)]'
                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            "
          >
            {{ kraScoredCount }}/{{ kraTotal }}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'meeting'"
          class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
          :class="
            activeTab === 'meeting'
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900'
              : 'text-slate-500 dark:text-slate-400'
          "
          @click="activeTab = 'meeting'"
        >
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
            :class="
              activeTab === 'meeting'
                ? 'bg-[rgba(var(--app-primary-rgb),0.15)] text-[var(--app-primary)]'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-700'
            "
          >
            2
          </span>
          Họp tuần
          <span
            class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
            :class="
              activeTab === 'meeting'
                ? 'bg-[rgba(var(--app-primary-rgb),0.15)] text-[var(--app-primary)]'
                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            "
          >
            {{ meetingScoredCount }}/{{ meetingCellTotal }}
          </span>
        </button>
      </div>

      <JobKpiKraResultTable
        v-show="activeTab === 'kpi'"
        :detail="detail"
        :disabled="isViewOnly"
        :fill-suggest="fillSuggest"
        :compact-header="true"
        @update-kra-field="(...args) => emit('update-kra-field', ...args)"
        @persist-kra="emit('persist-kra', $event)"
        @mark-week="(...args) => emit('mark-week', ...args)"
        @update-description="(...args) => emit('update-kra-description', ...args)"
        @fill-all-week="emit('fill-all-week')"
        @dismiss-fill="emit('dismiss-week-fill')"
      />

      <JobKpiMeetingScoreTable
        v-if="hasMeetingSection"
        v-show="activeTab === 'meeting'"
        :detail="detail"
        :disabled="isViewOnly"
        :meeting-fill-suggest="meetingFillSuggest"
        :compact-header="true"
        @change-score="(...args) => emit('change-meeting-score', ...args)"
        @update-description="emit('update-meeting-description', $event)"
        @fill-all="emit('fill-all-meeting')"
        @dismiss-fill="emit('dismiss-meeting-fill')"
      />
    </template>

    <div v-else class="py-12 text-center">
      <i class="pi pi-inbox mb-2 text-2xl text-slate-300 dark:text-slate-600" />
      <p class="text-sm text-slate-500 dark:text-slate-400">Không có dữ liệu chi tiết</p>
    </div>

    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-slate-400 dark:text-slate-500">
          <template v-if="isViewOnly">Đang ở chế độ xem</template>
          <template v-else-if="hasMeetingSection && activeTab === 'kpi'">
            KPI {{ kraScoredCount }}/{{ kraTotal }} ({{ kraProgressPercent }}%) · Xong KPI → chuyển sang tab Họp tuần
          </template>
          <template v-else-if="hasMeetingSection && activeTab === 'meeting'">
            Họp tuần {{ meetingScoredCount }}/{{ meetingCellTotal }} ({{ meetingProgressPercent }}%)
          </template>
          <template v-else>Kiểm tra điểm trước khi xác nhận</template>
        </p>
        <div class="flex flex-wrap justify-end gap-2">
          <Button type="button" label="Huỷ bỏ" severity="secondary" outlined @click="onHide" />
          <Button
            v-if="hasMeetingSection && activeTab === 'kpi' && !isViewOnly"
            type="button"
            label="Tiếp: Họp tuần"
            icon="pi pi-arrow-right"
            icon-pos="right"
            severity="secondary"
            @click="activeTab = 'meeting'"
          />
          <Button
            v-if="isViewOnly"
            type="button"
            label="Sửa"
            icon="pi pi-pencil"
            :disabled="loading || !detail"
            @click="emit('edit')"
          />
          <Button
            v-else
            type="button"
            label="Xác nhận"
            icon="pi pi-check"
            :disabled="loading || !detail"
            @click="emit('confirm')"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
