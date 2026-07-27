<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

defineProps<{
  class?: string
}>()

const router = useRouter()

function goToWelfare(): void {
  void router.push({
    path: '/profile/update',
    query: {
      active: '1',
      tab: 'welfare',
    },
  })
}
</script>

<template>
  <Button
    type="button"
    label="Xem chi tiết trái phiếu"
    link
    class="!p-0"
    @click="goToWelfare"
  />
</template>
