<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

defineProps<{
  visible: boolean
  loadingAction: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Xác nhận duyệt yêu cầu"
    :style="{ width: '95vw', maxWidth: '28rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <p class="text-sm leading-6 text-slate-700">
      Bạn có chắc chắn muốn duyệt yêu cầu này?
    </p>

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
          label="Xác nhận duyệt"
          icon="pi pi-check"
          :loading="loadingAction"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>
