<script setup lang="ts">
defineProps<{
  linkManage?: boolean
  link: string
}>()
</script>

<template>
  <p class="text-sm text-slate-600">
    {{ linkManage ? 'Cách tính xem chi tiết' : 'Hướng dẫn cách tính thuế' }}
    <a :href="link" target="_blank" rel="noopener noreferrer" class="text-primary font-medium">
      TẠI ĐÂY
    </a>
  </p>
</template>
