<script setup lang="ts">
import Paginator from 'primevue/paginator'

defineProps<{
  total: number
  currentPage: number
  perPage: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

function onPageChange(event: { page: number }): void {
  emit('page-change', event.page + 1)
}
</script>

<template>
  <div v-if="total > 0" class="col-span-12">
    <div
      class="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-3 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90 sm:flex-row sm:px-4"
    >
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Trang
        <span class="font-semibold text-slate-800 dark:text-slate-100">{{ currentPage }}</span>
        ·
        <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
        nhân sự
      </p>
      <Paginator
        :rows="perPage"
        :total-records="total"
        :first="(currentPage - 1) * perPage"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="!border-0 !bg-transparent !p-0"
        @page="onPageChange"
      />
    </div>
  </div>
</template>
