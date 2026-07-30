<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { JOB_KPI_PERCENT_OPTIONS } from '../constants'
import type {
  JobKpiDetailData,
  JobKpiDetailKraItem,
  JobKpiFillSuggestState,
  JobKpiManagerWeek,
} from '../models/job-kpi-teamlead.model'
import {
  currentCalendarMonth,
  formatPercentOrEmpty,
  getWeekPercentTone,
  showWarningComment,
} from '../utils/job-kpi-teamlead-helpers'

type KraViewMode = 'week' | 'all'

const props = withDefaults(
  defineProps<{
    detail: JobKpiDetailData
    disabled: boolean
    fillSuggest: JobKpiFillSuggestState
    compactHeader?: boolean
  }>(),
  { compactHeader: false },
)

const emit = defineEmits<{
  'update-kra-field': [kra: JobKpiDetailKraItem, field: 'name' | 'requestResult', value: string]
  'persist-kra': [kra: JobKpiDetailKraItem]
  'mark-week': [kra: JobKpiDetailKraItem, week: JobKpiManagerWeek, percent: number | null]
  'update-description': [kra: JobKpiDetailKraItem, value: string]
  'fill-all-week': []
  'dismiss-fill': []
}>()

const customValue = ref('')
const viewMode = ref<KraViewMode>('week')
const activeWeekIndex = ref(0)
const expandedKraIds = ref<Set<number>>(new Set())
const expandedDetailIds = ref<Set<number>>(new Set())
const percentOptions = ref<Array<{ label: string; value: number }>>([
  ...JOB_KPI_PERCENT_OPTIONS,
])

const weekHeaders = computed(() => props.detail.details[0]?.kraManagerWeeks ?? [])
const currentMonth = currentCalendarMonth()
const kraTotal = computed(() => props.detail.details.length)
const weekColSpan = computed(() => Math.max(weekHeaders.value.length, 1) + 6)

const isWeekMode = computed(() => viewMode.value === 'week')

function canEditKraMeta(kra: JobKpiDetailKraItem): boolean {
  return Number(kra.month) === currentMonth
}

function isExpanded(kraId: number): boolean {
  return expandedKraIds.value.has(kraId)
}

function isDetailExpanded(kraId: number): boolean {
  return expandedDetailIds.value.has(kraId)
}

function toggleExpand(kraId: number): void {
  const next = new Set(expandedKraIds.value)
  if (next.has(kraId)) next.delete(kraId)
  else next.add(kraId)
  expandedKraIds.value = next
}

function toggleDetail(kraId: number): void {
  const next = new Set(expandedDetailIds.value)
  if (next.has(kraId)) next.delete(kraId)
  else next.add(kraId)
  expandedDetailIds.value = next
}

function scoredCountForWeek(weekIndex: number): number {
  return props.detail.details.filter((kra) => {
    const week = kra.kraManagerWeeks[weekIndex]
    return week?.percentResults !== null && week?.percentResults !== undefined
  }).length
}

function weekPillClass(weekIndex: number): string {
  const scored = scoredCountForWeek(weekIndex)
  const isActive = activeWeekIndex.value === weekIndex
  if (isActive) {
    return 'bg-[var(--app-primary)] text-white shadow-sm'
  }
  if (scored === kraTotal.value && kraTotal.value > 0) {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800'
  }
  if (scored > 0) {
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800'
  }
  return 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
}

function goPrevWeek(): void {
  if (activeWeekIndex.value > 0) activeWeekIndex.value -= 1
}

function goNextWeek(): void {
  if (activeWeekIndex.value < weekHeaders.value.length - 1) activeWeekIndex.value += 1
}

function percentToneClass(value: number | null | undefined): string {
  const tone = getWeekPercentTone(value)
  if (tone === 'success') return 'text-emerald-600 dark:text-emerald-400'
  if (tone === 'danger') return 'text-red-600 dark:text-red-400'
  if (tone === 'warn') return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-500 dark:text-slate-400'
}

function resultBadgeClass(value: number | null | undefined): string {
  const tone = getWeekPercentTone(value)
  if (tone === 'success') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800'
  }
  if (tone === 'danger') {
    return 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800'
  }
  if (tone === 'warn') {
    return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800'
  }
  return 'bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700'
}

function onCustomPercent(kra: JobKpiDetailKraItem, week: JobKpiManagerWeek): void {
  const parsed = Number.parseFloat(customValue.value)
  if (Number.isNaN(parsed)) return
  const normalized = Math.max(0, Math.min(100, parsed))
  const exists = percentOptions.value.some((item) => item.value === normalized)
  if (!exists) {
    percentOptions.value = [
      ...percentOptions.value,
      { label: `${normalized}%`, value: normalized },
    ]
  }
  customValue.value = ''
  emit('mark-week', kra, week, normalized)
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function isSuggestFor(kra: JobKpiDetailKraItem, week: JobKpiManagerWeek): boolean {
  return (
    props.fillSuggest.visible &&
    props.fillSuggest.kraId === kra.id &&
    props.fillSuggest.week === week.week
  )
}

function getWeekAt(kra: JobKpiDetailKraItem, weekIndex: number): JobKpiManagerWeek | undefined {
  return kra.kraManagerWeeks[weekIndex]
}
</script>

<template>
  <section class="space-y-3">
    <div
      v-if="!compactHeader"
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">I. Kết quả KPI</h3>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Chọn tuần để chấm từng bước, hoặc xem tất cả tuần
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-3.5 py-1.5 text-sm font-semibold tabular-nums text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.2)]"
      >
        <i class="pi pi-chart-line text-xs" />
        KPI tổng
        <span class="text-base">{{ formatPercentOrEmpty(detail.totalPercentKra) }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        class="inline-flex w-full rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 sm:w-auto dark:border-slate-700 dark:bg-slate-800/80"
      >
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none"
          :class="
            isWeekMode
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900'
              : 'text-slate-500 dark:text-slate-400'
          "
          @click="viewMode = 'week'"
        >
          <i class="pi pi-calendar text-[10px]" />
          Chấm theo tuần
        </button>
        <button
          type="button"
          class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors sm:flex-none"
          :class="
            !isWeekMode
              ? 'bg-white text-[var(--app-primary)] shadow-sm dark:bg-slate-900'
              : 'text-slate-500 dark:text-slate-400'
          "
          @click="viewMode = 'all'"
        >
          <i class="pi pi-table text-[10px]" />
          Tất cả tuần
        </button>
      </div>

      <div v-if="isWeekMode && weekHeaders.length > 0" class="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          icon="pi pi-chevron-left"
          severity="secondary"
          outlined
          size="small"
          :disabled="activeWeekIndex === 0"
          aria-label="Tuần trước"
          @click="goPrevWeek"
        />
        <div class="flex flex-wrap items-center gap-1">
          <button
            v-for="(week, index) in weekHeaders"
            :key="week.id ?? week.week ?? index"
            type="button"
            class="inline-flex min-w-[2.75rem] flex-col items-center rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors"
            :class="weekPillClass(index)"
            :title="`${scoredCountForWeek(index)}/${kraTotal} KRA đã chấm`"
            @click="activeWeekIndex = index"
          >
            <span>T{{ index + 1 }}</span>
            <span class="text-[9px] font-medium opacity-80">
              {{ scoredCountForWeek(index) }}/{{ kraTotal }}
            </span>
          </button>
        </div>
        <Button
          type="button"
          icon="pi pi-chevron-right"
          severity="secondary"
          outlined
          size="small"
          :disabled="activeWeekIndex >= weekHeaders.length - 1"
          aria-label="Tuần sau"
          @click="goNextWeek"
        />
      </div>
    </div>

    <p v-if="isWeekMode" class="text-xs text-slate-500 dark:text-slate-400">
      Đang chấm
      <span class="font-semibold text-slate-700 dark:text-slate-200"
        >Tuần {{ activeWeekIndex + 1 }}</span
      >
      — {{ scoredCountForWeek(activeWeekIndex) }}/{{ kraTotal }} KRA đã chấm
    </p>
    <p v-else class="text-xs text-slate-500 dark:text-slate-400">
      Xem toàn bộ tuần. Cuộn ngang để xem đủ cột.
    </p>

    <!-- Week mode: card list -->
    <div
      v-if="isWeekMode"
      class="max-h-[min(62vh,640px)] space-y-2 overflow-auto pr-0.5"
    >
      <article
        v-for="kra in detail.details"
        :key="kra.id"
        class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div class="min-w-0 flex-1 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <p
                class="text-sm font-semibold leading-5 text-slate-800 dark:text-slate-100"
                :class="isExpanded(kra.id) ? '' : 'line-clamp-2'"
              >
                {{ kra.name || '—' }}
              </p>
              <span
                class="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {{ formatPercentOrEmpty(kra.percentScore) }}
              </span>
            </div>

            <button
              v-if="(kra.name?.length ?? 0) > 80 || kra.requestResult"
              type="button"
              class="text-[11px] font-medium text-[var(--app-primary)] hover:underline"
              @click="toggleDetail(kra.id)"
            >
              {{ isDetailExpanded(kra.id) ? 'Ẩn chi tiết' : 'Xem yêu cầu & thành phẩm' }}
            </button>

            <div
              v-if="isDetailExpanded(kra.id)"
              class="space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div>
                <p class="font-medium text-slate-500 dark:text-slate-400">Yêu cầu</p>
                <p class="mt-0.5 leading-5 text-slate-700 dark:text-slate-200">
                  {{ kra.requestResult || '—' }}
                </p>
              </div>
              <div>
                <p class="font-medium text-slate-500 dark:text-slate-400">Thành phẩm</p>
                <div
                  v-if="kra.results"
                  class="mt-0.5 leading-5 text-slate-600 dark:text-slate-300"
                  v-html="kra.results"
                />
                <p v-else class="mt-0.5 italic text-slate-400">Chưa có thành phẩm</p>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 flex-col gap-2 sm:w-44">
            <template v-if="getWeekAt(kra, activeWeekIndex)">
              <label class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Tuần {{ activeWeekIndex + 1 }}
              </label>
              <div
                class="relative"
                :class="isSuggestFor(kra, getWeekAt(kra, activeWeekIndex)!) ? 'z-30' : ''"
              >
                <div
                  class="rounded-lg"
                  :class="
                    isSuggestFor(kra, getWeekAt(kra, activeWeekIndex)!)
                      ? 'ring-2 ring-[var(--app-primary)] ring-offset-1 dark:ring-offset-slate-900'
                      : ''
                  "
                >
                  <Select
                    :model-value="getWeekAt(kra, activeWeekIndex)!.percentResults"
                    :options="percentOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Chọn điểm"
                    :disabled="disabled || !kra.results"
                    :title="
                      !kra.results
                        ? 'Không thể chấm do chưa có thành phẩm'
                        : `Tuần ${activeWeekIndex + 1}`
                    "
                    fluid
                    size="small"
                    :class="[
                      'text-sm font-semibold tabular-nums',
                      percentToneClass(getWeekAt(kra, activeWeekIndex)!.percentResults),
                    ]"
                    @update:model-value="
                      emit('mark-week', kra, getWeekAt(kra, activeWeekIndex)!, $event ?? null)
                    "
                  >
                    <template #footer>
                      <div class="border-t border-slate-200 p-2 dark:border-slate-700">
                        <InputText
                          v-model="customValue"
                          placeholder="% khác"
                          size="small"
                          fluid
                          @keydown.enter.prevent="
                            onCustomPercent(kra, getWeekAt(kra, activeWeekIndex)!)
                          "
                          @change="onCustomPercent(kra, getWeekAt(kra, activeWeekIndex)!)"
                        />
                      </div>
                    </template>
                  </Select>
                </div>

                <div
                  v-if="isSuggestFor(kra, getWeekAt(kra, activeWeekIndex)!)"
                  class="absolute right-0 top-[calc(100%+0.25rem)] z-40 w-64"
                  role="dialog"
                  aria-label="Tự động điền"
                >
                  <div
                    class="relative rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
                  >
                    <div class="space-y-2.5">
                      <div class="flex items-start gap-2">
                        <span
                          class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--app-primary-rgb),0.12)] text-[var(--app-primary)]"
                        >
                          <i class="pi pi-bolt text-[10px]" />
                        </span>
                        <div>
                          <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
                            Tự động điền
                          </p>
                          <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            Chấm tất cả KRA tuần {{ fillSuggest.week }} là
                            <span class="font-semibold">{{ fillSuggest.percent }}%</span>?
                          </p>
                        </div>
                      </div>
                      <div class="flex gap-1.5">
                        <Button
                          type="button"
                          label="Đồng ý"
                          icon="pi pi-check"
                          size="small"
                          class="flex-1"
                          @click="emit('fill-all-week')"
                        />
                        <Button
                          type="button"
                          label="Không"
                          severity="secondary"
                          outlined
                          size="small"
                          class="flex-1"
                          @click="emit('dismiss-fill')"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class="flex items-center justify-between gap-2">
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ring-1 ring-inset"
                :class="resultBadgeClass(kra.percentResults)"
              >
                KQ: {{ formatPercentOrEmpty(kra.percentResults) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700/70">
          <p
            v-if="showWarningComment(kra)"
            class="mb-1.5 flex items-start gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400"
          >
            <i class="pi pi-info-circle mt-0.5 shrink-0 text-[10px]" />
            <span>Chưa đạt 100% — hãy ghi nhận xét hỗ trợ nhân sự.</span>
          </p>
          <Textarea
            :model-value="kra.description"
            :disabled="disabled || !kra.results"
            rows="2"
            auto-resize
            maxlength="200"
            placeholder="Nhận xét cho KRA này..."
            class="w-full text-xs"
            @update:model-value="emit('update-description', kra, String($event ?? ''))"
          />
        </div>
      </article>

      <p
        v-if="detail.details.length === 0"
        class="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-700"
      >
        Không có dữ liệu KRA
      </p>
    </div>

    <!-- All weeks: table view -->
    <div
      v-else
      class="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      :class="compactHeader ? 'max-h-[min(62vh,640px)]' : 'max-h-[min(58vh,560px)]'"
    >
      <table class="w-full min-w-[1240px] border-collapse text-left text-sm">
        <thead class="sticky top-0 z-30">
          <tr class="bg-[var(--app-primary)] text-white">
            <th
              class="sticky left-0 z-40 min-w-[220px] max-w-[260px] bg-[var(--app-primary)] px-3 py-3 text-xs font-semibold tracking-wide"
            >
              KRAs
            </th>
            <th class="min-w-[170px] max-w-[200px] px-3 py-3 text-xs font-semibold tracking-wide">
              Yêu cầu thành phẩm
            </th>
            <th class="min-w-[150px] max-w-[180px] px-3 py-3 text-xs font-semibold tracking-wide">
              Thành phẩm
            </th>
            <th
              class="min-w-[84px] whitespace-nowrap px-2 py-3 text-center text-xs font-semibold"
              title="Trọng số"
            >
              Trọng số
            </th>
            <th
              v-for="(week, index) in weekHeaders"
              :key="week.id ?? week.week ?? index"
              class="min-w-[104px] whitespace-nowrap px-2 py-3 text-center text-xs font-semibold"
            >
              Tuần {{ index + 1 }}
            </th>
            <th class="min-w-[200px] px-3 py-3 text-xs font-semibold tracking-wide">Nhận xét</th>
            <th
              class="sticky right-0 z-40 min-w-[100px] whitespace-nowrap bg-[var(--app-primary)] px-2 py-3 text-center text-xs font-semibold"
            >
              Kết quả
            </th>
          </tr>
        </thead>
        <tbody v-if="detail.details.length > 0">
          <tr
            v-for="(kra, rowIndex) in detail.details"
            :key="kra.id"
            class="group border-b border-slate-100 align-top transition-colors hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-700/70 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
            :class="
              rowIndex % 2 === 0
                ? 'bg-white dark:bg-slate-900'
                : 'bg-slate-50/70 dark:bg-slate-800/40'
            "
          >
            <td
              class="sticky left-0 z-20 max-w-[260px] px-3 py-3 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]"
              :class="
                rowIndex % 2 === 0
                  ? 'bg-white group-hover:bg-[#f8f7fc] dark:bg-slate-900 dark:group-hover:bg-slate-900'
                  : 'bg-slate-50 group-hover:bg-[#f4f2fa] dark:bg-slate-800 dark:group-hover:bg-slate-800'
              "
            >
              <template v-if="canEditKraMeta(kra)">
                <Textarea
                  :model-value="kra.name"
                  rows="2"
                  auto-resize
                  placeholder="Nhập KRA"
                  class="w-full text-xs leading-5"
                  @update:model-value="emit('update-kra-field', kra, 'name', String($event ?? ''))"
                  @blur="emit('persist-kra', kra)"
                />
              </template>
              <template v-else>
                <p
                  class="text-xs leading-5 text-slate-700 dark:text-slate-200"
                  :class="isExpanded(kra.id) ? '' : 'line-clamp-3'"
                >
                  {{ kra.name || '—' }}
                </p>
                <button
                  v-if="(kra.name?.length ?? 0) > 90"
                  type="button"
                  class="mt-1 text-[11px] font-medium text-[var(--app-primary)] hover:underline"
                  @click="toggleExpand(kra.id)"
                >
                  {{ isExpanded(kra.id) ? 'Thu gọn' : 'Xem thêm' }}
                </button>
              </template>
            </td>

            <td class="max-w-[200px] px-3 py-3">
              <template v-if="canEditKraMeta(kra)">
                <Textarea
                  :model-value="kra.requestResult"
                  rows="2"
                  auto-resize
                  placeholder="Nhập yêu cầu"
                  class="w-full text-xs leading-5"
                  @update:model-value="
                    emit('update-kra-field', kra, 'requestResult', String($event ?? ''))
                  "
                  @blur="emit('persist-kra', kra)"
                />
              </template>
              <p v-else class="line-clamp-4 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {{ kra.requestResult || '—' }}
              </p>
            </td>

            <td class="max-w-[180px] px-3 py-3">
              <div
                class="max-h-24 overflow-auto rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-2 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-300"
                :title="stripHtml(kra.results || '')"
              >
                <div v-if="kra.results" v-html="kra.results" />
                <span v-else class="italic text-slate-400">Chưa có thành phẩm</span>
              </div>
            </td>

            <td class="px-2 py-3 text-center">
              <span
                class="inline-flex min-w-[3.25rem] justify-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold tabular-nums text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {{ formatPercentOrEmpty(kra.percentScore) }}
              </span>
            </td>

            <td
              v-for="week in kra.kraManagerWeeks"
              :key="`${kra.id}-${week.week}`"
              class="relative px-1.5 py-3"
              :class="isSuggestFor(kra, week) ? 'z-30' : ''"
            >
              <div
                class="rounded-lg transition-shadow"
                :class="
                  isSuggestFor(kra, week)
                    ? 'ring-2 ring-[var(--app-primary)] ring-offset-1 dark:ring-offset-slate-900'
                    : ''
                "
              >
                <Select
                  :model-value="week.percentResults"
                  :options="percentOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="—"
                  :disabled="disabled || !kra.results"
                  :title="
                    !kra.results ? 'Không thể chấm do chưa có thành phẩm' : `Tuần ${week.week}`
                  "
                  fluid
                  size="small"
                  :pt="{
                    root: {
                      class: week.percentResults == null ? 'opacity-70' : '',
                    },
                  }"
                  :class="[
                    'text-xs font-semibold tabular-nums',
                    percentToneClass(week.percentResults),
                  ]"
                  @update:model-value="emit('mark-week', kra, week, $event ?? null)"
                >
                  <template #footer>
                    <div class="border-t border-slate-200 p-2 dark:border-slate-700">
                      <InputText
                        v-model="customValue"
                        placeholder="% khác"
                        size="small"
                        fluid
                        @keydown.enter.prevent="onCustomPercent(kra, week)"
                        @change="onCustomPercent(kra, week)"
                      />
                    </div>
                  </template>
                </Select>
              </div>

              <div
                v-if="isSuggestFor(kra, week)"
                class="absolute left-1/2 top-[calc(100%-0.15rem)] z-40 w-[13.5rem] -translate-x-1/2 pt-2"
                role="dialog"
                aria-label="Tự động điền"
              >
                <div
                  class="relative rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800"
                >
                  <span
                    class="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
                  />
                  <div class="relative space-y-2.5">
                    <div class="flex items-start gap-2">
                      <span
                        class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--app-primary-rgb),0.12)] text-[var(--app-primary)]"
                      >
                        <i class="pi pi-bolt text-[10px]" />
                      </span>
                      <div class="min-w-0">
                        <p class="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          Tự động điền
                        </p>
                        <p class="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                          Chấm tất cả KRA tuần {{ fillSuggest.week }} là
                          <span class="font-semibold tabular-nums text-slate-700 dark:text-slate-200"
                            >{{ fillSuggest.percent }}%</span
                          >?
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <Button
                        type="button"
                        label="Đồng ý"
                        icon="pi pi-check"
                        size="small"
                        class="flex-1"
                        @click="emit('fill-all-week')"
                      />
                      <Button
                        type="button"
                        label="Không"
                        severity="secondary"
                        outlined
                        size="small"
                        class="flex-1"
                        @click="emit('dismiss-fill')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </td>

            <td class="min-w-[200px] px-3 py-3">
              <p
                v-if="showWarningComment(kra)"
                class="mb-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-amber-600 dark:text-amber-400"
              >
                <i class="pi pi-info-circle mt-0.5 shrink-0 text-[10px]" />
                <span>Chưa đạt 100% — hãy ghi nhận xét hỗ trợ nhân sự.</span>
              </p>
              <Textarea
                :model-value="kra.description"
                :disabled="disabled || !kra.results"
                rows="2"
                auto-resize
                maxlength="200"
                placeholder="Nhận xét..."
                class="w-full text-xs leading-5"
                @update:model-value="emit('update-description', kra, String($event ?? ''))"
              />
            </td>

            <td
              class="sticky right-0 z-20 px-2 py-3 text-center shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]"
              :class="
                rowIndex % 2 === 0
                  ? 'bg-white group-hover:bg-[#f8f7fc] dark:bg-slate-900 dark:group-hover:bg-slate-900'
                  : 'bg-slate-50 group-hover:bg-[#f4f2fa] dark:bg-slate-800 dark:group-hover:bg-slate-800'
              "
            >
              <span
                class="inline-flex min-w-[3.75rem] justify-center rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ring-1 ring-inset"
                :class="resultBadgeClass(kra.percentResults)"
              >
                {{ formatPercentOrEmpty(kra.percentResults) }}
              </span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="weekColSpan" class="px-4 py-10 text-center text-sm text-slate-500">
              Không có dữ liệu KRA
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
