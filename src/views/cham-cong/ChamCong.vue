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
const todayAttendance = computed(() => {
  const today = new Date()
  const inSelectedMonth =
    selectedDate.value.getFullYear() === today.getFullYear() &&
    selectedDate.value.getMonth() === today.getMonth()

  if (!inSelectedMonth) {
    return {
      isCurrentMonth: false,
      hasData: false,
      checkIn: '',
      checkOut: '',
      duration: '',
      status: null,
    }
  }

  const info = getDayCellInfo(today.getFullYear(), today.getMonth(), today.getDate())

  return {
    isCurrentMonth: true,
    hasData: info.hasData,
    checkIn: info.checkIn || 'Chưa có',
    checkOut: info.checkOut || 'Chưa có',
    duration: info.duration || '',
    status: info.hasData ? info.status : null,
  }
})

function onCalendarModelUpdate(value: Date): void {
  selectedDate.value = value
}
</script>

<template>
  <div class="space-y-4 py-3 sm:space-y-5 sm:py-4">
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
      class="relative overflow-hidden rounded-2xl border border-red-200/80 bg-gradient-to-r from-red-50 to-white px-4 py-3.5 shadow-sm sm:px-5"
    >
      <div class="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-red-100/70 blur-2xl" />
      <div class="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-3">
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm"
          >
            <i class="pi pi-exclamation-circle text-base" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-red-800">Không tải được dữ liệu chấm công</p>
            <p class="mt-1 text-[13px] leading-5 text-red-700/90">{{ errorMessage }}</p>
          </div>
        </div>
        <Button
          type="button"
          label="Thử lại"
          icon="pi pi-refresh"
          size="small"
          severity="danger"
          outlined
          class="shrink-0 self-start !bg-white/70 sm:self-auto"
          @click="reload"
        />
      </div>
    </div>

    <section class="box overflow-hidden">
      <div class="border-b border-slate-200/60 bg-slate-50/60 px-4 py-3.5 sm:px-5">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Lịch chấm công</h2>
            <p class="mt-1 text-sm text-slate-500">
              Xem nhanh lịch làm việc và giờ vào/ra trong ngày.
            </p>
          </div>
        </div>
      </div>

      <ProgressBar v-if="loading" mode="indeterminate" class="h-[2px]" />

      <div class="p-3 sm:p-4">
        <ChamCongCalendar
          :model-value="selectedDate"
          :loading="loading"
          :has-attendance="hasAnyAttendance"
          :status-counts="statusCounts"
          :today-attendance="todayAttendance"
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
