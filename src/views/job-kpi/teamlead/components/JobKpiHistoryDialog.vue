<script setup lang="ts">
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useFormatter } from '@/composables/use-formatter'
import type { JobKpiKraHistoryItem, JobKpiTeamleadListItem } from '../models/job-kpi-teamlead.model'
import JobKpiKraChangeHistory from './JobKpiKraChangeHistory.vue'

defineProps<{
  visible: boolean
  userInfo: JobKpiTeamleadListItem | null
  items: JobKpiKraHistoryItem[]
  selected: JobKpiKraHistoryItem | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
  select: [item: JobKpiKraHistoryItem]
}>()

const { formatDate } = useFormatter()

function onHide(): void {
  emit('update:visible', false)
  emit('close')
}

function formatHistoryDate(value: string): string {
  return formatDate(value, 'datetime') || value
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    maximizable
    :draggable="false"
    header="Lịch sử thay đổi"
    class="w-full max-w-5xl"
    :style="{ width: '92vw', maxWidth: '64rem' }"
    :content-style="{ maxHeight: 'calc(100vh - 8.5rem)', overflow: 'auto' }"
    @update:visible="emit('update:visible', $event)"
    @hide="onHide"
  >
    <div v-if="loading" class="flex min-h-40 items-center justify-center">
      <ProgressSpinner class="h-9 w-9" stroke-width="4" />
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
      <div>
        <div class="mb-2 flex items-center justify-between text-sm">
          <span class="font-medium text-slate-700 dark:text-slate-200">Thay đổi cũ</span>
          <span class="text-slate-500 dark:text-slate-400">{{ items.length }} lần thay đổi</span>
        </div>
        <div
          class="max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700"
        >
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="flex w-full flex-col gap-0.5 border-b border-slate-100 px-3 py-2.5 text-left transition last:border-b-0 dark:border-slate-700"
            :class="
              selected?.id === item.id
                ? 'border-l-4 border-l-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
            "
            @click="emit('select', item)"
          >
            <span class="text-xs text-slate-500 dark:text-slate-400">
              {{ formatHistoryDate(item.updatedAt) }}
            </span>
            <span class="text-sm font-medium text-slate-800 dark:text-slate-100">
              Thay đổi thông tin KRAs
            </span>
          </button>
          <p
            v-if="items.length === 0"
            class="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            Chưa có thay đổi nào
          </p>
        </div>
      </div>

      <div>
        <div class="mb-2 text-sm text-slate-500 dark:text-slate-400">
          <template v-if="items[0]">
            {{ formatHistoryDate(items[0].updatedAt) }}
          </template>
          <template v-else-if="userInfo">
            {{ userInfo.user?.name || 'Nhân sự' }}
          </template>
        </div>
        <JobKpiKraChangeHistory :history="selected" />
      </div>
    </div>
  </Dialog>
</template>
