<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  modelValue: Date
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const MONTH_LABELS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
] as const

const MONTH_SHORT = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'] as const

const panelOpen = ref(false)
const panelYear = ref(props.modelValue.getFullYear())
const rootRef = ref<HTMLElement | null>(null)

const displayLabel = computed(() => {
  const month = props.modelValue.getMonth()
  const year = props.modelValue.getFullYear()
  return `${MONTH_LABELS[month]}, ${year}`
})

const canGoNext = computed(() => {
  const now = new Date()
  const current = new Date(props.modelValue.getFullYear(), props.modelValue.getMonth(), 1)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return current < thisMonth
})

const canGoPanelYearNext = computed(() => panelYear.value < new Date().getFullYear())

function isMonthDisabled(monthIndex: number): boolean {
  const now = new Date()
  const candidate = new Date(panelYear.value, monthIndex, 1)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return candidate > thisMonth
}

function isMonthSelected(monthIndex: number): boolean {
  return (
    props.modelValue.getFullYear() === panelYear.value &&
    props.modelValue.getMonth() === monthIndex
  )
}

function emitDate(year: number, monthIndex: number): void {
  emit('update:modelValue', new Date(year, monthIndex, 1))
}

function shiftMonth(offset: number): void {
  const next = new Date(props.modelValue)
  next.setMonth(next.getMonth() + offset)
  emit('update:modelValue', next)
}

function togglePanel(): void {
  if (props.loading) return
  panelOpen.value = !panelOpen.value
  if (panelOpen.value) {
    panelYear.value = props.modelValue.getFullYear()
  }
}

function closePanel(): void {
  panelOpen.value = false
}

function selectMonth(monthIndex: number): void {
  if (isMonthDisabled(monthIndex)) return
  emitDate(panelYear.value, monthIndex)
  closePanel()
}

function shiftPanelYear(offset: number): void {
  const nextYear = panelYear.value + offset
  if (nextYear > new Date().getFullYear()) return
  if (nextYear < 2000) return
  panelYear.value = nextYear
}

function onDocumentClick(event: MouseEvent): void {
  if (!panelOpen.value) return
  const target = event.target
  if (target instanceof Node && rootRef.value?.contains(target)) return
  closePanel()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div ref="rootRef" class="month-picker">
    <div class="month-picker__bar">
      <button
        type="button"
        class="month-picker__nav"
        aria-label="Tháng trước"
        :disabled="loading"
        @click="shiftMonth(-1)"
      >
        <i class="pi pi-chevron-left"></i>
      </button>

      <button
        type="button"
        class="month-picker__trigger"
        :class="{ 'is-open': panelOpen }"
        :disabled="loading"
        aria-haspopup="dialog"
        :aria-expanded="panelOpen"
        @click.stop="togglePanel"
      >
        <i class="pi pi-calendar month-picker__trigger-icon"></i>
        <span class="month-picker__trigger-label">{{ displayLabel }}</span>
        <i class="pi pi-chevron-down month-picker__trigger-caret"></i>
      </button>

      <button
        type="button"
        class="month-picker__nav"
        aria-label="Tháng sau"
        :disabled="loading || !canGoNext"
        @click="shiftMonth(1)"
      >
        <i class="pi pi-chevron-right"></i>
      </button>
    </div>
    <div v-if="panelOpen" class="month-picker__panel" role="dialog" aria-label="Chọn tháng lương">
      <div class="month-picker__panel-header">
        <button
          type="button"
          class="month-picker__year-nav"
          aria-label="Năm trước"
          @click="shiftPanelYear(-1)"
        >
          <i class="pi pi-chevron-left"></i>
        </button>
        <span class="month-picker__year">{{ panelYear }}</span>
        <button
          type="button"
          class="month-picker__year-nav"
          aria-label="Năm sau"
          :disabled="!canGoPanelYearNext"
          @click="shiftPanelYear(1)"
        >
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>

      <div class="month-picker__grid">
        <button
          v-for="(label, index) in MONTH_SHORT"
          :key="label"
          type="button"
          class="month-picker__month"
          :class="{
            'is-selected': isMonthSelected(index),
            'is-disabled': isMonthDisabled(index),
          }"
          :disabled="isMonthDisabled(index)"
          :title="MONTH_LABELS[index]"
          @click="selectMonth(index)"
        >
          {{ label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.month-picker {
  position: relative;
  flex-shrink: 0;
}

.month-picker__bar {
  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--pl-border, #e2e8f0);
  border-radius: 12px;
  background: var(--pl-surface);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
  overflow: hidden;
}

.month-picker__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  border: none;
  background: var(--pl-surface-subtle);
  color: var(--pl-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.month-picker__nav:hover:not(:disabled) {
  background: var(--pl-hover);
  color: var(--pl-accent, #3b82f6);
}

.month-picker__nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.month-picker__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 10.5rem;
  padding: 0.625rem 0.875rem;
  border: none;
  border-left: 1px solid var(--pl-border, #e2e8f0);
  border-right: 1px solid var(--pl-border, #e2e8f0);
  background: var(--pl-surface);
  color: var(--pl-text, #1e293b);
  cursor: pointer;
  transition: background 0.15s;
}

.month-picker__trigger:hover:not(:disabled) {
  background: var(--pl-surface-muted);
}

.month-picker__trigger.is-open {
  background: var(--pl-accent-soft, #eff6ff);
  color: var(--pl-accent, #3b82f6);
}

.month-picker__trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.month-picker__trigger-icon {
  font-size: 0.875rem;
  color: var(--pl-accent, #3b82f6);
}

.month-picker__trigger-label {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.month-picker__trigger-caret {
  font-size: 0.625rem;
  color: var(--pl-muted);
  transition: transform 0.2s;
}

.month-picker__trigger.is-open .month-picker__trigger-caret {
  transform: rotate(180deg);
  color: var(--pl-accent, #3b82f6);
}

.month-picker__hint {
  margin: 0.375rem 0 0;
  font-size: 0.6875rem;
  color: var(--pl-muted);
  text-align: center;
}

.month-picker__panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 30;
  width: min(18rem, calc(100vw - 2rem));
  padding: 0.875rem;
  border: 1px solid var(--pl-border, #e2e8f0);
  border-radius: 14px;
  background: var(--pl-surface);
  box-shadow:
    0 10px 15px -3px rgb(15 23 42 / 0.08),
    0 4px 6px -4px rgb(15 23 42 / 0.06);
}

.month-picker__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--pl-divider);
}

.month-picker__year {
  font-size: 1rem;
  font-weight: 700;
  color: var(--pl-text, #1e293b);
}

.month-picker__year-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--pl-border, #e2e8f0);
  border-radius: 8px;
  background: var(--pl-surface);
  color: var(--pl-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.month-picker__year-nav:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--pl-accent, #3b82f6) 35%, #e2e8f0);
  color: var(--pl-accent, #3b82f6);
}

.month-picker__year-nav:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.month-picker__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.month-picker__month {
  padding: 0.625rem 0.25rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--pl-surface-subtle);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pl-text);
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.month-picker__month:hover:not(:disabled):not(.is-selected) {
  background: var(--pl-hover);
  border-color: var(--pl-border);
}

.month-picker__month.is-selected {
  border-color: var(--pl-accent, #3b82f6);
  background: var(--pl-accent-soft, #eff6ff);
  color: var(--pl-accent, #3b82f6);
}

.month-picker__month.is-disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>

