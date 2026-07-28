<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { storeToRefs } from 'pinia'
import { useFormatter } from '@/composables/use-formatter'
import { useAuthStore } from '@/stores/auth'
import { formatAttendanceNumber, monthYearLongLabel } from '../utils/cham-cong-helpers'
import ChamCongMonthPicker from './ChamCongMonthPicker.vue'

const props = defineProps<{
  modelValue: Date
  officeLabel?: string
  totalHourWork: number | string
  totalDayWork: number | string
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const { formatEmployeeCode } = useFormatter()

const today = new Date()
const isCurrentMonth = computed(() => {
  return (
    props.modelValue.getFullYear() === today.getFullYear() &&
    props.modelValue.getMonth() === today.getMonth()
  )
})

const monthTitle = computed(() => monthYearLongLabel(props.modelValue))
const displayName = computed(() => currentUser.value?.name?.trim() || 'Nhân viên')

const employeeCode = computed(() => {
  if (!currentUser.value?.id) return '—'
  return String(formatEmployeeCode(currentUser.value.id))
})

const office = computed(() => props.officeLabel?.trim() || '—')
const hoursLabel = computed(() => formatAttendanceNumber(props.totalHourWork))
const daysLabel = computed(() => formatAttendanceNumber(props.totalDayWork))
const metaItems = computed(() => [
  { label: 'Mã NS', value: employeeCode.value },
  { label: 'Văn phòng', value: office.value },
])
const summaryCards = computed(() => [
  { key: 'hours', label: 'Giờ làm thực tế', value: hoursLabel.value, unit: 'giờ' },
  { key: 'days', label: 'Ngày công thực tế', value: daysLabel.value, unit: 'ngày' },
])

function onMonthUpdate(value: Date): void {
  emit('update:modelValue', new Date(value.getFullYear(), value.getMonth(), 1))
}

function goThisMonth(): void {
  emit('update:modelValue', new Date(today.getFullYear(), today.getMonth(), 1))
}
</script>

<template>
  <header class="attendance-summary">
    <div class="attendance-summary__top">
      <div class="attendance-summary__title-block">
        <div class="attendance-summary__headline">
          <span class="attendance-summary__eyebrow">Chấm công</span>
          <span class="attendance-summary__dot" aria-hidden="true">·</span>
          <h1 class="attendance-summary__title">{{ monthTitle }}</h1>
          <span class="attendance-summary__dot" aria-hidden="true">·</span>
          <p class="attendance-summary__employee">
            <span v-if="loading" class="attendance-summary__loading attendance-summary__loading--name" />
            <template v-else>{{ displayName }}</template>
          </p>
        </div>

        <ul class="attendance-summary__meta">
          <li v-for="item in metaItems" :key="item.label">
            <span class="attendance-summary__meta-label">{{ item.label }}</span>
            <span class="attendance-summary__meta-value">
              <span
                v-if="loading"
                class="attendance-summary__loading"
                :class="item.label === 'Mã NS' ? 'attendance-summary__loading--short' : 'attendance-summary__loading--medium'"
              />
              <template v-else>{{ item.value }}</template>
            </span>
          </li>
        </ul>
      </div>

      <div class="attendance-summary__actions">
        <ChamCongMonthPicker
          :model-value="modelValue"
          :loading="loading"
          @update:model-value="onMonthUpdate"
        />
        <Button
          type="button"
          label="Tháng này"
          size="small"
          outlined
          :disabled="loading || isCurrentMonth"
          class="attendance-summary__today"
          @click="goThisMonth"
        />
      </div>
    </div>

    <div class="attendance-summary__metrics">
      <div v-for="card in summaryCards" :key="card.key" class="attendance-metric">
        <span class="attendance-metric__label">{{ card.label }}</span>
        <span v-if="loading" class="attendance-summary__loading attendance-summary__loading--metric" />
        <span v-else class="attendance-metric__value">
          {{ card.value }}
          <span class="attendance-metric__unit">{{ card.unit }}</span>
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.attendance-summary {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  padding: 1.25rem 1.5rem;
}

@media (min-width: 768px) {
  .attendance-summary {
    padding: 1.25rem 1.75rem;
  }
}

.attendance-summary__top {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .attendance-summary__top {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }
}

.attendance-summary__headline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.375rem 0.5rem;
}

.attendance-summary__eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #472f92;
}

.attendance-summary__dot {
  color: #cbd5e1;
  font-weight: 400;
  line-height: 1;
}

.attendance-summary__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.attendance-summary__employee {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #334155;
}

.attendance-summary__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.attendance-summary__meta li {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 0.8125rem;
}

.attendance-summary__meta-label {
  color: #64748b;
}

.attendance-summary__meta-value {
  font-weight: 500;
  color: #1e293b;
}

.attendance-summary__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
}

.attendance-summary__today:deep(.p-button) {
  border-color: #e2e8f0;
  color: #475569;
}

.attendance-summary__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.attendance-metric {
  display: flex;
  flex: 1 1 0;
  min-width: min(100%, 14rem);
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
}

.attendance-metric__label {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
}

.attendance-metric__value {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1e293b;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.attendance-metric__unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.attendance-summary__loading {
  display: inline-block;
  height: 0.875rem;
  border-radius: 999px;
  background: #e2e8f0;
  animation: pulse 1.4s ease-in-out infinite;
}

.attendance-summary__loading--name {
  width: 6.5rem;
}

.attendance-summary__loading--short {
  width: 3.5rem;
}

.attendance-summary__loading--medium {
  width: 5.75rem;
}

.attendance-summary__loading--metric {
  width: 4.5rem;
  height: 1.25rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
}
</style>
