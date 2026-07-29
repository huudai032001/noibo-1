<script setup lang="ts">
import { getStatusLabel, getStatusMeta } from '../utils/propose-helpers'

defineProps<{
  status: number
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
    :class="getStatusMeta(status).badgeClass"
  >
    <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="getStatusMeta(status).dotClass" />
    <i :class="[getStatusMeta(status).icon, 'text-[11px] opacity-80']" />
    {{ getStatusLabel(status) }}
  </span>
</template>
