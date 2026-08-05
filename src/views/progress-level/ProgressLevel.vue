<script setup lang="ts">
import { onMounted } from 'vue'
import ProgressLevelOverviewTable from './components/ProgressLevelOverviewTable.vue'
import ProgressLevelDetailTable from './components/ProgressLevelDetailTable.vue'
import { useProgressLevelPage } from './composables/use-progress-level-page'
import type { ProgressLevelItemApi } from './models/progress-level.model'

const { items, loading, yearFilter, years, fetchList, loadDetailMinusPoint } =
  useProgressLevelPage()

async function handleYearChange(): Promise<void> {
  await fetchList()
}

async function handleLoadMinusPoint(item: ProgressLevelItemApi): Promise<void> {
  await loadDetailMinusPoint(item)
}

onMounted(() => {
  void fetchList()
})
</script>

<template>
  <div class="space-y-6 py-3 sm:py-4">
    <!-- Hero Header -->
    <div
      class="relative overflow-hidden rounded-2xl p-6 shadow-lg"
      >
      <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full" style="background: rgba(255,255,255,0.08)"></div>
      <div class="pointer-events-none absolute -bottom-8 right-20 h-24 w-24 rounded-full" style="background: rgba(255,255,255,0.08)"></div>
      <div class="pointer-events-none absolute bottom-0 left-1/3 h-16 w-16 rounded-full" style="background: rgba(255,255,255,0.04)"></div>

      <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="mb-1 flex items-center gap-2">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span class="text-xs font-semibold uppercase tracking-widest">Performance Tracker</span>
          </div>
          <h1 class="text-2xl font-bold text-[var(--app-primary)]">Tiến trình Level của bạn</h1>
          <p class="mt-1 text-sm"">Theo dõi lộ trình phát triển và xếp hạng trong công ty</p>
        </div>

        <!-- Year filter -->
        <div
          class="flex w-fit items-center gap-2 rounded-xl px-4 py-2.5"
          style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2)"
        >
          <svg class="h-4 w-4 flex-shrink-0" style="color: rgba(216,180,254,0.9)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <select
            v-model.number="yearFilter"
            @change="handleYearChange"
            class="cursor-pointer bg-transparent text-sm font-semibold text-white focus:outline-none"
          >
            <option v-for="year in years" :key="year" :value="year" class="text-gray-900">
              Năm {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Overview Section -->
    <div>
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full bg-purple-600"></div>
        <h2 class="text-base font-semibold text-gray-800">Tổng quan tiến trình Level & xếp hạng</h2>
      </div>
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <ProgressLevelOverviewTable :items="items" :loading="loading" />
      </div>
    </div>

    <!-- Detail Section -->
    <div>
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full bg-purple-600"></div>
        <h2 class="text-base font-semibold text-gray-800">Chi tiết đánh giá & xét duyệt Level</h2>
      </div>
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <ProgressLevelDetailTable
          :items="items"
          :loading="loading"
          @load-minus-point="handleLoadMinusPoint"
        />
      </div>
    </div>
  </div>
</template>
