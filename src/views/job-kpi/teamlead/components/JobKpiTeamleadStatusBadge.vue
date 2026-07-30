<script setup lang="ts">
import { computed } from 'vue'
import { getTeamleadStatusMeta } from '../utils/job-kpi-teamlead-helpers'
import type { JobKpiTeamleadListItem } from '../models/job-kpi-teamlead.model'

const props = defineProps<{
  item: JobKpiTeamleadListItem
}>()

const meta = computed(() => getTeamleadStatusMeta(props.item))
</script>

<template>
  <span
    class="inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
    :class="meta.badgeClass"
    :title="meta.label"
  >
    <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="meta.dotClass" />
    <i :class="[meta.icon, 'shrink-0 text-[11px] opacity-80']" />
    <span class="truncate">{{ meta.label }}</span>
  </span>
</template>
