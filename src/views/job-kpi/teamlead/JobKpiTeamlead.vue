<script setup lang="ts">
import JobKpiCreateKraDialog from './components/JobKpiCreateKraDialog.vue'
import JobKpiHistoryDialog from './components/JobKpiHistoryDialog.vue'
import JobKpiScoreConfirmDialog from './components/JobKpiScoreConfirmDialog.vue'
import JobKpiScoreDialog from './components/JobKpiScoreDialog.vue'
import JobKpiTeamleadErrorBanner from './components/JobKpiTeamleadErrorBanner.vue'
import JobKpiTeamleadHero from './components/JobKpiTeamleadHero.vue'
import JobKpiTeamleadPaginator from './components/JobKpiTeamleadPaginator.vue'
import JobKpiTeamleadTable from './components/JobKpiTeamleadTable.vue'
import { useJobKpiTeamleadPage } from './composables/use-job-kpi-teamlead-page'

const page = useJobKpiTeamleadPage()

const {
  items,
  departments,
  detailData,
  loading,
  loadingSearch,
  loadingDetail,
  loadingConfirm,
  loadingCreateKra,
  loadingHistory,
  errorMessage,
  fillSuggest,
  meetingFillSuggest,
  keyword,
  month,
  departmentId,
  status,
  currentPage,
  perPage,
  total,
  dialog,
  createKraForm,
  historyItems,
  selectedHistory,
  needInputCount,
  needScoreCount,
  scoredCount,
  reload,
  handlePageChange,
  handleResetFilters,
  handleOpenScore,
  handleCloseScore,
  handleOpenConfirm,
  handleCloseConfirm,
  handleConfirmScore,
  handleEnableEdit,
  handleOpenCreateKra,
  handleCloseCreateKra,
  handleSubmitCreateKra,
  handleOpenHistory,
  handleCloseHistory,
  handleSelectHistory,
  markWeekPercent,
  fillAllWeekPercent,
  updateKraField,
  persistKraInfo,
  updateKraDescription,
  updateMeetingDescription,
  changeMeetingScore,
  fillAllMeetingScores,
  resetFillSuggest,
  resetMeetingFillSuggest,
} = page
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <div class="col-span-12">
      <JobKpiTeamleadHero
        :keyword="keyword"
        :month="month"
        :department-id="departmentId"
        :status="status"
        :departments="departments"
        :loading="loading || loadingSearch"
        :total="total"
        :need-input-count="needInputCount"
        :need-score-count="needScoreCount"
        :scored-count="scoredCount"
        @update:keyword="keyword = $event"
        @update:month="month = $event"
        @update:department-id="departmentId = $event"
        @update:status="status = $event"
        @reset="handleResetFilters"
      />
    </div>

    <div v-if="errorMessage && !loading" class="col-span-12">
      <JobKpiTeamleadErrorBanner :message="errorMessage" @retry="reload" />
    </div>

    <JobKpiTeamleadTable
      :items="items"
      :loading="loading"
      :loading-search="loadingSearch"
      :loading-detail="loadingDetail"
      :total="total"
      @score="handleOpenScore"
      @create-kra="handleOpenCreateKra"
      @history="handleOpenHistory"
      @clear-filters="handleResetFilters"
    />

    <JobKpiTeamleadPaginator
      :total="total"
      :current-page="currentPage"
      :per-page="perPage"
      @page-change="handlePageChange"
    />

    <JobKpiScoreDialog
      v-model:visible="dialog.scoreVisible"
      :user-name="dialog.userName"
      :is-view-only="dialog.isViewOnly"
      :loading="loadingDetail"
      :detail="detailData"
      :fill-suggest="fillSuggest"
      :meeting-fill-suggest="meetingFillSuggest"
      @close="handleCloseScore"
      @confirm="handleOpenConfirm"
      @edit="handleEnableEdit"
      @update-kra-field="updateKraField"
      @persist-kra="persistKraInfo"
      @mark-week="markWeekPercent"
      @update-kra-description="updateKraDescription"
      @fill-all-week="fillAllWeekPercent"
      @dismiss-week-fill="resetFillSuggest"
      @change-meeting-score="changeMeetingScore"
      @update-meeting-description="updateMeetingDescription"
      @fill-all-meeting="fillAllMeetingScores"
      @dismiss-meeting-fill="resetMeetingFillSuggest"
    />

    <JobKpiScoreConfirmDialog
      v-model:visible="dialog.confirmVisible"
      :detail="detailData"
      :loading="loadingConfirm"
      @close="handleCloseConfirm"
      @confirm="handleConfirmScore"
    />

    <JobKpiCreateKraDialog
      v-model:visible="dialog.createKraVisible"
      v-model:form="createKraForm"
      :user-info="dialog.selectedItem"
      :loading="loadingCreateKra"
      @close="handleCloseCreateKra"
      @submit="handleSubmitCreateKra"
    />

    <JobKpiHistoryDialog
      v-model:visible="dialog.historyVisible"
      :user-info="dialog.selectedItem"
      :items="historyItems"
      :selected="selectedHistory"
      :loading="loadingHistory"
      @close="handleCloseHistory"
      @select="handleSelectHistory"
    />
  </div>
</template>
