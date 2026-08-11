<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import type { Province, District, AdviseCenter } from '../models/advise-center.model'

interface Props {
  provinces: Province[]
  districts: District[]
  centerOptions: AdviseCenter[]
  loading: boolean
  provinceId?: number
  districtId?: number
  centerId?: number
}

interface Emits {
  (e: 'update:provinceId', value?: number): void
  (e: 'update:districtId', value?: number): void
  (e: 'update:centerId', value?: number): void
  (e: 'province-change'): void
  (e: 'district-change'): void
  (e: 'search'): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  provinces: () => [],
  districts: () => [],
  centerOptions: () => [],
  loading: false,
})

const emit = defineEmits<Emits>()

const hasActiveFilter = computed(
  () =>
    props.provinceId !== undefined ||
    props.districtId !== undefined ||
    props.centerId !== undefined,
)

const selectedProvinceName = computed(
  () => props.provinces.find((p) => p.id === props.provinceId)?.name,
)
const selectedDistrictName = computed(
  () => props.districts.find((d) => d.id === props.districtId)?.name,
)
const selectedCenterName = computed(
  () => props.centerOptions.find((c) => c.id === props.centerId)?.name,
)
</script>

<template>
  <div class="space-y-4">
    <!-- Filter header -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]"
        >
          <i class="pi pi-filter text-sm" />
        </span>
        <div>
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Bộ lọc tìm kiếm</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Chọn vị trí để tìm trung tâm phù hợp
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

    <!-- Filter inputs -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Province -->
      <div class="min-w-0">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Tỉnh / Thành phố
        </label>
        <Select
          :model-value="provinceId ?? null"
          :options="provinces"
          option-label="name"
          option-value="id"
          placeholder="Chọn Tỉnh / TP"
          show-clear
          fluid
          size="small"
          @update:model-value="
            (val) => {
              emit('update:provinceId', val ?? undefined)
              emit('province-change')
              emit('search')
            }
          "
        />
      </div>

      <!-- District -->
      <div class="min-w-0">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Quận / Huyện
        </label>
        <Select
          :model-value="districtId ?? null"
          :options="districts"
          option-label="name"
          option-value="id"
          placeholder="Chọn Quận / Huyện"
          show-clear
          fluid
          size="small"
          :disabled="!provinceId || districts.length === 0"
          @update:model-value="
            (val) => {
              emit('update:districtId', val ?? undefined)
              emit('district-change')
              emit('search')
            }
          "
        />
      </div>

      <!-- Center -->
      <div class="min-w-0">
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Trung tâm
        </label>
        <Select
          :model-value="centerId ?? null"
          :options="centerOptions"
          option-label="name"
          option-value="id"
          placeholder="Chọn Trung tâm"
          show-clear
          fluid
          size="small"
          :disabled="centerOptions.length === 0"
          @update:model-value="
            (val) => {
              emit('update:centerId', val ?? undefined)
              emit('search')
            }
          "
        />
      </div>
    </div>

    <!-- Active filter tags -->
    <div
      v-if="hasActiveFilter"
      class="flex flex-wrap items-center gap-2 rounded-xl bg-white/80 px-3 py-2.5 dark:bg-slate-800/80"
    >
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Đang lọc theo:</span>
      <span
        v-if="selectedProvinceName"
        class="inline-flex items-center gap-1 rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 py-1 text-xs font-medium text-[var(--app-primary)]"
      >
        <i class="pi pi-map-marker text-[10px]" />
        {{ selectedProvinceName }}
      </span>
      <span
        v-if="selectedDistrictName"
        class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
      >
        <i class="pi pi-map text-[10px]" />
        {{ selectedDistrictName }}
      </span>
      <span
        v-if="selectedCenterName"
        class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300"
      >
        <i class="pi pi-building text-[10px]" />
        {{ selectedCenterName }}
      </span>
    </div>
  </div>
</template>
