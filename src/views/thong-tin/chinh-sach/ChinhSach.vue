<script setup lang="ts">
import { onMounted } from 'vue'
import InfoAccordionPanel from '../_components/InfoAccordionPanel.vue'
import { useChinhSachPage } from './composables/use-chinh-sach-page'

const { items, loading, fetchList } = useChinhSachPage()

onMounted(() => {
  void fetchList()
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
      <div
        class="pointer-events-none absolute bottom-0 left-1/3 h-16 w-16 rounded-full"
        style="background: rgba(255, 255, 255, 0.04)"
      ></div>

      <div class="relative">
        <div class="mb-1 flex items-center gap-2">
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span class="text-xs font-semibold uppercase tracking-widest">Thông tin nội bộ</span>
        </div>
        <h1 class="text-2xl font-bold text-[var(--app-primary)]">Chính sách nhân sự</h1>
        <p class="mt-1 text-sm">Các chính sách và quy định nội bộ dành cho nhân sự Edutalk</p>
      </div>
    </div>

    <!-- Content Section -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-5 w-1 rounded-full bg-purple-600"></div>
          <h2 class="text-base font-semibold text-gray-800">Danh sách chính sách</h2>
        </div>
        <span v-if="!loading && items.length > 0" class="text-xs text-gray-400">
          {{ items.length }} chính sách
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="h-16 animate-pulse rounded-2xl bg-gray-100"
        ></div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="items.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 shadow-sm"
      >
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50"
        >
          <svg
            class="h-8 w-8 text-purple-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-500">Chưa có chính sách nào</p>
      </div>

      <!-- Accordion panels -->
      <div v-else class="space-y-3">
        <InfoAccordionPanel
          v-for="(item, index) in items"
          :key="index"
          :title="item.category"
          :content="item.content"
          :created-at="item.createdAt"
          :updated-at="item.updatedAt"
        />
      </div>
    </div>
  </div>
</template>
