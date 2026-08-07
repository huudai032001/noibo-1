import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { QuantumLeapInfoItem } from '../models/quantum-leap-intro.model'
import {
  fetchQuantumLeapRedirect,
  fetchQuantumLeapInfo,
} from '../services/quantum-leap-intro.service'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const maybeResponse = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return (
    maybeResponse.data?.message ||
    maybeResponse.response?.data?.message ||
    maybeResponse.message ||
    fallback
  )
}

export function useQuantumLeapPage() {
  const toast = useToast()

  const infoItems = ref<QuantumLeapInfoItem[]>([])
  const loading = ref(false)
  const redirecting = ref(false)
  const redirectUrl = ref<string>('')

  async function fetchInfo(): Promise<void> {
    loading.value = true
    try {
      const response = await fetchQuantumLeapInfo()
      infoItems.value = (response.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải thông tin')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
    } finally {
      loading.value = false
    }
  }

  async function handleRedirect(): Promise<void> {
    redirecting.value = true
    try {
      const response = await fetchQuantumLeapRedirect()
      redirectUrl.value = response.redirect_url || ''

      if (redirectUrl.value) {
        window.open(redirectUrl.value, '_blank')
      } else {
        toast.add({
          severity: 'warning',
          summary: 'Thông báo',
          detail: 'Không thể truy cập Quantum Leap vào lúc này',
          life: 3000,
        })
      }
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi chuyển hướng')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
    } finally {
      redirecting.value = false
    }
  }

  return {
    infoItems,
    loading,
    redirecting,
    redirectUrl,
    fetchInfo,
    handleRedirect,
  }
}
