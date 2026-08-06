<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LevelEmployeeTable from './components/LevelEmployeeTable.vue'
import { useLevelEmployeePage } from './composables/use-level-employee-page'

const router = useRouter()

const {
  pagedItems,
  loading,
  keyword,
  currentPage,
  totalPages,
  fetchList,
  handleSearch,
  toggleExpandPaged,
  goToPage,
} = useLevelEmployeePage()

async function handleKeywordChange(): Promise<void> {
  if (keyword.value.length >= 3 || keyword.value.length == 0) {
    await handleSearch()
  }
}

function handlePageChange(page: number): Promise<void> {
  return goToPage(page)
}

function handleViewDetail(id: number | undefined): void {
  if (id) {
    router.push({ name: 'level-employee-detail', params: { id } })
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
        style="background: rgba(255,255,255,0.08)"
      ></div>
      <div
        class="pointer-events-none absolute -bottom-8 right-20 h-24 w-24 rounded-full"
        style="background: rgba(255,255,255,0.08)"
      ></div>
      <div
        class="pointer-events-none absolute bottom-0 left-1/3 h-16 w-16 rounded-full"
        style="background: rgba(255,255,255,0.04)"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span class="text-xs font-semibold uppercase tracking-widest">Quản lý chỉ số</span>
          </div>
          <h1 class="text-2xl font-bold text-[var(--app-primary)]">Bảng tiêu chuẩn chỉ số </h1>
          <p class="mt-1 text-sm">Quản lý tiêu chí và điểm chuẩn cho các Level nhân sự</p>
        </div>

        <!-- Search Filter -->
        <div
          class="flex w-fit items-center gap-2 rounded-xl px-4 py-2.5"
          style="background: rgba(255,255,255,0.12); border: 1px solid rgba(84, 54, 54, 0.2)"
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
            placeholder="Tìm theo mã, tên nhân viên..."
            @input="handleKeywordChange"
            class="bg-transparent text-sm font-semibold focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div>
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-5 w-1 rounded-full bg-purple-600"></div>
          <h2 class="text-base font-semibold text-gray-800">Danh sách tiêu chí</h2>
        </div>
      </div>
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <LevelEmployeeTable
          :items="pagedItems"
          :loading="loading"
          @toggle-expand="toggleExpandPaged"
          @view-detail="handleViewDetail"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        v-if="currentPage > 1"
        @click="handlePageChange(currentPage - 1)"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Trước
      </button>
      <div class="flex items-center gap-1">
        <span
          v-for="page in totalPages"
          :key="page"
          @click="handlePageChange(page)"
          :class="[
            'rounded-lg px-3 py-2 text-sm font-medium cursor-pointer transition-colors',
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
        @click="handlePageChange(currentPage + 1)"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Sau
      </button>
    </div>
  </div>
</template>
