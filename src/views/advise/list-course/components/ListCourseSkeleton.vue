<script setup lang="ts">
const skeletonCount = 3
</script>

<template>
  <div class="space-y-8">
    <div v-for="n in skeletonCount" :key="n" class="space-y-4">
      <!-- Group header skeleton -->
      <div class="space-y-2">
        <div class="h-4 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div class="h-3 w-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>

      <!-- Carousel skeleton -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="space-y-3">
          <div class="h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div class="h-3 w-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div class="h-3 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  </div>
</template>
