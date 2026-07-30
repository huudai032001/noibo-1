<script setup lang="ts">
import ProgressBar from 'primevue/progressbar'
import type { JobKpiWeekMeetingRow } from '../models/job-kpi-staff.model'
import { formatScoreOrEmpty, getMeetingScoreMeta } from '../utils/job-kpi-helpers'
import JobKpiTableSkeleton from './JobKpiTableSkeleton.vue'

defineProps<{
  weekMeetings: JobKpiWeekMeetingRow[]
  weekCount: number
  loading: boolean
  loadingSearch?: boolean
  totalScoreMeeting: number | null
  description: string
}>()
</script>

<template>
  <div class="box overflow-hidden">
    <div
      class="flex flex-col items-start justify-between gap-3 border-b border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:px-5"
    >
      <div>
        <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">Điểm họp tuần</h2>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Kết quả đánh giá theo từng tuần trong tháng
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
      >
        <i class="pi pi-star text-sm" />
        Điểm tích: {{ formatScoreOrEmpty(totalScoreMeeting) }}
      </div>
    </div>

    <ProgressBar v-if="loading || loadingSearch" mode="indeterminate" class="!h-[3px]" />

    <div
      class="overflow-x-auto"
      :class="{ 'pointer-events-none opacity-60': loadingSearch && !loading }"
    >
      <table class="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr
            class="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
          >
            <th class="sticky left-0 z-[1] bg-slate-50/95 px-4 py-3 font-medium dark:bg-slate-900/95">
              Tiêu chí
            </th>
            <th
              v-for="weekIndex in weekCount"
              :key="weekIndex"
              class="whitespace-nowrap px-4 py-3 text-center font-medium"
            >
              Tuần {{ weekIndex }}
            </th>
          </tr>
        </thead>

        <JobKpiTableSkeleton v-if="loading" :columns="Math.max(weekCount, 1) + 1" />

        <tbody v-else-if="weekMeetings.length > 0">
          <tr
            v-for="(item, rowIndex) in weekMeetings"
            :key="item.id ?? rowIndex"
            class="border-b border-slate-100 dark:border-slate-800"
          >
            <td
              class="sticky left-0 z-[1] bg-white px-4 py-3.5 font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
            >
              {{ item.criteriaName || '—' }}
            </td>
            <td
              v-for="(score, scoreIndex) in item.weekScores"
              :key="scoreIndex"
              class="px-4 py-3.5 text-center"
            >
              <span
                class="inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1"
                :class="{
                  'bg-emerald-50 text-emerald-700 ring-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800/60':
                    getMeetingScoreMeta(score).tone === 'success',
                  'bg-red-50 text-red-600 ring-red-200/80 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800/60':
                    getMeetingScoreMeta(score).tone === 'danger',
                  'bg-slate-100 text-slate-500 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700':
                    getMeetingScoreMeta(score).tone === 'neutral',
                }"
              >
                <i
                  v-if="getMeetingScoreMeta(score).tone === 'success'"
                  class="pi pi-check text-[10px]"
                />
                <i
                  v-else-if="getMeetingScoreMeta(score).tone === 'danger'"
                  class="pi pi-times text-[10px]"
                />
                <i v-else class="pi pi-minus text-[10px]" />
                {{ getMeetingScoreMeta(score).label }}
              </span>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td :colspan="Math.max(weekCount, 1) + 1" class="px-4 py-14 text-center">
              <div class="flex flex-col items-center justify-center">
                <span
                  class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  <i class="pi pi-calendar text-xl" />
                </span>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Không có dữ liệu
                </p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Chưa có kết quả họp tuần trong tháng đã chọn.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="border-t border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:px-5">
      <div class="mb-2 flex items-center gap-2">
        <span
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
        >
          <i class="pi pi-comment text-xs" />
        </span>
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Nhận xét từ quản lý</p>
      </div>
      <div
        class="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm leading-6 dark:border-slate-700 dark:bg-slate-900/40"
        :class="
          description ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
        "
      >
        {{ description || 'Không có nhận xét' }}
      </div>
    </div>
  </div>
</template>
