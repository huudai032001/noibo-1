<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { AdviseCenter } from '../models/advise-center.model'

interface Props {
  center: AdviseCenter
}

withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'view-detail': [center: AdviseCenter]
}>()

const toast = useToast()

function getAvgColor(avg: number | undefined): string {
  if (!avg) return 'text-slate-300 dark:text-slate-600'
  if (avg >= 4.5) return 'text-yellow-400'
  if (avg >= 3.5) return 'text-yellow-300'
  return 'text-slate-300 dark:text-slate-600'
}

function getAvgBg(avg: number | undefined): string {
  if (!avg) return 'bg-slate-100 dark:bg-slate-700'
  if (avg >= 4.5) return 'bg-yellow-50 dark:bg-yellow-900/20'
  if (avg >= 3.5) return 'bg-amber-50 dark:bg-amber-900/20'
  return 'bg-slate-100 dark:bg-slate-700'
}

async function copyAddress(address: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(address)
    toast.add({
      severity: 'success',
      summary: 'Đã sao chép',
      detail: 'Địa chỉ đã được sao chép vào clipboard',
      life: 2500,
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể sao chép địa chỉ', life: 3000 })
  }
}
</script>

<template>
  <div
    class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--app-primary)]/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
  >
    <!-- Banner -->
    <div
      class="relative h-14 overflow-hidden bg-gradient-to-r from-[rgba(var(--app-primary-rgb),0.06)] via-[rgba(var(--app-primary-rgb),0.04)] to-purple-50/60 dark:from-[rgba(var(--app-primary-rgb),0.12)] dark:via-[rgba(var(--app-primary-rgb),0.06)] dark:to-purple-900/20"
    >
      <div
        class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[rgba(var(--app-primary-rgb),0.07)] transition-transform duration-300 group-hover:scale-125"
      />
      <div class="absolute -bottom-5 -left-4 h-16 w-16 rounded-full bg-purple-100/40 dark:bg-purple-500/10" />

      <!-- Combo badge -->
      <div v-if="center.combo" class="absolute left-3 top-3">
        <span
          class="inline-flex items-center gap-1 rounded-full bg-[var(--app-primary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm"
        >
          <i class="pi pi-star-fill text-[8px]" />
          Combo
        </span>
      </div>

      <!-- Rating badge -->
      <div v-if="center.avg" class="absolute right-3 top-3">
        <div
          class="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
          :class="getAvgBg(center.avg)"
        >
          <svg class="h-3 w-3" :class="getAvgColor(center.avg)" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          <span class="text-slate-700 dark:text-slate-200">{{ center.avg.toFixed(1) }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col px-4 pb-4 pt-3">
      <!-- Center Name -->
      <h3
        class="mb-1.5 line-clamp-2 cursor-pointer text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-[var(--app-primary)] dark:text-slate-100"
        @click="emit('view-detail', center)"
      >
        {{ center.name || 'N/A' }}
      </h3>

      <!-- Branch name -->
      <div
        v-if="center.branchName"
        class="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--app-primary)]"
      >
        <i class="pi pi-building text-[10px] flex-shrink-0" />
        <span class="truncate">{{ center.branchName }}</span>
      </div>

      <!-- Short description -->
      <p
        v-if="center.shortDescription"
        class="mb-2.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400"
      >
        {{ center.shortDescription }}
      </p>

      <!-- Address (with inline copy) -->
      <div
        v-if="center.address"
        class="group/addr mb-3 flex items-start gap-1.5 text-xs text-slate-400 dark:text-slate-500"
      >
        <i class="pi pi-map-marker mt-0.5 flex-shrink-0 text-[var(--app-primary)]/50 text-[10px]" />
        <span class="line-clamp-2 flex-1">{{ center.address }}</span>
        <button
          type="button"
          title="Sao chép địa chỉ"
          class="ml-1 shrink-0 rounded p-0.5 opacity-0 transition-all group-hover/addr:opacity-100 hover:text-[var(--app-primary)]"
          @click.stop="copyAddress(center.address!)"
        >
          <i class="pi pi-copy text-[10px]" />
        </button>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Stats -->
      <div
        v-if="center.totalStudent"
        class="mb-3 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-700/50"
      >
        <i class="pi pi-users text-[10px] text-slate-400" />
        <span class="text-xs text-slate-500 dark:text-slate-400">
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ center.totalStudent.toLocaleString('vi-VN') }}
          </span>
          học viên
        </span>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center gap-2">
        <!-- Copy address icon button -->
        <button
          v-if="center.address"
          type="button"
          title="Sao chép địa chỉ"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-[var(--app-primary)]/40 hover:bg-[rgba(var(--app-primary-rgb),0.05)] hover:text-[var(--app-primary)] dark:border-slate-600 dark:text-slate-500 dark:hover:border-[var(--app-primary)]/40 dark:hover:text-[var(--app-primary)]"
          @click="copyAddress(center.address!)"
        >
          <i class="pi pi-copy text-xs" />
        </button>

        <!-- View detail button -->
        <button
          type="button"
          class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition-all hover:border-[var(--app-primary)]/40 hover:bg-[rgba(var(--app-primary-rgb),0.05)] hover:text-[var(--app-primary)] dark:border-slate-600 dark:text-slate-400 dark:hover:border-[var(--app-primary)]/40 dark:hover:text-[var(--app-primary)]"
          @click="emit('view-detail', center)"
        >
          <i class="pi pi-eye text-[10px]" />
          Xem chi tiết
        </button>
      </div>
    </div>
  </div>
</template>
