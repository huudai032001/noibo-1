<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useFormatter } from '@/composables/use-formatter'
import type { ProposeItem } from '../models/propose.model'
import { getCategoryLabel } from '../utils/propose-helpers'

defineProps<{
  visible: boolean
  item: ProposeItem | null
  loadingAction: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
}>()

const { formatDate } = useFormatter()
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="`Xoá đơn xin ${getCategoryLabel(item?.category)}`"
    :style="{ width: '95vw', maxWidth: '28rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <p class="text-sm leading-6 text-slate-700">
      Bạn có chắc chắn muốn xoá đơn xin
      <strong>{{ getCategoryLabel(item?.category) }}</strong>
      ngày <strong>{{ formatDate(item?.startDate, 'date') }}</strong>?
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
          label="Xác nhận"
          severity="danger"
          :loading="loadingAction"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>
