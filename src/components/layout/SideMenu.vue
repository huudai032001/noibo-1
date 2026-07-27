<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useFilteredMenu } from '@/composables/use-filtered-menu'
import SideMenuItem from './SideMenuItem.vue'
import logoEdutalk from '@/assets/logo_edutalk.svg'

const route = useRoute()
const { filteredMenuItems } = useFilteredMenu()

function cloneMenu(items) {
  return items.map((item) => {
    if (item.divider) return { ...item }
    const cloned = { ...item, open: false }
    if (item.subMenu) {
      cloned.subMenu = cloneMenu(item.subMenu)
    }
    return cloned
  })
}

const menu = ref(cloneMenu(filteredMenuItems.value))

watch(
  filteredMenuItems,
  (items) => {
    menu.value = cloneMenu(items)
  },
  { deep: true },
)

function pathMatches(item, path) {
  if (item.to === path) return true
  if (item.subMenu) return item.subMenu.some((c) => pathMatches(c, path))
  return false
}

function openActiveMenus(items, path) {
  items.forEach((item) => {
    if (item.subMenu) {
      item.open = pathMatches(item, path)
      openActiveMenus(item.subMenu, path)
    }
  })
}

watch(
  () => route.path,
  (path) => openActiveMenus(menu.value, path),
  { immediate: true },
)

function toggleItem(target) {
  const walk = (items) => {
    items.forEach((item) => {
      if (item === target) {
        item.open = !item.open
      } else if (item.subMenu) {
        walk(item.subMenu)
      }
    })
  }
  walk(menu.value)
}
</script>

<template>
  <nav class="side-nav hidden md:block">
    <RouterLink to="/" class="intro-x flex items-center pl-5 pt-4">
      <img alt="Edutalk" class="w-6" :src="logoEdutalk" />
    </RouterLink>
    <div class="side-nav__devider my-6" />
    <ul>
      <SideMenuItem
        v-for="(item, index) in menu"
        :key="item.title || `divider-${index}`"
        :item="item"
        @toggle="toggleItem"
      />
    </ul>
  </nav>
</template>
