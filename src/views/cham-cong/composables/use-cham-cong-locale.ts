import { onBeforeUnmount, onMounted } from 'vue'
import { usePrimeVue } from 'primevue/config'
import { CHAM_CONG_LOCALE } from '../utils/cham-cong-helpers'

/** Apply Vietnamese DatePicker locale while the page is mounted. */
export function useChamCongLocale() {
  const primevue = usePrimeVue()
  const previousLocaleSnapshot = JSON.stringify(primevue.config.locale ?? {})

  onMounted(() => {
    if (!primevue.config.locale) return
    Object.assign(primevue.config.locale, {
      ...CHAM_CONG_LOCALE,
      today: 'Hôm nay',
      clear: 'Xóa',
    })
  })

  onBeforeUnmount(() => {
    if (!primevue.config.locale) return
    Object.assign(primevue.config.locale, JSON.parse(previousLocaleSnapshot) as object)
  })
}
