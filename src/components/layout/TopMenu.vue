<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown, resolveIcon } from '../../utils/icons'
import { useFilteredMenu } from '@/composables/use-filtered-menu'

const route = useRoute()
const { filteredMenuItems } = useFilteredMenu()
const openIndex = ref(null)
const nestedOpenKey = ref(null)

let closeTimer = null

function matchesRoute(item) {
  if (item.name != null && route.name === item.name) return true
  if (item.to && route.path === item.to) return true
  return false
}

function isActive(item) {
  if (matchesRoute(item)) return true
  if (!item.subMenu?.length) return false
  return item.subMenu.some(
    (child) => matchesRoute(child) || child.subMenu?.some((sub) => matchesRoute(sub)),
  )
}

function clearCloseTimer() {
  if (closeTimer != null) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function openMenu(index) {
  clearCloseTimer()
  openIndex.value = index
  nestedOpenKey.value = null
}

function scheduleClose() {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    openIndex.value = null
    nestedOpenKey.value = null
    closeTimer = null
  }, 160)
}

function toggle(index, item) {
  if (!item.subMenu) return
  clearCloseTimer()
  openIndex.value = openIndex.value === index ? null : index
  nestedOpenKey.value = null
}

function openNested(key) {
  clearCloseTimer()
  nestedOpenKey.value = key
}

function close() {
  clearCloseTimer()
  openIndex.value = null
  nestedOpenKey.value = null
}

function onKeydown(event) {
  if (event.key === 'Escape' && openIndex.value != null) close()
}

watch(
  () => route.fullPath,
  () => close(),
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  clearCloseTimer()
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <nav class="top-nav" aria-label="Menu chính">
    <ul>
      <li
        v-for="(item, index) in filteredMenuItems"
        :key="item.title"
        class="relative"
        :class="{ 'is-open': openIndex === index }"
        @mouseenter="item.subMenu ? openMenu(index) : undefined"
        @mouseleave="item.subMenu ? scheduleClose() : undefined"
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
          :class="{ 'top-menu--active': isActive(item) }"
          :aria-expanded="openIndex === index"
          :aria-haspopup="item.subMenu ? 'menu' : undefined"
          @click="toggle(index, item)"
        >
          <div class="top-menu__icon">
            <component :is="resolveIcon(item.icon)" />
          </div>
          <div class="top-menu__title">
            {{ item.title }}
            <ChevronDown v-if="item.subMenu" class="top-menu__sub-icon" />
          </div>
        </a>

        <Transition name="top-menu-dropdown">
          <ul
            v-if="item.subMenu && openIndex === index"
            class="top-menu__sub"
            role="menu"
            @mouseenter="clearCloseTimer"
          >
            <li
              v-for="(child, cIndex) in item.subMenu"
              :key="child.title + cIndex"
              class="relative"
              :class="{ 'is-nested-open': nestedOpenKey === `${index}-${cIndex}` }"
              role="none"
              @mouseenter="child.subMenu ? openNested(`${index}-${cIndex}`) : undefined"
            >
              <RouterLink
                v-if="child.to && !child.subMenu"
                :to="child.to"
                class="top-menu"
                :class="{ 'top-menu--current': matchesRoute(child) }"
                role="menuitem"
                :title="child.title"
                @click="close"
              >
                <div class="top-menu__icon">
                  <component :is="resolveIcon(child.icon)" />
                </div>
                <div class="top-menu__title">{{ child.title }}</div>
              </RouterLink>
              <template v-else>
                <a
                  href="javascript:;"
                  class="top-menu"
                  :class="{ 'top-menu--current': isActive(child) }"
                  role="menuitem"
                  :title="child.title"
                  :aria-expanded="nestedOpenKey === `${index}-${cIndex}`"
                  :aria-haspopup="child.subMenu ? 'menu' : undefined"
                >
                  <div class="top-menu__icon">
                    <component :is="resolveIcon(child.icon)" />
                  </div>
                  <div class="top-menu__title">
                    {{ child.title }}
                    <ChevronDown v-if="child.subMenu" class="top-menu__sub-icon" />
                  </div>
                </a>
                <Transition name="top-menu-nested">
                  <ul
                    v-if="child.subMenu && nestedOpenKey === `${index}-${cIndex}`"
                    class="top-menu__sub top-menu__sub--nested"
                    role="menu"
                  >
                    <li
                      v-for="(sub, sIndex) in child.subMenu"
                      :key="sub.title + sIndex"
                      role="none"
                    >
                      <RouterLink
                        :to="sub.to || '/'"
                        class="top-menu"
                        :class="{ 'top-menu--current': matchesRoute(sub) }"
                        role="menuitem"
                        :title="sub.title"
                        @click="close"
                      >
                        <div class="top-menu__icon">
                          <component :is="resolveIcon(sub.icon)" />
                        </div>
                        <div class="top-menu__title">{{ sub.title }}</div>
                      </RouterLink>
                    </li>
                  </ul>
                </Transition>
              </template>
            </li>
          </ul>
        </Transition>
      </li>
    </ul>
  </nav>
</template>
