<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'

defineProps<{
  visible: boolean
  reasonForRefusal: string
  loadingAction: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:reasonForRefusal': [value: string]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Từ chối yêu cầu"
    :style="{ width: '95vw', maxWidth: '32rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
        Lý do từ chối <span class="text-red-500 dark:text-red-400">*</span>
      </label>
      <Textarea
        :model-value="reasonForRefusal"
        rows="4"
        maxlength="500"
        placeholder="Nhập lý do từ chối"
        fluid
        @update:model-value="emit('update:reasonForRefusal', $event ?? '')"
      />
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
          label="Xác nhận từ chối"
          severity="danger"
          :loading="loadingAction"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>
