<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { computed } from 'vue'
import type { JobKpiKraItem } from '../models/job-kpi-staff.model'
import {
  formatPercentOrEmpty,
  getPercentTone,
  linkifyText,
} from '../utils/job-kpi-helpers'
import JobKpiStatusBadge from './JobKpiStatusBadge.vue'

const props = defineProps<{
  visible: boolean
  item: JobKpiKraItem | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const linkedResults = computed(() => {
  const results = props.item?.results?.trim()
  if (!results) return 'Chưa nhập'
  return linkifyText(results)
})

const weekResults = computed(() => props.item?.kraManagerWeeks ?? [])

const monthTone = computed(() => getPercentTone(props.item?.percentResults))

function closeDialog(): void {
  emit('update:visible', false)
  emit('close')
}

function toneValueClass(tone: string): string {
  if (tone === 'success') return 'text-emerald-600 dark:text-emerald-400'
  if (tone === 'warn') return 'text-amber-600 dark:text-amber-400'
  if (tone === 'danger') return 'text-red-600 dark:text-red-400'
  return 'text-slate-700 dark:text-slate-200'
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Kết quả KRA chi tiết"
    class="job-kpi-detail-dialog w-full max-w-3xl"
    :style="{ width: '95vw', maxWidth: '48rem' }"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="item" class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <JobKpiStatusBadge :status="item.status" />
        <span
          class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
        >
          Trọng số {{ formatPercentOrEmpty(item.percentScore) }}
        </span>
        <span
          class="inline-flex items-center gap-1.5 rounded-lg bg-[rgba(var(--app-primary-rgb),0.08)] px-2.5 py-1 text-xs font-semibold text-[var(--app-primary)]"
        >
          Kết quả tháng
          <span :class="toneValueClass(monthTone)">
            {{ formatPercentOrEmpty(item.percentResults) }}
          </span>
        </span>
      </div>

      <section
        class="job-kpi-detail__block rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"
      >
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <i class="pi pi-flag text-[var(--app-primary)]" />
          KRA
        </h3>
        <p class="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
          {{ item.name }}
        </p>
      </section>

      <section
        class="job-kpi-detail__block rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"
      >
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <i class="pi pi-box text-[var(--app-primary)]" />
          Thành phẩm
        </h3>
        <div
          class="job-kpi-detail__result whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
          v-html="linkedResults"
        />
      </section>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section
          class="job-kpi-detail__block rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"
        >
          <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <i class="pi pi-calendar text-[var(--app-primary)]" />
            Đánh giá tháng
          </h3>
          <p class="text-2xl font-semibold tabular-nums" :class="toneValueClass(monthTone)">
            {{ formatPercentOrEmpty(item.percentResults) }}
          </p>
        </section>

        <section
          class="job-kpi-detail__block rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"
        >
          <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
            <i class="pi pi-comment text-[var(--app-primary)]" />
            Nhận xét
          </h3>
          <p
            class="text-sm leading-6"
            :class="
              item.description
                ? 'text-slate-700 dark:text-slate-200'
                : 'text-slate-400 dark:text-slate-500'
            "
          >
            {{ item.description || 'Không có nhận xét' }}
          </p>
        </section>
      </div>

      <section
        class="job-kpi-detail__block rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"
      >
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
          <i class="pi pi-list text-[var(--app-primary)]" />
          Kết quả theo tuần
        </h3>
        <div v-if="weekResults.length > 0" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div
            v-for="(week, index) in weekResults"
            :key="week.id ?? index"
            class="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-center dark:border-slate-700 dark:bg-slate-900/40"
          >
            <p class="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tuần {{ week.week ?? index + 1 }}
            </p>
            <p
              class="mt-1 text-base font-semibold tabular-nums"
              :class="toneValueClass(getPercentTone(week.percentResults))"
            >
              {{ formatPercentOrEmpty(week.percentResults) }}
            </p>
          </div>
        </div>
        <p v-else class="text-sm text-slate-500 dark:text-slate-400">Chưa có kết quả theo tuần.</p>
      </section>
    </div>

    <template #footer>
      <Button type="button" label="Đóng" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>
