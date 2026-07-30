<script setup lang="ts">
import JobKpiCompleteDialog from './components/JobKpiCompleteDialog.vue'
import JobKpiErrorBanner from './components/JobKpiErrorBanner.vue'
import JobKpiMeetingTable from './components/JobKpiMeetingTable.vue'
import JobKpiResultDetailDialog from './components/JobKpiResultDetailDialog.vue'
import JobKpiStaffHero from './components/JobKpiStaffHero.vue'
import JobKpiStaffPaginator from './components/JobKpiStaffPaginator.vue'
import JobKpiStaffTable from './components/JobKpiStaffTable.vue'
import JobKpiTabSwitch from './components/JobKpiTabSwitch.vue'
import { JOB_KPI_STAFF_TABS } from './constants'
import { useJobKpiStaffPage } from './composables/use-job-kpi-staff-page'

const page = useJobKpiStaffPage()

const {
  kraItems,
  loading,
  loadingSearch,
  errorMessage,
  activeTab,
  resultFeedback,
  savingKraIds,
  month,
  currentPage,
  perPage,
  total,
  dialog,
  totalPercentKra,
  totalScoreMeeting,
  meetingDescription,
  weekMeetings,
  weekCount,
  inputtedCount,
  pendingCount,
  reload,
  handlePageChange,
  handleMonthChange,
  handleTabChange,
  handleOpenDetail,
  handleCloseDetail,
  handleCloseComplete,
  onResultInput,
} = page
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <div class="col-span-12">
      <JobKpiStaffHero
        :month="month"
        :loading="loading"
        :total-percent-kra="totalPercentKra"
        :total-score-meeting="totalScoreMeeting"
        :active-tab="activeTab"
        :total="total"
        :inputted-count="inputtedCount"
        :pending-count="pendingCount"
        @update:month="handleMonthChange"
        @update:tab="handleTabChange"
      />
    </div>

    <div v-if="errorMessage && !loading" class="col-span-12">
      <JobKpiErrorBanner :message="errorMessage" @retry="reload" />
    </div>

    <div class="col-span-12">
      <JobKpiTabSwitch :active-tab="activeTab" @update:tab="handleTabChange" />
    </div>

    <div v-show="activeTab === JOB_KPI_STAFF_TABS.kpi" class="col-span-12 grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <JobKpiStaffTable
          :items="kraItems"
          :loading="loading"
          :loading-search="loadingSearch"
          :total="total"
          :total-percent-kra="totalPercentKra"
          :result-feedback="resultFeedback"
          :saving-kra-ids="savingKraIds"
          @view="handleOpenDetail"
          @update-result="onResultInput"
        />
      </div>

      <JobKpiStaffPaginator
        :total="total"
        :current-page="currentPage"
        :per-page="perPage"
        @page-change="handlePageChange"
      />
    </div>

    <div v-show="activeTab === JOB_KPI_STAFF_TABS.meeting" class="col-span-12">
      <JobKpiMeetingTable
        :week-meetings="weekMeetings"
        :week-count="weekCount"
        :loading="loading"
        :loading-search="loadingSearch"
        :total-score-meeting="totalScoreMeeting"
        :description="meetingDescription"
      />
    </div>

    <JobKpiResultDetailDialog
      v-model:visible="dialog.detailVisible"
      :item="dialog.selectedItem"
      @close="handleCloseDetail"
    />

    <JobKpiCompleteDialog
      v-model:visible="dialog.completeVisible"
      :is-happy="dialog.isHappyComplete"
      @close="handleCloseComplete"
    />
  </div>
</template>
