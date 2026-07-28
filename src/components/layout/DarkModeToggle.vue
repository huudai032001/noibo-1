<script setup lang="ts">
import { Moon, Sun } from '../../utils/icons'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    type="button"
    class="dark-mode-toggle intro-x flex items-center justify-center rounded-full transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
    :class="
      compact
        ? 'w-8 h-8 text-slate-500 hover:text-theme-1'
        : 'w-9 h-9 border border-theme-5 text-slate-500 hover:text-theme-1 hover:border-theme-1 dark:border-slate-600'
    "
    :title="themeStore.isDark ? 'Bật chế độ sáng' : 'Bật chế độ tối'"
    :aria-label="themeStore.isDark ? 'Bật chế độ sáng' : 'Bật chế độ tối'"
    :aria-pressed="themeStore.isDark"
    @click="themeStore.toggle()"
  >
    <Sun v-if="themeStore.isDark" class="w-[18px] h-[18px]" :size="18" />
    <Moon v-else class="w-[18px] h-[18px]" :size="18" />
  </button>
</template>
