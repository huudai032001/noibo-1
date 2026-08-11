import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import type { AdviseCenter, Province, District } from '../models/advise-center.model'
import {
  fetchAdviseList,
  fetchProvinces,
  fetchDistricts,
  fetchCenters,
} from '../services/advise-center.service'
import { ADVISE_CENTER_DEFAULT_PROVINCES } from '../constants'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const e = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return e.data?.message || e.response?.data?.message || e.message || fallback
}

export function useAdviseCenterPage() {
  const toast = useToast()
  const route = useRoute()

  const centers = ref<AdviseCenter[]>([])
  const provinces = ref<Province[]>([])
  const districts = ref<District[]>([])
  const centerOptions = ref<AdviseCenter[]>([])

  const loading = ref(false)
  const isSubmitted = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const totalCenters = ref(0)

  const filter = ref({
    province_id: undefined as number | undefined,
    district_id: undefined as number | undefined,
    center_id: undefined as number | undefined,
    customer_id: '' as string,
  })

  function showError(detail: string): void {
    toast.add({ severity: 'error', summary: 'Lỗi', detail, life: 5000 })
  }

  function showWarning(detail: string): void {
    toast.add({ severity: 'warn', summary: 'Thông báo', detail, life: 3000 })
  }

  async function fetchProvincesList(): Promise<void> {
    try {
      const response = await fetchProvinces({ province_ids: ADVISE_CENTER_DEFAULT_PROVINCES })
      provinces.value = response.data || []
    } catch (error) {
      showError(getApiErrorMessage(error, 'Lỗi khi tải danh sách tỉnh/TP'))
    }
  }

  async function fetchDistrictsList(): Promise<void> {
    if (!filter.value.province_id) {
      districts.value = []
      return
    }
    try {
      const response = await fetchDistricts({ province_id: filter.value.province_id })
      districts.value = response.data || []
    } catch (error) {
      showError(getApiErrorMessage(error, 'Lỗi khi tải danh sách quận/huyện'))
    }
  }

  async function fetchCenterOptions(): Promise<void> {
    try {
      const response = await fetchCenters({
        province_id: filter.value.province_id,
        district_id: filter.value.district_id,
        status: 1,
      })
      centerOptions.value = response.data || []
    } catch (error) {
      showError(getApiErrorMessage(error, 'Lỗi khi tải danh sách trung tâm'))
    }
  }

  async function searchCenters(page: number = 1): Promise<void> {
    if (
      filter.value.province_id === undefined &&
      filter.value.district_id === undefined &&
      filter.value.center_id === undefined
    ) {
      showWarning('Vui lòng chọn ít nhất một bộ lọc vị trí trước khi tìm kiếm')
      return
    }

    loading.value = true
    try {
      const response = await fetchAdviseList({
        province_id: filter.value.province_id,
        district_id: filter.value.district_id,
        center_id: filter.value.center_id,
        customer_id: filter.value.customer_id || undefined,
        payment: route.query.payment ? String(route.query.payment) : undefined,
        page,
      })

      const payload = response.data
      if (page === 1) {
        centers.value = payload?.data || []
      } else {
        centers.value.push(...(payload?.data || []))
      }

      currentPage.value = page
      lastPage.value = payload?.lastPage || 1
      totalCenters.value = payload?.total || 0
      isSubmitted.value = true
    } catch (error) {
      showError(getApiErrorMessage(error, 'Lỗi khi tải danh sách trung tâm'))
    } finally {
      loading.value = false
    }
  }

  function handleProvinceChange(): void {
    filter.value.district_id = undefined
    filter.value.center_id = undefined
    districts.value = []
    centerOptions.value = []
    void fetchDistrictsList()
    void fetchCenterOptions()
  }

  function handleDistrictChange(): void {
    filter.value.center_id = undefined
    centerOptions.value = []
    void fetchCenterOptions()
  }

  function handleLoadMore(): void {
    const nextPage = currentPage.value + 1
    if (nextPage <= lastPage.value) {
      void searchCenters(nextPage)
    }
  }

  function resetFilters(): void {
    filter.value = {
      province_id: undefined,
      district_id: undefined,
      center_id: undefined,
      customer_id: filter.value.customer_id,
    }
    centers.value = []
    districts.value = []
    centerOptions.value = []
    isSubmitted.value = false
    currentPage.value = 1
    lastPage.value = 1
    totalCenters.value = 0
  }

  function initFromRoute(): void {
    const customerId = route.query.customer_id
    if (customerId) {
      filter.value.customer_id = String(customerId)
    }
  }

  return {
    centers,
    provinces,
    districts,
    centerOptions,
    loading,
    isSubmitted,
    currentPage,
    lastPage,
    totalCenters,
    filter,
    fetchProvincesList,
    fetchDistrictsList,
    fetchCenterOptions,
    searchCenters,
    handleProvinceChange,
    handleDistrictChange,
    handleLoadMore,
    resetFilters,
    initFromRoute,
  }
}
