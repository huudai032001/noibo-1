<script setup lang="ts">
import { computed } from 'vue'
import { PROGRESS_LEVEL_APPROVE_TYPE_MAP } from '../constants'
import type { ProgressLevelItemApi } from '../models/progress-level.model'

interface Props {
  items: ProgressLevelItemApi[]
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
})

const emit = defineEmits<{
  'load-minus-point': [item: ProgressLevelItemApi]
}>()

function convertToRoman(num: number | undefined): string {
  if (!num) return ''
  const map: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
  return map[num] || String(num)
}

function getRowKey(row: ProgressLevelItemApi): string {
  return row.id || `${row.userId}-${row.quarter}-${row.year}`
}

const latestRow = computed(() => {
  return props.items && props.items.length > 0 ? props.items[0] : null
})

const targetScore = computed(() => latestRow.value?.requestedLevel?.score || 140)

const requiredExp = computed(() => {
  if (!latestRow.value) return 30
  const { kraScore = 0, meetingPoints = 0, expPoints = 0, totalMinusPoint = 0 } = latestRow.value
  const currentTotal = kraScore + meetingPoints + expPoints - totalMinusPoint
  return Math.max(0, Math.round(targetScore.value - currentTotal))
})

const progressPercent = computed(() => {
  if (!latestRow.value) return 0
  const { kraScore = 0, meetingPoints = 0, expPoints = 0, totalMinusPoint = 0 } = latestRow.value
  const currentTotal = kraScore + meetingPoints + expPoints - totalMinusPoint
  return Math.min(100, Math.round((currentTotal / targetScore.value) * 100))
})

function approveTypeLabel(type: number | undefined): string {
  return PROGRESS_LEVEL_APPROVE_TYPE_MAP[type as keyof typeof PROGRESS_LEVEL_APPROVE_TYPE_MAP] || '—'
}

function approveBadgeClass(type: number | undefined): string {
  if (type === 1) return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  if (type === 2) return 'bg-red-50 text-red-700 ring-1 ring-red-200'
  if (type === 3) return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  return 'bg-gray-50 text-gray-500 ring-1 ring-gray-200'
}

function handleLoadMinusPoint(item: ProgressLevelItemApi): void {
  emit('load-minus-point', item)
}
</script>

<template>
  <div class="w-full">
    <!-- Motivational Banner -->
    <div
      v-if="!props.loading && props.items.length > 0"
      class="relative overflow-hidden border-b border-purple-100 px-5 py-4"
      style="background: linear-gradient(90deg, #f5f3ff 0%, #eef2ff 50%, #f5f3ff 100%)"
    >
      <div class="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-purple-200/30"></div>
      <div class="flex items-start gap-3">
        <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
          <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <p v-if="requiredExp !== 0" class="text-sm font-medium text-gray-700">
            Tiến về đích! Hãy chinh phục
            <strong class="font-bold text-purple-700">{{ targetScore }} điểm</strong>,
            tối thiểu <strong class="font-bold text-purple-700">{{ requiredExp }} điểm</strong> nữa để bứt phá lên level mới.
            <span class="text-gray-500">Mỗi nỗ lực đang viết nên hành trình rực rỡ của bạn!</span>
          </p>
          <p v-else class="text-sm font-semibold text-emerald-700">
            Chúc mừng! Bạn đã về đích — mỗi nỗ lực đang viết nên hành trình rực rỡ của bạn!
          </p>
          <!-- Mini progress bar -->
          <div class="mt-2 flex items-center gap-3">
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-purple-100">
              <div
                class="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
            <span class="text-xs font-semibold text-purple-700">{{ progressPercent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="text-white" style="background: linear-gradient(90deg, #7c3aed 0%, #4338ca 100%)">
            <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Thời gian</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Team</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Level hiện tại</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Điểm KRA</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Điểm họp</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Điểm EXP</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Điểm trừ</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Tổng điểm</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Kết quả</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Level mới</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Mục tiêu tiếp theo</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Loading state -->
          <tr v-if="props.loading">
            <td colspan="11" class="px-4 py-14 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"></div>
                <span class="text-sm text-gray-400">Đang tải dữ liệu...</span>
              </div>
            </td>
          </tr>
          <!-- Empty state -->
          <tr v-else-if="props.items.length === 0">
            <td colspan="11" class="px-4 py-14 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <svg class="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p class="text-sm text-gray-400">Không có dữ liệu trong năm này</p>
              </div>
            </td>
          </tr>
          <!-- Data rows -->
          <tr
            v-for="(item, idx) in props.items"
            :key="getRowKey(item)"
            class="transition-colors duration-150 hover:bg-purple-50/40"
            :class="idx % 2 !== 0 ? 'bg-gray-50/50' : 'bg-white'"
          >
            <!-- Thời gian -->
            <td class="px-4 py-4">
              <span class="rounded-lg bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
                Q{{ convertToRoman(item.quarter) }}/{{ item.year }}
              </span>
            </td>
            <!-- Team -->
            <td class="px-4 py-4 text-center text-sm text-gray-600">{{ item.department?.name || '—' }}</td>
            <!-- Level hiện tại -->
            <td class="px-4 py-4 text-center">
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {{ item.currentLevel?.level || '—' }}
              </span>
            </td>
            <!-- Điểm KRA -->
            <td class="px-4 py-4 text-center">
              <span
                class="text-sm font-semibold"
                :class="!item.kraScore || item.kraScore < 10 ? 'text-red-500' : 'text-emerald-600'"
                title="Tổng điểm / điểm tối đa của tiêu chí"
              >
                {{ item.kraScore ? parseInt(String(item.kraScore)) : 0 }}
                <span class="font-normal text-gray-400">/100</span>
              </span>
            </td>
            <!-- Điểm họp -->
            <td class="px-4 py-4 text-center">
              <span
                class="text-sm font-semibold"
                :class="!item.meetingPoints || item.meetingPoints < 10 ? 'text-red-500' : 'text-emerald-600'"
              >
                {{ item.meetingPoints ?? 0 }}
                <span class="font-normal text-gray-400">/10</span>
              </span>
            </td>
            <!-- Điểm EXP -->
            <td class="px-4 py-4 text-center">
              <span class="text-sm font-semibold text-indigo-600">{{ item.expPoints ?? 0 }}</span>
            </td>
            <!-- Điểm trừ -->
            <td class="px-4 py-4 text-center">
              <div>
                <button
                  v-if="item.totalMinusPoint && item.totalMinusPoint > 0"
                  type="button"
                  class="cursor-pointer rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-100"
                  @click="handleLoadMinusPoint(item)"
                >
                  −{{ item.totalMinusPoint }}
                </button>
                <span v-else class="text-sm font-semibold text-emerald-600">0</span>

                <!-- Minus point detail -->
                <div
                  v-if="item.minusPoint && item.minusPoint.length > 0"
                  class="mt-2 overflow-hidden rounded-lg border border-red-100 bg-red-50 text-left"
                >
                  <div v-if="item._minusLoading" class="flex items-center justify-center gap-2 py-3">
                    <div class="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500"></div>
                    <span class="text-xs text-red-500">Đang tải...</span>
                  </div>
                  <table v-else class="w-full text-xs">
                    <thead>
                      <tr class="border-b border-red-200 bg-red-100">
                        <th class="px-2 py-1.5 text-left font-semibold text-red-700">Điểm</th>
                        <th class="px-2 py-1.5 text-left font-semibold text-red-700">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(mp, i) in item.minusPoint"
                        :key="i"
                        class="border-b border-red-100 last:border-b-0"
                      >
                        <td class="px-2 py-1.5 font-semibold text-red-600">{{ mp.point }}</td>
                        <td class="px-2 py-1.5 text-gray-600">{{ mp.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
            <!-- Tổng điểm -->
            <td class="px-4 py-4 text-center">
              <span
                v-if="item.topCompany?.totalScore"
                class="font-bold text-purple-700"
                title="Tổng điểm / điểm cần đạt để tăng level"
              >
                {{ parseInt(String(item.topCompany.totalScore)) }}
                <span class="font-normal text-gray-400">/{{ item.requestedLevel?.score }}</span>
              </span>
              <span v-else class="font-semibold text-red-500">
                0<span class="font-normal text-gray-400">/{{ item.requestedLevel?.score }}</span>
              </span>
            </td>
            <!-- Kết quả -->
            <td class="px-4 py-4 text-center">
              <span
                v-if="approveTypeLabel(item.approveType) !== '—'"
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                :class="approveBadgeClass(item.approveType)"
              >
                <!-- Up arrow -->
                <svg v-if="item.approveType === 1" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <!-- Down arrow -->
                <svg v-else-if="item.approveType === 2" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <!-- Minus -->
                <svg v-else-if="item.approveType === 3" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                </svg>
                {{ approveTypeLabel(item.approveType) }}
              </span>
              <span v-else class="text-sm text-gray-400">—</span>
            </td>
            <!-- Level mới -->
            <td class="px-4 py-4 text-center">
              <span
                v-if="item.requestedLevel?.level"
                class="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200"
              >
                {{ item.requestedLevel.level }}
              </span>
              <span v-else class="text-sm text-gray-400">—</span>
            </td>
            <!-- Mục tiêu tiếp theo -->
            <td class="px-4 py-4 text-center">
              <span
                v-if="item.levelTarget?.level"
                class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200"
              >
                {{ item.levelTarget.level }}
              </span>
              <span v-else class="text-sm text-gray-400">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
