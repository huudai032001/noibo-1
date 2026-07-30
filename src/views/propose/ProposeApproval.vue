<script setup lang="ts">
import ProposeApprovalTable from './components/ProposeApprovalTable.vue'
import ProposeApproveDialog from './components/ProposeApproveDialog.vue'
import ProposeCreateDialog from './components/ProposeCreateDialog.vue'
import ProposeDetailDialog from './components/ProposeDetailDialog.vue'
import ProposeErrorBanner from './components/ProposeErrorBanner.vue'
import ProposeHeroBanner from './components/ProposeHeroBanner.vue'
import ProposeOvertimeTypeDialog from './components/ProposeOvertimeTypeDialog.vue'
import ProposePaginator from './components/ProposePaginator.vue'
import ProposeRejectDialog from './components/ProposeRejectDialog.vue'
import { useProposeApprovalPage } from './composables/use-propose-approval-page'

const page = useProposeApprovalPage()

const {
  items,
  loading,
  loadingSearch,
  loadingAction,
  loadingCreate,
  errorMessage,
  profileUser,
  departments,
  formState,
  editPhoneNumber,
  keyword,
  month,
  category,
  status,
  department,
  currentPage,
  perPage,
  total,
  dialog,
  roleFlags,
  categoryTitle,
  handlePageChange,
  handleOpenDetail,
  handleOpenApprove,
  handleOpenReject,
  handleConfirmApprove,
  handleConfirmReject,
  handleOpenCreate,
  handleCreate,
  handleCategoryChange,
  reload,
  validateGeneralLeave,
  validateDateRange,
  validateTimeRange,
  validateShiftChange,
  validatePhone,
  fingerprintStart,
  fingerprintEnd,
  handleResetFilters,
} = page
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <div class="col-span-12">
      <ProposeHeroBanner
        mode="approval"
        :total="total"
        :items="items"
        :loading="loading"
        :can-create="roleFlags.canCreate"
        :month="month"
        :category="category"
        :status="status"
        :keyword="keyword"
        :department="department"
        :departments="departments"
        :role-flags="roleFlags"
        @create="handleOpenCreate"
        @reset="handleResetFilters"
        @update:month="month = $event"
        @update:category="category = $event"
        @update:status="status = $event"
        @update:keyword="keyword = $event"
        @update:department="department = $event"
      />
    </div>

    <div v-if="errorMessage && !loading" class="col-span-12">
      <ProposeErrorBanner :message="errorMessage" @retry="reload" />
    </div>

    <ProposeApprovalTable
      :items="items"
      :loading="loading"
      :loading-search="loadingSearch"
      :total="total"
      :role-flags="roleFlags"
      @view="handleOpenDetail"
      @approve="handleOpenApprove"
      @reject="handleOpenReject"
      @clear-filters="handleResetFilters"
    />

    <ProposePaginator
      :total="total"
      :current-page="currentPage"
      :per-page="perPage"
      @page-change="handlePageChange"
    />

    <ProposeDetailDialog
      v-model:visible="dialog.detailVisible"
      :item="dialog.selectedItem"
      :profile-user="profileUser"
      :fingerprint-start="fingerprintStart"
      :fingerprint-end="fingerprintEnd"
      mode="approval"
      @approve="handleOpenApprove(dialog.selectedItem!)"
      @reject="handleOpenReject(dialog.selectedItem!)"
    />

    <ProposeApproveDialog
      v-model:visible="dialog.approveVisible"
      :loading-action="loadingAction"
      @confirm="handleConfirmApprove"
    />

    <ProposeRejectDialog
      v-model:visible="dialog.rejectVisible"
      :reason-for-refusal="dialog.reasonForRefusal"
      :loading-action="loadingAction"
      @update:reason-for-refusal="dialog.reasonForRefusal = $event"
      @confirm="handleConfirmReject"
    />

    <ProposeOvertimeTypeDialog
      v-model:visible="dialog.overtimeTypeVisible"
      :type-arise="formState.typeArise"
      mode="approve"
      :loading-action="loadingAction"
      @update:type-arise="formState.typeArise = $event"
      @confirm="handleConfirmApprove"
    />

    <ProposeCreateDialog
      v-model:visible="dialog.createVisible"
      :form-state="formState"
      :profile-user="profileUser"
      :edit-phone-number="editPhoneNumber"
      :loading-create="loadingCreate"
      :category-title="categoryTitle"
      @update:form-state="formState = $event"
      @update:edit-phone-number="editPhoneNumber = $event"
      @category-change="handleCategoryChange"
      @validate-general-leave="validateGeneralLeave"
      @validate-date-range="validateDateRange"
      @validate-time-range="validateTimeRange"
      @validate-shift-change="validateShiftChange"
      @validate-phone="validatePhone"
      @submit="handleCreate"
    />
  </div>
</template>
