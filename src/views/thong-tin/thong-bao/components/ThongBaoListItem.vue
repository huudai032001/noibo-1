<script setup lang="ts">
import { computed } from 'vue'
import type { ThongBaoItem } from '../models/thong-bao.model'

const props = defineProps<{ item: ThongBaoItem }>()
const emit = defineEmits<{ (e: 'click'): void }>()

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

const badge = computed<'new' | 'update' | null>(() => {
  const now = Date.now()
  const sixDays = 6 * 24 * 60 * 60 * 1000
  if (props.item.createdAt && now - new Date(props.item.createdAt).getTime() <= sixDays)
    return 'new'
  if (props.item.updatedAt && now - new Date(props.item.updatedAt).getTime() <= sixDays)
    return 'update'
  return null
})
</script>

<template>
  <div
    class="group flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
    @click="emit('click')"
  >
    <!-- Icon -->
    <div
      class="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500 transition-colors group-hover:bg-purple-100 group-hover:text-purple-600"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    </div>

    <!-- Content -->
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="text-sm font-semibold text-gray-800 transition-colors group-hover:text-purple-700"
        >
          {{ item.category || 'Chưa có tiêu đề' }}
        </span>
        <span
          v-if="badge === 'new'"
          class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
        >Mới</span>
        <span
          v-else-if="badge === 'update'"
          class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
        >Cập nhật</span>
        <span
          v-if="item.isSpecial"
          class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700"
        >Nổi bật</span>
      </div>
      <p class="mt-1 text-xs text-gray-400">
        Áp dụng từ
        <span class="font-medium text-gray-600">{{ formatDate(item.startDate) }}</span>
        <template v-if="item.endDate">
          đến <span class="font-medium text-gray-600">{{ formatDate(item.endDate) }}</span>
        </template>
      </p>
    </div>

    <!-- Date (desktop) -->
    <div class="hidden flex-shrink-0 text-right sm:block">
      <p class="text-xs text-gray-400">Cập nhật</p>
      <p class="text-xs font-medium text-gray-600">{{ formatDate(item.updatedAt) }}</p>
    </div>

    <!-- Arrow -->
    <div
      class="mt-1 flex-shrink-0 text-gray-300 transition-colors group-hover:text-purple-400"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>
