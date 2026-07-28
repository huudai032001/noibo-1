import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ThemeMode } from '@/constants/theme'
import { applyTheme, getSystemTheme, persistTheme, readStoredTheme } from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(readStoredTheme() ?? getSystemTheme())

  const isDark = computed(() => mode.value === 'dark')

  function setMode(nextMode: ThemeMode): void {
    mode.value = nextMode
    applyTheme(nextMode)
    persistTheme(nextMode)
  }

  function toggle(): void {
    setMode(mode.value === 'dark' ? 'light' : 'dark')
  }

  function syncFromDom(): void {
    mode.value = readStoredTheme() ?? getSystemTheme()
  }

  return {
    mode,
    isDark,
    setMode,
    toggle,
    syncFromDom,
  }
})
