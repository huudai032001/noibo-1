<script setup lang="ts">
import { computed } from 'vue'
import type { LevelEmployeeItemApi } from '../models/level-employee.model'
import { LEVEL_EMPLOYEE_CRITERIA_TYPE_MAP, LEVEL_EMPLOYEE_CRITERIA_TYPE_COLOR } from '../constants'

interface Props {
  items: LevelEmployeeItemApi[]
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'toggle-expand': [id: number | undefined]
  'view-detail': [id: number | undefined]
}>()

function handleToggle(id: number | undefined): void {
  emit('toggle-expand', id)
}

function handleViewDetail(id: number | undefined): void {
  emit('view-detail', id)
}

function getRowLevels(row: LevelEmployeeItemApi) {
  const map = new Map()
  ;(row?.criterias || []).forEach((c) => {
    ;(c?.score_standards || []).forEach((s) => {
      const level = s?.level
      if (!level) return
      const key = level.id ?? level.level
      if (!map.has(key)) {
        map.set(key, {
          id: level.id ?? null,
          level: level.level ?? '',
          name: level.name ?? '',
        })
      }
    })
  })
  return Array.from(map.values()).sort((a, b) => Number(a.level) - Number(b.level))
}

function getScoreByLevel(criteria: any, level: any) {
  const found = (criteria?.score_standards || []).find(
    (s: any) => (s?.level?.id ?? s?.level?.level) === (level?.id ?? level?.level),
  )
  if (!found) return '—'
  const score = found?.score_standard
  return score === null || score === undefined || score === '' ? '—' : `${score} %`
}

function truncateText(text: string, maxLength = 40): string {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function formatEmployeeId(id: number | undefined): string {
  return id ? `${id + 100000}` : '—'
}
</script>

<template>
  <div class="overflow-x-auto">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full border-4 border-gray-300 border-t-purple-600 h-8 w-8"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0" class="px-6 py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="mt-2 text-gray-500">Không có dữ liệu phù hợp</p>
    </div>

    <!-- Table -->
    <table v-else class="w-full border-collapse">
      <colgroup>
        <col class="w-1/3" />
        <col class="w-1/6" />
        <col class="w-1/6" />
        <col class="w-1/6" />
      </colgroup>
      <thead>
        <tr class="border-b border-gray-200 bg-gray-50">
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nhân sự</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số điện thoại</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vị trí</th>
          <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Chi tiết</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in items" :key="row.id">
          <tr class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex flex-col gap-1">
                <button
                  @click="handleViewDetail(row.id)"
                  class="text-left font-medium text-purple-600 transition-colors hover:text-purple-700 hover:underline"
                >
                  {{ row.name }}
                </button>
                <span class="text-xs text-gray-500">{{ formatEmployeeId(row.id) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span v-if="row.phone" class="text-sm text-gray-600">{{ row.phone }}</span>
              <span v-else class="text-sm italic text-gray-400">Chưa có</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-600">
                {{ row.profile?.account_type?.name || '—' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <button
                @click="handleToggle(row.id)"
                :disabled="!row.criterias || row.criterias.length === 0"
                :class="[
                  'inline-flex items-center justify-center rounded-lg p-2 transition-colors',
                  row._expanded
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-400 hover:text-purple-600',
                  !row.criterias || row.criterias.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                ]"
                title="Xem chi tiết"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Expanded row -->
          <tr v-if="row._expanded && row.criterias && row.criterias.length > 0" class="bg-gray-50">
            <td colspan="4" class="px-6 py-6">
              <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table class="w-full">
                  <colgroup>
                    <col class="w-48" />
                    <col class="w-32" />
                    <col class="w-32" />
                  </colgroup>
                  <thead>
                    <tr class="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                      <th class="sticky left-0 z-10 bg-purple-50 px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Tiêu chí
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nhiệm vụ</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Loại chỉ số</th>
                      <th
                        v-for="(lv, lvi) in getRowLevels(row)"
                        :key="`level-${row.id}-${lv.id || lv.level || lvi}`"
                        :class="[
                          'px-4 py-3 text-center text-xs font-semibold',
                          row.latest_level_approval_request?.current_level?.id === lv.id
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'text-gray-700',
                        ]"
                      >
                        Bậc {{ lv.level }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="c in row.criterias" :key="c.id" class="border-b border-gray-100 hover:bg-gray-50">
                      <td class="sticky left-0 z-10 bg-purple-50 px-4 py-3">
                        <span class="text-xs font-medium text-purple-700" :title="c.name">
                          {{ truncateText(c.name) }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <span class="text-xs text-gray-600">{{ c.task || '—' }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <span
                          :class="[
                            'inline-block rounded-full px-2 py-1 text-xs font-medium',
                            LEVEL_EMPLOYEE_CRITERIA_TYPE_COLOR[c.type as 1 | 2] || '',
                          ]"
                        >
                          {{ LEVEL_EMPLOYEE_CRITERIA_TYPE_MAP[c.type as 1 | 2] || 'N/A' }}
                        </span>
                      </td>
                      <td
                        v-for="(lv, lvi) in getRowLevels(row)"
                        :key="`score-${c.id}-${lv.id || lv.level || lvi}`"
                        :class="[
                          'px-4 py-3 text-center text-sm font-semibold',
                          row.latest_level_approval_request?.current_level?.id === lv.id
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'text-gray-600',
                        ]"
                      >
                        {{ getScoreByLevel(c, lv) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
