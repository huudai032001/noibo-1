<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
</script>

<template>
  <div class="space-y-4">
    <!-- Summary bar (KPI & Họp tuần) -->
    <div
      class="mb-1 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/50"
    >
      <div class="flex items-center gap-2">
        <Skeleton shape="circle" size="2.25rem" />
        <div class="space-y-1">
          <Skeleton width="3rem" height="0.75rem" />
          <Skeleton width="7.5rem" height="1.25rem" />
        </div>
      </div>

      <span class="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-600" />

      <div class="flex items-center gap-2">
        <Skeleton shape="circle" size="2.25rem" />
        <div class="space-y-1">
          <Skeleton width="4rem" height="0.75rem" />
          <Skeleton width="7.5rem" height="1.25rem" />
        </div>
      </div>

      <span class="hidden h-4 w-px bg-slate-200 sm:block dark:bg-slate-600" />

      <div class="flex min-w-[10rem] flex-1 items-center gap-2">
        <Skeleton width="5.5rem" height="0.75rem" />
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div class="h-full rounded-full bg-[var(--app-primary)] opacity-40" style="width: 65%" />
        </div>
        <Skeleton width="3.5rem" height="0.75rem" />
      </div>
    </div>

    <!-- Tabs -->
    <div
      class="flex w-full rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-800/80"
      role="tablist"
    >
      <div
        class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[var(--app-primary)] shadow-sm dark:bg-slate-900"
      >
        <Skeleton width="4rem" height="1rem" border-radius="999px" />
      </div>
      <div
        class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
      >
        <Skeleton width="5rem" height="1rem" />
      </div>
    </div>

    <!-- KPI all-weeks table header -->
    <div
      class="rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-1.5">
          <Skeleton width="9rem" height="0.85rem" />
          <Skeleton width="11rem" height="0.75rem" />
        </div>
        <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
          <Skeleton width="2.5rem" height="1rem" border-radius="999px" />
          <Skeleton width="2.8rem" height="1rem" border-radius="999px" />
          <Skeleton width="2.8rem" height="1rem" border-radius="999px" />
        </div>
      </div>

      <!-- View mode: Tất cả tuần (active) -->
      <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          class="inline-flex w-full rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 dark:border-slate-700 dark:bg-slate-800/80 sm:w-auto"
        >
          <div
            class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors text-slate-500 dark:text-slate-400"
          >
            <Skeleton width="7.5rem" height="0.75rem" />
          </div>
          <div
            class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900"
          >
            <Skeleton width="6.5rem" height="0.75rem" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table body skeleton -->
    <div
      class="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="min-w-[1240px]">
        <div class="bg-[var(--app-primary)] px-3 py-3">
          <div class="flex flex-wrap items-center gap-3">
            <Skeleton width="16rem" height="0.85rem" class="!bg-white/25" />
            <Skeleton width="10rem" height="0.85rem" class="!bg-white/25" />
            <Skeleton width="7rem" height="0.85rem" class="!bg-white/25" />
            <Skeleton v-for="i in 5" :key="i" width="6.5rem" height="0.85rem" class="!bg-white/25" />
            <Skeleton width="10rem" height="0.85rem" class="!bg-white/25" />
            <Skeleton width="6rem" height="0.85rem" class="!bg-white/25" />
          </div>
        </div>

        <div class="space-y-2 p-3">
          <div v-for="row in 6" :key="row" class="flex items-center gap-2">
            <Skeleton width="14rem" height="2rem" border-radius="10px" />
            <Skeleton width="10rem" height="2rem" border-radius="10px" />
            <Skeleton width="8rem" height="2rem" border-radius="10px" />
            <Skeleton v-for="i in 5" :key="i" width="6.5rem" height="2rem" border-radius="10px" />
            <Skeleton width="10rem" height="2rem" border-radius="10px" />
            <Skeleton width="4.5rem" height="2rem" border-radius="999px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
