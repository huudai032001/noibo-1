<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import RadioButton from 'primevue/radiobutton'
import { PROPOSE_OVERTIME_TYPE_OPTIONS } from '../constants'

defineProps<{
  visible: boolean
  typeArise: number
  loadingAction?: boolean
  mode?: 'create' | 'approve'
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:typeArise': [value: number]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Chọn loại tăng ca"
    :style="{ width: '95vw', maxWidth: '28rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <p class="mb-4 text-sm text-slate-600">
      Vui lòng chọn loại tăng ca trước khi {{ mode === 'approve' ? 'duyệt' : 'gửi' }} yêu cầu.
    </p>

    <div class="flex flex-col gap-3">
      <div
        v-for="option in PROPOSE_OVERTIME_TYPE_OPTIONS"
        :key="option.value"
        class="flex items-center gap-2"
      >
        <RadioButton
          :input-id="`overtime-type-${option.value}`"
          :value="option.value"
          :model-value="typeArise"
          @update:model-value="emit('update:typeArise', $event as number)"
        />
        <label :for="`overtime-type-${option.value}`" class="text-sm text-slate-700">
          {{ option.label }}
        </label>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Huỷ bỏ"
          severity="secondary"
          outlined
          @click="emit('update:visible', false)"
        />
        <Button
          type="button"
          label="Xác nhận"
          :loading="loadingAction"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>
