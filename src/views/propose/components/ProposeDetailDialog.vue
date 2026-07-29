<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { computed } from 'vue'
import { useFormatter } from '@/composables/use-formatter'
import { PROPOSE_CATEGORY, PROPOSE_STATUS } from '../constants'
import type { ProposeItem, ProposeProfileUser } from '../models/propose.model'
import ProposeCategoryBadge from './ProposeCategoryBadge.vue'
import ProposeStatusBadge from './ProposeStatusBadge.vue'
import {
  canApprovePropose,
  canDeletePropose,
  getCategoryLabel,
  getCategoryMeta,
  getLeaveTypeLabel,
  getOvertimeTypeLabel,
  getShiftOffLabel,
  getStatusLabel,
  getStatusMeta,
  getWorkShiftLabel,
} from '../utils/propose-helpers'

const props = defineProps<{
  visible: boolean
  item: ProposeItem | null
  profileUser: ProposeProfileUser | null
  fingerprintStart?: string
  fingerprintEnd?: string
  mode?: 'employee' | 'approval'
  loadingAction?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  delete: []
  approve: []
  reject: []
  close: []
}>()

const { formatDate, formatEmployeeCode } = useFormatter()

const categoryLabel = computed(() => getCategoryLabel(props.item?.category))
const departmentName = computed(
  () => props.profileUser?.department?.department?.name ?? '—',
)

function closeDialog(): void {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :header="`Chi tiết đề xuất: ${categoryLabel}`"
    class="w-full max-w-4xl"
    :style="{ width: '95vw', maxWidth: '56rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="item" class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <ProposeCategoryBadge :category="item.category" />
        <ProposeStatusBadge :status="item.status" />
      </div>

      <section class="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <i class="pi pi-user text-[var(--app-primary)]" />
          Thông tin nhân sự
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Mã nhân sự</label>
          <InputText
            v-if="item.user"
            :model-value="String(formatEmployeeCode(item.user.id))"
            disabled
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Họ và tên</label>
          <InputText :model-value="item.user?.name ?? ''" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Vị trí</label>
          <InputText
            :model-value="item.user?.profile?.accountType?.name ?? ''"
            disabled
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Phòng ban</label>
          <InputText :model-value="departmentName" disabled fluid />
        </div>
        </div>
      </section>

      <section
        v-if="item.category === PROPOSE_CATEGORY.leave"
        class="rounded-xl border border-slate-200/80 bg-white p-4"
      >
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <i :class="[getCategoryMeta(item.category).icon, getCategoryMeta(item.category).iconClass]" />
          Nội dung nghỉ phép
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Tổng số công nghỉ phép</label>
          <InputText :model-value="`${item.generalLeave ?? 0} Công`" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ngày bắt đầu nghỉ phép</label>
          <InputText :model-value="formatDate(item.startDate, 'date')" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Buổi bắt đầu nghỉ phép</label>
          <InputText :model-value="getShiftOffLabel(item.startShiftOff)" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ngày kết thúc nghỉ phép</label>
          <InputText :model-value="formatDate(item.endDate, 'date')" disabled fluid />
        </div>
        <div class="col-span-full flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Lý do nghỉ phép</label>
          <Textarea :model-value="item.reason" rows="4" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Số điện thoại liên hệ</label>
          <InputText :model-value="item.phone || profileUser?.phone || ''" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Loại nghỉ phép</label>
          <InputText :model-value="getLeaveTypeLabel(item.typeLeave)" disabled fluid />
        </div>
        </div>
      </section>

      <section
        v-else-if="item.category === PROPOSE_CATEGORY.overtime"
        class="rounded-xl border border-slate-200/80 bg-white p-4"
      >
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <i :class="[getCategoryMeta(item.category).icon, getCategoryMeta(item.category).iconClass]" />
          Nội dung tăng ca
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ngày tăng ca</label>
          <InputText :model-value="formatDate(item.startDate, 'date')" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Giờ bắt đầu</label>
          <InputText :model-value="item.timeCheckin ?? ''" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Giờ kết thúc</label>
          <InputText :model-value="item.timeCheckout ?? ''" disabled fluid />
        </div>
        <div class="col-span-full flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Lý do tăng ca</label>
          <Textarea :model-value="item.reason" rows="4" disabled fluid />
        </div>
        <div v-if="fingerprintStart" class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Giờ chấm công bắt đầu</label>
          <InputText :model-value="fingerprintStart" disabled fluid />
        </div>
        <div v-if="fingerprintEnd" class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Giờ chấm công kết thúc</label>
          <InputText :model-value="fingerprintEnd" disabled fluid />
        </div>
        </div>
      </section>

      <section
        v-else-if="item.category === PROPOSE_CATEGORY.offSiteHours"
        class="rounded-xl border border-slate-200/80 bg-white p-4"
      >
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <i :class="[getCategoryMeta(item.category).icon, getCategoryMeta(item.category).iconClass]" />
          Bổ sung giờ làm việc
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ngày cần bổ sung</label>
          <InputText :model-value="formatDate(item.startDate, 'date')" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Thời gian bắt đầu</label>
          <InputText :model-value="item.timeCheckin ?? ''" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Giờ kết thúc</label>
          <InputText :model-value="item.timeCheckout ?? ''" disabled fluid />
        </div>
        <div class="col-span-full flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Lý do bổ sung</label>
          <Textarea :model-value="item.reason" rows="4" disabled fluid />
        </div>
        </div>
      </section>

      <section
        v-else-if="item.category === PROPOSE_CATEGORY.shiftChange"
        class="rounded-xl border border-slate-200/80 bg-white p-4"
      >
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <i :class="[getCategoryMeta(item.category).icon, getCategoryMeta(item.category).iconClass]" />
          Xin đổi ca làm việc
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ngày đổi ca</label>
          <InputText :model-value="formatDate(item.startDate, 'date')" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ca hiện tại</label>
          <InputText
            :model-value="getWorkShiftLabel(item.currentWorkingHours)"
            disabled
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Ca thay đổi</label>
          <InputText
            :model-value="getWorkShiftLabel(item.currentWorkingChange)"
            disabled
            fluid
          />
        </div>
        <div class="col-span-full flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Lý do đổi ca</label>
          <Textarea :model-value="item.reason" rows="4" disabled fluid />
        </div>
        </div>
      </section>

      <section class="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <i :class="[getStatusMeta(item.status).icon, 'text-slate-500']" />
          Trạng thái xử lý
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">Trạng thái đơn</label>
          <InputText :model-value="getStatusLabel(item.status)" disabled fluid />
        </div>
        <div
          v-if="item.userHandler && item.status === PROPOSE_STATUS.approved"
          class="flex flex-col gap-1"
        >
          <label class="text-sm font-medium text-slate-700">Người duyệt</label>
          <InputText :model-value="item.userHandler.name ?? ''" disabled fluid />
        </div>
        <div
          v-if="item.userHandler && item.status === PROPOSE_STATUS.rejected"
          class="flex flex-col gap-1"
        >
          <label class="text-sm font-medium text-slate-700">Người từ chối</label>
          <InputText :model-value="item.userHandler.name ?? ''" disabled fluid />
        </div>
        <div
          v-if="item.category === PROPOSE_CATEGORY.overtime && item.status === PROPOSE_STATUS.approved"
          class="flex flex-col gap-1"
        >
          <label class="text-sm font-medium text-slate-700">Loại tăng ca</label>
          <InputText :model-value="getOvertimeTypeLabel(item.typeArise)" disabled fluid />
        </div>
        </div>
      </section>

      <div
        v-if="item.userHandler && item.status === PROPOSE_STATUS.rejected"
        class="rounded-xl border border-red-200/80 bg-red-50/50 p-4"
      >
        <label class="text-sm font-medium text-slate-700">Lý do từ chối</label>
        <Textarea :model-value="item.reasonForRefusal ?? ''" rows="3" disabled fluid />
      </div>
    </div>

    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <Button type="button" label="Đóng" severity="secondary" outlined @click="closeDialog" />
        <Button
          v-if="mode === 'employee' && item && canDeletePropose(item.status)"
          type="button"
          label="Xoá yêu cầu"
          severity="danger"
          @click="emit('delete')"
        />
        <template v-if="mode === 'approval' && item && canApprovePropose(item.status)">
          <Button
            type="button"
            label="Từ chối"
            severity="danger"
            outlined
            @click="emit('reject')"
          />
          <Button type="button" label="Duyệt" icon="pi pi-check" @click="emit('approve')" />
        </template>
      </div>
    </template>
  </Dialog>
</template>
