<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Calendar from 'primevue/calendar'
import ErrorTargetProgressTable from './components/ErrorTargetProgressTable.vue'
import ErrorCard from './components/ErrorCard.vue'
import { useErrorTargetProgressPageV2 } from './composables/use-error-target-progress-page-v2'

const {
  filters,
  summaryData,
  tableData,
  childUsers,
  loading,
  currentPage,
  pagination,
  areas,
  branches,
  errorTypes,
  goalTypes,
  watchAsOptions,
  positions,
  filteredPositions,
  keyAccount,
  isValidBranch,
  canSelectArea,
  canSelectBranch,
  showGoalTypeFilter,
  showViewAsFilter,
  handleAreaChange,
  handleBranchChange,
  handleSaleChange,
  handleFilterChange,
  handlePageChange,
  handleExport,
  reload,
} = useErrorTargetProgressPageV2()

// Date range selection
const selectedDates = ref<Date[] | null>(null)

const updateDateRange = (dates: Date[] | null) => {
  if (dates && dates.length === 2) {
    const startDate = new Date(dates[0])
    const endDate = new Date(dates[1])
    const formatDate = (d: Date) => d.toISOString().split('T')[0]
    filters.dateRange = [formatDate(startDate), formatDate(endDate)]
  }
}

// Initialize selectedDates from filters
const initializeSelectedDates = () => {
  if (filters.dateRange && filters.dateRange.length === 2) {
    selectedDates.value = [
      new Date(filters.dateRange[0]),
      new Date(filters.dateRange[1]),
    ]
  }
}

onMounted(() => {
  initializeSelectedDates()
})
</script>

<template>
  <div class="space-y-6 py-3 sm:py-4">
    <!-- Filters Panel -->
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
        <h2 class="text-lg font-semibold">Bộ lọc</h2>
      </div>

      <div class="p-6">
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <!-- Area Select -->
          <div v-if="canSelectArea" class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Chọn Khu vực</label>
            <select
              v-model.number="filters.areaId"
              @change="handleAreaChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="undefined">-- Chọn khu vực --</option>
              <option v-for="item in areas" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Branch Select -->
          <div v-if="canSelectBranch" class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Chọn văn phòng</label>
            <select
              v-model.number="filters.branchId"
              @change="handleBranchChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="undefined">-- Chọn văn phòng --</option>
              <option v-for="item in branches" :key="item.id" :value="item.id">
                {{ item.nameAlias || item.name_alias || item.name }}
              </option>
            </select>
          </div>

          <!-- Sale/Staff Select -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Chọn nhân sự muốn xem</label>
            <select
              v-model.number="filters.saleId"
              @change="handleSaleChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="null">-- Chọn nhân sự --</option>
              <option v-for="user in childUsers" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- Watch As Select -->
          <div v-if="showViewAsFilter" class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Xem theo</label>
            <select
              v-model.number="filters.viewAs"
              @change="handleFilterChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="undefined">-- Chọn --</option>
              <option v-for="item in watchAsOptions" :key="item.id" :value="item.id">
                {{ item.value }}
              </option>
            </select>
          </div>

          <!-- Position Select -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Chọn chức vụ</label>
            <select
              v-model.number="filters.accountTypeId"
              @change="handleFilterChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="undefined">-- Chọn --</option>
              <option v-for="item in filteredPositions" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Error Type Select -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Chọn loại lỗi</label>
            <select
              v-model.number="filters.typeError"
              @change="handleFilterChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="undefined">-- Chọn --</option>
              <option v-for="item in errorTypes" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Goal Type Select -->
          <div v-if="showGoalTypeFilter" class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Chọn loại mục tiêu</label>
            <select
              v-model.number="filters.goalType"
              @change="handleFilterChange"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="undefined">-- Chọn --</option>
              <option v-for="item in goalTypes" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div class="md:col-span-1">
            <label class="mb-2 block text-sm font-medium">Khoảng thời gian</label>
            <Calendar
              v-model="selectedDates"
              selection-mode="range"
              :inline="false"
              date-format="dd/mm/yy"
              placeholder="Từ ngày - Đến ngày"
              :show-other-months="false"
              :number-of-months="1"
              @update:model-value="updateDateRange"
              class="w-full"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex gap-2">
          <button
            @click="handleExport"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <i class="fas fa-download mr-2"></i>
            Export
          </button>
          <button
            @click="reload"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <i class="fas fa-redo mr-2"></i>
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Error Cards Summary -->
    <div v-if="summaryData.length > 0" class="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
      <div class="space-y-6">
        <div v-for="(item, index) in summaryData" :key="index">
          <ErrorCard :response-error="item" />
        </div>
      </div>
    </div>

    <!-- Table Panel -->
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
        <h2 class="text-lg font-semibold">Danh sách lỗi tiến độ mục tiêu</h2>
      </div>

      <div class="p-6">
        <div v-if="!isValidBranch" class="rounded bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-800">
          Bạn chưa chọn cơ sở hoặc bạn không ở cơ sở nào cả
        </div>

        <ErrorTargetProgressTable
          v-else
          :data="tableData"
          :loading="loading"
          :current-page="currentPage.value"
          :total-records="pagination.total"
          :page-size="pagination.pageSize"
          @page-change="handlePageChange"
          @row-click="(row) => console.log('Row clicked:', row)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
