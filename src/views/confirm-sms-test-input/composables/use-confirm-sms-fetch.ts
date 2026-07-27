import { watch, type Ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useFormatter } from '@/composables/use-formatter'
import type { ConfirmSmsScheduleItem } from '../models/confirm-sms-test-input.model'
import { CONFIRM_SMS_DATE_FORMAT } from '../constants'
import { fetchConfirmSmsTestInput } from '../services/confirm-sms-test-input.service'

interface ConfirmSmsState {
  data: Ref<import('../models/confirm-sms-test-input.model').ConfirmSmsTestInputData | null>
  testInputScheduleItem: Ref<ConfirmSmsScheduleItem | null>
  loading: Ref<boolean>
  error: Ref<boolean>
  setScheduleItem: (item: ConfirmSmsScheduleItem | null) => void
  findSpeakingScheduleItem: (scheduleItems: ConfirmSmsScheduleItem[]) => ConfirmSmsScheduleItem | null
}

function formatScheduleItemDates(
  item: ConfirmSmsScheduleItem,
  formatDate: ReturnType<typeof useFormatter>['formatDate'],
): ConfirmSmsScheduleItem {
  return {
    ...item,
    timeConfirm: formatDate(item.timeConfirm, CONFIRM_SMS_DATE_FORMAT),
    canceledAt: formatDate(item.canceledAt, CONFIRM_SMS_DATE_FORMAT),
    schedule: formatDate(item.schedule, CONFIRM_SMS_DATE_FORMAT),
  }
}

export function useConfirmSmsFetch(route: RouteLocationNormalizedLoaded, state: ConfirmSmsState) {
  const { formatDate } = useFormatter()

  async function loadConfirmData(): Promise<void> {
    state.loading.value = true
    state.error.value = false

    try {
      const uuid = typeof route.query.uuid === 'string' ? route.query.uuid : ''

      if (!uuid) {
        state.error.value = true
        return
      }

      const response = await fetchConfirmSmsTestInput(uuid)
      state.data.value = response.data

      const scheduleItems = response.data?.testInputScheduleItem ?? []
      const scheduleItem = state.findSpeakingScheduleItem(scheduleItems)

      state.setScheduleItem(
        scheduleItem ? formatScheduleItemDates(scheduleItem, formatDate) : null,
      )
    } catch (fetchError) {
      console.error('Có lỗi xảy ra khi tải dữ liệu:', fetchError)
      state.error.value = true
    } finally {
      state.loading.value = false
    }
  }

  watch(
    () => route.query.uuid,
    (newUuid, oldUuid) => {
      if (newUuid !== oldUuid) {
        void loadConfirmData()
      }
    },
  )

  return {
    loadConfirmData,
  }
}
