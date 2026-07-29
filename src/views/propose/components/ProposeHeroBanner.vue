<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import { storeToRefs } from 'pinia'
import { useFormatter } from '@/composables/use-formatter'
import { useAuthStore } from '@/stores/auth'
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

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const { formatEmployeeCode } = useFormatter()

const displayName = computed(() => currentUser.value?.name?.trim() || 'Nhân viên')
const employeeCode = computed(() => {
  if (!currentUser.value?.id) return '—'
  return String(formatEmployeeCode(currentUser.value.id))
})

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
    return 'border-[var(--app-primary)] bg-[rgba(var(--app-primary-rgb),0.1)] ring-2 ring-[rgba(var(--app-primary-rgb),0.25)]'
  }
  switch (tone) {
    case 'primary':
      return 'border-[rgba(var(--app-primary-rgb),0.18)] bg-[rgba(var(--app-primary-rgb),0.06)]'
    case 'success':
      return 'border-emerald-200/80 bg-emerald-50/80'
    case 'danger':
      return 'border-red-200/80 bg-red-50/80'
    default:
      return 'border-slate-200/80 bg-slate-50/80'
  }
}

function statIconClass(tone: string): string {
  switch (tone) {
    case 'primary':
      return 'bg-[rgba(var(--app-primary-rgb),0.12)] text-[var(--app-primary)]'
    case 'success':
      return 'bg-emerald-100 text-emerald-600'
    case 'danger':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-slate-200/70 text-slate-600'
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
    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm"
  >
    <div
      class="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[rgba(var(--app-primary-rgb),0.08)] blur-2xl"
    />

    <div class="relative grid gap-5 p-4 sm:p-5 lg:grid-cols-[1fr_min(340px,38%)] lg:gap-6">
      <div class="min-w-0 space-y-3">
        <div class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]">
            Hành chính
          </p>
          <h1 class="text-xl font-semibold text-slate-900 sm:text-2xl">{{ title }}</h1>
          <p class="text-sm leading-6 text-slate-600">{{ subtitle }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button
            v-if="canCreate !== false && mode === 'employee'"
            type="button"
            label="Thêm mới"
            icon="pi pi-plus"
            class="!shadow-sm"
            @click="emit('create')"
          />
          <Button
            v-if="canCreate && mode === 'approval'"
            type="button"
            label="Thêm mới"
            icon="pi pi-plus"
            outlined
            class="!shadow-sm"
            @click="emit('create')"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
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
              <p class="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                {{ stat.label }}
              </p>
              <p v-if="loading" class="mt-1.5">
                <Skeleton width="2rem" height="1.25rem" />
              </p>
              <p v-else class="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 sm:text-xl">
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

    <div class="border-t border-slate-200/70 bg-white/60 px-4 py-4 sm:px-5">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)]"
          >
            <i class="pi pi-filter text-sm" />
          </span>
          <div>
            <p class="text-sm font-semibold text-slate-800">Bộ lọc</p>
            <p class="text-xs text-slate-500">Thay đổi sẽ cập nhật URL và danh sách ngay</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a
            href="https://t.me/edutalk_hcns_bot"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-50 hover:text-sky-800"
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
          <label class="text-xs font-medium text-slate-600">Tên/Mã nhân sự</label>
          <InputText
            :model-value="keyword ?? ''"
            placeholder="Nhập mã/tên nhân sự"
            size="small"
            fluid
            @update:model-value="emit('update:keyword', $event ?? '')"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-medium text-slate-600">Thời gian tạo</label>
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
          <label class="text-xs font-medium text-slate-600">Danh mục</label>
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
          <label class="text-xs font-medium text-slate-600">
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
          <label class="text-xs font-medium text-slate-600">Trạng thái</label>
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
