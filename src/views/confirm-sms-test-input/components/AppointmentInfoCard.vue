<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  phone: string
  name: string
  schedule: string
}>()

const displaySchedule = computed(() => props.schedule?.trim() || 'Chưa có thông tin')
</script>

<template>
  <div class="appointment-card">
    <div class="appointment-card__schedule">
      <span class="appointment-card__schedule-label">Thời gian test</span>
      <strong class="appointment-card__schedule-value">{{ displaySchedule }}</strong>
    </div>

    <div class="appointment-card__rows">
      <div class="appointment-card__row">
        <span class="appointment-card__row-icon"><i class="pi pi-user" /></span>
        <div class="appointment-card__row-content">
          <span class="appointment-card__row-label">Khách hàng</span>
          <span class="appointment-card__row-value">{{ name }}</span>
        </div>
      </div>

      <div class="appointment-card__row">
        <span class="appointment-card__row-icon"><i class="pi pi-phone" /></span>
        <div class="appointment-card__row-content">
          <span class="appointment-card__row-label">Số điện thoại</span>
          <span class="appointment-card__row-value">{{ phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appointment-card {
  overflow: hidden;
  border-radius: 0.875rem;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.appointment-card__schedule {
  padding: 1rem 1.125rem;
  text-align: center;
  background: linear-gradient(135deg, #65558f, #7c6aad);
  color: #fff;
}

.appointment-card__schedule-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.appointment-card__schedule-value {
  display: block;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
}

.appointment-card__rows {
  border-top: 1px solid #f1f5f9;
}

.appointment-card__row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
}

.appointment-card__row + .appointment-card__row {
  border-top: 1px solid #f1f5f9;
}

.appointment-card__row-icon {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  background: #f5f3ff;
  color: #65558f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
}

.appointment-card__row-content {
  min-width: 0;
  text-align: left;
}

.appointment-card__row-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.125rem;
}

.appointment-card__row-value {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
}
</style>
