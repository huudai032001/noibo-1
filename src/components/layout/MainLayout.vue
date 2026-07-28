<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import MobileMenu from './MobileMenu.vue'
import TopBar from './TopBar.vue'
import TopMenu from './TopMenu.vue'
import AppFooter from './AppFooter.vue'
import { breadcrumbs } from '../../data/menu'

const route = useRoute()

const breadcrumbItems = computed(() => {
  return (
    breadcrumbs[route.path] || [
      { label: 'Edutalk nội bộ', to: '/' },
      { label: route.meta?.title || 'Page', active: true },
    ]
  )
})
</script>

<template>
  <!-- class "app" gắn trên body (xem router) — giống Midone HTML -->
  <MobileMenu />
  <div class="">
    <TopBar :breadcrumb-items="breadcrumbItems" />
    <TopMenu />
    <div class="content">
      <RouterView />
      <AppFooter />
    </div>
  </div>
</template>
