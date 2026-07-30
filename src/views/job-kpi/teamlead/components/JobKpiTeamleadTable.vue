<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Skeleton from 'primevue/skeleton'
import { useFormatter } from '@/composables/use-formatter'
import { JOB_KPI_TEAMLEAD_STATUS } from '../constants'
import type { JobKpiTeamleadListItem } from '../models/job-kpi-teamlead.model'
import {
  formatPercentOrEmpty,
  formatScoreOrEmpty,
  getEmployeeInitials,
  getPercentTone,
  isNeedScoreItem,
} from '../utils/job-kpi-teamlead-helpers'
import JobKpiTeamleadEmptyState from './JobKpiTeamleadEmptyState.vue'
import JobKpiTeamleadStatusBadge from './JobKpiTeamleadStatusBadge.vue'

const props = defineProps<{
  items: JobKpiTeamleadListItem[]
  loading: boolean
  loadingSearch?: boolean
  loadingDetail?: boolean
  total: number
}>()

const emit = defineEmits<{
  score: [item: JobKpiTeamleadListItem, viewOnly: boolean]
  'create-kra': [item: JobKpiTeamleadListItem]
  history: [item: JobKpiTeamleadListItem]
  'clear-filters': []
}>()

const { formatEmployeeCode } = useFormatter()

const isRefreshing = computed(() => Boolean(props.loadingSearch && !props.loading))

function pointToneClass(value: number | null | undefined, threshold = 90): string {
  if (value === null || value === undefined) return 'text-slate-500 dark:text-slate-400'
  const tone = getPercentTone(value >= threshold ? 100 : value)
  if (tone === 'success') return 'text-emerald-600 dark:text-emerald-400'
  if (tone === 'danger') return 'text-red-600 dark:text-red-400'
  return 'text-amber-600 dark:text-amber-400'
}

function meetingToneClass(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'text-slate-500 dark:text-slate-400'
  if (value > 0) return 'text-emerald-600 dark:text-emerald-400'
  return 'text-red-600 dark:text-red-400'
}

function isScored(item: JobKpiTeamleadListItem): boolean {
  return Number(item.status) === JOB_KPI_TEAMLEAD_STATUS.scored
}

function openPrimaryAction(item: JobKpiTeamleadListItem): void {
  emit('score', item, isScored(item))
}
</script>

<template>
  <div class="col-span-12">
    <div class="box overflow-hidden">
      <div
        class="flex flex-col items-start justify-between gap-2 border-b border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:px-5"
      >
        <div>
          <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">
            Danh sách nhân sự
          </h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Ưu tiên xử lý trạng thái
            <span class="font-medium text-amber-700 dark:text-amber-300">Cần chấm</span>
            · bấm vào dòng để xem hoặc chấm điểm
          </p>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Tổng
          <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
          bản ghi
        </p>
      </div>

      <ProgressBar v-if="loading || loadingSearch" mode="indeterminate" class="!h-[3px]" />

      <!-- Mobile cards -->
      <div
        class="space-y-3 p-3 sm:p-4 lg:hidden"
        :class="{ 'pointer-events-none opacity-60': isRefreshing }"
      >
        <template v-if="loading">
          <div
            v-for="row in 3"
            :key="row"
            class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div class="mb-3 flex items-center gap-3">
              <Skeleton shape="circle" size="2.5rem" />
              <div class="min-w-0 flex-1 space-y-2">
                <Skeleton width="60%" height="0.9rem" />
                <Skeleton width="40%" height="0.7rem" />
              </div>
            </div>
            <Skeleton width="100%" height="3.5rem" class="mb-3" />
            <Skeleton width="70%" height="2rem" />
          </div>
        </template>

        <template v-else-if="items.length > 0">
          <article
            v-for="item in items"
            :key="`${item.userId}-${item.departmentId}`"
            class="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-[rgba(var(--app-primary-rgb),0.35)] hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80"
            :class="
              isNeedScoreItem(item)
                ? 'border-l-4 border-l-amber-400 dark:border-l-amber-500'
                : ''
            "
          >
            <button
              type="button"
              class="mb-3 flex w-full items-start gap-3 text-left"
              @click="openPrimaryAction(item)"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--app-primary-rgb),0.1)] text-sm font-semibold text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.2)]"
              >
                {{ getEmployeeInitials(item.user?.name) }}
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h3 class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {{ item.user?.name || '—' }}
                    </h3>
                    <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Mã {{ item.user ? formatEmployeeCode(item.user.id) : '—' }}
                      · {{ item.department?.name || '—' }}
                    </p>
                  </div>
                  <JobKpiTeamleadStatusBadge :item="item" />
                </div>
              </div>
            </button>

            <div class="mb-3 grid grid-cols-2 gap-2 text-xs">
              <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/50">
                <p class="text-slate-500 dark:text-slate-400">% KPI tổng</p>
                <p class="mt-0.5 text-sm font-semibold tabular-nums" :class="pointToneClass(item.totalPointKra)">
                  {{ formatPercentOrEmpty(item.totalPointKra) }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/50">
                <p class="text-slate-500 dark:text-slate-400">Điểm họp tuần</p>
                <p
                  class="mt-0.5 text-sm font-semibold tabular-nums"
                  :class="meetingToneClass(item.totalPointMeeting)"
                >
                  {{ formatScoreOrEmpty(item.totalPointMeeting) }}
                </p>
              </div>
            </div>

            <p class="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Người chấm:
              <span class="font-medium text-slate-700 dark:text-slate-200">
                {{ item.assessor?.name || '—' }}
              </span>
            </p>

            <div class="flex flex-wrap gap-2">
              <Button
                type="button"
                icon="pi pi-file-plus"
                size="small"
                severity="secondary"
                outlined
                label="Thêm KRA"
                @click="emit('create-kra', item)"
              />
              <Button
                v-if="isScored(item)"
                type="button"
                icon="pi pi-eye"
                size="small"
                outlined
                label="Xem"
                :loading="loadingDetail"
                @click="emit('score', item, true)"
              />
              <Button
                v-else
                type="button"
                icon="pi pi-pencil"
                size="small"
                label="Chấm"
                :loading="loadingDetail"
                @click="emit('score', item, false)"
              />
              <Button
                type="button"
                icon="pi pi-history"
                size="small"
                severity="secondary"
                outlined
                label="Lịch sử"
                @click="emit('history', item)"
              />
            </div>
          </article>
        </template>

        <JobKpiTeamleadEmptyState
          v-else
          @clear-filters="emit('clear-filters')"
        />
      </div>

      <!-- Desktop table -->
      <div
        class="hidden overflow-x-auto lg:block"
        :class="{ 'pointer-events-none opacity-60': isRefreshing }"
      >
        <table class="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead>
            <tr
              class="border-b border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900/50"
            >
              <th class="min-w-[200px] px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Nhân sự
              </th>
              <th class="min-w-[140px] px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Đơn vị
              </th>
              <th class="min-w-[100px] px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                % KPI tổng
              </th>
              <th class="min-w-[120px] px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Điểm họp tuần
              </th>
              <th class="min-w-[140px] px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Người chấm
              </th>
              <th class="min-w-[150px] px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                Trạng thái
              </th>
              <th
                class="min-w-[150px] px-4 py-3 text-center font-medium text-slate-600 dark:text-slate-300"
              >
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody v-if="loading">
            <tr
              v-for="row in 5"
              :key="row"
              class="border-b border-slate-100 dark:border-slate-800"
            >
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <Skeleton shape="circle" size="2.25rem" />
                  <div class="min-w-0 flex-1 space-y-2">
                    <Skeleton width="70%" height="0.85rem" />
                    <Skeleton width="40%" height="0.7rem" />
                  </div>
                </div>
              </td>
              <td v-for="col in 6" :key="col" class="px-4 py-3.5">
                <Skeleton height="0.85rem" width="80%" />
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="items.length > 0">
            <tr
              v-for="item in items"
              :key="`${item.userId}-${item.departmentId}`"
              class="group cursor-pointer border-b border-slate-100 transition hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-800 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
              :class="
                isNeedScoreItem(item) ? 'bg-amber-50/25 dark:bg-amber-950/20' : ''
              "
              @click="openPrimaryAction(item)"
            >
              <td class="px-4 py-3.5">
                <div class="flex min-w-0 items-center gap-3">
                  <span
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--app-primary-rgb),0.1)] text-xs font-semibold text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.2)]"
                  >
                    {{ getEmployeeInitials(item.user?.name) }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate font-medium text-slate-800 dark:text-slate-100">
                      {{ item.user?.name || '—' }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Mã {{ item.user ? formatEmployeeCode(item.user.id) : '—' }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                {{ item.department?.name || '—' }}
              </td>
              <td
                class="px-4 py-3.5 font-semibold tabular-nums"
                :class="pointToneClass(item.totalPointKra)"
              >
                {{ formatPercentOrEmpty(item.totalPointKra) }}
              </td>
              <td
                class="px-4 py-3.5 font-semibold tabular-nums"
                :class="meetingToneClass(item.totalPointMeeting)"
              >
                {{ formatScoreOrEmpty(item.totalPointMeeting) }}
              </td>
              <td class="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                {{ item.assessor?.name || '—' }}
              </td>
              <td class="px-4 py-3.5">
                <JobKpiTeamleadStatusBadge :item="item" />
              </td>
              <td class="px-4 py-3.5" @click.stop>
                <div class="flex items-center justify-center gap-1.5">
                  <Button
                    type="button"
                    icon="pi pi-file-plus"
                    size="small"
                    severity="secondary"
                    outlined
                    rounded
                    title="Thêm KRA"
                    aria-label="Thêm KRA"
                    @click="emit('create-kra', item)"
                  />
                  <Button
                    v-if="isScored(item)"
                    type="button"
                    icon="pi pi-eye"
                    size="small"
                    outlined
                    rounded
                    title="Xem"
                    aria-label="Xem"
                    @click="emit('score', item, true)"
                  />
                  <Button
                    v-else
                    type="button"
                    icon="pi pi-pencil"
                    size="small"
                    rounded
                    severity="warn"
                    title="Chấm"
                    aria-label="Chấm"
                    @click="emit('score', item, false)"
                  />
                  <Button
                    type="button"
                    icon="pi pi-history"
                    size="small"
                    severity="secondary"
                    outlined
                    rounded
                    title="Lịch sử"
                    aria-label="Lịch sử"
                    @click="emit('history', item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <JobKpiTeamleadEmptyState
          v-if="!loading && items.length === 0"
          @clear-filters="emit('clear-filters')"
        />
      </div>
    </div>
  </div>
</template>
