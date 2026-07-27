<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string
}>()
</script>

<template>
  <div class="detail-row">
    <span class="detail-row__icon"><i :class="icon" /></span>
    <div class="detail-row__content">
      <span class="detail-row__label">{{ label }}</span>
      <span class="detail-row__value">{{ value }}</span>
    </div>
  </div>
</template>

<style scoped>
.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.625rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.detail-row__icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.detail-row__content {
  min-width: 0;
}

.detail-row__label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
}

.detail-row__value {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
}
</style>
