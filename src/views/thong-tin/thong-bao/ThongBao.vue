<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ThongBaoListItem from './components/ThongBaoListItem.vue'
import { useThongBaoPage } from './composables/use-thong-bao-page'
import { THONG_BAO_IS_SPECIAL_OPTIONS } from './constants'

const router = useRouter()

const {
  items,
  loading,
  keyword,
  isSpecialFilter,
  currentPage,
  totalPages,
  fetchList,
  handleSearch,
  goToPage,
} = useThongBaoPage()

async function handleKeywordChange(): Promise<void> {
  if (keyword.value.length >= 3 || keyword.value.length === 0) {
    await handleSearch()
  }
}

async function handleFilterChange(): Promise<void> {
  await handleSearch()
}

function handleViewDetail(slug?: string): void {
  if (slug) {
    router.push({ name: 'thong-bao-detail', params: { slug } })
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span class="text-xs font-semibold uppercase tracking-widest">Thông tin nội bộ</span>
          </div>
          <h1 class="text-2xl font-bold text-[var(--app-primary)]">Thông báo</h1>
          <p class="mt-1 text-sm">Cập nhật thông báo và thông tin mới nhất từ Edutalk</p>
        </div>

        <!-- Filters -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <!-- Search -->
          <div
            class="flex items-center gap-2 rounded-xl px-4 py-2.5"
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
              placeholder="Tìm theo tiêu đề..."
              @input="handleKeywordChange"
              class="w-40 bg-transparent text-sm font-semibold focus:outline-none"
            />
          </div>

          <!-- is_special filter -->
          <div
            class="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style="background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2)"
          >
            <svg
              class="h-4 w-4 flex-shrink-0 text-[var(--app-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M7 8h10M11 12h6M13 16h4" />
            </svg>
            <select
              v-model="isSpecialFilter"
              @change="handleFilterChange"
              class="cursor-pointer bg-transparent text-sm font-semibold focus:outline-none"
            >
              <option value="">Tất cả</option>
              <option
                v-for="opt in THONG_BAO_IS_SPECIAL_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- List Section -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-5 w-1 rounded-full bg-purple-600"></div>
          <h2 class="text-base font-semibold text-gray-800">Danh sách thông báo</h2>
        </div>
        <span v-if="!loading && items.length > 0" class="text-xs text-gray-400">
          {{ items.length }} thông báo
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-3">
        <div
          v-for="i in 5"
          :key="i"
          class="h-[72px] animate-pulse rounded-2xl bg-gray-100"
        ></div>
      </div>

      <!-- Empty state -->
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <p class="text-sm font-medium text-gray-500">
          {{ keyword ? 'Không tìm thấy thông báo phù hợp' : 'Chưa có thông báo nào' }}
        </p>
      </div>

      <!-- Items -->
      <div v-else class="space-y-3">
        <ThongBaoListItem
          v-for="item in items"
          :key="item.slug"
          :item="item"
          @click="handleViewDetail(item.slug)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        v-if="currentPage > 1"
        @click="goToPage(currentPage - 1)"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Trước
      </button>
      <div class="flex items-center gap-1">
        <span
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            currentPage === page
              ? 'bg-purple-600 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </span>
      </div>
      <button
        v-if="currentPage < totalPages"
        @click="goToPage(currentPage + 1)"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Sau
      </button>
    </div>
  </div>
</template>
