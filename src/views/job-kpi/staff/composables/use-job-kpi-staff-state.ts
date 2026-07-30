import { ref } from 'vue'
import { JOB_KPI_STAFF_TABS } from '../constants'
import type {
  JobKpiKraItem,
  JobKpiPersonalData,
  JobKpiResultFeedback,
  JobKpiStaffTab,
} from '../models/job-kpi-staff.model'
import { clearFeedbackMap } from '../utils/job-kpi-helpers'

export function useJobKpiStaffState() {
  const personalData = ref<JobKpiPersonalData | null>(null)
  const kraItems = ref<JobKpiKraItem[]>([])
  const loading = ref(false)
  const loadingSearch = ref(false)
  const savingKraIds = ref<number[]>([])
  const errorMessage = ref('')
  const activeTab = ref<JobKpiStaffTab>(JOB_KPI_STAFF_TABS.kpi)
  const resultFeedback = ref<Map<number, JobKpiResultFeedback>>(clearFeedbackMap())
  const initialResults = ref<Map<number, string>>(new Map())

  function setPersonalData(value: JobKpiPersonalData | null): void {
    personalData.value = value
  }

  function setKraItems(value: JobKpiKraItem[]): void {
    kraItems.value = value
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function setLoadingSearch(value: boolean): void {
    loadingSearch.value = value
  }

  function setError(message: string): void {
    errorMessage.value = message
  }

  function clearError(): void {
    errorMessage.value = ''
  }

  function setActiveTab(tab: JobKpiStaffTab): void {
    activeTab.value = tab
  }

  function setResultFeedback(value: Map<number, JobKpiResultFeedback>): void {
    resultFeedback.value = value
  }

  function setInitialResults(value: Map<number, string>): void {
    initialResults.value = value
  }

  function addSavingKraId(kraId: number): void {
    if (!savingKraIds.value.includes(kraId)) {
      savingKraIds.value = [...savingKraIds.value, kraId]
    }
  }

  function removeSavingKraId(kraId: number): void {
    savingKraIds.value = savingKraIds.value.filter((id) => id !== kraId)
  }

  function syncInitialResults(items: JobKpiKraItem[]): void {
    const next = new Map(initialResults.value)
    items.forEach((item) => {
      next.set(item.id, item.results ?? '')
    })
    initialResults.value = next
  }

  function updateKraItem(kraId: number, patch: Partial<JobKpiKraItem>): void {
    kraItems.value = kraItems.value.map((item) =>
      item.id === kraId ? { ...item, ...patch } : item,
    )

    if (personalData.value) {
      personalData.value = {
        ...personalData.value,
        details: {
          ...personalData.value.details,
          data: personalData.value.details.data.map((item) =>
            item.id === kraId ? { ...item, ...patch } : item,
          ),
        },
      }
    }
  }

  return {
    personalData,
    kraItems,
    loading,
    loadingSearch,
    savingKraIds,
    errorMessage,
    activeTab,
    resultFeedback,
    initialResults,
    setPersonalData,
    setKraItems,
    setLoading,
    setLoadingSearch,
    setError,
    clearError,
    setActiveTab,
    setResultFeedback,
    setInitialResults,
    addSavingKraId,
    removeSavingKraId,
    syncInitialResults,
    updateKraItem,
  }
}
