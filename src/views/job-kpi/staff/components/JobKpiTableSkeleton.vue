<script setup lang="ts">
defineProps<{
  columns: number
  rows?: number
}>()
</script>

<template>
  <tbody>
    <tr
      v-for="row in rows ?? 5"
      :key="row"
      class="border-b border-slate-100 dark:border-slate-800"
    >
      <td v-for="col in columns" :key="col" class="px-4 py-3.5">
        <div class="h-4 animate-pulse rounded bg-slate-200/80 dark:bg-slate-700/80" />
      </td>
    </tr>
  </tbody>
</template>
