<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHumanResourcePage } from './composables/use-human-resource-page'
import ZingChartVue from 'zingchart-vue'
import 'zingchart'
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

const page = useHumanResourcePage()

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
  chartConfig,
  chartDatatest,
} = page

onMounted(async () => {
  await page.initializePage()
})

const currentYear = new Date().getFullYear()

const expandedRoles = ref<Record<string, boolean>>({
  sales_intern: false,
  sales: true,
  sales_leader: false,
  gdvp: false,
})

const toggleRole = (role: string) => {
  expandedRoles.value[role] = !expandedRoles.value[role]
}

const ACCOUNT_TYPES = {
  SALE_INTERN: 4,
  SALE_MEMBER: 3,
  SALE_LEADER: 1,
  GDVP: 'GDVP',
}

const POSITION_RANKS = ['Intern', 'Rookie', 'Junior', 'Executive', 'Pro', 'Master']

const roleGroups = [
  { key: 'sales_intern', label: 'Sales Intern' },
  { key: 'sales', label: 'Sales' },
  { key: 'sales_leader', label: 'Sales Leader' },
  { key: 'gdvp', label: 'Giám đốc văn phòng' },
]

const getPositionStaff = (position: string) => {
  const data = getStaffCount(position)
  if (typeof data === 'object') {
    return data
  }
  return data ?? 0
}

const getPositionRankCount = (position: string, rank: string): number => {
  const data = getPositionStaff(position)
  if (typeof data === 'object' && rank in data) {
    return (data as Record<string, number>)[rank] ?? 0
  }
  return 0
}

const totalByRole = (role: string): number => {
  if (role === 'sales_intern') return getPositionStaff(ACCOUNT_TYPES.SALE_INTERN) as number
  if (role === 'sales') return getTotalLevel(ACCOUNT_TYPES.SALE_MEMBER) ?? 0
  if (role === 'sales_leader') return getTotalLevel(ACCOUNT_TYPES.SALE_LEADER) ?? 0
  if (role === 'gdvp') return getTotalLevel(ACCOUNT_TYPES.GDVP) ?? 0
  return 0
}

const grandTotal = computed(() => {
  return (getTotalLevel(ACCOUNT_TYPES.GDVP) ?? 0) +
         (getTotalLevel(ACCOUNT_TYPES.SALE_LEADER) ?? 0) +
         (getTotalLevel(ACCOUNT_TYPES.SALE_MEMBER) ?? 0) +
         (getPositionStaff(ACCOUNT_TYPES.SALE_INTERN) as number || 0)
})

const rolePercent = (role: string): string => {
  const total = grandTotal.value
  if (total === 0) return '0'
  return ((totalByRole(role) / total) * 100).toFixed(1)
}

const levelsByRole = (role: string): string[] => {
  if (role === 'sales_intern') return ['Intern']
  return POSITION_RANKS
}

const countByRoleLevel = (role: string, level: string): number => {
  if (role === 'sales_intern') return getPositionRankCount(ACCOUNT_TYPES.SALE_INTERN, level)
  if (role === 'sales') return getPositionRankCount(ACCOUNT_TYPES.SALE_MEMBER, level)
  if (role === 'sales_leader') return getPositionRankCount(ACCOUNT_TYPES.SALE_LEADER, level)
  if (role === 'gdvp') return getPositionRankCount(ACCOUNT_TYPES.GDVP, level)
  return 0
}

const formatNumber = (num: number | string): string => {
  return Number(num).toLocaleString('vi-VN')
}

const resetFilters = () => {
  filters.year = null
  filters.branchId = null
  filters.areaId = null
  filters.salaryMechanismId = null
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- Left Panel: Staff Summary -->
    <div class="col-span-12 lg:col-span-5">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
          <h2 class="text-base font-medium text-slate-900 dark:text-white">
            Bảng báo cáo số lượng nhân sự hiện tại theo vị trí
          </h2>
        </div>

        <!-- Loading Bar -->
        <div v-if="loading" class="h-1 bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>

        <!-- Content -->
        <div class="p-5">
          <!-- Filters -->
          <div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 p-3 mb-4">
            <div class="grid grid-cols-12 items-center gap-3">
              <select
                v-if="keyAccount === 6"
                v-model.number="filters.areaId"
                @change="page.handleAreaChange()"
                class="col-span-12 md:col-span-4 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option :value="null">Chọn khu vực</option>
                <option v-for="item in areas" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>

              <Dropdown
                v-model="filters.salaryMechanismId"
                :options="mechanisms"
                optionLabel="name"
                @change="page.handleMechanismChange()"
                placeholder="Chọn cơ chế lương"
                checkmark
                :highlightOnSelect="false"
                class="col-span-4 md:w-14rem" />

            </div>
          </div>

          <!-- Loading Skeleton -->
          <div v-if="loading && !isValidBranch" class="space-y-3">
            <div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 animate-pulse">
              <div class="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/3"></div>
            </div>
            <div v-for="i in 4" :key="i" class="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 animate-pulse">
              <div class="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/4"></div>
            </div>
          </div>

          <!-- Content -->
          <div v-else class="space-y-3">
            <!-- Total Card -->
            <div class="rounded-lg border-2 border-amber-300 dark:border-amber-600 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/20 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <i class="fal fa-chart-pie text-amber-600 dark:text-amber-400"></i>
                    <p class="text-sm font-bold text-amber-900 dark:text-amber-200">Tổng nhân sự đội kinh doanh</p>
                  </div>
                  <p class="text-xs text-amber-700 dark:text-amber-300 ml-6">Phân bổ theo từng vị trí và cấp bậc</p>
                </div>
                <div class="text-right">
                  <span class="text-3xl font-bold text-amber-900 dark:text-amber-100">{{ formatNumber(grandTotal) }}</span>
                  <p class="text-xs text-amber-700 dark:text-amber-300 mt-1">nhân sự</p>
                </div>
              </div>
            </div>

            <!-- Role Groups -->
            <div class="space-y-2">
              <div
                v-for="group in roleGroups"
                :key="group.key"
                class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/50"
              >
                <button
                  type="button"
                  class="flex w-full items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 px-4 py-3.5 text-left transition hover:from-blue-50 hover:to-blue-100 dark:hover:from-slate-600 dark:hover:to-slate-500 border-l-4 border-blue-500 hover:border-blue-600 focus:outline-none"
                  @click="toggleRole(group.key)"
                >
                  <div class="flex-1">
                    <p class="font-bold text-slate-900 dark:text-white text-base">{{ group.label }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <i class="fal fa-user-circle mr-1"></i>
                      {{ rolePercent(group.key) }}% tổng nhân sự
                    </p>
                  </div>
                  <div class="flex items-center gap-4 ml-4">
                    <div class="text-right">
                      <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ formatNumber(totalByRole(group.key)) }}
                      </span>
                    </div>
                    <div class="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-700 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer">
                      <i :class="['pi', 'text-blue-600', 'dark:text-blue-400', 'text-lg', expandedRoles[group.key] ? 'pi-angle-up' : 'pi-angle-down']"></i>
                    </div>
                  </div>
                </button>

                <!-- Expanded Content -->
                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-96"
                  leave-active-class="transition-all duration-300"
                  leave-from-class="opacity-100 max-h-96"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="expandedRoles[group.key]" class="border-t border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div class="px-4 py-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-700/50 dark:to-slate-700/30">
                      <div class="space-y-2">
                        <div
                          v-for="level in levelsByRole(group.key)"
                          :key="`${group.key}-${level}`"
                          class="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-default"
                        >
                          <div class="flex items-center gap-3 flex-1">
                            <div class="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:scale-150 transition-transform"></div>
                            <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">{{ level }}</span>
                          </div>
                          <span class="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md">
                            {{ formatNumber(countByRoleLevel(group.key, level)) }}
                          </span>
                        </div>

                        <!-- Total Row -->
                        <div
                          v-if="group.key !== 'sales_intern'"
                          class="mt-3 flex items-center justify-between px-4 py-3 rounded-lg border-2 border-amber-300 dark:border-amber-600 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20"
                        >
                          <div class="flex items-center gap-3">
                            <i class="fal fa-check-circle text-amber-600 dark:text-amber-400 text-base"></i>
                            <span class="text-sm font-bold text-amber-900 dark:text-amber-300">Tất cả cấp bậc</span>
                          </div>
                          <span class="text-lg font-bold text-amber-900 dark:text-amber-200 bg-amber-200 dark:bg-amber-900/50 px-3 py-1 rounded-lg">
                            {{ formatNumber(totalByRole(group.key)) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: Chart and Stats -->
    <div class="col-span-12 lg:col-span-7">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
          <h2 class="text-base font-medium text-slate-900 dark:text-white">
            Biểu đồ báo cáo tình hình biến động nhân sự văn phòng năm: {{ filters.year || currentYear }}
          </h2>
        </div>

        <!-- Loading Bar -->
        <div v-if="loading" class="h-1 bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse"></div>

        <!-- Content -->
        <div class="p-5">
          <!-- Filters and Reset Button -->
          <div class="grid grid-cols-12 gap-4 mb-4">
            <Calendar
              v-model="filters.year"
              view="year"
              dateFormat="yy"
              @change="page.handleYearChange()"
              placeholder="Chọn năm"
              class="col-span-4" />
<!--            <button-->
<!--              @click="resetFilters"-->
<!--              class="col-span-12 md:col-span-6 px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium text-sm transition flex items-center justify-center gap-2"-->
<!--            >-->
<!--              <i class="fal fa-times-circle"></i>-->
<!--              Xóa lọc-->
<!--            </button>-->
          </div>

          <!-- Stats Cards -->
          <div class="col-span-12 grid grid-cols-12 gap-3 mb-4">
            <template v-if="loading && !isValidBranch">
              <div v-for="i in 3" :key="i" class="col-span-12 md:col-span-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 p-3 animate-pulse">
                <div class="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
                <div class="h-6 bg-slate-300 dark:bg-slate-600 rounded w-1/3"></div>
              </div>
            </template>
            <template v-else>
              <div class="col-span-12 md:col-span-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 p-3">
                <div class="text-xs font-medium text-slate-500 dark:text-slate-400">Tổng nhân sự hiện tại</div>
                <div class="text-lg font-semibold text-slate-900 dark:text-white mt-1">{{ formatNumber(grandTotal) }}</div>
              </div>
              <div class="col-span-12 md:col-span-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 p-3">
                <div class="text-xs font-medium text-slate-500 dark:text-slate-400">Tuyển thêm</div>
                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">150</div>
              </div>
              <div class="col-span-12 md:col-span-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 p-3">
                <div class="text-xs font-medium text-slate-500 dark:text-slate-400">Nghỉ việc</div>
                <div class="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">133</div>
              </div>
            </template>
          </div>

          <!-- Chart -->
          <div class="col-span-12">
            <div v-if="loading && !isValidBranch" class="h-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div v-else-if="isValidBranch" class="w-full" style="height: 380px">
              <ZingChartVue
                id="humanResourceChart"
                :data="chartDatatest"
                width="100%"
                height="380"
              />
            </div>
            <div
              v-else
              class="flex h-96 items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 text-sm text-slate-500 dark:text-slate-400"
            >
              Chọn văn phòng để xem biểu đồ
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  @apply transition-all duration-200;
}

input:focus {
  @apply border-blue-500 ring-2 ring-blue-500/10;
}

select {
  @apply transition-all duration-200;
}

select:focus {
  @apply border-blue-500 ring-2 ring-blue-500/10;
}

button {
  @apply transition-all duration-200;
}

/* Dot indicator animation */
.dot-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
