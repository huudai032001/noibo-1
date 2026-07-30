<script setup lang="ts">
import { computed } from 'vue'
import type { JobKpiKraHistoryItem } from '../models/job-kpi-teamlead.model'
import { renderHistoryDiff } from '../utils/job-kpi-teamlead-helpers'

const props = defineProps<{
  history: JobKpiKraHistoryItem | null
}>()

const hasOld = computed(() => Boolean(props.history?.oldContent))
const hasNew = computed(() => Boolean(props.history?.newContent))
</script>

<template>
  <div
    class="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 md:grid-cols-2"
  >
    <div
      class="space-y-2 border-b border-slate-200 p-3 dark:border-slate-700 md:border-b-0 md:border-r"
    >
      <template v-if="hasOld">
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
          KRA:
          <span v-html="renderHistoryDiff(history, 'name', 'old')" />
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Yêu cầu thành phẩm:</p>
        <p
          class="text-sm text-slate-700 dark:text-slate-200"
          v-html="renderHistoryDiff(history, 'requestResult', 'old')"
        />
      </template>
      <p v-else class="text-sm text-slate-400">Không có nội dung cũ</p>
    </div>

    <div class="space-y-2 p-3">
      <template v-if="hasNew">
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
          KRA:
          <span v-html="renderHistoryDiff(history, 'name', 'new')" />
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Yêu cầu thành phẩm:</p>
        <p
          class="text-sm text-slate-700 dark:text-slate-200"
          v-html="renderHistoryDiff(history, 'requestResult', 'new')"
        />
      </template>
      <p v-else class="text-sm text-slate-400">Không có nội dung mới</p>
    </div>
  </div>
</template>
