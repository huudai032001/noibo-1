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

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))

function adjustBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const r = clamp(rgb.r * factor)
  const g = clamp(rgb.g * factor)
  const b = clamp(rgb.b * factor)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const v = clamp(l * 255); return [v, v, v] }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    clamp(hue2rgb(p, q, h + 1 / 3) * 255),
    clamp(hue2rgb(p, q, h) * 255),
    clamp(hue2rgb(p, q, h - 1 / 3) * 255),
  ]
}

function makeDarkVariant(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const darkL = Math.min(l, 0.35)
  const darkS = Math.min(s, 0.6)
  const [r, g, b] = hslToRgb(h, darkS, darkL)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

function makeDarkSoftVariant(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const [h, s] = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const [r, g, b] = hslToRgb(h, Math.min(s, 0.5), 0.55)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export function applyPrimaryColor(color: string): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const rgb = hexToRgb(color)
  if (!rgb) return

  const darkColor = makeDarkVariant(color)
  const darkRgb = hexToRgb(darkColor)!
  const darkSoft = makeDarkSoftVariant(color)
  const darkSoftRgb = hexToRgb(darkSoft)!

  root.style.setProperty('--app-primary', color)
  root.style.setProperty('--app-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`)
  root.style.setProperty('--app-primary-hover', adjustBrightness(color, 0.85))
  root.style.setProperty('--app-primary-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`)
  root.style.setProperty('--app-primary-lighter', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`)

  root.style.setProperty('--app-primary-dark', darkColor)
  root.style.setProperty('--app-primary-dark-rgb', `${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b}`)
  root.style.setProperty('--app-primary-dark-hover', adjustBrightness(darkColor, 0.85))
  root.style.setProperty('--app-primary-dark-soft', darkSoft)
  root.style.setProperty('--app-primary-dark-soft-rgb', `${darkSoftRgb.r}, ${darkSoftRgb.g}, ${darkSoftRgb.b}`)
  root.style.setProperty('--app-primary-dark-light', `rgba(${darkSoftRgb.r}, ${darkSoftRgb.g}, ${darkSoftRgb.b}, 0.12)`)
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
