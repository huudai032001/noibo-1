import {
  DARK_MODE_CLASS,
  DEFAULT_PRIMARY_COLOR,
  THEME_BG_KEY,
  THEME_COLOR_KEY,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/constants/theme'

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readStoredTheme(): ThemeMode | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'dark' || value === 'light') return value
  } catch { /* ignore */ }
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
  } catch { /* ignore */ }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

function adjustBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  const r = clamp(rgb.r * factor)
  const g = clamp(rgb.g * factor)
  const b = clamp(rgb.b * factor)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export function applyPrimaryColor(color: string): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const rgb = hexToRgb(color)
  if (!rgb) return

  root.style.setProperty('--app-primary', color)
  root.style.setProperty('--app-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
  root.style.setProperty('--app-primary-hover', adjustBrightness(color, 0.85))
  root.style.setProperty('--app-primary-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`)
  root.style.setProperty('--app-primary-lighter', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`)
}

export function readStoredPrimaryColor(): string {
  try {
    return localStorage.getItem(THEME_COLOR_KEY) || DEFAULT_PRIMARY_COLOR
  } catch {
    return DEFAULT_PRIMARY_COLOR
  }
}

export function persistPrimaryColor(color: string): void {
  try {
    localStorage.setItem(THEME_COLOR_KEY, color)
  } catch { /* ignore */ }
}

export function applyBgImage(url: string): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (url) {
    root.style.setProperty('--app-bg-image', `url(${url})`)
    root.classList.add('has-bg-image')
  } else {
    root.style.removeProperty('--app-bg-image')
    root.classList.remove('has-bg-image')
  }
}

export function readStoredBgImage(): string {
  try {
    return localStorage.getItem(THEME_BG_KEY) || ''
  } catch {
    return ''
  }
}

export function persistBgImage(url: string): void {
  try {
    if (url) localStorage.setItem(THEME_BG_KEY, url)
    else localStorage.removeItem(THEME_BG_KEY)
  } catch { /* ignore */ }
}

export function initTheme(): ThemeMode {
  const mode = resolveTheme()
  applyTheme(mode)
  applyPrimaryColor(readStoredPrimaryColor())
  applyBgImage(readStoredBgImage())
  return mode
}
