<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import {
  CategoryThueTncn,
  CategoryThuNhapRsm,
  PayslipType,
  TAX_DETAIL_LINK,
  type PayslipCategory,
  type PayslipTypeValue,
} from '../constants/payslip-config'
import type { PayslipDetailItem } from '../models/phieu-luong.model'
import BackOfficeDetailTable from './details/BackOfficeDetailTable.vue'
import GdkvDetailTable from './details/GdkvDetailTable.vue'
import LinkInstruct from './details/LinkInstruct.vue'
import PunishDetailTable from './details/PunishDetailTable.vue'

const props = defineProps<{
  visible: boolean
  title?: string
  details: PayslipDetailItem[]
  category: PayslipCategory | null
  payslipType: PayslipTypeValue | ''
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const dialogTitle = computed(() => {
  if (props.category === CategoryThueTncn) {
    return 'Xem chi tiết: Thuế thu nhập cá nhân'
  }
  return props.title || 'Xem chi tiết'
})

const isHeadOfficeTax = computed(
  () => props.payslipType === PayslipType.headOffice && props.category === CategoryThueTncn,
)

function closeDialog(): void {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="dialogTitle"
    class="w-full max-w-5xl"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="max-h-[70vh] overflow-auto rounded-xl border border-slate-100">
      <GdkvDetailTable v-if="category === CategoryThuNhapRsm" :details="details" />
      <BackOfficeDetailTable v-else-if="isHeadOfficeTax" :details="details" />
      <PunishDetailTable v-else :details="details" />
    </div>

    <LinkInstruct
      v-if="isHeadOfficeTax"
      class="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3"
      :link-manage="false"
      :link="TAX_DETAIL_LINK"
    />

    <template #footer>
      <Button type="button" label="Đóng" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>
