<script setup lang="ts">
import { computed } from 'vue'

interface ErrorSummary {
  title: string
  type: number | null
  totalError: number
  totalErrorToday: number
  totalErrorForgetFill: number
  totalErrorNotFill: number
  totalErrorNotAchieve: number
  totalErrorTodayForgetFill: number
  totalErrorTodayNotFill: number
  totalErrorTodayNotAchieve: number
}

interface Props {
  responseError: ErrorSummary
}

defineProps<Props>()

// Determine background color based on whether there are errors
const getCardBgClass = (value: number) => {
  return value > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
}

const getTextColor = (value: number) => {
  return value > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
}
</script>

<template>
  <div>
    <div class="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
      {{ responseError.title }}
    </div>

    <div class="flex flex-wrap gap-3">
      <!-- Total Error -->
      <div :class="getCardBgClass(responseError.totalError)" class="flex flex-col rounded-2xl p-4">
        <span class="text-sm text-slate-600 dark:text-slate-400">Tổng số lỗi</span>
        <span class="mt-2 text-2xl font-bold" :class="getTextColor(responseError.totalError)">
          {{ responseError.totalError }}
        </span>
      </div>

      <!-- Forget Fill (not shown for daily goals) -->
      <div
        v-if="responseError.title !== 'Mục tiêu ngày'"
        :class="getCardBgClass(responseError.totalErrorForgetFill)"
        class="flex flex-col rounded-2xl p-4"
      >
        <span class="text-sm text-slate-600 dark:text-slate-400">Lỗi quên điền</span>
        <span class="mt-2 text-2xl font-bold" :class="getTextColor(responseError.totalErrorForgetFill)">
          {{ responseError.totalErrorForgetFill }}
        </span>
      </div>

      <!-- Not Fill -->
      <div :class="getCardBgClass(responseError.totalErrorNotFill)" class="flex flex-col rounded-2xl p-4">
        <span class="text-sm text-slate-600 dark:text-slate-400">Lỗi Không điền</span>
        <span class="mt-2 text-2xl font-bold" :class="getTextColor(responseError.totalErrorNotFill)">
          {{ responseError.totalErrorNotFill }}
        </span>
      </div>

      <!-- Not Achieve -->
      <div :class="getCardBgClass(responseError.totalErrorNotAchieve)" class="flex flex-col rounded-2xl p-4">
        <span class="text-sm text-slate-600 dark:text-slate-400">Không đạt mục tiêu</span>
        <span class="mt-2 text-2xl font-bold" :class="getTextColor(responseError.totalErrorNotAchieve)">
          {{ responseError.totalErrorNotAchieve }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
div {
  word-wrap: break-word;
}
</style>
