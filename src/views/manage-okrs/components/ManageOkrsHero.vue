<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'

const props = defineProps<{
  name: string
  quarter: number | null
  year: Date | null
  quarterOptions: ReadonlyArray<{ label: string; value: number }>
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:quarter': [value: number | null]
  'update:year': [value: Date | null]
  reset: []
  create: []
}>()

const selectedQuarterLabel = computed(() => {
  if (props.quarter === null) return null
  return props.quarterOptions.find((item) => item.value === props.quarter)?.label ?? null
})

const selectedYearLabel = computed(() => {
  if (!props.year) return null
  return String(props.year.getFullYear())
})

const hasActiveFilter = computed(() => {
  return Boolean(props.name.trim()) || props.quarter !== null || Boolean(props.year)
})
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
  >
    <div
      class="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[rgba(var(--app-primary-rgb),0.08)] blur-2xl dark:bg-[rgba(var(--app-primary-rgb),0.16)]"
    />
    <div
      class="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10"
    />

    <div class="relative space-y-4 p-4 sm:p-5">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0 space-y-1">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]">
            Quản lý OKRs
          </p>
          <p class="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Theo dõi, lọc nhanh và cập nhật trạng thái OKR theo quý cho từng phòng ban.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-primary)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:self-center"
          :disabled="loading"
          @click="emit('create')"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner text-sm" aria-hidden="true" />
          <i v-else class="pi pi-plus text-sm" aria-hidden="true" />
          Thêm mới OKR
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
          v-if="hasActiveFilter"
          type="button"
          label="Xóa bộ lọc"
          icon="pi pi-filter-slash"
          size="small"
          severity="secondary"
          text
          @click="emit('reset')"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Tên OKR
          </label>
          <InputText
            :model-value="name"
            fluid
            size="small"
            placeholder="Tìm kiếm theo tên"
            @update:model-value="emit('update:name', String($event ?? ''))"
          />
        </div>

        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Quý
          </label>
          <Select
            :model-value="quarter"
            :options="[...quarterOptions]"
            option-label="label"
            option-value="value"
            placeholder="Chọn quý"
            show-clear
            fluid
            size="small"
            @update:model-value="emit('update:quarter', $event ?? null)"
          />
        </div>

        <div class="min-w-0">
          <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Năm
          </label>
          <DatePicker
            :model-value="year"
            view="year"
            date-format="yy"
            placeholder="Chọn năm"
            show-icon
            fluid
            size="small"
            :manual-input="false"
            @update:model-value="emit('update:year', $event as Date | null)"
          />
        </div>
      </div>

      <div
        v-if="hasActiveFilter"
        class="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-white/80 px-3 py-2.5 dark:bg-slate-800/80"
      >
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Đang lọc theo:</span>
        <span
          v-if="name.trim()"
          class="rounded-full bg-[var(--app-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--app-primary)]"
        >
          Tên: {{ name.trim() }}
        </span>
        <span
          v-if="selectedQuarterLabel"
          class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
        >
          {{ selectedQuarterLabel }}
        </span>
        <span
          v-if="selectedYearLabel"
          class="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
        >
          Năm {{ selectedYearLabel }}
        </span>
      </div>
    </div>
  </section>
</template>
