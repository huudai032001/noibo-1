<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import {
  PROPOSE_CATEGORY_OPTIONS,
  PROPOSE_STATUS,
  PROPOSE_STATUS_OPTIONS,
} from '../constants'
import type { ProposeApprovalRoleFlags, ProposeDepartment } from '../models/propose.model'
import { countProposeByStatus, hasActiveFilters } from '../utils/propose-helpers'

const props = defineProps<{
  mode: 'employee' | 'approval'
  total: number
  items: { status?: number }[]
  loading?: boolean
  canCreate?: boolean
  month: Date | null
  category: number | ''
  status: number | ''
  keyword?: string
  department?: number | ''
  departments?: ProposeDepartment[]
  roleFlags?: ProposeApprovalRoleFlags
}>()

const emit = defineEmits<{
  create: []
  reset: []
  'update:month': [value: Date | null]
  'update:category': [value: number | '']
  'update:status': [value: number | '']
  'update:keyword': [value: string]
  'update:department': [value: number | '']
}>()

const title = computed(() =>
  props.mode === 'approval' ? 'Duyệt đề xuất' : 'Đề xuất của tôi',
)

const subtitle = computed(() =>
  props.mode === 'approval'
    ? 'Theo dõi và xử lý các yêu cầu từ nhân sự trong phạm vi quyền hạn của bạn.'
    : 'Tạo và theo dõi đơn nghỉ phép, tăng ca, đổi ca và bổ sung giờ làm việc.',
)

const stats = computed(() => [
  {
    key: 'total',
    label: 'Tổng',
    value: props.total,
    icon: 'pi pi-inbox',
    tone: 'primary',
    filter: '' as number | '',
  },
  {
    key: 'pending',
    label: 'Chờ duyệt',
    value: countProposeByStatus(props.items, PROPOSE_STATUS.pending),
    icon: 'pi pi-hourglass',
    tone: 'neutral',
    filter: PROPOSE_STATUS.pending,
  },
  {
    key: 'approved',
    label: 'Đã duyệt',
    value: countProposeByStatus(props.items, PROPOSE_STATUS.approved),
    icon: 'pi pi-check-circle',
    tone: 'success',
    filter: PROPOSE_STATUS.approved,
  },
  {
    key: 'rejected',
    label: 'Từ chối',
    value: countProposeByStatus(props.items, PROPOSE_STATUS.rejected),
    icon: 'pi pi-times-circle',
    tone: 'danger',
    filter: PROPOSE_STATUS.rejected,
  },
])

const showCreateButton = computed(() => {
  if (props.mode === 'employee') return props.canCreate !== false
  return Boolean(props.canCreate)
})

const filtersActive = computed(() =>
  hasActiveFilters({
    month: props.month,
    category: props.category,
    status: props.status,
    keyword: props.keyword,
    department: props.department,
  }),
)

function statToneClass(tone: string, filter: number | ''): string {
  const isActive = props.status !== '' && props.status === filter
  if (isActive && filter !== '') {
    return 'border-[var(--app-primary)] bg-[rgba(var(--app-primary-rgb),0.1)] ring-2 ring-[rgba(var(--app-primary-rgb),0.25)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]'
  }
  switch (tone) {
    case 'primary':
      return 'border-[rgba(var(--app-primary-rgb),0.18)] bg-[rgba(var(--app-primary-rgb),0.06)] dark:border-[rgba(var(--app-primary-rgb),0.35)] dark:bg-[rgba(var(--app-primary-rgb),0.12)]'
    case 'success':
      return 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-800/60 dark:bg-emerald-950/40'
    case 'danger':
      return 'border-red-200/80 bg-red-50/80 dark:border-red-800/60 dark:bg-red-950/40'
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
    default:
      return 'bg-slate-200/70 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
  }
}

function onStatusFilter(filter: number | ''): void {
  if (filter === '') {
    emit('update:status', '')
    return
  }
  emit('update:status', props.status === filter ? '' : filter)
}
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
  >
    <div
      class="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[rgba(var(--app-primary-rgb),0.08)] blur-2xl dark:bg-[rgba(var(--app-primary-rgb),0.16)]"
    />

    <div class="relative space-y-4 p-4 sm:p-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0 space-y-1">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]">
            Hành chính
          </p>
          <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
            {{ title }}
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {{ subtitle }}
          </p>
        </div>

        <button
          v-if="showCreateButton"
          type="button"
          class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)] active:scale-[0.98] sm:self-center"
          @click="emit('create')"
        >
          <i class="pi pi-plus text-sm" aria-hidden="true" />
          Thêm mới
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <button
          v-for="stat in stats"
          :key="stat.key"
          type="button"
          class="rounded-xl border p-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:p-3"
          :class="statToneClass(stat.tone, stat.filter)"
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
        <div class="flex flex-wrap items-center gap-2">
          <a
            href="https://t.me/edutalk_hcns_bot"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-50 hover:text-sky-800 dark:text-sky-400 dark:hover:bg-sky-950/50 dark:hover:text-sky-300"
          >
            <i class="pi pi-telegram text-sm" />
            <span>Nhận thông báo qua Telegram</span>
            <i class="pi pi-external-link text-[10px] opacity-70" />
          </a>
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
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <div v-if="mode === 'approval'" class="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Tên/Mã nhân sự
          </label>
          <InputText
            :model-value="keyword ?? ''"
            placeholder="Nhập mã/tên nhân sự"
            size="small"
            fluid
            @update:model-value="emit('update:keyword', $event ?? '')"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Thời gian tạo
          </label>
          <DatePicker
            :model-value="month"
            view="month"
            date-format="mm-yy"
            placeholder="Chọn tháng"
            show-icon
            fluid
            show-clear
            size="small"
            @update:model-value="emit('update:month', $event as Date | null)"
          />
        </div>

        <div
          v-if="mode === 'employee' || (roleFlags && !roleFlags.isBod)"
          class="flex flex-col gap-1"
        >
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Danh mục</label>
          <Select
            :model-value="category"
            :options="[...PROPOSE_CATEGORY_OPTIONS]"
            option-label="label"
            option-value="value"
            placeholder="Chọn danh mục"
            show-clear
            fluid
            size="small"
            @update:model-value="emit('update:category', $event as number | '')"
          />
        </div>

        <div
          v-if="mode === 'approval' && roleFlags && (roleFlags.isLeader || roleFlags.isBod)"
          class="flex flex-col gap-1"
        >
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            {{ roleFlags.isLeader ? 'Bộ phận' : 'Phòng ban' }}
          </label>
          <Select
            :model-value="department ?? ''"
            :options="departments ?? []"
            option-label="name"
            option-value="id"
            placeholder="Chọn phòng ban"
            show-clear
            filter
            fluid
            size="small"
            @update:model-value="emit('update:department', $event as number | '')"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Trạng thái</label>
          <Select
            :model-value="status"
            :options="[...PROPOSE_STATUS_OPTIONS]"
            option-label="label"
            option-value="value"
            placeholder="Chọn trạng thái"
            show-clear
            fluid
            size="small"
            @update:model-value="emit('update:status', $event as number | '')"
          />
        </div>
      </div>
    </div>
  </section>
</template>
