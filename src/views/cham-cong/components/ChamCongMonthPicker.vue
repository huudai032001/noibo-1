<script setup lang="ts">
import { computed } from 'vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps<{
  modelValue: Date
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const maxDate = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
})

function onUpdate(value: Date | Date[] | (Date | null)[] | null | undefined): void {
  if (!value || Array.isArray(value)) return
  emit('update:modelValue', new Date(value.getFullYear(), value.getMonth(), 1))
}
</script>

<template>
  <!--
    Month Picker — PrimeVue DatePicker view="month"
    https://primevue.dev/datepicker/#monthpicker
  -->
  <DatePicker
    :model-value="modelValue"
    view="month"
    date-format="MM yy"
    placeholder="Chọn tháng"
    show-icon
    icon-display="input"
    :manual-input="false"
    :max-date="maxDate"
    :disabled="loading"
    fluid
    size="small"
    class="cham-cong-month-picker w-[11.5rem] sm:w-44"
    :pt="{
      pcInputText: {
        root: { class: '!text-sm !font-semibold' },
      },
    }"
    @update:model-value="onUpdate"
  />
</template>
