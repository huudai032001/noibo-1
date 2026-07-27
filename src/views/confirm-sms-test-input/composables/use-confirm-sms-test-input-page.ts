import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfirmSmsActions } from './use-confirm-sms-actions'
import { useConfirmSmsFetch } from './use-confirm-sms-fetch'
import { useConfirmSmsState } from './use-confirm-sms-state'

export function useConfirmSmsTestInputPage() {
  const route = useRoute()
  const state = useConfirmSmsState()
  const { loadConfirmData } = useConfirmSmsFetch(route, state)

  const { validationState, handleConfirm } = useConfirmSmsActions(state.testInputScheduleItem, {
    confirming: state.confirming,
    setLocalConfirmFlags: state.setLocalConfirmFlags,
    onConfirmSuccess: loadConfirmData,
  })

  onMounted(() => {
    void loadConfirmData()
  })

  return {
    ...state,
    validationState,
    handleConfirm,
    reload: loadConfirmData,
  }
}
