import ApiService from '@/services/api-service'
import type { LoginFormValues, SocialLoginPayload } from '../models/login.model'
import type { LoginResponse } from '../models/auth-user.model'

function extractToken(response: LoginResponse): string | null {
  return (
    response.authTokennoibo ||
    response.data?.authTokennoibo ||
    response.token ||
    response.data?.token ||
    null
  )
}

export async function loginWithCredentials(credentials: LoginFormValues): Promise<LoginResponse> {
  return ApiService.post<LoginFormValues, LoginResponse>('/login', credentials)
}

export async function loginWithFacebook(payload: SocialLoginPayload): Promise<LoginResponse> {
  return ApiService.post<SocialLoginPayload, LoginResponse>('/login/facebook', payload)
}

export async function loginWithGoogle(payload: SocialLoginPayload): Promise<LoginResponse> {
  return ApiService.post<SocialLoginPayload, LoginResponse>('/login/google', payload)
}

export async function logout(): Promise<void> {
  await ApiService.post('logout')
}

export { extractToken }
