<script setup lang="ts">
import ProposeCreateDialog from './components/ProposeCreateDialog.vue'
import ProposeDeleteDialog from './components/ProposeDeleteDialog.vue'
import ProposeDetailDialog from './components/ProposeDetailDialog.vue'
import ProposeErrorBanner from './components/ProposeErrorBanner.vue'
import ProposeHeroBanner from './components/ProposeHeroBanner.vue'
import ProposeOvertimeTypeDialog from './components/ProposeOvertimeTypeDialog.vue'
import ProposePaginator from './components/ProposePaginator.vue'
import ProposeTable from './components/ProposeTable.vue'
import { useProposePage } from './composables/use-propose-page'

const page = useProposePage()

const {
  items,
  loading,
  loadingSearch,
  loadingAction,
  loadingCreate,
  errorMessage,
  profileUser,
  formState,
  editPhoneNumber,
  month,
  category,
  status,
  currentPage,
  perPage,
  total,
  dialog,
  categoryTitle,
  showOvertimeTypeField,
  handlePageChange,
  handleOpenCreate,
  handleOpenDetail,
  handleOpenDelete,
  handleConfirmDelete,
  handleCreate,
  handleCreateOvertime,
  handleConfirmOvertimeType,
  handleCategoryChange,
  reload,
  validateGeneralLeave,
  validateDateRange,
  validateTimeRange,
  validateShiftChange,
  validatePhone,
  handleResetFilters,
} = page
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <div class="col-span-12">
      <ProposeHeroBanner
        mode="employee"
        :total="total"
        :items="items"
        :loading="loading"
        :month="month"
        :category="category"
        :status="status"
        @create="handleOpenCreate"
        @reset="handleResetFilters"
        @update:month="month = $event"
        @update:category="category = $event"
        @update:status="status = $event"
      />
    </div>

    <div v-if="errorMessage && !loading" class="col-span-12">
      <ProposeErrorBanner :message="errorMessage" @retry="reload" />
    </div>

    <ProposeTable
      :items="items"
      :loading="loading"
      :loading-search="loadingSearch"
      :total="total"
      show-create-empty
      @view="handleOpenDetail"
      @delete="handleOpenDelete"
      @create="handleOpenCreate"
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
      mode="employee"
      @delete="handleOpenDelete(dialog.selectedItem!)"
    />

    <ProposeDeleteDialog
      v-model:visible="dialog.deleteVisible"
      :item="dialog.selectedItem"
      :loading-action="loadingAction"
      @confirm="handleConfirmDelete"
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
      @submit="showOvertimeTypeField ? handleCreateOvertime() : handleCreate()"
    />

    <ProposeOvertimeTypeDialog
      v-model:visible="dialog.overtimeTypeVisible"
      :type-arise="formState.typeArise"
      mode="create"
      :loading-action="loadingCreate"
      @update:type-arise="formState.typeArise = $event"
      @confirm="handleConfirmOvertimeType"
    />
  </div>
</template>
