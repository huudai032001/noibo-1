<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import Skeleton from 'primevue/skeleton'
import { computed } from 'vue'
import { JOB_KPI_STAFF_TABS, type JobKpiStaffTab } from '../constants'
import {
  formatPercentOrEmpty,
  formatScoreOrEmpty,
  getPercentTone,
} from '../utils/job-kpi-helpers'

const props = defineProps<{
  month: Date | null
  loading?: boolean
  totalPercentKra: number | null
  totalScoreMeeting: number | null
  activeTab: JobKpiStaffTab
  total: number
  inputtedCount: number
  pendingCount: number
}>()

const emit = defineEmits<{
  'update:month': [value: Date | null]
  'update:tab': [value: JobKpiStaffTab]
}>()

const kpiTone = computed(() => getPercentTone(props.totalPercentKra))

function toneCardClass(tone: string, active: boolean): string {
  if (active) {
    return 'border-[var(--app-primary)] bg-[rgba(var(--app-primary-rgb),0.1)] ring-2 ring-[rgba(var(--app-primary-rgb),0.22)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]'
  }
  switch (tone) {
    case 'success':
      return 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-800/60 dark:bg-emerald-950/40'
    case 'warn':
      return 'border-amber-200/80 bg-amber-50/80 dark:border-amber-800/60 dark:bg-amber-950/40'
    case 'danger':
      return 'border-red-200/80 bg-red-50/80 dark:border-red-800/60 dark:bg-red-950/40'
    default:
      return 'border-[rgba(var(--app-primary-rgb),0.18)] bg-[rgba(var(--app-primary-rgb),0.06)] dark:border-[rgba(var(--app-primary-rgb),0.35)] dark:bg-[rgba(var(--app-primary-rgb),0.12)]'
  }
}

function toneIconClass(tone: string): string {
  switch (tone) {
    case 'success':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
    case 'warn':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
    case 'danger':
      return 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    default:
      return 'bg-[rgba(var(--app-primary-rgb),0.12)] text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.22)]'
  }
}
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
  >
    <div
      class="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[rgba(var(--app-primary-rgb),0.08)] blur-2xl dark:bg-[rgba(var(--app-primary-rgb),0.16)]"
    />
    <div
      class="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10"
    />

    <div class="relative space-y-4 p-4 sm:p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="min-w-0 space-y-1">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]">
            Hành chính
          </p>
          <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
            KPI công việc
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Nhập thành phẩm KRA và theo dõi điểm họp tuần theo tháng.
          </p>
        </div>

        <div class="w-full shrink-0 sm:max-w-[220px] lg:pt-1">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Tháng xem
          </label>
          <DatePicker
            :model-value="month"
            view="month"
            date-format="mm-yy"
            placeholder="Chọn tháng"
            show-icon
            fluid
            size="small"
            :manual-input="false"
            @update:model-value="emit('update:month', $event as Date | null)"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <button
          type="button"
          class="rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:p-3"
          :class="toneCardClass(kpiTone, activeTab === JOB_KPI_STAFF_TABS.kpi)"
          @click="emit('update:tab', JOB_KPI_STAFF_TABS.kpi)"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                Điểm KPI tổng
              </p>
              <p v-if="loading" class="mt-1.5">
                <Skeleton width="3.5rem" height="1.35rem" />
              </p>
              <p
                v-else
                class="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-xl"
              >
                {{ formatPercentOrEmpty(totalPercentKra) }}
              </p>
            </div>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl"
              :class="toneIconClass(kpiTone)"
            >
              <i class="pi pi-chart-line text-sm" />
            </span>
          </div>
        </button>

        <button
          type="button"
          class="rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:p-3"
          :class="
            activeTab === JOB_KPI_STAFF_TABS.meeting
              ? 'border-[var(--app-primary)] bg-[rgba(var(--app-primary-rgb),0.1)] ring-2 ring-[rgba(var(--app-primary-rgb),0.22)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]'
              : 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-800/60 dark:bg-emerald-950/40'
          "
          @click="emit('update:tab', JOB_KPI_STAFF_TABS.meeting)"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                Điểm họp tuần
              </p>
              <p v-if="loading" class="mt-1.5">
                <Skeleton width="3.5rem" height="1.35rem" />
              </p>
              <p
                v-else
                class="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-xl"
              >
                {{ formatScoreOrEmpty(totalScoreMeeting) }}
              </p>
            </div>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 sm:h-9 sm:w-9 sm:rounded-xl"
            >
              <i class="pi pi-users text-sm" />
            </span>
          </div>
        </button>

        <div
          class="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 dark:border-slate-600/80 dark:bg-slate-800/60 sm:p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                Đã nhập
              </p>
              <p v-if="loading" class="mt-1.5">
                <Skeleton width="2rem" height="1.35rem" />
              </p>
              <p
                v-else
                class="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-xl"
              >
                {{ inputtedCount }}/{{ total }}
              </p>
            </div>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200/70 text-slate-600 dark:bg-slate-700 dark:text-slate-300 sm:h-9 sm:w-9 sm:rounded-xl"
            >
              <i class="pi pi-check-circle text-sm" />
            </span>
          </div>
        </div>

        <div
          class="rounded-xl border border-amber-200/80 bg-amber-50/80 p-2.5 dark:border-amber-800/60 dark:bg-amber-950/40 sm:p-3"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                Cần nhập
              </p>
              <p v-if="loading" class="mt-1.5">
                <Skeleton width="2rem" height="1.35rem" />
              </p>
              <p
                v-else
                class="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-xl"
              >
                {{ pendingCount }}
              </p>
            </div>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 sm:h-9 sm:w-9 sm:rounded-xl"
            >
              <i class="pi pi-pencil text-sm" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
