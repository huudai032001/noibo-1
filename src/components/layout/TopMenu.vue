<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown, resolveIcon } from '../../utils/icons'
import { useFilteredMenu } from '@/composables/use-filtered-menu'

const route = useRoute()
const { filteredMenuItems } = useFilteredMenu()
const openIndex = ref(null)

function isActive(item) {
  if (item.to && route.path === item.to) return true
  if (item.subMenu) {
    return item.subMenu.some(
      (c) =>
        (c.to && route.path === c.to) ||
        c.subMenu?.some((s) => s.to === route.path),
    )
  }
  return false
}

function toggle(index, item) {
  if (!item.subMenu) return
  openIndex.value = openIndex.value === index ? null : index
}

function close() {
  openIndex.value = null
}
</script>

<template>
  <nav class="top-nav">
    <ul>
      <li
        v-for="(item, index) in filteredMenuItems"
        :key="item.title"
        class="relative"
        @mouseleave="close"
      >
        <RouterLink
          v-if="item.to && !item.subMenu"
          :to="item.to"
          class="top-menu"
          :class="{ 'top-menu--active': isActive(item) }"
        >
          <div class="top-menu__icon">
            <component :is="resolveIcon(item.icon)" />
          </div>
          <div class="top-menu__title">{{ item.title }}</div>
        </RouterLink>

        <a
          v-else
          href="javascript:;"
          class="top-menu"
          :class="{ 'top-menu--active': isActive(item) || openIndex === index }"
          @click="toggle(index, item)"
          @mouseenter="openIndex = index"
        >
          <div class="top-menu__icon">
            <component :is="resolveIcon(item.icon)" />
          </div>
          <div class="top-menu__title">
            {{ item.title }}
            <ChevronDown v-if="item.subMenu" class="top-menu__sub-icon" />
          </div>
        </a>

        <ul v-if="item.subMenu && openIndex === index" class="top-menu__sub">
          <li
            v-for="(child, cIndex) in item.subMenu"
            :key="child.title + cIndex"
            class="relative"
          >
            <RouterLink
              v-if="child.to && !child.subMenu"
              :to="child.to"
              class="top-menu"
              @click="close"
            >
              <div class="top-menu__icon">
                <component :is="resolveIcon(child.icon)" />
              </div>
              <div class="top-menu__title">{{ child.title }}</div>
            </RouterLink>
            <template v-else>
              <a href="javascript:;" class="top-menu">
                <div class="top-menu__icon">
                  <component :is="resolveIcon(child.icon)" />
                </div>
                <div class="top-menu__title">
                  {{ child.title }}
                  <ChevronDown v-if="child.subMenu" class="top-menu__sub-icon" />
                </div>
              </a>
              <ul v-if="child.subMenu" class="top-menu__sub top-menu__sub--nested">
                <li v-for="(sub, sIndex) in child.subMenu" :key="sub.title + sIndex">
                  <RouterLink :to="sub.to || '/'" class="top-menu" @click="close">
                    <div class="top-menu__icon">
                      <component :is="resolveIcon(sub.icon)" />
                    </div>
                    <div class="top-menu__title">{{ sub.title }}</div>
                  </RouterLink>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
