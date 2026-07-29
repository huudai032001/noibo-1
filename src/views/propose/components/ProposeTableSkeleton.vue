<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

defineProps<{
  columns: number
  rows?: number
}>()
</script>

<template>
  <tbody>
    <tr v-for="row in rows ?? 5" :key="row" class="border-b border-slate-100">
      <td v-for="col in columns" :key="col" class="px-3 py-3">
        <Skeleton height="1rem" :width="col === 1 ? '70%' : '85%'" />
      </td>
    </tr>
  </tbody>
</template>
