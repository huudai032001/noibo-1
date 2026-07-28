<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="payslip-error">
    <div class="payslip-error__content">
      <i class="pi pi-exclamation-circle payslip-error__icon"></i>
      <div>
        <p class="payslip-error__title">Không tải được phiếu lương</p>
        <p class="payslip-error__message">{{ message }}</p>
      </div>
    </div>
    <Button
      type="button"
      label="Thử lại"
      icon="pi pi-refresh"
      severity="danger"
      outlined
      size="small"
      @click="emit('retry')"
    />
  </div>
</template>

<style scoped>
.payslip-error {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid #fecaca;
  border-radius: var(--pl-radius, 12px);
  background: #fef2f2;
}

@media (min-width: 640px) {
  .payslip-error {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.payslip-error__content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.payslip-error__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #dc2626;
  flex-shrink: 0;
}

.payslip-error__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #991b1b;
}

.payslip-error__message {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #b91c1c;
}
</style>
