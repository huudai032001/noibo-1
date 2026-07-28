<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from 'primevue/skeleton'
import { useFormatter } from '@/composables/use-formatter'
import { useAuthStore } from '@/stores/auth'
import type { PayslipHighlightStat } from '../composables/use-phieu-luong-summary'
import type { PayslipData } from '../models/phieu-luong.model'
import PayslipMonthPicker from './PayslipMonthPicker.vue'

const props = defineProps<{
  selectedDate: Date
  loading?: boolean
  monthYearLongLabel: string
  netSalaryLabel?: string | null
  highlightStats?: PayslipHighlightStat[]
  data: PayslipData
}>()

const emit = defineEmits<{
  'update:selectedDate': [value: Date]
}>()

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const { formatEmployeeCode } = useFormatter()

const displayName = computed(() => {
  if (props.data.hoVaTen) return props.data.hoVaTen
  if (props.data.hoTen) return props.data.hoTen
  return currentUser.value?.name ?? 'Nhân viên'
})

const employeeCode = computed(() => {
  if (props.data.maNhanSu) return props.data.maNhanSu
  if (currentUser.value?.id) return String(formatEmployeeCode(currentUser.value.id))
  return '—'
})

const positionLabel = computed(() => {
  if (props.data.viTri) return props.data.viTri
  if (props.data.chucVu) return props.data.chucVu
  if (props.data.accountType) return props.data.accountType
  return currentUser.value?.accountType?.name ?? '—'
})

interface MetaItem {
  label: string
  value: string
}

const metaItems = computed<MetaItem[]>(() => {
  const items: MetaItem[] = [
    { label: 'Mã NS', value: employeeCode.value },
  ]

  if (props.data.isV2) {
    if (props.data.chucVu) items.push({ label: 'Chức vụ', value: props.data.chucVu })
    else if (props.data.viTri) items.push({ label: 'Vị trí', value: props.data.viTri })
    if (props.data.capBac) items.push({ label: 'Cấp bậc', value: props.data.capBac })
    if (props.data.khuVuc) items.push({ label: 'Khu vực', value: props.data.khuVuc })
    if (props.data.vanPhong) items.push({ label: 'Văn phòng', value: props.data.vanPhong })
    if (props.data.accountType === 'v2_vp_tong' && props.data.levelChuyenMon) {
      items.push({ label: 'Level Chuyên môn', value: props.data.levelChuyenMon })
    }
    if (props.data.accountType === 'v2_vp_tong' && props.data.levelQuanTri) {
      items.push({ label: 'Level Quản trị', value: props.data.levelQuanTri })
    }
    return items
  }

  items.push({ label: 'Vị trí', value: positionLabel.value })
  if (props.data.khuVuc) {
    items.push({ label: 'Khu vực', value: props.data.khuVuc })
  } else if (props.data.vanPhong) {
    items.push({ label: 'Văn phòng', value: props.data.vanPhong })
  }

  return items
})

const secondaryStats = computed(() => {
  return (props.highlightStats ?? []).filter((stat) => stat.label !== 'Thuế TNCN').slice(0, 2)
})

function onDateChange(value: Date): void {
  emit('update:selectedDate', value)
}
</script>

<template>
  <header class="payslip-card payslip-summary">
    <div class="payslip-summary__top">
      <div class="payslip-summary__title-block">
        <div class="payslip-summary__headline">
          <span class="payslip-summary__eyebrow">Phiếu lương</span>
          <span class="payslip-summary__dot" aria-hidden="true">·</span>
          <h1 class="payslip-summary__title">{{ monthYearLongLabel }}</h1>
          <span class="payslip-summary__dot" aria-hidden="true">·</span>
          <p class="payslip-summary__employee">{{ displayName }}</p>
        </div>
        <ul class="payslip-summary__meta">
          <li v-for="item in metaItems" :key="item.label">
            <span class="payslip-summary__meta-label">{{ item.label }}</span>
            <span class="payslip-summary__meta-value">{{ item.value }}</span>
          </li>
        </ul>
      </div>

      <PayslipMonthPicker
        :model-value="selectedDate"
        :loading="loading"
        @update:model-value="onDateChange"
      />
    </div>

    <div v-if="loading" class="payslip-summary__metrics payslip-summary__metrics--loading">
      <Skeleton height="3rem" class="payslip-summary__metric-skeleton" />
      <Skeleton height="3rem" class="payslip-summary__metric-skeleton" />
      <Skeleton height="3rem" class="payslip-summary__metric-skeleton" />
    </div>

    <div v-else-if="netSalaryLabel || secondaryStats.length" class="payslip-summary__metrics">
      <div v-if="netSalaryLabel" class="payslip-metric payslip-metric--primary">
        <span class="payslip-metric__label">Thu nhập thực nhận</span>
        <span class="payslip-metric__value">{{ netSalaryLabel }}</span>
      </div>
      <div
        v-for="stat in secondaryStats"
        :key="stat.label"
        class="payslip-metric"
      >
        <span class="payslip-metric__label">{{ stat.label }}</span>
        <span class="payslip-metric__value">{{ stat.value }}</span>
      </div>
      <div v-if="!netSalaryLabel && !loading" class="payslip-metric payslip-metric--empty">
        <span class="payslip-metric__label">Trạng thái</span>
        <span class="payslip-metric__value payslip-metric__value--muted">Chưa có số liệu</span>
      </div>
    </div>

  </header>
</template>

<style scoped>
.payslip-summary {
  position: relative;
  overflow: visible;
  padding: 1.25rem 1.5rem;
}

@media (min-width: 768px) {
  .payslip-summary {
    padding: 1.5rem 1.75rem;
  }
}

.payslip-summary__metrics--loading {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--pl-border);
}

.payslip-summary__metric-skeleton {
  flex: 1 1 0;
  min-width: min(100%, 12rem);
  border-radius: 10px !important;
}

@media (min-width: 768px) {
  .payslip-summary__metric-skeleton {
    min-width: 0;
  }

  .payslip-summary__metric-skeleton:first-child {
    flex: 1.4 1 0;
  }
}

.payslip-summary__top {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .payslip-summary__top {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
}

.payslip-summary__headline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.375rem 0.5rem;
}

.payslip-summary__dot {
  color: var(--pl-border);
  font-weight: 400;
  line-height: 1;
}

.payslip-summary__eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pl-accent);
  white-space: nowrap;
}

.payslip-summary__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--pl-text);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .payslip-summary__title {
    font-size: 1.25rem;
  }
}

.payslip-summary__employee {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--pl-text);
  white-space: nowrap;
}

.payslip-summary__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 1rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.payslip-summary__meta li {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 0.8125rem;
}

.payslip-summary__meta-label {
  color: var(--pl-muted);
}

.payslip-summary__meta-value {
  font-weight: 500;
  color: var(--pl-text);
}

.payslip-summary__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--pl-border);
}

.payslip-metric {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: min(100%, 12rem);
  padding: 0.75rem 1rem;
  border: 1px solid var(--pl-border);
  border-radius: 10px;
  background: var(--pl-surface-muted);
}

@media (min-width: 768px) {
  .payslip-metric {
    flex: 1 1 0;
    min-width: 0;
  }
}

.payslip-metric--primary {
  flex: 1.4 1 0;
  border-color: color-mix(in srgb, var(--pl-accent) 25%, var(--pl-border));
  background: var(--pl-accent-soft);
}

.payslip-metric--empty {
  flex: 1 1 100%;
  justify-content: flex-start;
}

.payslip-metric__label {
  font-size: 0.75rem;
  color: var(--pl-muted);
  white-space: nowrap;
}

.payslip-metric__value {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--pl-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.payslip-metric--primary .payslip-metric__value {
  font-size: 1.125rem;
  color: var(--pl-accent);
}

@media (min-width: 768px) {
  .payslip-metric--primary .payslip-metric__value {
    font-size: 1.25rem;
  }
}

.payslip-metric__value--muted {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--pl-muted);
}
</style>
