import { onMounted, onUnmounted } from 'vue'
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { AuthUser, LoginResponse } from '../models/auth-user.model'
import { useLoginRedirect } from './use-login-redirect'
import { useRoute } from 'vue-router'

interface SsoMessagePayload {
  user: AuthUser
  candidate?: LoginResponse['candidate']
}

function isSsoPayload(data: unknown): data is SsoMessagePayload {
  if (!data || typeof data !== 'object') return false
  return 'user' in data && typeof (data as SsoMessagePayload).user === 'object'
}

export function useLoginSso(router: Router) {
  const authStore = useAuthStore()
  const route = useRoute()
  const { redirectAfterLogin } = useLoginRedirect(router, route)

  async function handleSsoMessage(event: MessageEvent): Promise<void> {
    const loginBaseUrl = import.meta.env.VITE_APP_BASE_URL_LOGIN
    if (!loginBaseUrl) return

    const trustedOrigin = loginBaseUrl.endsWith('/') ? loginBaseUrl.slice(0, -1) : loginBaseUrl
    if (event.origin !== trustedOrigin) return
    if (!isSsoPayload(event.data)) return

    await authStore.setAuthenticated('Edutalk', event.data.user)
    await redirectAfterLogin({
      user: event.data.user,
      candidate: event.data.candidate,
    })
  }

  function openSsoPopup(): void {
    const loginBaseUrl = import.meta.env.VITE_APP_BASE_URL_LOGIN
    if (!loginBaseUrl) return
    window.open(
      `${loginBaseUrl}login?from=noibo`,
      'Login with Edutalk',
      'height=550,width=650,top=350,left=600',
    )
  }

  onMounted(() => {
    window.addEventListener('message', handleSsoMessage)
  })

  onUnmounted(() => {
    window.removeEventListener('message', handleSsoMessage)
  })

  return {
    openSsoPopup,
  }
}
