<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { LevelEmployeeItemApi } from './models/level-employee.model'
import { fetchLevelEmployeeList } from './services/level-employee.service'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const employee = ref<LevelEmployeeItemApi | null>(null)
const loading = ref(false)
const employeeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id, 10) : id
})

async function fetchEmployee(): Promise<void> {
  loading.value = true
  try {
    const response = await fetchLevelEmployeeList({})
    const items = response.data || []
    const found = items.find((item) => item.id === employeeId.value)
    if (found) {
      employee.value = found
    } else {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không tìm thấy nhân viên',
        life: 3000,
      })
      router.back()
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Lỗi khi tải dữ liệu',
      life: 3000,
    })
    router.back()
  } finally {
    loading.value = false
  }
}

function goBack(): void {
  router.back()
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

onMounted(() => {
  void fetchEmployee()
})
</script>

<template>
  <div class="space-y-6 py-3 sm:py-4">
    <!-- Back Button & Header -->
    <div class="flex items-center gap-4">
      <button
        @click="goBack"
        class="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50"
        title="Quay lại"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-gray-900">Chi tiết nhân viên</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full border-4 border-gray-300 border-t-purple-600 h-8 w-8"></div>
    </div>

    <!-- Content -->
    <template v-else-if="employee">
      <!-- Employee Info Card -->
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="border-b border-gray-100 px-6 py-6">
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase text-gray-500">Tên nhân viên</p>
              <p class="mt-1 text-lg font-semibold text-gray-900">{{ employee.name }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase text-gray-500">Mã nhân viên</p>
              <p class="mt-1 text-lg font-semibold text-gray-900">{{ formatEmployeeId(employee.id) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase text-gray-500">Số điện thoại</p>
              <p class="mt-1 text-lg font-semibold text-gray-900">
                {{ employee.phone || 'Chưa có' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase text-gray-500">Vị trí</p>
              <p class="mt-1 text-lg font-semibold text-gray-900">
                {{ employee.profile?.account_type?.name || '—' }}
              </p>
            </div>
            <div v-if="employee.latest_level_approval_request?.current_level">
              <p class="text-xs font-semibold uppercase text-gray-500">Level hiện tại</p>
              <p class="mt-1 text-lg font-semibold text-purple-600">
                {{ employee.latest_level_approval_request.current_level.level }}
              </p>
              <p class="text-sm text-gray-500">
                {{ employee.latest_level_approval_request.current_level.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Criteria Table -->
        <div v-if="employee.criterias && employee.criterias.length > 0" class="px-6 py-6">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">Tiêu chí & Điểm chuẩn</h2>
          <div class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="w-full">
              <colgroup>
                <col class="w-48" />
                <col class="w-32" />
                <col class="w-32" />
              </colgroup>
              <thead>
                <tr class="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <th
                    class="sticky left-0 z-10 bg-purple-50 px-4 py-3 text-left text-xs font-semibold text-gray-700"
                  >
                    Tiêu chí
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nhiệm vụ</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Loại chỉ số</th>
                  <th
                    v-for="(lv, lvi) in getRowLevels(employee)"
                    :key="`level-${employee.id}-${lv.id || lv.level || lvi}`"
                    :class="[
                      'px-4 py-3 text-center text-xs font-semibold',
                      employee.latest_level_approval_request?.current_level?.id === lv.id
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'text-gray-700',
                    ]"
                  >
                    Bậc {{ lv.level }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="c in employee.criterias"
                  :key="c.id"
                  class="border-b border-gray-100 hover:bg-gray-50"
                >
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
                        c.type === 1 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : c.type === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                          : '',
                      ]"
                    >
                      {{ c.type === 1 ? 'Tháng' : c.type === 2 ? 'Quý' : 'N/A' }}
                    </span>
                  </td>
                  <td
                    v-for="(lv, lvi) in getRowLevels(employee)"
                    :key="`score-${c.id}-${lv.id || lv.level || lvi}`"
                    :class="[
                      'px-4 py-3 text-center text-sm font-semibold',
                      employee.latest_level_approval_request?.current_level?.id === lv.id
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
        </div>

        <!-- Empty Criteria -->
        <div v-else class="px-6 py-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="mt-2 text-gray-500">Chưa có tiêu chí cho nhân viên này</p>
        </div>
      </div>
    </template>
  </div>
</template>
