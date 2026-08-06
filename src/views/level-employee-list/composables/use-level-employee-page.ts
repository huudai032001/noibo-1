import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type {
  LevelEmployeeItemApi,
  LevelEmployeeListQuery,
  LevelEmployeeCreatePayload,
  LevelEmployeeEditCriteriaPayload,
} from '../models/level-employee.model'
import {
  fetchLevelEmployeeList,
  createLevelEmployeeCriteria,
  updateLevelEmployeeCriteria,
} from '../services/level-employee.service'
import {
  LEVEL_EMPLOYEE_DEFAULT_PAGE,
  LEVEL_EMPLOYEE_DEFAULT_PAGE_SIZE,
} from '../constants'

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

export function useLevelEmployeePage() {
  const toast = useToast()

  const items = ref<LevelEmployeeItemApi[]>([])
  const loading = ref(false)
  const keyword = ref('')
  const currentPage = ref(LEVEL_EMPLOYEE_DEFAULT_PAGE)
  const lastPage = ref(1)
  const pageSize = ref(LEVEL_EMPLOYEE_DEFAULT_PAGE_SIZE)

  const filteredItems = computed(() => {
    const data = items.value || []
    return Array.isArray(data) ? data : []
  })

  const pagedItems = computed(() => filteredItems.value)

  const totalPages = computed(() => Math.max(1, lastPage.value))

  async function fetchList(): Promise<void> {
    loading.value = true
    try {
      const response = await fetchLevelEmployeeList({
        keyword: keyword.value || undefined,
        page: currentPage.value,
        per_page: pageSize.value,
      })

      items.value = response.data.data
      lastPage.value = (response.data as any).lastPage || 1
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi tải dữ liệu')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function handleSearch(): Promise<void> {
    currentPage.value = LEVEL_EMPLOYEE_DEFAULT_PAGE
    await fetchList()
  }

  function toggleExpand(id: number | undefined): void {
    if (!id) return
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item._expanded = !item._expanded
    }
  }

  function toggleExpandPaged(id: number | undefined): void {
    toggleExpand(id)
  }

  function goToPage(page: number): void {
    currentPage.value = page
    fetchList()
  }

  async function handleCreate(payload: LevelEmployeeCreatePayload): Promise<void> {
    try {
      await createLevelEmployeeCriteria(payload)
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Thêm mới thành công',
        life: 3000,
      })
      await fetchList()
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi thêm mới')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
    }
  }

  async function handleUpdate(payload: LevelEmployeeEditCriteriaPayload): Promise<void> {
    try {
      await updateLevelEmployeeCriteria(payload)
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Cập nhật thành công',
        life: 3000,
      })
      await fetchList()
    } catch (error) {
      const message = getApiErrorMessage(error, 'Lỗi khi cập nhật')
      toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
    }
  }

  return {
    items,
    filteredItems,
    pagedItems,
    loading,
    keyword,
    currentPage,
    lastPage,
    totalPages,
    pageSize,
    fetchList,
    handleSearch,
    toggleExpand,
    toggleExpandPaged,
    goToPage,
    handleCreate,
    handleUpdate,
  }
}
