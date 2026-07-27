<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'error' | 'warning'
    title: string
  }>(),
  {
    type: 'success',
  },
)

const cardClass = computed(() => `result-message--${props.type}`)
</script>

<template>
  <div class="result-message" :class="cardClass">
    <div class="result-message__icon">
      <i
        :class="
          type === 'error'
            ? 'pi pi-times-circle'
            : type === 'warning'
              ? 'pi pi-exclamation-circle'
              : 'pi pi-check-circle'
        "
      />
    </div>

    <h2 class="result-message__title">{{ title }}</h2>

    <div v-if="$slots.default" class="result-message__content">
      <slot />
    </div>

    <div v-if="$slots.actions" class="result-message__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.result-message {
  padding: 1.25rem 1rem;
  border-radius: 0.875rem;
  text-align: center;
  border: 1px solid transparent;
}

.result-message--success {
  background: linear-gradient(180deg, #ecfdf5, #f0fdf4);
  border-color: #a7f3d0;
}

.result-message--error {
  background: linear-gradient(180deg, #fff1f2, #fef2f2);
  border-color: #fecaca;
}

.result-message--warning {
  background: linear-gradient(180deg, #fffbeb, #fef3c7);
  border-color: #fde68a;
}

.result-message__icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.875rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.result-message--success .result-message__icon {
  background: #d1fae5;
  color: #059669;
}

.result-message--error .result-message__icon {
  background: #fee2e2;
  color: #dc2626;
}

.result-message--warning .result-message__icon {
  background: #fef3c7;
  color: #d97706;
}

.result-message__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
}

.result-message--success .result-message__title {
  color: #047857;
}

.result-message--error .result-message__title {
  color: #b91c1c;
}

.result-message--warning .result-message__title {
  color: #b45309;
}

.result-message__content {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: #64748b;
}

.result-message__content :deep(p) {
  margin: 0;
}

.result-message__actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
