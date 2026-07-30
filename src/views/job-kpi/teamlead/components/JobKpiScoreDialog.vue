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

  return {
    width: '98vw',
    maxWidth: '96rem',
  }
})

const contentStyle = computed(() => {
  if (isMaximized.value) {
    return {
      flexGrow: 1,
      maxHeight: 'none',
      overflow: 'auto',
      paddingTop: '0.5rem',
    }
  }

  return {
    maxHeight: 'calc(100vh - 8.5rem)',
    overflow: 'auto',
    paddingTop: '0.5rem',
  }
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

const kraProgressLabel = computed(() => {
  if (kraTotal.value === 0) return 'Chưa có KRA'
  return `${kraScoredCount.value}/${kraTotal.value} KRA đã có kết quả`
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
  if (!hasMeeting && activeTab.value === 'meeting') {
    activeTab.value = 'kpi'
  }
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
        <div class="min-w-0">
          <p class="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
            Chấm KPI · {{ userName }}
          </p>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {{ isViewOnly ? 'Chế độ xem — bấm Sửa để chỉnh điểm' : 'Nhập điểm theo tuần rồi xác nhận' }}
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
        class="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3"
      >
        <div
          class="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            % KPI tổng
          </p>
          <p class="mt-1 text-xl font-bold tabular-nums text-[var(--app-primary)]">
            {{ formatPercentOrEmpty(detail.totalPercentKra) }}
          </p>
        </div>
        <div
          class="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Điểm họp tuần
          </p>
          <p class="mt-1 text-xl font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {{ formatScoreOrEmpty(detail.totalScoreMeeting) }}
          </p>
        </div>
        <div
          class="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Tiến độ chấm
          </p>
          <p class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            {{ kraProgressLabel }}
          </p>
          <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              class="h-full rounded-full bg-[var(--app-primary)] transition-all"
              :style="{
                width: kraTotal
                  ? `${Math.min(100, Math.round((kraScoredCount / kraTotal) * 100))}%`
                  : '0%',
              }"
            />
          </div>
        </div>
      </div>

      <div
        v-if="hasMeetingSection"
        class="mb-4 inline-flex w-full rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-800/80 sm:w-auto"
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'kpi'"
          class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none"
          :class="
            activeTab === 'kpi'
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900 dark:text-[var(--app-primary-dark-soft)]'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          "
          @click="activeTab = 'kpi'"
        >
          <i class="pi pi-chart-line text-xs" />
          I. Kết quả KPI
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'meeting'"
          class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none"
          :class="
            activeTab === 'meeting'
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900 dark:text-[var(--app-primary-dark-soft)]'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          "
          @click="activeTab = 'meeting'"
        >
          <i class="pi pi-users text-xs" />
          II. Họp tuần
        </button>
      </div>

      <div class="pb-1">
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
      </div>
    </template>

    <div v-else class="py-12 text-center">
      <i class="pi pi-inbox mb-2 text-2xl text-slate-300 dark:text-slate-600" />
      <p class="text-sm text-slate-500 dark:text-slate-400">Không có dữ liệu chi tiết</p>
    </div>

    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span
            class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-medium tabular-nums dark:bg-slate-800"
          >
            KPI {{ formatPercentOrEmpty(detail?.totalPercentKra) }}
          </span>
          <span
            class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-medium tabular-nums dark:bg-slate-800"
          >
            Họp {{ formatScoreOrEmpty(detail?.totalScoreMeeting) }}
          </span>
        </div>
        <div class="flex flex-wrap justify-end gap-2">
          <Button type="button" label="Huỷ bỏ" severity="secondary" outlined @click="onHide" />
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
