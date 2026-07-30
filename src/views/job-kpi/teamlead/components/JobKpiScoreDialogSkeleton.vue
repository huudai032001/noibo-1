<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <div
        v-for="card in 3"
        :key="card"
        class="rounded-xl border border-slate-200 px-3.5 py-3 dark:border-slate-700"
      >
        <Skeleton width="5rem" height="0.7rem" class="mb-2" />
        <Skeleton width="4rem" height="1.5rem" />
      </div>
    </div>

    <Skeleton width="16rem" height="2.25rem" border-radius="0.75rem" />

    <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div class="bg-[var(--app-primary)] px-3 py-3">
        <div class="flex gap-3">
          <Skeleton
            v-for="col in 7"
            :key="col"
            width="100%"
            height="0.85rem"
            class="!bg-white/25"
          />
        </div>
      </div>
      <div class="space-y-3 p-3">
        <div
          v-for="row in 4"
          :key="row"
          class="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7"
        >
          <Skeleton v-for="cell in 7" :key="cell" height="2.5rem" border-radius="0.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>
