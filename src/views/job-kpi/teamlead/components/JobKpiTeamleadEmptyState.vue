<script setup lang="ts">
import Button from 'primevue/button'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Không có nhân sự phù hợp',
    description:
      'Không tìm thấy bản ghi theo bộ lọc hiện tại. Hãy thử đổi tháng, đơn vị hoặc trạng thái.',
  },
)

const emit = defineEmits<{
  'clear-filters': []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-14 text-center">
    <span
      class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)] dark:bg-[rgba(var(--app-primary-rgb),0.16)]"
    >
      <i class="pi pi-users text-2xl" />
    </span>
    <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">
      {{ title }}
    </h3>
    <p class="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
    <Button
      type="button"
      label="Xóa bộ lọc"
      icon="pi pi-filter-slash"
      severity="secondary"
      outlined
      class="mt-5"
      @click="emit('clear-filters')"
    />
  </div>
</template>
