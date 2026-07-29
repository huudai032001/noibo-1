<script setup lang="ts">
import { getCategoryLabel, getCategoryMeta } from '../utils/propose-helpers'

defineProps<{
  category: number
  compact?: boolean
}>()
</script>

<template>
  <span
    class="inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
    :class="getCategoryMeta(category).badgeClass"
  >
    <i :class="[getCategoryMeta(category).icon, getCategoryMeta(category).iconClass, 'text-[11px]']" />
    <span class="truncate">
      {{ compact ? getCategoryMeta(category).shortLabel : getCategoryLabel(category) }}
    </span>
  </span>
</template>
