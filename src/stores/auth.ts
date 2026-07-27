import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { AuthUser } from '@/views/auth/login/models/auth-user.model'
import { USER_KEY } from '@/types/base'
import { destroyToken, getToken, saveToken } from '@/services/jwt-service'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<AuthUser | null>(null)
  const errors = ref<string>('')

  async function setAuthenticated(token: string, user: AuthUser): Promise<void> {
    saveToken(token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    currentUser.value = user
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    errors.value = ''
  }

  async function setUnauthenticated(): Promise<void> {
    destroyToken()
    axios.defaults.headers.common.Authorization = ''
    currentUser.value = null
    localStorage.removeItem(USER_KEY)
    errors.value = ''
  }

  function setError(message: string): void {
    errors.value = message
  }

  async function isAuthenticated(): Promise<boolean> {
    return getToken() !== null
  }

  function initializeAuth(): void {
    const token = getToken()
    const userStr = localStorage.getItem(USER_KEY)

    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    }

    if (userStr) {
      try {
        currentUser.value = JSON.parse(userStr) as AuthUser
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }
  }

  function updateCurrentUser(updatedUser: AuthUser): void {
    currentUser.value = updatedUser
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
  }

  return {
    currentUser,
    errors,
    setAuthenticated,
    setUnauthenticated,
    setError,
    isAuthenticated,
    initializeAuth,
    updateCurrentUser,
  }
})
