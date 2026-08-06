import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { ChinhSachItem } from '../models/chinh-sach.model'
import { fetchChinhSachList } from '../services/chinh-sach.service'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const e = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return e.data?.message || e.response?.data?.message || e.message || fallback
}

export function useChinhSachPage() {
  const toast = useToast()
  const items = ref<ChinhSachItem[]>([])
  const loading = ref(false)

  async function fetchList(): Promise<void> {
    loading.value = true
    try {
      const response = await fetchChinhSachList()
      items.value = response.data || []
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải dữ liệu')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
      items.value = []
    } finally {
      loading.value = false
    }
  }

  return { items, loading, fetchList }
}
