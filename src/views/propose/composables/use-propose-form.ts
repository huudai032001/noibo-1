import type { Ref } from 'vue'
import { PROPOSE_CATEGORY } from '../constants'
import type { ProposeFormState, ProposeProfileUser } from '../models/propose.model'
import { formatDateToApi, formatTimeToApi } from '../utils/propose-helpers'
import type { ProposeCreatePayload } from '../models/propose.model'

interface ProposeFormDeps {
  formState: Ref<ProposeFormState>
  profileUser: Ref<ProposeProfileUser | null>
  editPhoneNumber: Ref<boolean>
}

export function useProposeForm({ formState, profileUser, editPhoneNumber }: ProposeFormDeps) {
  function resetCategoryFields(): void {
    const category = formState.value.category
    formState.value = {
      category,
      startDate: null,
      endDate: null,
      reason: '',
      phone: '',
      generalLeave: null,
      startShiftOff: null,
      typeLeave: 0,
      timeCheckin: null,
      timeCheckout: null,
      currentWorkingHours: null,
      currentWorkingChange: null,
      overtimeResults: '',
      typeArise: 0,
      month: '',
      dateRange: [],
    }
    editPhoneNumber.value = false
  }

  function changeCategory(category: number): void {
    formState.value.category = category as ProposeFormState['category']
    resetCategoryFields()
    formState.value.category = category as ProposeFormState['category']
  }

  function resolvePhone(): string {
    if (formState.value.phone) {
      return formState.value.phone
    }
    if (!editPhoneNumber.value && profileUser.value?.phone) {
      return profileUser.value.phone
    }
    return ''
  }

  function buildCreatePayload(): ProposeCreatePayload {
    const state = formState.value
    const payload: ProposeCreatePayload = {
      category: state.category,
      startDate: formatDateToApi(state.startDate),
      reason: state.reason.trim(),
      phone: resolvePhone(),
      typeArise: state.typeArise,
      month: state.month,
      overtimeResults: state.overtimeResults,
    }

    if (state.category === PROPOSE_CATEGORY.leave) {
      payload.endDate = formatDateToApi(state.endDate)
      payload.generalLeave = state.generalLeave ?? ''
      payload.startShiftOff = state.startShiftOff ?? ''
      payload.typeLeave = state.typeLeave
    }

    if (
      state.category === PROPOSE_CATEGORY.overtime ||
      state.category === PROPOSE_CATEGORY.offSiteHours
    ) {
      payload.timeCheckin = formatTimeToApi(state.timeCheckin)
      payload.timeCheckout = formatTimeToApi(state.timeCheckout)
    }

    if (state.category === PROPOSE_CATEGORY.shiftChange) {
      payload.currentWorkingHours = state.currentWorkingHours ?? ''
      payload.currentWorkingChange = state.currentWorkingChange ?? ''
    }

    return payload
  }

  function isCreateFormValid(): boolean {
    const state = formState.value
    if (!state.reason.trim() || !state.startDate) {
      return false
    }

    if (state.category === PROPOSE_CATEGORY.leave) {
      return Boolean(
        state.generalLeave &&
          state.startShiftOff &&
          state.endDate &&
          resolvePhone(),
      )
    }

    if (state.category === PROPOSE_CATEGORY.overtime) {
      return Boolean(state.timeCheckin && state.timeCheckout)
    }

    if (state.category === PROPOSE_CATEGORY.shiftChange) {
      return Boolean(state.currentWorkingHours && state.currentWorkingChange)
    }

    if (state.category === PROPOSE_CATEGORY.offSiteHours) {
      return Boolean(state.timeCheckin && state.timeCheckout)
    }

    return false
  }

  return {
    changeCategory,
    resetCategoryFields,
    buildCreatePayload,
    isCreateFormValid,
    resolvePhone,
  }
}
