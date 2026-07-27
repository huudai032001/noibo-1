import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MIN_CREDENTIAL_LENGTH } from '../constants'
import type {
  LoginFormErrors,
  LoginFormResolverResult,
  LoginFormValues,
} from '../models/login.model'
import { extractToken, loginWithCredentials } from '../services/auth.service'
import { useLoginRedirect } from './use-login-redirect'

export function useLoginForm() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const { redirectAfterLogin } = useLoginRedirect(router, route)

  const form = reactive<LoginFormValues>({
    email: '',
    password: '',
  })

  const loading = ref(false)
  const loginError = ref('')

  function resolveFormErrors(values: LoginFormValues): LoginFormResolverResult {
    const errors: LoginFormErrors = {}
    const email = values.email.trim()
    const password = values.password

    if (!email) {
      errors.email = [{ message: 'Vui lòng nhập email hoặc số điện thoại' }]
    } else if (email.length < MIN_CREDENTIAL_LENGTH) {
      errors.email = [{ message: `Tối thiểu ${MIN_CREDENTIAL_LENGTH} ký tự` }]
    }

    if (!password.trim()) {
      errors.password = [{ message: 'Vui lòng nhập mật khẩu' }]
    } else if (password.length < MIN_CREDENTIAL_LENGTH) {
      errors.password = [{ message: `Tối thiểu ${MIN_CREDENTIAL_LENGTH} ký tự` }]
    }

    return { errors }
  }

  async function submitLogin(credentials?: LoginFormValues): Promise<boolean> {
    const payload = credentials ?? { ...form }
    const { errors } = resolveFormErrors(payload)
    if (errors.email?.length || errors.password?.length) {
      return false
    }

    if (loading.value) return false

    try {
      loading.value = true
      loginError.value = ''
      authStore.setError('')

      const response = await loginWithCredentials({
        email: payload.email.trim(),
        password: payload.password,
      })

      const token = extractToken(response) || 'Edutalk'
      await authStore.setAuthenticated(token, response.user)
      await redirectAfterLogin(response)
      return true
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } }
        message?: string
      }
      const message =
        err.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      loginError.value = message
      authStore.setError(message)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    loginError,
    resolveFormErrors,
    submitLogin,
  }
}
