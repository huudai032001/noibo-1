<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ManageOkrShareExpDialog from './components/ManageOkrShareExpDialog.vue'
import ManageOkrUpsertDialog from './components/ManageOkrUpsertDialog.vue'
import ManageOkrsHero from './components/ManageOkrsHero.vue'
import ManageOkrsTable from './components/ManageOkrsTable.vue'
import { useManageOkrsPage } from './composables/use-manage-okrs-page'
import { useManageOkrsUrl } from './composables/use-manage-okrs-url'
import type { ManageOkrsFormData, ManageOkrsHuman } from './models/manage-okrs.model'

const page = useManageOkrsPage()

const {
  filters,
  pagination,
  dialogs,
  items,
  loading,
  loadingSubmit,
  loadingDetail,
  errorMessage,
  statusOptions,
  typeOptions,
  selectedExpRows,
  fetchList,
  updateStatus,
  submitShareExp,
  searchUsers,
  loadDetailForm,
  submitUpsert,
  onPageChange,
} = page

const users = ref<ManageOkrsHuman[]>([])
const loadingUsers = ref(false)
const createSelectedUsers = ref<ManageOkrsHuman[]>([])
const editSelectedUsers = ref<ManageOkrsHuman[]>([])
const name = filters.name
const quarter = filters.quarter
const year = filters.year
const total = pagination.total
const currentPage = pagination.currentPage
const perPage = pagination.perPage
const createVisible = dialogs.createVisible
const editVisible = dialogs.editVisible
const shareExpVisible = dialogs.shareExpVisible

const createFormData = ref<ManageOkrsFormData>({
  name: '',
  type: 1,
  kpiTarget: '',
  kpiMin: '',
  userIds: [],
  expTarget: '',
  result: '',
})

const editFormData = ref<ManageOkrsFormData>({
  name: '',
  type: 1,
  kpiTarget: '',
  kpiMin: '',
  userIds: [],
  expTarget: '',
  result: '',
})

const shareDialogTitle = computed(() =>
  dialogs.selectedItem.value ? `Chia EXP ${dialogs.selectedItem.value.name}` : 'Chia EXP',
)

const editDialogTitle = computed(() =>
  dialogs.selectedItem.value ? `Sửa OKR ${dialogs.selectedItem.value.name}` : 'Sửa OKR',
)
const selectedTotalExp = computed(() => dialogs.selectedItem.value?.totalExp ?? 0)
const { initFromUrl } = useManageOkrsUrl(
  {
    name,
    quarter,
    year,
    currentPage,
  },
  {
    onFetch: fetchList,
  },
)

async function handleOpenCreate(): Promise<void> {
  createFormData.value = {
    name: '',
    type: 1,
    kpiTarget: '',
    kpiMin: '',
    userIds: [],
    expTarget: '',
    result: '',
  }
  users.value = []
  createSelectedUsers.value = []
  dialogs.openCreate()
}

async function handleOpenEdit(itemId: number): Promise<void> {
  const detail = await loadDetailForm(itemId)
  if (!detail) return
  editFormData.value = detail.form
  editSelectedUsers.value = detail.selectedUsers
  users.value = detail.selectedUsers
  dialogs.editVisible.value = true
}

async function handleSearchUsers(keyword: string): Promise<void> {
  loadingUsers.value = true
  users.value = await searchUsers(keyword)
  loadingUsers.value = false
}

async function handleSubmitCreate(form: ManageOkrsFormData): Promise<void> {
  await submitUpsert(form)
}

async function handleSubmitEdit(form: ManageOkrsFormData): Promise<void> {
  const itemId = dialogs.selectedItem.value?.id
  if (!itemId) return
  await submitUpsert(form, itemId)
}

function handleResetFilters(): void {
  filters.resetFilters()
  pagination.resetPage()
}

async function handleOpenEditDialog(itemId: number): Promise<void> {
  dialogs.selectedItem.value = items.value.find((item) => item.id === itemId) ?? null
  if (!dialogs.selectedItem.value) return
  await handleOpenEdit(itemId)
}

onMounted(() => {
  initFromUrl()
  void fetchList()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <div class="col-span-12">
      <ManageOkrsHero
        :name="name"
        :quarter="quarter"
        :year="year"
        :quarter-options="filters.quarterOptions"
        :total="total"
        :loading="loading"
        @update:name="name = $event"
        @update:quarter="quarter = $event"
        @update:year="year = $event"
        @reset="handleResetFilters"
        @create="handleOpenCreate"
      />
    </div>

    <div
      v-if="errorMessage && !loading"
      class="col-span-12 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
    >
      {{ errorMessage }}
    </div>

    <div class="col-span-12">
      <ManageOkrsTable
        :items="items"
        :loading="loading"
        :total="total"
        :current-page="currentPage"
        :per-page="perPage"
        :status-options="statusOptions"
        @edit="handleOpenEditDialog($event.id)"
        @share-exp="dialogs.openShareExp"
        @update-status="updateStatus($event.item, $event.status)"
        @page-change="onPageChange"
      />
    </div>

    <ManageOkrUpsertDialog
      v-model:visible="createVisible"
      title="Thêm mới OKR"
      :type-options="typeOptions"
      :initial-data="createFormData"
      :loading="loadingSubmit"
      :users="users"
      :selected-users="createSelectedUsers"
      :loading-users="loadingUsers"
      @search-users="handleSearchUsers"
      @submit="handleSubmitCreate"
    />

    <ManageOkrUpsertDialog
      v-model:visible="editVisible"
      :title="editDialogTitle"
      :type-options="typeOptions"
      :initial-data="editFormData"
      :loading="loadingSubmit || loadingDetail"
      :users="users"
      :selected-users="editSelectedUsers"
      :loading-users="loadingUsers"
      disabled-exp-target
      @search-users="handleSearchUsers"
      @submit="handleSubmitEdit"
    />

    <ManageOkrShareExpDialog
      v-model:visible="shareExpVisible"
      :title="shareDialogTitle"
      :loading="loadingSubmit"
      :total-exp-target="selectedTotalExp"
      :initial-rows="selectedExpRows"
      @submit="submitShareExp"
    />
  </div>
</template>
