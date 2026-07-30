<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Fieldset from 'primevue/fieldset'
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
const categoryMeta = computed(() => getCategoryMeta(props.item?.category))
const statusMeta = computed(() => getStatusMeta(props.item?.status))
const departmentName = computed(
  () => props.profileUser?.department?.department?.name ?? '—',
)

const contentTitle = computed(() => {
  switch (props.item?.category) {
    case PROPOSE_CATEGORY.leave:
      return 'Nội dung nghỉ phép'
    case PROPOSE_CATEGORY.overtime:
      return 'Nội dung tăng ca'
    case PROPOSE_CATEGORY.offSiteHours:
      return 'Bổ sung giờ làm việc'
    case PROPOSE_CATEGORY.shiftChange:
      return 'Xin đổi ca làm việc'
    default:
      return 'Nội dung đề xuất'
  }
})

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

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
    class="propose-detail-dialog w-full max-w-4xl"
    :style="{ width: '95vw', maxWidth: '56rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div v-if="item" class="propose-detail">
      <div class="propose-detail__summary">
        <ProposeCategoryBadge :category="item.category" />
        <ProposeStatusBadge :status="item.status" />
      </div>

      <Fieldset class="propose-detail__fieldset">
        <template #legend>
          <span class="propose-detail__legend">
            <i class="pi pi-user text-[var(--app-primary)]" />
            Thông tin nhân sự
          </span>
        </template>
        <dl class="propose-detail__grid propose-detail__grid--2">
          <div class="propose-detail__field">
            <dt>Mã nhân sự</dt>
            <dd>{{ item.user ? formatEmployeeCode(item.user.id) : '—' }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Họ và tên</dt>
            <dd>{{ displayValue(item.user?.name) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Vị trí</dt>
            <dd>{{ displayValue(item.user?.profile?.accountType?.name) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Phòng ban</dt>
            <dd>{{ departmentName }}</dd>
          </div>
        </dl>
      </Fieldset>

      <Fieldset
        v-if="item.category === PROPOSE_CATEGORY.leave"
        class="propose-detail__fieldset"
      >
        <template #legend>
          <span class="propose-detail__legend">
            <i :class="[categoryMeta.icon, categoryMeta.iconClass]" />
            {{ contentTitle }}
          </span>
        </template>
        <dl class="propose-detail__grid propose-detail__grid--2">
          <div class="propose-detail__field">
            <dt>Tổng số công nghỉ phép</dt>
            <dd>{{ item.generalLeave ?? 0 }} Công</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Ngày bắt đầu nghỉ phép</dt>
            <dd>{{ formatDate(item.startDate, 'date') || '—' }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Buổi bắt đầu nghỉ phép</dt>
            <dd>{{ displayValue(getShiftOffLabel(item.startShiftOff)) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Ngày kết thúc nghỉ phép</dt>
            <dd>{{ formatDate(item.endDate, 'date') || '—' }}</dd>
          </div>
          <div class="propose-detail__field propose-detail__field--full">
            <dt>Lý do nghỉ phép</dt>
            <dd class="propose-detail__reason">{{ displayValue(item.reason) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Số điện thoại liên hệ</dt>
            <dd>{{ displayValue(item.phone || profileUser?.phone) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Loại nghỉ phép</dt>
            <dd>{{ displayValue(getLeaveTypeLabel(item.typeLeave)) }}</dd>
          </div>
        </dl>
      </Fieldset>

      <Fieldset
        v-else-if="item.category === PROPOSE_CATEGORY.overtime"
        class="propose-detail__fieldset"
      >
        <template #legend>
          <span class="propose-detail__legend">
            <i :class="[categoryMeta.icon, categoryMeta.iconClass]" />
            {{ contentTitle }}
          </span>
        </template>
        <dl class="propose-detail__grid propose-detail__grid--3">
          <div class="propose-detail__field">
            <dt>Ngày tăng ca</dt>
            <dd>{{ formatDate(item.startDate, 'date') || '—' }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Giờ bắt đầu</dt>
            <dd>{{ displayValue(item.timeCheckin) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Giờ kết thúc</dt>
            <dd>{{ displayValue(item.timeCheckout) }}</dd>
          </div>
          <div class="propose-detail__field propose-detail__field--full">
            <dt>Lý do tăng ca</dt>
            <dd class="propose-detail__reason">{{ displayValue(item.reason) }}</dd>
          </div>
          <div v-if="fingerprintStart" class="propose-detail__field">
            <dt>Giờ chấm công bắt đầu</dt>
            <dd>{{ fingerprintStart }}</dd>
          </div>
          <div v-if="fingerprintEnd" class="propose-detail__field">
            <dt>Giờ chấm công kết thúc</dt>
            <dd>{{ fingerprintEnd }}</dd>
          </div>
        </dl>
      </Fieldset>

      <Fieldset
        v-else-if="item.category === PROPOSE_CATEGORY.offSiteHours"
        class="propose-detail__fieldset"
      >
        <template #legend>
          <span class="propose-detail__legend">
            <i :class="[categoryMeta.icon, categoryMeta.iconClass]" />
            {{ contentTitle }}
          </span>
        </template>
        <dl class="propose-detail__grid propose-detail__grid--3">
          <div class="propose-detail__field">
            <dt>Ngày cần bổ sung</dt>
            <dd>{{ formatDate(item.startDate, 'date') || '—' }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Thời gian bắt đầu</dt>
            <dd>{{ displayValue(item.timeCheckin) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Giờ kết thúc</dt>
            <dd>{{ displayValue(item.timeCheckout) }}</dd>
          </div>
          <div class="propose-detail__field propose-detail__field--full">
            <dt>Lý do bổ sung</dt>
            <dd class="propose-detail__reason">{{ displayValue(item.reason) }}</dd>
          </div>
        </dl>
      </Fieldset>

      <Fieldset
        v-else-if="item.category === PROPOSE_CATEGORY.shiftChange"
        class="propose-detail__fieldset"
      >
        <template #legend>
          <span class="propose-detail__legend">
            <i :class="[categoryMeta.icon, categoryMeta.iconClass]" />
            {{ contentTitle }}
          </span>
        </template>
        <dl class="propose-detail__grid propose-detail__grid--3">
          <div class="propose-detail__field">
            <dt>Ngày đổi ca</dt>
            <dd>{{ formatDate(item.startDate, 'date') || '—' }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Ca hiện tại</dt>
            <dd>{{ displayValue(getWorkShiftLabel(item.currentWorkingHours)) }}</dd>
          </div>
          <div class="propose-detail__field">
            <dt>Ca thay đổi</dt>
            <dd>{{ displayValue(getWorkShiftLabel(item.currentWorkingChange)) }}</dd>
          </div>
          <div class="propose-detail__field propose-detail__field--full">
            <dt>Lý do đổi ca</dt>
            <dd class="propose-detail__reason">{{ displayValue(item.reason) }}</dd>
          </div>
        </dl>
      </Fieldset>

      <Fieldset class="propose-detail__fieldset propose-detail__fieldset--status">
        <template #legend>
          <span class="propose-detail__legend">
            <i :class="[statusMeta.icon, 'text-slate-500 dark:text-slate-400']" />
            Trạng thái xử lý
          </span>
        </template>
        <dl class="propose-detail__grid propose-detail__grid--3">
          <div class="propose-detail__field">
            <dt>Trạng thái đơn</dt>
            <dd>
              <ProposeStatusBadge :status="item.status" />
            </dd>
          </div>
          <div
            v-if="item.userHandler && item.status === PROPOSE_STATUS.approved"
            class="propose-detail__field"
          >
            <dt>Người duyệt</dt>
            <dd>{{ displayValue(item.userHandler.name) }}</dd>
          </div>
          <div
            v-if="item.userHandler && item.status === PROPOSE_STATUS.rejected"
            class="propose-detail__field"
          >
            <dt>Người từ chối</dt>
            <dd>{{ displayValue(item.userHandler.name) }}</dd>
          </div>
          <div
            v-if="item.category === PROPOSE_CATEGORY.overtime && item.status === PROPOSE_STATUS.approved"
            class="propose-detail__field"
          >
            <dt>Loại tăng ca</dt>
            <dd>{{ displayValue(getOvertimeTypeLabel(item.typeArise)) }}</dd>
          </div>
          <div
            v-if="item.userHandler && item.status === PROPOSE_STATUS.rejected"
            class="propose-detail__field propose-detail__field--full"
          >
            <dt>Lý do từ chối</dt>
            <dd class="propose-detail__reason propose-detail__reason--danger">
              {{ displayValue(item.reasonForRefusal) }}
            </dd>
          </div>
        </dl>
      </Fieldset>
    </div>

    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <Button type="button" label="Đóng" severity="secondary" outlined @click="closeDialog" />
        <Button
          v-if="mode === 'employee' && item && canDeletePropose(item.status)"
          type="button"
          label="Xoá yêu cầu"
          severity="danger"
          :loading="loadingAction"
          @click="emit('delete')"
        />
        <template v-if="mode === 'approval' && item && canApprovePropose(item.status)">
          <Button
            type="button"
            label="Từ chối"
            severity="danger"
            outlined
            :disabled="loadingAction"
            @click="emit('reject')"
          />
          <Button
            type="button"
            label="Duyệt"
            icon="pi pi-check"
            :loading="loadingAction"
            @click="emit('approve')"
          />
        </template>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.propose-detail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.propose-detail__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.propose-detail__legend {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.propose-detail__grid {
  display: grid;
  gap: 0.75rem 1rem;
}

.propose-detail__grid--2 {
  grid-template-columns: 1fr;
}

.propose-detail__grid--3 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .propose-detail__grid--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .propose-detail__grid--3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.propose-detail__field {
  min-width: 0;
}

.propose-detail__field--full {
  grid-column: 1 / -1;
}

.propose-detail__field dt {
  margin: 0 0 0.2rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  color: #64748b;
}

.propose-detail__field dd {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 550;
  line-height: 1.4;
  color: #0f172a;
  word-break: break-word;
}

.propose-detail__reason {
  padding: 0.625rem 0.75rem;
  border-radius: 0.625rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  white-space: pre-wrap;
}

.propose-detail__reason--danger {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.propose-detail-dialog :deep(.p-dialog-header) {
  padding: 0.85rem 1.1rem;
}

.propose-detail-dialog :deep(.p-dialog-content) {
  padding: 0.75rem 1.1rem 1rem;
  max-height: calc(100vh - 9rem);
  overflow-y: auto;
}

.propose-detail-dialog :deep(.p-dialog-footer) {
  padding: 0.75rem 1.1rem;
}

.propose-detail__fieldset {
  margin: 0;
  border-radius: 0.875rem;
  border-color: #e2e8f0;
  background: #fff;
}

.propose-detail__fieldset :deep(.p-fieldset-legend) {
  padding: 0 0.35rem;
  background: transparent;
  border: none;
}

.propose-detail__fieldset :deep(.p-fieldset-content) {
  padding: 0.35rem 0.15rem 0.15rem;
}

.propose-detail__fieldset--status {
  background: #f8fafc;
}
</style>
