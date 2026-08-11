<script setup lang="ts">
import { computed } from 'vue'
import { ACCOUNT_TYPES, POSITION_RANKS } from '../constants'

interface Props {
  loading: boolean
  isValidBranch: boolean
  reportData: any
  getTotalLevel: (position: string) => number
  getStaffCount: (position: string) => number | Record<string, number>
}

const props = defineProps<Props>()

const getPositionStaff = (position: string) => {
  const data = props.getStaffCount(position)
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

const totalInYear = computed(() => {
  const gdvp = (props.getTotalLevel(ACCOUNT_TYPES.GDVP) as number) ?? 0
  const saleLead = (props.getTotalLevel(ACCOUNT_TYPES.SALE_LEADER) as number) ?? 0
  const saleMember = (props.getTotalLevel(ACCOUNT_TYPES.SALE_MEMBER) as number) ?? 0
  const saleInternValue = props.getStaffCount(ACCOUNT_TYPES.SALE_INTERN)
  const saleIntern = typeof saleInternValue === 'number' ? saleInternValue : 0
  return gdvp + saleLead + saleMember + saleIntern
})
</script>

<template>
  <div v-if="loading" class="flex justify-center py-8">
    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
  </div>
  <div v-else-if="!isValidBranch" class="rounded bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-800">
    Bạn chưa chọn cơ sở hoặc bạn không ở cơ sở nào cả 3
  </div>
  <div v-else class="overflow-x-auto">
    <table class="w-full border-collapse border border-slate-300 text-sm dark:border-slate-600">
      <thead>
        <tr class="bg-slate-100 dark:bg-slate-800">
          <th class="border border-slate-300 px-4 py-2 text-left dark:border-slate-600">Mảng</th>
          <th class="border border-slate-300 px-4 py-2 text-left dark:border-slate-600">Vị trí</th>
          <th class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">Số lượng</th>
        </tr>
      </thead>
      <tbody>
        <!-- Sales Intern Section -->
        <tr>
          <td rowspan="2" class="border border-slate-300 px-4 py-2 dark:border-slate-600">
            Đội kinh doanh
          </td>
          <td colspan="2" class="border border-slate-300 bg-slate-200 px-4 py-2 text-center font-medium dark:border-slate-600 dark:bg-slate-700">
            Sales Intern
          </td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">Intern</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getPositionStaff(ACCOUNT_TYPES.SALE_INTERN) || 0 }}
          </td>
        </tr>

        <!-- Sales Section -->
        <tr>
          <td colspan="2" class="border border-slate-300 bg-slate-200 px-4 py-2 text-center font-medium dark:border-slate-600 dark:bg-slate-700">
            Sales
          </td>
        </tr>
        <tr v-for="rank in POSITION_RANKS" :key="`sales-${rank}`">
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">{{ rank }}</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getPositionRankCount(ACCOUNT_TYPES.SALE_MEMBER, rank) }}
          </td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">Tất cả cấp bậc</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getTotalLevel(ACCOUNT_TYPES.SALE_MEMBER) ?? 0 }}
          </td>
        </tr>

        <!-- Sales Leader Section -->
        <tr>
          <td colspan="2" class="border border-slate-300 bg-slate-200 px-4 py-2 text-center font-medium dark:border-slate-600 dark:bg-slate-700">
            Sales Leader
          </td>
        </tr>
        <tr v-for="rank in POSITION_RANKS" :key="`leader-${rank}`">
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">{{ rank }}</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getPositionRankCount(ACCOUNT_TYPES.SALE_LEADER, rank) }}
          </td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">Tất cả cấp bậc</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getTotalLevel(ACCOUNT_TYPES.SALE_LEADER) ?? 0 }}
          </td>
        </tr>

        <!-- Director Section -->
        <tr>
          <td colspan="2" class="border border-slate-300 bg-slate-200 px-4 py-2 text-center font-medium dark:border-slate-600 dark:bg-slate-700">
            Giám đốc văn phòng
          </td>
        </tr>
        <tr v-for="rank in POSITION_RANKS" :key="`director-${rank}`">
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">{{ rank }}</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getPositionRankCount(ACCOUNT_TYPES.GDVP, rank) }}
          </td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-4 py-2 text-center dark:border-slate-600">Tất cả cấp bậc</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ getTotalLevel(ACCOUNT_TYPES.GDVP) ?? 0 }}
          </td>
        </tr>

        <!-- Total Row -->
        <tr class="bg-yellow-200 dark:bg-yellow-900">
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            Tổng
          </td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ totalInYear }}
          </td>
        </tr>

        <!-- Consultant Row -->
        <tr>
          <td class="border border-slate-300 px-4 py-2 dark:border-slate-600">Tư vấn viên</td>
          <td class="border border-slate-300 px-4 py-2 dark:border-slate-600">TTV</td>
          <td class="border border-slate-300 px-4 py-2 text-center font-semibold dark:border-slate-600">
            {{ reportData.pluralities?.tvv || 0 }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
