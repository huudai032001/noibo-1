import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { ThongBaoItem } from '../models/thong-bao.model'
import { fetchThongBaoDetail } from '../services/thong-bao.service'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const e = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return e.data?.message || e.response?.data?.message || e.message || fallback
}

export function useThongBaoDetailPage() {
  const toast = useToast()

  const item = ref<ThongBaoItem | null>(null)
  const loading = ref(false)

  async function fetchDetail(slug: string): Promise<void> {
    loading.value = true
    try {
      const response = await fetchThongBaoDetail(slug)
      item.value = response.data || null
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải chi tiết thông báo')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
      item.value = null
    } finally {
      loading.value = false
    }
  }

  return { item, loading, fetchDetail }
}
