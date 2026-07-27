<script setup lang="ts">
import { computed } from 'vue'
import PayslipDetailDialog from './components/PayslipDetailDialog.vue'
import PayslipErrorBanner from './components/PayslipErrorBanner.vue'
import PayslipHeroBanner from './components/PayslipHeroBanner.vue'
import PayslipNoticeCard from './components/PayslipNoticeCard.vue'
import PayslipTable from './components/PayslipTable.vue'
import { usePhieuLuongKeyboard } from './composables/use-phieu-luong-keyboard'
import { usePhieuLuongPage } from './composables/use-phieu-luong-page'
import { usePhieuLuongSummary } from './composables/use-phieu-luong-summary'
import { usePhieuLuongTableFilter } from './composables/use-phieu-luong-table-filter'
import './components/payslip-page.css'

const page = usePhieuLuongPage()
const {
  selectedDate,
  payslipData,
  loading,
  errorMessage,
  linkManage,
  monthYearLabel,
  monthYearLongLabel,
  tableRows,
  hasPayslip,
  payslipType,
  visible,
  title,
  details,
  category,
  openDialog,
  handleMonthChange,
  reload,
} = page

const { netSalaryLabel, rowCount, highlightStats } = usePhieuLuongSummary({
  payslipData,
  tableRows,
  hasPayslip,
})

const {
  searchQuery,
  sections,
  filteredRows,
  hasSearchResults,
  clearSearch,
} = usePhieuLuongTableFilter(tableRows)

const isInitialLoading = computed(() => loading.value && !hasPayslip.value)
const isRefreshing = computed(() => loading.value && hasPayslip.value)

const emptyMessage = computed(
  () => `Chưa có thông tin tháng lương của tháng ${monthYearLabel.value}.`,
)

const isBackOffice = computed(() => payslipData.value.office === 'backoffice')

function updateSearchQuery(value: string): void {
  searchQuery.value = value
}

usePhieuLuongKeyboard(selectedDate, handleMonthChange, { disabled: loading })
</script>

<template>
  <div class="payslip-page">
    <PayslipHeroBanner
      :selected-date="selectedDate"
      :loading="loading"
      :month-year-long-label="monthYearLongLabel"
      :net-salary-label="netSalaryLabel"
      :highlight-stats="highlightStats"
      :data="payslipData"
      @update:selected-date="handleMonthChange"
    />

    <PayslipErrorBanner
      v-if="errorMessage && !loading"
      :message="errorMessage"
      @retry="reload"
    />

    <PayslipTable
      :rows="filteredRows"
      :sections="sections"
      :search-query="searchQuery"
      :has-search-results="hasSearchResults"
      :loading="loading"
      :is-initial-loading="isInitialLoading"
      :is-refreshing="isRefreshing"
      :has-payslip="hasPayslip"
      :payslip-type="payslipType"
      :link-manage="linkManage"
      :month-year-label="monthYearLabel"
      :empty-message="emptyMessage"
      :row-count="rowCount"
      @update:search-query="updateSearchQuery"
      @clear-search="clearSearch"
      @open-detail="openDialog({ ...$event, payslipType })"
    />

    <PayslipNoticeCard :is-back-office="isBackOffice" />

    <PayslipDetailDialog
      v-model:visible="visible"
      :title="title"
      :details="details"
      :category="category"
      :payslip-type="payslipType"
    />
  </div>
</template>

<style scoped>
.payslip-page {
  padding: 1rem 0 1.5rem;
}

@media (min-width: 768px) {
  .payslip-page {
    padding: 1.25rem 0 2rem;
  }
}
</style>
