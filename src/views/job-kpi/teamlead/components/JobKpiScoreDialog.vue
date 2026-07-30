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
import JobKpiKraResultTable from './JobKpiKraResultTable.vue'
import JobKpiMeetingScoreTable from './JobKpiMeetingScoreTable.vue'
import JobKpiScoreDialogSkeleton from './JobKpiScoreDialogSkeleton.vue'

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
    }
  }

  return {
    maxHeight: 'calc(100vh - 8.5rem)',
    overflow: 'auto',
  }
})

watch(
  () => props.visible,
  (visible) => {
    if (!visible) isMaximized.value = false
  },
)

function onHide(): void {
  isMaximized.value = false
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
    :header="`Chấm KPI nhân sự: ${userName}`"
    class="job-kpi-score-dialog w-full"
    :style="dialogStyle"
    :content-style="contentStyle"
    @update:visible="emit('update:visible', $event)"
    @maximize="isMaximized = true"
    @unmaximize="isMaximized = false"
    @hide="onHide"
  >
    <JobKpiScoreDialogSkeleton v-if="loading" />

    <div v-else-if="detail" class="space-y-5">
      <JobKpiKraResultTable
        :detail="detail"
        :disabled="isViewOnly"
        :fill-suggest="fillSuggest"
        @update-kra-field="(...args) => emit('update-kra-field', ...args)"
        @persist-kra="emit('persist-kra', $event)"
        @mark-week="(...args) => emit('mark-week', ...args)"
        @update-description="(...args) => emit('update-kra-description', ...args)"
        @fill-all-week="emit('fill-all-week')"
        @dismiss-fill="emit('dismiss-week-fill')"
      />

      <JobKpiMeetingScoreTable
        :detail="detail"
        :disabled="isViewOnly"
        :meeting-fill-suggest="meetingFillSuggest"
        @change-score="(...args) => emit('change-meeting-score', ...args)"
        @update-description="emit('update-meeting-description', $event)"
        @fill-all="emit('fill-all-meeting')"
        @dismiss-fill="emit('dismiss-meeting-fill')"
      />
    </div>

    <div v-else class="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
      Không có dữ liệu chi tiết
    </div>

    <template #footer>
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
    </template>
  </Dialog>
</template>
