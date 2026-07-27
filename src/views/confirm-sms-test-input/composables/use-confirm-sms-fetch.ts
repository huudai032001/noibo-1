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
  setError: (message?: string) => void
  clearError: () => void
}

function formatScheduleItemDates(
  item: ConfirmSmsScheduleItem,
  formatDate: ReturnType<typeof useFormatter>['formatDate'],
): ConfirmSmsScheduleItem {
  const formattedSchedule = formatDate(item.schedule, CONFIRM_SMS_DATE_FORMAT) || item.schedule

  return {
    ...item,
    timeConfirm: formatDate(item.timeConfirm, CONFIRM_SMS_DATE_FORMAT) || item.timeConfirm,
    canceledAt: formatDate(item.canceledAt, CONFIRM_SMS_DATE_FORMAT) || item.canceledAt,
    schedule: formattedSchedule,
  }
}

export function useConfirmSmsFetch(route: RouteLocationNormalizedLoaded, state: ConfirmSmsState) {
  const { formatDate } = useFormatter()

  async function loadConfirmData(): Promise<void> {
    state.loading.value = true
    state.clearError()
    state.data.value = null
    state.setScheduleItem(null)

    try {
      const uuid = typeof route.query.uuid === 'string' ? route.query.uuid : ''

      if (!uuid) {
        state.setError('Thiếu mã xác nhận trong liên kết. Vui lòng mở lại link từ SMS.')
        return
      }

      const response = await fetchConfirmSmsTestInput(uuid)

      if (response.error || !response.data) {
        state.setError(
          response.message || 'Không có thông tin lịch hẹn. Liên kết có thể đã hết hạn hoặc không hợp lệ.',
        )
        return
      }

      state.data.value = response.data

      const scheduleItems = response.data.testInputScheduleItem ?? []
      const scheduleItem = state.findSpeakingScheduleItem(scheduleItems)

      if (!scheduleItem) {
        state.setError('Không tìm thấy lịch test speaking trong thông tin lịch hẹn.')
        return
      }

      state.setScheduleItem(formatScheduleItemDates(scheduleItem, formatDate))
    } catch (fetchError) {
      console.error('Có lỗi xảy ra khi tải dữ liệu:', fetchError)
      state.setError('Không thể tải thông tin lịch hẹn. Vui lòng thử lại sau ít phút.')
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
