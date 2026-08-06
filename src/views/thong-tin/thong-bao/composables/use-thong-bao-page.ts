import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { ThongBaoItem } from '../models/thong-bao.model'
import { fetchThongBaoList } from '../services/thong-bao.service'
import { THONG_BAO_DEFAULT_PAGE, THONG_BAO_DEFAULT_PER_PAGE } from '../constants'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const e = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return e.data?.message || e.response?.data?.message || e.message || fallback
}

export function useThongBaoPage() {
  const toast = useToast()

  const items = ref<ThongBaoItem[]>([])
  const loading = ref(false)
  const keyword = ref('')
  const isSpecialFilter = ref('')
  const currentPage = ref(THONG_BAO_DEFAULT_PAGE)
  const totalItems = ref(0)
  const perPage = ref(THONG_BAO_DEFAULT_PER_PAGE)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / perPage.value)),
  )

  async function fetchList(): Promise<void> {
    loading.value = true
    try {
      const response = await fetchThongBaoList({
        page: currentPage.value,
        per_page: perPage.value,
        category: keyword.value || undefined,
        is_special: isSpecialFilter.value || undefined,
      })
      items.value = response.data || []
      totalItems.value = response.pagination?.total || items.value.length
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải dữ liệu')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function handleSearch(): Promise<void> {
    currentPage.value = THONG_BAO_DEFAULT_PAGE
    await fetchList()
  }

  async function goToPage(page: number): Promise<void> {
    currentPage.value = page
    await fetchList()
  }

  return {
    items,
    loading,
    keyword,
    isSpecialFilter,
    currentPage,
    totalItems,
    totalPages,
    fetchList,
    handleSearch,
    goToPage,
  }
}
