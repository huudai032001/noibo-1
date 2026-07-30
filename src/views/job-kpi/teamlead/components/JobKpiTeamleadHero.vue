<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import { JOB_KPI_TEAMLEAD_STATUS, JOB_KPI_TEAMLEAD_STATUS_OPTIONS } from '../constants'
import type { JobKpiDepartmentOption } from '../models/job-kpi-teamlead.model'
import { hasActiveFilters } from '../utils/job-kpi-teamlead-helpers'

const props = defineProps<{
  keyword: string
  month: Date | null
  departmentId: number | null
  status: number | null
  departments: JobKpiDepartmentOption[]
  loading?: boolean
  total: number
  needInputCount: number
  needScoreCount: number
  scoredCount: number
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  'update:month': [value: Date | null]
  'update:departmentId': [value: number | null]
  'update:status': [value: number | null]
  reset: []
}>()

const filtersActive = computed(() =>
  hasActiveFilters({
    keyword: props.keyword,
    departmentId: props.departmentId,
    status: props.status,
  }),
)

const stats = computed(() => [
  {
    key: 'total',
    label: 'Tổng',
    value: props.total,
    icon: 'pi pi-users',
    tone: 'primary',
    filter: null as number | null,
  },
  {
    key: 'needInput',
    label: 'Chưa nhập',
    value: props.needInputCount,
    icon: 'pi pi-exclamation-circle',
    tone: 'danger',
    filter: JOB_KPI_TEAMLEAD_STATUS.needInput,
  },
  {
    key: 'needScore',
    label: 'Cần chấm',
    value: props.needScoreCount,
    icon: 'pi pi-pencil',
    tone: 'warn',
    filter: JOB_KPI_TEAMLEAD_STATUS.needScore,
  },
  {
    key: 'scored',
    label: 'Đã chấm',
    value: props.scoredCount,
    icon: 'pi pi-check-circle',
    tone: 'success',
    filter: JOB_KPI_TEAMLEAD_STATUS.scored,
  },
])

function isStatActive(filter: number | null): boolean {
  if (filter === null) return props.status === null
  return props.status === filter
}

function statToneClass(tone: string, filter: number | null): string {
  if (isStatActive(filter) && filter !== null) {
    return 'border-[var(--app-primary)] bg-[rgba(var(--app-primary-rgb),0.1)] ring-2 ring-[rgba(var(--app-primary-rgb),0.25)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]'
  }
  switch (tone) {
    case 'primary':
      return 'border-[rgba(var(--app-primary-rgb),0.18)] bg-[rgba(var(--app-primary-rgb),0.06)] dark:border-[rgba(var(--app-primary-rgb),0.35)] dark:bg-[rgba(var(--app-primary-rgb),0.12)]'
    case 'success':
      return 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-800/60 dark:bg-emerald-950/40'
    case 'danger':
      return 'border-red-200/80 bg-red-50/80 dark:border-red-800/60 dark:bg-red-950/40'
    case 'warn':
      return 'border-amber-200/80 bg-amber-50/80 dark:border-amber-800/60 dark:bg-amber-950/40'
    default:
      return 'border-slate-200/80 bg-slate-50/80 dark:border-slate-600/80 dark:bg-slate-800/60'
  }
}

function statIconClass(tone: string): string {
  switch (tone) {
    case 'primary':
      return 'bg-[rgba(var(--app-primary-rgb),0.12)] text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.22)]'
    case 'success':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
    case 'danger':
      return 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
    case 'warn':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
    default:
      return 'bg-slate-200/70 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
  }
}

function onStatusFilter(filter: number | null): void {
  if (filter === null) {
    emit('update:status', null)
    return
  }
  emit('update:status', props.status === filter ? null : filter)
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
      <div class="min-w-0 space-y-1">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]">
          Chấm KPI và họp tuần
        </p>
        <p class="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Ưu tiên nhân sự cần chấm, theo dõi % KPI và điểm họp tuần theo tháng.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <button
          v-for="stat in stats"
          :key="stat.key"
          type="button"
          class="rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)] sm:p-3"
          :class="statToneClass(stat.tone, stat.filter)"
          :aria-pressed="isStatActive(stat.filter)"
          @click="onStatusFilter(stat.filter)"
        >
          <div class="flex items-center justify-between gap-1.5">
            <div class="min-w-0">
              <p
                class="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs"
              >
                {{ stat.label }}
              </p>
              <p v-if="loading" class="mt-1.5">
                <Skeleton width="2rem" height="1.25rem" />
              </p>
              <p
                v-else
                class="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-xl"
              >
                {{ stat.value }}
              </p>
            </div>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl"
              :class="statIconClass(stat.tone)"
            >
              <i :class="[stat.icon, 'text-sm']" />
            </span>
          </div>
        </button>
      </div>
    </div>

    <div
      class="border-t border-slate-200/70 bg-white/60 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 sm:px-5"
    >
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]"
          >
            <i class="pi pi-filter text-sm" />
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Bộ lọc</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Thay đổi sẽ cập nhật URL và danh sách ngay
            </p>
          </div>
        </div>
        <Button
          v-if="filtersActive"
          type="button"
          label="Xóa bộ lọc"
          icon="pi pi-filter-slash"
          size="small"
          severity="secondary"
          text
          @click="emit('reset')"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Tên / Mã nhân sự
          </label>
          <InputText
            :model-value="keyword"
            placeholder="Nhập tên, SĐT, email"
            fluid
            size="small"
            @update:model-value="emit('update:keyword', String($event ?? ''))"
          />
        </div>

        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Thời gian
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

        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Đơn vị
          </label>
          <Select
            :model-value="departmentId"
            :options="departments"
            option-label="name"
            option-value="id"
            placeholder="Chọn đơn vị"
            show-clear
            filter
            fluid
            size="small"
            @update:model-value="emit('update:departmentId', $event ?? null)"
          />
        </div>

        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Trạng thái
          </label>
          <Select
            :model-value="status"
            :options="[...JOB_KPI_TEAMLEAD_STATUS_OPTIONS]"
            option-label="label"
            option-value="value"
            placeholder="Chọn trạng thái"
            show-clear
            fluid
            size="small"
            @update:model-value="emit('update:status', $event ?? null)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
