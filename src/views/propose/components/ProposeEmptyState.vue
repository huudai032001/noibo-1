<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  title?: string
  description?: string
  showCreate?: boolean
}>()

const emit = defineEmits<{
  create: []
  'clear-filters': []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-14 text-center">
    <span
      class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)]"
    >
      <i class="pi pi-inbox text-2xl" />
    </span>
    <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">
      {{ title || 'Chưa có đề xuất nào' }}
    </h3>
    <p class="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
      {{
        description ||
          'Bạn chưa gửi đề xuất nào hoặc không có kết quả phù hợp với bộ lọc hiện tại.'
      }}
    </p>
    <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <Button
        v-if="showCreate"
        type="button"
        label="Tạo đề xuất mới"
        icon="pi pi-plus"
        @click="emit('create')"
      />
      <Button
        type="button"
        label="Xóa bộ lọc"
        icon="pi pi-filter-slash"
        severity="secondary"
        outlined
        @click="emit('clear-filters')"
      />
    </div>
  </div>
</template>
