<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 12,
})
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <div v-for="i in count" :key="i" class="animate-pulse">
      <div
        class="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <!-- Banner -->
        <div class="h-14 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600" />

        <!-- Content -->
        <div class="flex flex-1 flex-col px-4 pb-4 pt-3">
          <div class="mb-2 h-4 w-4/5 rounded-md bg-slate-200 dark:bg-slate-600" />
          <div class="mb-3 h-3 w-2/5 rounded bg-slate-100 dark:bg-slate-700" />

          <div class="mb-3 space-y-1.5">
            <div class="h-3 w-full rounded bg-slate-100 dark:bg-slate-700" />
            <div class="h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-700" />
          </div>

          <div class="mb-3 space-y-1.5">
            <div class="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-700" />
            <div class="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-700" />
          </div>

          <div class="mb-3 h-8 rounded-lg bg-slate-100 dark:bg-slate-700" />

          <div class="h-8 rounded-xl bg-slate-100 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  </div>
</template>
