<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50 to-white px-4 py-3.5 shadow-sm dark:border-red-800/60 dark:from-red-950/40 dark:to-slate-800 sm:px-5"
  >
    <div
      class="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-red-100/70 blur-2xl dark:bg-red-900/40"
    />
    <div class="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-start gap-3">
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm dark:bg-red-900/50 dark:text-red-400"
        >
          <i class="pi pi-exclamation-circle text-base" />
        </span>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-red-800 dark:text-red-300">
            Không tải được dữ liệu
          </p>
          <p class="mt-1 text-[13px] leading-5 text-red-700/90 dark:text-red-400/90">
            {{ message }}
          </p>
        </div>
      </div>
      <Button
        type="button"
        label="Thử lại"
        icon="pi pi-refresh"
        size="small"
        severity="danger"
        outlined
        class="shrink-0 self-start !bg-white/70 dark:!bg-slate-800/70 sm:self-auto"
        @click="emit('retry')"
      />
    </div>
  </div>
</template>
