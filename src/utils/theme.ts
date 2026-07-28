import { DARK_MODE_CLASS, THEME_STORAGE_KEY, type ThemeMode } from '@/constants/theme'

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readStoredTheme(): ThemeMode | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'dark' || value === 'light') return value
  } catch {
    // ignore storage errors (private browsing, etc.)
  }
  return null
}

export function resolveTheme(): ThemeMode {
  return readStoredTheme() ?? getSystemTheme()
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle(DARK_MODE_CLASS, mode === 'dark')
}

export function persistTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // ignore storage errors
  }
}

export function initTheme(): ThemeMode {
  const mode = resolveTheme()
  applyTheme(mode)
  return mode
}
