<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThongBaoDetailPage } from './composables/use-thong-bao-detail-page'

const route = useRoute()
const router = useRouter()

const { item, loading, fetchDetail } = useThongBaoDetailPage()

function goBack(): void {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'thong-bao' })
  }
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

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

onMounted(() => {
  const slug = String(route.params.slug).replace('.', '')
  void fetchDetail(slug)
})
</script>

<template>
  <div class="space-y-6 py-3 sm:py-4">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl p-6 shadow-lg">
      <div
        class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
        style="background: rgba(255, 255, 255, 0.08)"
      ></div>
      <div
        class="pointer-events-none absolute -bottom-8 right-20 h-24 w-24 rounded-full"
        style="background: rgba(255, 255, 255, 0.08)"
      ></div>

      <div class="relative">
        <!-- Back button -->
        <button
          @click="goBack"
          class="mb-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:scale-[1.02]"
          style="background: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.25)"
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại danh sách
        </button>

        <div class="flex items-center gap-2 mb-1">
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span class="text-xs font-semibold uppercase tracking-widest">Chi tiết thông báo</span>
        </div>

        <h1 class="text-xl font-bold text-[var(--app-primary)] leading-snug">
          {{ loading ? 'Đang tải...' : item?.category || 'Thông báo' }}
        </h1>

        <div v-if="item" class="mt-2 flex flex-wrap items-center gap-4 text-xs opacity-80">
          <span v-if="item.updatedAt" class="flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cập nhật: {{ formatDateTime(item.updatedAt) }}
          </span>
          <span v-if="item.startDate" class="flex items-center gap-1">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Áp dụng từ {{ formatDate(item.startDate) }}
            <template v-if="item.endDate"> đến {{ formatDate(item.endDate) }}</template>
          </span>
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-3 p-8">
        <div class="h-4 w-3/4 animate-pulse rounded-md bg-gray-100"></div>
        <div class="h-4 w-full animate-pulse rounded-md bg-gray-100"></div>
        <div class="h-4 w-5/6 animate-pulse rounded-md bg-gray-100"></div>
        <div class="h-4 w-2/3 animate-pulse rounded-md bg-gray-100"></div>
        <div class="mt-4 h-4 w-full animate-pulse rounded-md bg-gray-100"></div>
        <div class="h-4 w-4/5 animate-pulse rounded-md bg-gray-100"></div>
        <div class="h-4 w-full animate-pulse rounded-md bg-gray-100"></div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!item?.content"
        class="flex flex-col items-center justify-center py-16"
      >
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
          <svg
            class="h-8 w-8 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-sm text-gray-400">Chưa có nội dung</p>
      </div>

      <!-- HTML content -->
      <div
        v-else
        v-html="item.content"
        class="thong-tin-content p-6 text-sm leading-relaxed text-gray-700 sm:p-8"
      ></div>
    </div>

    <!-- Footer back button -->
    <div class="flex justify-start">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại danh sách thông báo
      </button>
    </div>
  </div>
</template>
