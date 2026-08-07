import ApiService from '@/services/api-service'
import { QUANTUM_LEAP_INTRO_API } from '../constants'
import type {
  QuantumLeapRedirectResponse,
  QuantumLeapInfoResponse,
} from '../models/quantum-leap-intro.model'

export async function fetchQuantumLeapRedirect(): Promise<QuantumLeapRedirectResponse> {
  return ApiService.get<Record<string, never>, QuantumLeapRedirectResponse>(
    QUANTUM_LEAP_INTRO_API.redirect,
    {},
  )
}

export async function fetchQuantumLeapInfo(): Promise<QuantumLeapInfoResponse> {
  return ApiService.get<Record<string, never>, QuantumLeapInfoResponse>(
    QUANTUM_LEAP_INTRO_API.info,
    {},
  )
}
