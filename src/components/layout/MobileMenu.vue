<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BarChart2, ChevronDown, resolveIcon } from '../../utils/icons'
import { useFilteredMenu } from '@/composables/use-filtered-menu'
import logoEdutalk from '@/assets/logo_edutalk.svg'

const route = useRoute()
const { filteredMenuItems } = useFilteredMenu()
const open = ref(false)

function cloneMenu(items) {
  return items.map((item) => {
    if (item.divider) return { ...item }
    const cloned = { ...item, open: false }
    if (item.subMenu) cloned.subMenu = cloneMenu(item.subMenu)
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

watch(
  () => route.path,
  () => {
    open.value = false
  },
)

function toggleMenu() {
  open.value = !open.value
}

function toggleItem(item) {
  item.open = !item.open
}

function getIcon(name) {
  return resolveIcon(name)
}
</script>

<template>
  <div class="mobile-menu md:hidden">
    <div class="mobile-menu-bar">
      <RouterLink to="/" class="flex mr-auto">
        <img alt="Edutalk" class="w-6" :src="logoEdutalk" />
      </RouterLink>
      <a href="javascript:;" @click="toggleMenu">
        <BarChart2 class="w-8 h-8 text-white transform -rotate-90" />
      </a>
    </div>

    <ul class="border-t border-theme-24 py-5" :class="open ? 'block' : 'hidden'">
      <template v-for="(item, index) in menu" :key="item.title || `d-${index}`">
        <li v-if="item.divider" class="menu__devider my-6" />
        <li v-else>
          <RouterLink
            v-if="item.to && !item.subMenu"
            :to="item.to"
            class="menu"
            :class="{ 'menu--active': route.path === item.to }"
          >
            <div class="menu__icon">
              <component :is="getIcon(item.icon)" class="w-5 h-5" />
            </div>
            <div class="menu__title">{{ item.title }}</div>
          </RouterLink>

          <template v-else>
            <a
              href="javascript:;"
              class="menu"
              :class="{ 'menu--open': item.open }"
              @click="toggleItem(item)"
            >
              <div class="menu__icon">
                <component :is="getIcon(item.icon)" class="w-5 h-5" />
              </div>
              <div class="menu__title">
                {{ item.title }}
                <ChevronDown class="menu__sub-icon" />
              </div>
            </a>
            <ul v-if="item.open" class="py-1">
              <li v-for="(child, cIndex) in item.subMenu" :key="child.title + cIndex">
                <RouterLink :to="child.to || '/'" class="menu pl-10">
                  <div class="menu__icon">
                    <component :is="getIcon(child.icon)" class="w-5 h-5" />
                  </div>
                  <div class="menu__title">{{ child.title }}</div>
                </RouterLink>
              </li>
            </ul>
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>
