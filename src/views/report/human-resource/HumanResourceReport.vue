<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHumanResourcePage } from './composables/use-human-resource-page'
import HumanResourceStaffTable from './components/HumanResourceStaffTable.vue'
import { zingChartTheme } from '@/utils/zingChartTheme'
import ZingChartVue from 'zingchart-vue'

const page = useHumanResourcePage()

// Destructure for easier template access
const {
  filters,
  branches,
  areas,
  mechanisms,
  loading,
  reportData,
  chartData,
  isFullTree,
  isFullDetail,
  isValidBranch,
  getStaffCount,
  getTotalLevel,
  keyAccount,
} = page

const chartRef = ref(null)

onMounted(async () => {
  await page.initializePage()
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="space-y-6 py-3 sm:py-4">
    <!-- Left Panel: Staff Count Table -->
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
        <h2 class="text-lg font-semibold">Bảng báo cáo số lượng nhân sự hiện tại theo vị trí</h2>
        <button
          @click="page.toggleFullTree()"
          class="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          :title="isFullTree ? 'Thu nhỏ' : 'Phóng to'"
        >
          <i class="fal" :class="{ 'fa-times': isFullTree, 'fa-expand': !isFullTree }"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Filters -->
        <div class="mb-6 grid gap-4" :class="keyAccount === 6 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'">
          <!-- Area Select (only for keyAccount === 6) -->
          <div v-if="keyAccount === 6">
            <label class="mb-2 block text-sm font-medium">Chọn Khu vực</label>
            <select
              v-model.number="filters.areaId"
              @change="page.handleAreaChange()"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="null">-- Chọn khu vực --</option>
              <option v-for="item in areas" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>

          <!-- Branch Select -->
          <div>
            <label class="mb-2 block text-sm font-medium">Chọn văn phòng</label>
            <select
              v-model.number="filters.branchId"
              @change="page.handleBranchChange()"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="null">-- Chọn văn phòng --</option>
              <option v-for="item in branches" :key="item.id" :value="item.id">
                {{ item.nameAlias || item.name }}
              </option>
            </select>
          </div>

          <!-- Salary Mechanism Select -->
          <div>
            <label class="mb-2 block text-sm font-medium">Chọn cơ chế lương</label>
            <select
              v-model.number="filters.salaryMechanismId"
              @change="page.handleMechanismChange()"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              <option :value="null">-- Chọn cơ chế --</option>
              <option v-for="item in mechanisms" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Staff Table -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        </div>
        <div v-else-if="!isValidBranch" class="rounded bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-800">
          Bạn chưa chọn cơ sở hoặc bạn không ở cơ sở nào cả 2
        </div>
        <div v-else class="overflow-x-auto">
          <HumanResourceStaffTable
            :loading="false"
            :is-valid-branch="isValidBranch"
            :report-data="reportData"
            :get-total-level="getTotalLevel"
            :get-staff-count="getStaffCount"
          />
        </div>
      </div>
    </div>

    <!-- Right Panel: Chart -->
    <div class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
        <h2 class="text-lg font-semibold">
          Biểu đồ báo cáo tình hình biến động nhân sự văn phòng năm:
          {{ filters.year || currentYear }}
        </h2>
        <button
          @click="page.toggleFullDetail()"
          class="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          :title="isFullDetail ? 'Thu nhỏ' : 'Phóng to'"
        >
          <i class="fal" :class="{ 'fa-times': isFullDetail, 'fa-expand': !isFullDetail }"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Chart Filter -->
        <div class="mb-6">
          <label class="mb-2 block text-sm font-medium">Chọn năm</label>
          <input
            v-model="filters.year"
            type="number"
            :min="2000"
            :max="currentYear"
            @change="page.handleYearChange()"
            placeholder="Chọn năm"
            class="w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>

        <!-- Chart Display -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        </div>
        <div v-else-if="!isValidBranch" class="rounded bg-slate-50 p-12 text-center text-slate-500 dark:bg-slate-800">
          Bạn chưa chọn cơ sở hoặc bạn không ở cơ sở nào cả 4
        </div>
        <div v-else style="height: 500px; width: 100%">
          <ZingChartVue
            id="humanResourceChart"
            ref="chartRef"
            :data="page.chartConfig"
            :theme="zingChartTheme"
            style="width: 100%; height: 100%"
          ></ZingChartVue>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
