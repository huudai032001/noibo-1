<script setup lang="ts">
import { JOB_KPI_STAFF_TABS, type JobKpiStaffTab } from '../constants'

defineProps<{
  activeTab: JobKpiStaffTab
}>()

const emit = defineEmits<{
  'update:tab': [value: JobKpiStaffTab]
}>()

const tabs = [
  {
    value: JOB_KPI_STAFF_TABS.kpi,
    label: 'Điểm KPI',
    icon: 'pi pi-chart-line',
    hint: 'Nhập thành phẩm KRA',
  },
  {
    value: JOB_KPI_STAFF_TABS.meeting,
    label: 'Điểm họp tuần',
    icon: 'pi pi-users',
    hint: 'Kết quả theo tuần',
  },
] as const
</script>

<template>
  <div
    class="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition"
      :class="
        activeTab === tab.value
          ? 'bg-[var(--app-primary)] text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/70'
      "
      @click="emit('update:tab', tab.value)"
    >
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition"
        :class="
          activeTab === tab.value
            ? 'bg-white/15 text-white'
            : 'bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]'
        "
      >
        <i :class="[tab.icon, 'text-sm']" />
      </span>
      <span class="min-w-0">
        <span class="block text-sm font-semibold">{{ tab.label }}</span>
        <span
          class="mt-0.5 block text-xs"
          :class="activeTab === tab.value ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ tab.hint }}
        </span>
      </span>
    </button>
  </div>
</template>
