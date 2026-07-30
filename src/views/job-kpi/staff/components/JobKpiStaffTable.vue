<script setup lang="ts">
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Textarea from 'primevue/textarea'
import type { JobKpiKraItem, JobKpiResultFeedback } from '../models/job-kpi-staff.model'
import {
  canViewKraResult,
  formatPercentOrEmpty,
  getPercentTone,
} from '../utils/job-kpi-helpers'
import JobKpiStatusBadge from './JobKpiStatusBadge.vue'
import JobKpiTableSkeleton from './JobKpiTableSkeleton.vue'

defineProps<{
  items: JobKpiKraItem[]
  loading: boolean
  loadingSearch?: boolean
  total: number
  totalPercentKra: number | null
  resultFeedback: Map<number, JobKpiResultFeedback>
  savingKraIds: number[]
}>()

const emit = defineEmits<{
  view: [item: JobKpiKraItem]
  'update-result': [item: JobKpiKraItem, value: string]
}>()

function feedbackOf(
  map: Map<number, JobKpiResultFeedback>,
  kraId: number,
): JobKpiResultFeedback | undefined {
  return map.get(kraId)
}

function resultToneClass(value: number | null | undefined): string {
  const tone = getPercentTone(value)
  if (tone === 'success') return 'text-emerald-600 dark:text-emerald-400'
  if (tone === 'warn') return 'text-amber-600 dark:text-amber-400'
  if (tone === 'danger') return 'text-red-600 dark:text-red-400'
  return 'text-slate-500 dark:text-slate-400'
}
</script>

<template>
  <div class="box overflow-hidden">
    <div
      class="flex flex-col items-start justify-between gap-3 border-b border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:px-5"
    >
      <div>
        <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">Danh sách KRA</h2>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Tổng
          <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
          bản ghi · Tự lưu sau khi ngừng gõ khoảng 1 giây
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 rounded-xl bg-[rgba(var(--app-primary-rgb),0.06)] px-3 py-2 text-xs font-semibold text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.16)]"
      >
        <i class="pi pi-chart-line text-sm" />
        KPI tổng: {{ formatPercentOrEmpty(totalPercentKra) }}
      </div>
    </div>

    <div
      class="flex items-start gap-2.5 border-b border-amber-100 bg-amber-50/80 px-4 py-3 text-xs leading-5 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 sm:px-5"
    >
      <i class="pi pi-info-circle mt-0.5 shrink-0 text-sm" />
      <p>
        Nhân sự cần mở quyền truy cập bảng thành phẩm cho teamlead và email
        <span class="font-semibold">hanhchinh@edutalkvn.com</span>.
      </p>
    </div>

    <ProgressBar v-if="loading || loadingSearch" mode="indeterminate" class="!h-[3px]" />

    <!-- Mobile cards -->
    <div
      class="space-y-3 p-3 sm:p-4 lg:hidden"
      :class="{ 'pointer-events-none opacity-60': loadingSearch && !loading }"
    >
      <template v-if="loading">
        <div
          v-for="row in 3"
          :key="row"
          class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
        >
          <div class="mb-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div class="mb-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div class="h-16 w-full rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </template>

      <template v-else-if="items.length > 0">
        <article
          v-for="item in items"
          :key="item.id"
          class="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-800/80"
        >
          <div class="mb-3 flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="whitespace-pre-wrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ item.name }}
              </h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Trọng số
                <span class="font-semibold text-slate-700 dark:text-slate-200">
                  {{ formatPercentOrEmpty(item.percentScore) }}
                </span>
                · Kết quả
                <span class="font-semibold" :class="resultToneClass(item.percentResults)">
                  {{ formatPercentOrEmpty(item.percentResults) }}
                </span>
              </p>
            </div>
            <JobKpiStatusBadge :status="item.status" />
          </div>

          <div class="mb-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-900/50">
            <p class="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Yêu cầu thành phẩm
            </p>
            <p class="whitespace-pre-wrap text-sm leading-5 text-slate-700 dark:text-slate-300">
              {{ item.requestResult || '—' }}
            </p>
          </div>

          <label class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
            Nhập thành phẩm
          </label>
          <div class="relative">
            <Textarea
              :model-value="item.results"
              rows="3"
              auto-resize
              class="w-full"
              placeholder="Dán link hoặc mô tả thành phẩm..."
              :disabled="savingKraIds.includes(item.id)"
              @update:model-value="emit('update-result', item, String($event ?? ''))"
            />
            <span
              v-if="savingKraIds.includes(item.id)"
              class="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-800/90"
            >
              <i class="pi pi-spin pi-spinner text-[10px]" />
              Đang lưu
            </span>
          </div>

          <p
            v-if="feedbackOf(resultFeedback, item.id)?.error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
          >
            <i class="pi pi-times-circle text-[11px]" />
            {{ feedbackOf(resultFeedback, item.id)?.error }}
          </p>
          <p
            v-else-if="feedbackOf(resultFeedback, item.id)?.success"
            class="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
          >
            <i class="pi pi-check-circle text-[11px]" />
            {{ feedbackOf(resultFeedback, item.id)?.success }}
          </p>

          <div v-if="canViewKraResult(item)" class="mt-3 flex justify-end">
            <Button
              type="button"
              label="Xem kết quả"
              icon="pi pi-eye"
              size="small"
              severity="secondary"
              outlined
              @click="emit('view', item)"
            />
          </div>
        </article>
      </template>

      <div
        v-else
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center dark:border-slate-700"
      >
        <span
          class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)]"
        >
          <i class="pi pi-inbox text-xl" />
        </span>
        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Không có dữ liệu</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Chưa có KRA nào trong tháng đã chọn.
        </p>
      </div>
    </div>

    <!-- Desktop table -->
    <div
      class="hidden overflow-x-auto lg:block"
      :class="{ 'pointer-events-none opacity-60': loadingSearch && !loading }"
    >
      <table class="w-full min-w-[980px] border-collapse text-sm">
        <thead>
          <tr
            class="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
          >
            <th class="px-4 py-3 font-medium">KRA</th>
            <th class="px-4 py-3 font-medium">Yêu cầu thành phẩm</th>
            <th class="min-w-[240px] px-4 py-3 font-medium">Nhập thành phẩm</th>
            <th class="whitespace-nowrap px-4 py-3 text-center font-medium">Trọng số</th>
            <th class="whitespace-nowrap px-4 py-3 text-center font-medium">Trạng thái</th>
            <th class="whitespace-nowrap px-4 py-3 text-center font-medium">Kết quả</th>
            <th class="whitespace-nowrap px-4 py-3 text-center font-medium">Thao tác</th>
          </tr>
        </thead>

        <JobKpiTableSkeleton v-if="loading" :columns="7" />

        <tbody v-else-if="items.length > 0">
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-b border-slate-100 align-top transition hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-800 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
          >
            <td class="px-4 py-4">
              <p class="max-w-[220px] whitespace-pre-wrap font-medium text-slate-800 dark:text-slate-100">
                {{ item.name }}
              </p>
            </td>
            <td class="px-4 py-4">
              <p class="max-w-[240px] whitespace-pre-wrap leading-5 text-slate-600 dark:text-slate-300">
                {{ item.requestResult || '—' }}
              </p>
            </td>
            <td class="px-4 py-4">
              <div class="relative">
                <Textarea
                  :model-value="item.results"
                  rows="2"
                  auto-resize
                  class="w-full"
                  placeholder="Dán link hoặc mô tả thành phẩm..."
                  :disabled="savingKraIds.includes(item.id)"
                  @update:model-value="emit('update-result', item, String($event ?? ''))"
                />
                <span
                  v-if="savingKraIds.includes(item.id)"
                  class="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-800/90"
                >
                  <i class="pi pi-spin pi-spinner text-[10px]" />
                  Đang lưu
                </span>
              </div>
              <p
                v-if="feedbackOf(resultFeedback, item.id)?.error"
                class="mt-1.5 flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
              >
                <i class="pi pi-times-circle text-[11px]" />
                {{ feedbackOf(resultFeedback, item.id)?.error }}
              </p>
              <p
                v-else-if="feedbackOf(resultFeedback, item.id)?.success"
                class="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <i class="pi pi-check-circle text-[11px]" />
                {{ feedbackOf(resultFeedback, item.id)?.success }}
              </p>
            </td>
            <td class="px-4 py-4 text-center tabular-nums text-slate-700 dark:text-slate-300">
              {{ formatPercentOrEmpty(item.percentScore) }}
            </td>
            <td class="px-4 py-4 text-center">
              <JobKpiStatusBadge :status="item.status" />
            </td>
            <td class="px-4 py-4 text-center">
              <span class="font-semibold tabular-nums" :class="resultToneClass(item.percentResults)">
                {{ formatPercentOrEmpty(item.percentResults) }}
              </span>
            </td>
            <td class="px-4 py-4 text-center">
              <Button
                v-if="canViewKraResult(item)"
                type="button"
                icon="pi pi-eye"
                size="small"
                severity="secondary"
                outlined
                rounded
                title="Xem kết quả"
                aria-label="Xem kết quả"
                @click="emit('view', item)"
              />
              <span v-else class="text-xs text-slate-400">—</span>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="7" class="px-4 py-14 text-center">
              <div class="flex flex-col items-center justify-center">
                <span
                  class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)]"
                >
                  <i class="pi pi-inbox text-xl" />
                </span>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Không có dữ liệu
                </p>
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Chưa có KRA nào trong tháng đã chọn.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
