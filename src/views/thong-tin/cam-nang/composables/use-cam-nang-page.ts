import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { CamNangItem } from '../models/cam-nang.model'
import { fetchCamNangList } from '../services/cam-nang.service'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const e = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return e.data?.message || e.response?.data?.message || e.message || fallback
}

export function useCamNangPage() {
  const toast = useToast()
  const items = ref<CamNangItem[]>([])
  const loading = ref(false)
  const keyword = ref('')

  async function fetchList(): Promise<void> {
    loading.value = true
    try {
      const response = await fetchCamNangList({
        category: keyword.value || undefined,
      })
      items.value = response.data || []
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải dữ liệu')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function handleSearch(): Promise<void> {
    await fetchList()
  }

  return { items, loading, keyword, fetchList, handleSearch }
}
