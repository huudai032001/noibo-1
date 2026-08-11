import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import 'zingchart/es6'
import App from './App.vue'
import router from './router'
import ApiService from '@/services/api-service'
import { useAuthStore } from '@/stores/auth'
import './assets/tailwind.css'
import './assets/base.css'
import './assets/dark-mode.css'
import './assets/css/app.css'
import { initTheme } from '@/utils/theme'
import { PRIMEVUE_VI_LOCALE } from '@/utils/primevue-locale'

const app = createApp(App)

const EduPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
})

app.use(PrimeVue, {
  locale: PRIMEVUE_VI_LOCALE,
  theme: {
    preset: EduPreset,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
})
app.use(createPinia())
app.use(router)
app.use(ToastService)

initTheme()

ApiService.init()
useAuthStore().initializeAuth()

app.mount('#app')
