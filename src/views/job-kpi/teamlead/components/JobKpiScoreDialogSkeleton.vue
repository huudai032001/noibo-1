<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="space-y-5">
    <section class="space-y-3">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton width="9rem" height="1.25rem" />
        <Skeleton width="8.5rem" height="2rem" border-radius="0.75rem" />
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="bg-[var(--app-primary)] px-3 py-3">
          <div class="flex gap-3">
            <Skeleton
              v-for="col in 8"
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
            class="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8"
          >
            <Skeleton v-for="cell in 8" :key="cell" height="2.5rem" border-radius="0.5rem" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton width="11rem" height="1.25rem" />
        <Skeleton width="10rem" height="2rem" border-radius="0.75rem" />
      </div>

      <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="bg-[var(--app-primary)] px-3 py-3">
          <div class="flex gap-3">
            <Skeleton
              v-for="col in 5"
              :key="col"
              width="100%"
              height="0.85rem"
              class="!bg-white/25"
            />
          </div>
        </div>
        <div class="space-y-3 p-3">
          <div v-for="row in 3" :key="row" class="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Skeleton v-for="cell in 5" :key="cell" height="2.75rem" border-radius="0.5rem" />
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <Skeleton width="5rem" height="1rem" />
        <Skeleton height="4rem" border-radius="0.75rem" />
      </div>
    </section>
  </div>
</template>
