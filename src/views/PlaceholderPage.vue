<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta?.title || 'Trang')
</script>

<template>
  <div class="mt-8">
    <div class="intro-y box p-8 text-center">
      <h2 class="text-xl font-medium">{{ title }}</h2>
      <p class="text-gray-600 mt-3">
        Trang này được dựng sẵn trong layout tái sử dụng. Bạn có thể thay nội dung theo nghiệp vụ.
      </p>
      <RouterLink to="/" class="button bg-theme-1 text-white mt-6">
        Về Dashboard
      </RouterLink>
    </div>
  </div>
</template>
