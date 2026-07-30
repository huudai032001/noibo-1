<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import type { JobKpiCreateKraForm, JobKpiTeamleadListItem } from '../models/job-kpi-teamlead.model'

defineProps<{
  visible: boolean
  form: JobKpiCreateKraForm
  userInfo: JobKpiTeamleadListItem | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:form': [value: JobKpiCreateKraForm]
  close: []
  submit: []
}>()

function patchForm(field: keyof JobKpiCreateKraForm, value: string, form: JobKpiCreateKraForm): void {
  emit('update:form', { ...form, [field]: value })
}

function onHide(): void {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    header="Thêm KRA cho nhân sự"
    class="w-full max-w-xl"
    :style="{ width: '92vw', maxWidth: '36rem' }"
    @update:visible="emit('update:visible', $event)"
    @hide="onHide"
  >
    <p v-if="userInfo" class="mb-4 text-sm text-slate-600 dark:text-slate-300">
      Nhân sự:
      <span class="font-semibold text-slate-800 dark:text-slate-100">
        {{ userInfo.user?.name || '—' }}
      </span>
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Tên KRA <span class="text-red-500">*</span>
        </label>
        <InputText
          :model-value="form.name"
          placeholder="Nhập tên KRA"
          fluid
          @update:model-value="patchForm('name', String($event ?? ''), form)"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Yêu cầu thành phẩm <span class="text-red-500">*</span>
        </label>
        <InputText
          :model-value="form.requestResult"
          placeholder="Nhập kết quả"
          fluid
          @update:model-value="patchForm('requestResult', String($event ?? ''), form)"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Thời gian hoàn thành <span class="text-red-500">*</span>
        </label>
        <InputText
          :model-value="form.numberHour"
          placeholder="Nhập thời gian hoàn thành"
          fluid
          @update:model-value="patchForm('numberHour', String($event ?? ''), form)"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Trọng số <span class="text-red-500">*</span>
        </label>
        <InputText
          :model-value="form.percentScore"
          placeholder="Nhập trọng số"
          fluid
          @update:model-value="patchForm('percentScore', String($event ?? ''), form)"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Huỷ" severity="secondary" outlined @click="onHide" />
        <Button
          type="button"
          label="Xác nhận"
          icon="pi pi-check"
          :loading="loading"
          @click="emit('submit')"
        />
      </div>
    </template>
  </Dialog>
</template>
