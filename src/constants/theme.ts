export const THEME_STORAGE_KEY = 'edutalk-theme'
export const THEME_COLOR_KEY = 'edutalk-primary-color'
export const THEME_BG_KEY = 'edutalk-bg-image'
export const DARK_MODE_CLASS = 'dark-mode'
export const DEFAULT_PRIMARY_COLOR = '#472f92'

export type ThemeMode = 'light' | 'dark'

export interface ThemeBgOption {
  id: string
  label: string
  url: string
  thumbnail: string
}

export const PRESET_COLORS = [
  '#472f92',
  '#1e40af',
  '#0f766e',
  '#15803d',
  '#b91c1c',
  '#c2410c',
  '#a16207',
  '#6d28d9',
  '#be185d',
  '#334155',
] as const

export const PRESET_BACKGROUNDS: ThemeBgOption[] = [
  {
    id: 'none',
    label: 'Không có',
    url: '',
    thumbnail: '',
  },
  {
    id: 'tet',
    label: 'Tết Nguyên Đán',
    url: 'https://images.unsplash.com/photo-1548905568-79debd927fd4?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1548905568-79debd927fd4?w=200&q=60',
  },
  {
    id: 'noel',
    label: 'Giáng Sinh',
    url: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=200&q=60',
  },
  {
    id: '8-3',
    label: 'Ngày 8/3',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&q=60',
  },
  {
    id: 'summer',
    label: 'Mùa Hè',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=60',
  },
  {
    id: 'autumn',
    label: 'Mùa Thu',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60',
  },
]
