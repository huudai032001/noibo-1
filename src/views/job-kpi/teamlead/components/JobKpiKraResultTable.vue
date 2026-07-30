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

const props = defineProps<{
  detail: JobKpiDetailData
  disabled: boolean
  fillSuggest: JobKpiFillSuggestState
}>()

const emit = defineEmits<{
  'update-kra-field': [kra: JobKpiDetailKraItem, field: 'name' | 'requestResult', value: string]
  'persist-kra': [kra: JobKpiDetailKraItem]
  'mark-week': [kra: JobKpiDetailKraItem, week: JobKpiManagerWeek, percent: number | null]
  'update-description': [kra: JobKpiDetailKraItem, value: string]
  'fill-all-week': []
  'dismiss-fill': []
}>()

const customValue = ref('')
const percentOptions = ref<Array<{ label: string; value: number }>>([
  ...JOB_KPI_PERCENT_OPTIONS,
])

const weekHeaders = computed(() => {
  return props.detail.details[0]?.kraManagerWeeks ?? []
})

const currentMonth = currentCalendarMonth()

function canEditKraMeta(kra: JobKpiDetailKraItem): boolean {
  return Number(kra.month) === currentMonth
}

function percentToneClass(value: number | null | undefined): string {
  const tone = getWeekPercentTone(value)
  if (tone === 'success') return 'text-emerald-600 dark:text-emerald-400'
  if (tone === 'danger') return 'text-red-600 dark:text-red-400'
  if (tone === 'warn') return 'text-blue-600 dark:text-blue-400'
  return 'text-slate-700 dark:text-slate-200'
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

function isSuggestFor(kra: JobKpiDetailKraItem, week: JobKpiManagerWeek): boolean {
  return (
    props.fillSuggest.visible &&
    props.fillSuggest.kraId === kra.id &&
    props.fillSuggest.week === week.week
  )
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">I. Kết quả KPI</h3>
      <div
        class="inline-flex items-center gap-2 rounded-xl bg-[rgba(var(--app-primary-rgb),0.08)] px-3 py-2 text-xs font-semibold text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.18)]"
      >
        <i class="pi pi-chart-line text-sm" />
        % KPI tổng: {{ formatPercentOrEmpty(detail.totalPercentKra) }}
      </div>
    </div>

    <div
      class="max-h-[min(62vh,640px)] overflow-auto rounded-xl border border-slate-200 dark:border-slate-700"
    >
      <table class="w-full min-w-[1380px] border-collapse text-left text-sm">
        <thead class="sticky top-0 z-10">
          <tr class="bg-[var(--app-primary)] text-white">
            <th class="min-w-[220px] px-3 py-3 font-semibold">KRAs</th>
            <th class="min-w-[200px] px-3 py-3 font-semibold">Yêu cầu thành phẩm</th>
            <th class="min-w-[180px] px-3 py-3 font-semibold">Thành phẩm</th>
            <th class="min-w-[88px] whitespace-nowrap px-3 py-3 text-center font-semibold">
              Trọng số
            </th>
            <th
              v-for="(week, index) in weekHeaders"
              :key="week.id ?? week.week ?? index"
              class="min-w-[118px] whitespace-nowrap px-3 py-3 text-center font-semibold"
            >
              Tuần {{ index + 1 }}
            </th>
            <th class="min-w-[100px] whitespace-nowrap px-3 py-3 text-center font-semibold">
              Kết quả KRA
            </th>
            <th class="min-w-[220px] px-3 py-3 font-semibold">Nhận xét</th>
          </tr>
        </thead>
        <tbody v-if="detail.details.length > 0">
          <tr
            v-for="kra in detail.details"
            :key="kra.id"
            class="border-b border-slate-100 align-top dark:border-slate-700/80"
          >
            <td class="px-3 py-3">
              <Textarea
                :model-value="kra.name"
                :disabled="!canEditKraMeta(kra)"
                rows="3"
                auto-resize
                placeholder="Nhập KRA"
                class="w-full text-sm"
                @update:model-value="emit('update-kra-field', kra, 'name', String($event ?? ''))"
                @blur="emit('persist-kra', kra)"
              />
            </td>
            <td class="px-3 py-3">
              <Textarea
                :model-value="kra.requestResult"
                :disabled="!canEditKraMeta(kra)"
                rows="3"
                auto-resize
                placeholder="Nhập thành phẩm"
                class="w-full text-sm"
                @update:model-value="
                  emit('update-kra-field', kra, 'requestResult', String($event ?? ''))
                "
                @blur="emit('persist-kra', kra)"
              />
            </td>
            <td class="px-3 py-3">
              <div
                class="max-h-32 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-5 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
                v-html="kra.results || '—'"
              />
            </td>
            <td
              class="px-3 py-3 text-center text-sm font-medium tabular-nums text-slate-700 dark:text-slate-200"
            >
              {{ formatPercentOrEmpty(kra.percentScore) }}
            </td>
            <td
              v-for="week in kra.kraManagerWeeks"
              :key="`${kra.id}-${week.week}`"
              class="relative px-3 py-3"
            >
              <Select
                :model-value="week.percentResults"
                :options="percentOptions"
                option-label="label"
                option-value="value"
                placeholder="Chọn"
                :disabled="disabled || !kra.results"
                :title="!kra.results ? 'Không thể chấm do chưa có thành phẩm' : ''"
                fluid
                :class="percentToneClass(week.percentResults)"
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

              <div
                v-if="isSuggestFor(kra, week)"
                class="absolute left-2 top-14 z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Tự động điền</p>
                <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Chấm tất cả KRA của tuần {{ fillSuggest.week }} là {{ fillSuggest.percent }}%?
                </p>
                <div class="mt-2 flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    icon="pi pi-check-circle"
                    severity="success"
                    text
                    rounded
                    @click="emit('fill-all-week')"
                  />
                  <Button
                    type="button"
                    icon="pi pi-times-circle"
                    severity="danger"
                    text
                    rounded
                    @click="emit('dismiss-fill')"
                  />
                </div>
              </div>
            </td>
            <td
              class="px-3 py-3 text-center text-base font-semibold tabular-nums"
              :class="percentToneClass(kra.percentResults)"
            >
              {{ formatPercentOrEmpty(kra.percentResults) }}
            </td>
            <td class="px-3 py-3">
              <p
                v-if="showWarningComment(kra)"
                class="mb-1.5 text-xs font-semibold leading-5 text-amber-600 dark:text-amber-400"
              >
                Hãy giúp nhân sự biết vì sao chưa đạt 100% và gợi ý cách cải thiện.
              </p>
              <Textarea
                :model-value="kra.description"
                :disabled="disabled || !kra.results"
                rows="3"
                auto-resize
                maxlength="200"
                placeholder="Nhập nhận xét..."
                class="w-full text-sm"
                @update:model-value="emit('update-description', kra, String($event ?? ''))"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="10" class="px-4 py-8 text-center text-sm text-slate-500">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
