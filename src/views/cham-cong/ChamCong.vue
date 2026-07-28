<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import ChamCongCalendar from './components/ChamCongCalendar.vue'
import ChamCongDetailDialog from './components/ChamCongDetailDialog.vue'
import ChamCongHeroBanner from './components/ChamCongHeroBanner.vue'
import { useChamCongPage } from './composables/use-cham-cong-page'

const {
  selectedDate,
  loading,
  errorMessage,
  totalDayWork,
  totalHourWork,
  officeLabel,
  dayMap,
  visible,
  detail,
  statusCounts,
  getDayCellInfo,
  handleMonthChange,
  handleCalendarMonthChange,
  handleSelectedDateChange,
  reload,
} = useChamCongPage()

const hasAnyAttendance = computed(() => Object.keys(dayMap.value).length > 0)

function onCalendarModelUpdate(value: Date): void {
  selectedDate.value = value
}
</script>

<template>
  <div class="space-y-4 py-4 sm:space-y-5 sm:py-5">
    <ChamCongHeroBanner
      :model-value="selectedDate"
      :office-label="officeLabel"
      :total-hour-work="totalHourWork"
      :total-day-work="totalDayWork"
      :loading="loading"
      @update:model-value="handleMonthChange"
    />

    <div
      v-if="errorMessage && !loading"
      class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
    >
      <i class="pi pi-exclamation-triangle mt-0.5 shrink-0" />
      <div class="min-w-0 flex-1">
        <p class="font-medium">Không tải được dữ liệu</p>
        <p class="mt-0.5 text-amber-700/90">{{ errorMessage }}</p>
      </div>
      <Button
        type="button"
        label="Thử lại"
        icon="pi pi-refresh"
        size="small"
        severity="secondary"
        outlined
        @click="reload"
      />
    </div>

    <section class="box overflow-hidden">
      <div
        class="flex flex-col gap-2 border-b border-slate-200/60 px-4 py-3.5 sm:flex-row sm:items-end sm:justify-between sm:px-5"
      >
        <div>
          <h2 class="text-base font-semibold text-slate-800">Lịch chấm công</h2>
          <p class="mt-0.5 text-sm text-slate-500">
            Theo dõi giờ vào / ra từng ngày trong tháng
          </p>
        </div>
        <span
          v-if="hasAnyAttendance && !loading"
          class="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#472f92]/10 px-3 py-1 text-xs font-semibold text-[#472f92]"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-[#472f92]" />
          {{ statusCounts.total }} ngày có dữ liệu
        </span>
      </div>

      <ProgressBar v-if="loading" mode="indeterminate" class="h-[2px]" />

      <div class="p-3 sm:p-5">
        <ChamCongCalendar
          :model-value="selectedDate"
          :loading="loading"
          :has-attendance="hasAnyAttendance"
          :status-counts="statusCounts"
          :get-day-cell-info="getDayCellInfo"
          @update:model-value="onCalendarModelUpdate"
          @month-change="handleCalendarMonthChange"
          @date-select="handleSelectedDateChange"
        />
      </div>
    </section>

    <ChamCongDetailDialog v-model:visible="visible" :detail="detail" />
  </div>
</template>
