<script setup lang="ts">
import type { ProgressLevelItemApi } from '../models/progress-level.model'

interface Props {
  items: ProgressLevelItemApi[]
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
})

const levelOrder = ['trainee', 'junior1', 'junior2', 'member1', 'member2', 'senior1', 'senior2']
const levelLabels = ['Trainee', 'Jr.1', 'Jr.2', 'Mb.1', 'Mb.2', 'Sr.1', 'Sr.2']

function convertToRoman(num: number | undefined): string {
  if (!num) return ''
  const map: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }
  return map[num] || String(num)
}

function getRowKey(row: ProgressLevelItemApi): string {
  return row.id || `${row.userId}-${row.quarter}-${row.year}`
}

function overallWidth(level: string | undefined): number {
  if (!level) return 0
  const normalized = level.toLowerCase().trim()
  const levelName = normalized.match(/(senior|junior|member|trainee)/)?.[1]
  const number = normalized.match(/[12]/)?.[0]
  const normalizedLevel = levelName === 'trainee' ? 'trainee' : `${levelName}${number || '2'}`
  const idx = Math.max(0, levelOrder.indexOf(normalizedLevel))
  return ((idx + 0.5) / levelOrder.length) * 100
}

function getPointNeeded(item: ProgressLevelItemApi): number {
  const sum = (item.kraScore ?? 0) + (item.meetingPoints ?? 0) + (item.expPoints ?? 0)
  return Math.max(0, (item.requestedLevel?.score ?? 0) - sum)
}

function rankBadgeClass(rank: number | undefined): string {
  if (!rank) return 'bg-gray-100 text-gray-400'
  if (rank === 1) return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-300'
  if (rank === 2) return 'bg-slate-100 text-slate-600 ring-1 ring-slate-300'
  if (rank === 3) return 'bg-orange-50 text-orange-700 ring-1 ring-orange-300'
  return 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
}

function rankIcon(rank: number | undefined): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}
</script>

<template>
  <div class="w-full">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="text-white" style="background: linear-gradient(90deg, #7c3aed 0%, #4338ca 100%)">
            <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Top Team</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Thời gian</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Team</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Điểm EXP</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Tổng điểm</th>
            <th class="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">Top Công ty</th>
            <th class="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Level Progress</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Loading state -->
          <tr v-if="props.loading">
            <td colspan="7" class="px-4 py-14 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"></div>
                <span class="text-sm text-gray-400">Đang tải dữ liệu...</span>
              </div>
            </td>
          </tr>
          <!-- Empty state -->
          <tr v-else-if="props.items.length === 0">
            <td colspan="7" class="px-4 py-14 text-center">
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
            <!-- Top Team -->
            <td class="px-4 py-4">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
                :class="rankBadgeClass(item.topTeam?.rank)"
              >
                <span v-if="item.topTeam?.rank && item.topTeam.rank <= 3">{{ rankIcon(item.topTeam.rank) }}</span>
                <span v-if="item.topTeam?.rank">#{{ item.topTeam.rank }}</span>
                <span v-else>—</span>
              </span>
            </td>
            <!-- Thời gian -->
            <td class="px-4 py-4 text-center">
              <span class="rounded-lg bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
                Q{{ convertToRoman(item.quarter) }}/{{ item.year }}
              </span>
            </td>
            <!-- Team -->
            <td class="px-4 py-4 text-center text-sm text-gray-600">
              {{ item.department?.name || '—' }}
            </td>
            <!-- EXP -->
            <td class="px-4 py-4 text-center">
              <span class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                {{ item.expPoints ?? 0 }}
              </span>
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
            <!-- Top Công ty -->
            <td class="px-4 py-4 text-center">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
                :class="rankBadgeClass(item.topCompany?.rank)"
              >
                <span v-if="item.topCompany?.rank && item.topCompany.rank <= 3">{{ rankIcon(item.topCompany.rank) }}</span>
                <span v-if="item.topCompany?.rank">#{{ item.topCompany.rank }}</span>
                <span v-else>—</span>
              </span>
            </td>
            <!-- Level Progress -->
            <td class="px-4 py-4">
              <div class="flex min-w-64 flex-col gap-2">
                <!-- Progress track -->
                <div
                  class="relative h-6 cursor-default overflow-hidden rounded-full bg-gray-100 shadow-inner"
                  :title="getPointNeeded(item) > 0 ? `Cần thêm ${getPointNeeded(item)} điểm để lên level` : 'Đã đủ điểm lên level!'"
                >
                  <div
                    class="absolute left-0 top-0 flex h-full items-center justify-end rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 pr-2.5 transition-all duration-700 bg-[#663399]"
                    :style="{ width: `${Math.max(0, Math.min(100, overallWidth(item.currentLevel?.level)))}%` }"
                  >
                    <span class="whitespace-nowrap text-[10px] font-bold leading-none text-white">
                      {{ item.currentLevel?.level || '' }}
                    </span>
                  </div>
                  <!-- Milestone dividers -->
                  <div
                    v-for="i in levelOrder.length - 1"
                    :key="i"
                    class="absolute top-0 h-full w-px bg-white/50"
                    :style="{ left: `${(i / levelOrder.length) * 100}%` }"
                  ></div>
                </div>
                <!-- Level labels -->
                <div class="flex justify-between px-0.5">
                  <span v-for="label in levelLabels" :key="label" class="text-[9px] text-gray-400">
                    {{ label }}
                  </span>
                </div>
                <!-- Status line -->
                <div class="flex items-center justify-between">
                  <span class="text-xs font-medium text-gray-500">{{ item.currentLevel?.level || '—' }}</span>
                  <span v-if="getPointNeeded(item) > 0" class="text-xs font-medium text-amber-600">
                    +{{ getPointNeeded(item) }} điểm nữa
                  </span>
                  <span v-else class="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Đủ điểm
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
