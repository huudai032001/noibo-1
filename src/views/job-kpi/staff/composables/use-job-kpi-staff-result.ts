import { JOB_KPI_RESULT_SAVE_DEBOUNCE_MS } from '../constants'
import type { JobKpiKraItem, JobKpiResultFeedback } from '../models/job-kpi-staff.model'
import {
  clearFeedbackMap,
  deleteFeedbackEntry,
  setFeedbackEntry,
} from '../utils/job-kpi-helpers'
import type { Ref } from 'vue'

interface JobKpiResultHandlersDeps {
  kraItems: Ref<JobKpiKraItem[]>
  resultFeedback: Ref<Map<number, JobKpiResultFeedback>>
  setResultFeedback: (value: Map<number, JobKpiResultFeedback>) => void
  updateKraItem: (kraId: number, patch: Partial<JobKpiKraItem>) => void
  saveKraResult: (kraId: number, result: string) => Promise<boolean>
}

function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number,
): (...args: TArgs) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: TArgs) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}

export function useJobKpiStaffResult(deps: JobKpiResultHandlersDeps) {
  function clearAllFeedback(): void {
    deps.setResultFeedback(clearFeedbackMap())
  }

  function onResultInput(item: JobKpiKraItem, value: string): void {
    deps.updateKraItem(item.id, { results: value })
    clearAllFeedback()
    debouncedSave(item.id, value)
  }

  const debouncedSave = debounce((kraId: number, value: string) => {
    if (!value.trim()) {
      deps.setResultFeedback(
        setFeedbackEntry(deps.resultFeedback.value, kraId, {
          error: 'Thành phẩm không được để trống',
        }),
      )
      return
    }

    deps.setResultFeedback(deleteFeedbackEntry(deps.resultFeedback.value, kraId))
    void deps.saveKraResult(kraId, value)
  }, JOB_KPI_RESULT_SAVE_DEBOUNCE_MS)

  return {
    onResultInput,
    clearAllFeedback,
  }
}
