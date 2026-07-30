<script setup lang="ts">
import { JOB_KPI_STAFF_STATUS } from '../constants'
import { getKpiStatusLabel } from '../utils/job-kpi-helpers'

defineProps<{
  status: number | null | undefined
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
    :class="
      status === JOB_KPI_STAFF_STATUS.inputted
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800/60'
        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800/60'
    "
  >
    <i
      :class="
        status === JOB_KPI_STAFF_STATUS.inputted ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'
      "
      class="text-[11px]"
    />
    {{ getKpiStatusLabel(status) }}
  </span>
</template>
