<script setup lang="ts">
import { computed } from 'vue'
import type { ErrorTargetProgressItem, TableColumn } from '../models/error-target-progress.model'
import { TYPE_GOAL_DEFINE, PROCESS_TYPE_DEFINE, TABLE_COLUMNS, PAGE_SIZE } from '../constants'

interface Props {
  data: ErrorTargetProgressItem[]
  loading: boolean
  currentPage: number
  totalRecords: number
  pageSize?: number
}

interface Emits {
  (e: 'page-change', page: number): void
  (e: 'row-click', row: ErrorTargetProgressItem): void
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: PAGE_SIZE,
})

defineEmits<Emits>()

const totalPages = computed(() => Math.ceil(props.totalRecords / (props.pageSize || PAGE_SIZE)))

const visibleColumns = computed<TableColumn[]>(() => TABLE_COLUMNS)
</script>

<template>
  <div class="space-y-4">
    <!-- Table Wrapper -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
    </div>

    <div v-else-if="data.length === 0" class="rounded bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-800">
      Không có dữ liệu
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">#</th>
            <th
              v-for="col in visibleColumns"
              :key="col.key"
              :style="col.style"
              class="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="row.id"
            class="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
            @click="$emit('row-click', row)"
          >
            <td class="px-4 py-3 text-sm text-slate-700 dark:text-slate-400">
              {{ (currentPage - 1) * (pageSize || PAGE_SIZE) + index + 1 }}
            </td>

            <td
              v-for="col in visibleColumns"
              :key="col.key"
              class="px-4 py-3 text-sm text-slate-700 dark:text-slate-400"
            >
              <!-- Process column - show formatted error type -->
              <template v-if="col.key === 'process'">
                <span>{{ TYPE_GOAL_DEFINE[row.process] || 'N/A' }} {{ PROCESS_TYPE_DEFINE[row.processType || row.process_type || 0] || '' }}</span>
              </template>

              <!-- IsCTV column - show badge -->
              <template v-else-if="col.key === 'isCTV'">
                <span
                  v-if="row.isCTV || row.is_ctv"
                  class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  Có
                </span>
                <span v-else class="text-xs text-slate-500">Không</span>
              </template>

              <!-- Branch name - handle null -->
              <template v-else-if="col.key === 'branchName'">
                {{ row.branchName || row.branch_name || 'N/A' }}
              </template>

              <!-- Default - show field value -->
              <template v-else>
                {{ row[col.key as keyof ErrorTargetProgressItem] || 'N/A' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-4 py-3">
      <div class="text-sm text-slate-600 dark:text-slate-400">
        Tổng bản ghi: <span class="font-semibold text-slate-900 dark:text-slate-100">{{ totalRecords }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1 || loading"
          class="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="flex items-center gap-1">
          <span v-if="totalPages > 5" class="text-sm text-slate-600 dark:text-slate-400">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="$emit('page-change', page)"
            :disabled="loading"
            :class="{
              'bg-blue-600 text-white': page === currentPage,
              'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800': page !== currentPage,
            }"
            class="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage >= totalPages || loading"
          class="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
