import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ThemeMode } from '@/constants/theme'
import { DEFAULT_PRIMARY_COLOR } from '@/constants/theme'
import {
  applyBgImage,
  applyPrimaryColor,
  applyTheme,
  getSystemTheme,
  persistBgImage,
  persistPrimaryColor,
  persistTheme,
  readStoredBgImage,
  readStoredPrimaryColor,
  readStoredTheme,
} from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(readStoredTheme() ?? getSystemTheme())
  const primaryColor = ref(readStoredPrimaryColor())
  const bgImageUrl = ref(readStoredBgImage())

  const isDark = computed(() => mode.value === 'dark')
  const hasBgImage = computed(() => !!bgImageUrl.value)

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

  function setPrimaryColor(color: string): void {
    primaryColor.value = color
    applyPrimaryColor(color)
    persistPrimaryColor(color)
  }

  function resetPrimaryColor(): void {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR)
  }

  function setBgImage(url: string): void {
    bgImageUrl.value = url
    applyBgImage(url)
    persistBgImage(url)
  }

  function setCustomBgImage(url: string): void {
    setBgImage(url)
  }

  return {
    mode,
    isDark,
    primaryColor,
    bgImageUrl,
    hasBgImage,
    setMode,
    toggle,
    syncFromDom,
    setPrimaryColor,
    resetPrimaryColor,
    setBgImage,
    setCustomBgImage,
  }
})
