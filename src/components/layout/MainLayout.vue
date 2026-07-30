<script setup>
import { RouterView } from 'vue-router'
import MobileMenu from './MobileMenu.vue'
import TopBar from './TopBar.vue'
import TopMenu from './TopMenu.vue'
import AppFooter from './AppFooter.vue'
import logoZalo from '@/assets/logo-zalo.png'
</script>

<template>
  <!-- class "app" gắn trên body (xem router) — giống Midone HTML -->
  <MobileMenu />
  <div class="">
    <TopBar />
    <TopMenu />
    <div class="content">
      <RouterView />
      <AppFooter />
    </div>
  </div>
  <a
    href="https://zalo.me/edutalkholdings"
    class="zalo-floating-button fixed bottom-6 right-6 z-[1100] inline-flex size-16 items-center justify-center rounded-full p-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Liên hệ Edutalk qua Zalo"
    title="Liên hệ Edutalk qua Zalo"
  >
    <img :src="logoZalo" alt="Zalo" class="h-full w-full object-contain" />
  </a>
</template>

<style scoped>
.zalo-floating-button {
  transition: transform 0.2s ease-in-out;
}

.zalo-floating-button:hover {
  transform: translateY(-2px);
}
</style>
