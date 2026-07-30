<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useFormatter } from '@/composables/use-formatter'
import type { ManageOkrsFormData, ManageOkrsHuman } from '../models/manage-okrs.model'

const props = defineProps<{
  visible: boolean
  loading: boolean
  title: string
  typeOptions: ReadonlyArray<{ label: string; value: number }>
  initialData: ManageOkrsFormData
  disabledExpTarget?: boolean
  loadingUsers?: boolean
  users: ManageOkrsHuman[]
  selectedUsers?: ManageOkrsHuman[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  searchUsers: [keyword: string]
  submit: [form: ManageOkrsFormData]
}>()

const form = ref<ManageOkrsFormData>({
  name: '',
  type: 1,
  kpiTarget: '',
  kpiMin: '',
  userIds: [],
  expTarget: '',
  result: '',
})
const selectedUsersModel = ref<ManageOkrsHuman[]>([])
const searchKeyword = ref('')
const { formatEmployeeCode } = useFormatter()

function mergeUsers(users: ManageOkrsHuman[]): ManageOkrsHuman[] {
  const map = new Map<number, ManageOkrsHuman>()
  users.forEach((user) => {
    map.set(user.id, {
      ...user,
      displayName:
        user.displayName?.trim() || `${formatEmployeeCode(user.id)} - ${user.name}`.trim(),
    })
  })
  return [...map.values()]
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return
    form.value = { ...props.initialData, userIds: [...props.initialData.userIds] }
    selectedUsersModel.value = mergeUsers(props.selectedUsers ?? [])
    searchKeyword.value = ''
  },
  { immediate: true },
)

watch(
  selectedUsersModel,
  (users) => {
    form.value.userIds = users.map((user) => user.id)
  },
  { deep: true },
)

const userSuggestions = computed(() => mergeUsers([...(props.selectedUsers ?? []), ...props.users]))

const canSubmit = computed(() => {
  return (
    form.value.name.trim().length > 0 &&
    form.value.kpiTarget.trim().length > 0 &&
    form.value.expTarget.trim().length > 0 &&
    form.value.userIds.length > 0
  )
})

const requiredMissingCount = computed(() => {
  let count = 0
  if (!form.value.name.trim()) count += 1
  if (!form.value.kpiTarget.trim()) count += 1
  if (!form.value.expTarget.trim()) count += 1
  if (form.value.userIds.length === 0) count += 1
  return count
})

function closeDialog(): void {
  emit('update:visible', false)
}

function onSearchUsers(event: { query?: string }): void {
  searchKeyword.value = (event.query ?? '').trim()
  emit('searchUsers', searchKeyword.value)
}

function onClearUsers(): void {
  searchKeyword.value = ''
  selectedUsersModel.value = []
}

function onSubmit(): void {
  emit('submit', { ...form.value, userIds: [...form.value.userIds] })
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :closable="!loading"
    :dismissable-mask="!loading"
    :header="title"
    class="w-[95vw] max-w-3xl"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="mb-3 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
      Các trường có dấu <span class="text-red-500">*</span> là bắt buộc.
      <span v-if="requiredMissingCount > 0" class="ml-1 font-medium">
        Còn thiếu {{ requiredMissingCount }} trường.
      </span>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div class="space-y-1 md:col-span-2">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
          Tên OKR <span class="text-red-500">*</span>
        </label>
        <InputText v-model="form.name" fluid size="small" placeholder="Nhập tên OKR" />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
          Phân loại <span class="text-red-500">*</span>
        </label>
        <Select
          v-model="form.type"
          :options="[...typeOptions]"
          option-label="label"
          option-value="value"
          fluid
          size="small"
          disabled
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
          Số EXP của OKR <span class="text-red-500">*</span>
        </label>
        <InputText
          v-model="form.expTarget"
          fluid
          size="small"
          placeholder="Ví dụ: 500"
          :disabled="disabledExpTarget"
        />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
          KPI mục tiêu <span class="text-red-500">*</span>
        </label>
        <InputText v-model="form.kpiTarget" fluid size="small" placeholder="Nhập KPI mục tiêu" />
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">KPI tối thiểu</label>
        <InputText v-model="form.kpiMin" fluid size="small" placeholder="Nhập KPI tối thiểu" />
      </div>

      <div class="space-y-1 md:col-span-2">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
          Nhân sự tham gia <span class="text-red-500">*</span>
        </label>
        <AutoComplete
          v-model="selectedUsersModel"
          multiple
          optionLabel="displayName"
          :suggestions="userSuggestions"
          placeholder="Tìm SĐT hoặc Mã nhân viên"
          class="manage-okr-users-autocomplete w-full"
          showClear
          fluid
          :loading="loadingUsers"
          @complete="onSearchUsers"
          @clear="onClearUsers"
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <div>
                Nhân viên: {{ formatEmployeeCode(slotProps.option.id) }} -
                {{ slotProps.option.name }}
                <span v-if="slotProps.option.phone"> - {{ slotProps.option.phone }}</span>
              </div>
            </div>
          </template>
          <template #header>
            <div v-if="userSuggestions.length > 0 && searchKeyword" class="px-3 py-3 font-medium">
              Có ({{ userSuggestions.length }}) kết quả phù hợp với: {{ searchKeyword }}
            </div>
          </template>
          <template #empty>
            <div class="flex items-center justify-between px-3 py-2">
              <div class="flex items-center">
                <i class="pi pi-search mr-2"></i>
                {{
                  loadingUsers
                    ? 'Chúng tôi đang tìm nhân viên cho bạn...'
                    : 'Không tìm thấy nhân viên'
                }}
              </div>
              <i v-if="loadingUsers" class="pi pi-spinner pi-spin"></i>
            </div>
          </template>
        </AutoComplete>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Gõ tên nhân sự để tìm nhanh, có thể chọn nhiều người cùng lúc.
        </p>
      </div>

      <div class="space-y-1 md:col-span-2">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">Link thành phẩm</label>
        <Textarea v-model="form.result" auto-resize rows="3" fluid placeholder="Nhập link thành phẩm" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Hủy" severity="secondary" text :disabled="loading" @click="closeDialog" />
        <Button
          label="Lưu thông tin"
          icon="pi pi-save"
          :loading="loading"
          :disabled="!canSubmit"
          @click="onSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.manage-okr-users-autocomplete :deep(.p-autocomplete-input-multiple) {
  display: flex;
  min-height: 2.625rem;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
}

.manage-okr-users-autocomplete :deep(.p-autocomplete-chip-item) {
  margin: 0;
}

.manage-okr-users-autocomplete :deep(.p-autocomplete-chip) {
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid #94a3b8;
  border-radius: 9999px;
  background: #e2e8f0;
  padding: 0.25rem 0.625rem;
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.manage-okr-users-autocomplete :deep(.p-autocomplete-chip-icon) {
  border-radius: 9999px;
  color: #64748b;
  font-size: 0.75rem;
  transition: background-color 0.2s ease;
}

.manage-okr-users-autocomplete :deep(.p-autocomplete-chip-icon:hover) {
  background-color: rgba(100, 116, 139, 0.18);
}

:global(html.dark) .manage-okr-users-autocomplete :deep(.p-autocomplete-chip) {
  border-color: #64748b;
  background: rgba(148, 163, 184, 0.2);
  color: #e2e8f0;
}

:global(html.dark) .manage-okr-users-autocomplete :deep(.p-autocomplete-chip-icon) {
  color: #cbd5e1;
}
</style>
