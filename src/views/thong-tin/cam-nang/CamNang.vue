<script setup lang="ts">
import { onMounted } from 'vue'
import InfoAccordionPanel from '../_components/InfoAccordionPanel.vue'
import { useCamNangPage } from './composables/use-cam-nang-page'

const { items, loading, keyword, fetchList, handleSearch } = useCamNangPage()

async function handleKeywordChange(): Promise<void> {
  if (keyword.value.length >= 3 || keyword.value.length === 0) {
    await handleSearch()
  }
}

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

      <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span class="text-xs font-semibold uppercase tracking-widest">Thông tin nội bộ</span>
          </div>
          <h1 class="text-2xl font-bold text-[var(--app-primary)]">Cẩm nang vận hành</h1>
          <p class="mt-1 text-sm">Hướng dẫn và quy trình vận hành nội bộ của Edutalk</p>
        </div>

        <!-- Search -->
        <div
          class="flex w-fit items-center gap-2 rounded-xl px-4 py-2.5"
          style="background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2)"
        >
          <svg
            class="h-4 w-4 flex-shrink-0 text-[var(--app-primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="keyword"
            type="text"
            placeholder="Tìm theo danh mục..."
            @input="handleKeywordChange"
            class="w-44 bg-transparent text-sm font-semibold focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-5 w-1 rounded-full bg-purple-600"></div>
          <h2 class="text-base font-semibold text-gray-800">Danh sách cẩm nang</h2>
        </div>
        <span v-if="!loading && items.length > 0" class="text-xs text-gray-400">
          {{ items.length }} mục
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-500">
          {{ keyword ? 'Không tìm thấy cẩm nang phù hợp' : 'Chưa có cẩm nang nào' }}
        </p>
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
