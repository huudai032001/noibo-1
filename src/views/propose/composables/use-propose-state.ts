import { ref } from 'vue'
import type {
  ProposeDepartment,
  ProposeFormErrors,
  ProposeFormState,
  ProposeItem,
  ProposeProfileUser,
} from '../models/propose.model'
import { PROPOSE_CATEGORY, PROPOSE_LEAVE_TYPE, PROPOSE_OVERTIME_TYPE } from '../constants'

function createDefaultFormState(): ProposeFormState {
  return {
    category: PROPOSE_CATEGORY.leave,
    startDate: null,
    endDate: null,
    reason: '',
    phone: '',
    generalLeave: null,
    startShiftOff: null,
    typeLeave: PROPOSE_LEAVE_TYPE.paid,
    timeCheckin: null,
    timeCheckout: null,
    currentWorkingHours: null,
    currentWorkingChange: null,
    overtimeResults: '',
    typeArise: PROPOSE_OVERTIME_TYPE.workHours,
    month: '',
    dateRange: [],
  }
}

function createDefaultFormErrors(): ProposeFormErrors {
  return {
    generalLeave: false,
    dateRest: false,
    timecheckRest: false,
    checkphone: false,
    today: false,
  }
}

export function useProposeState() {
  const items = ref<ProposeItem[]>([])
  const loading = ref(false)
  const loadingSearch = ref(false)
  const loadingAction = ref(false)
  const loadingCreate = ref(false)
  const errorMessage = ref('')

  const profileUser = ref<ProposeProfileUser | null>(null)
  const departments = ref<ProposeDepartment[]>([])

  const formState = ref<ProposeFormState>(createDefaultFormState())
  const formErrors = ref<ProposeFormErrors>(createDefaultFormErrors())
  const editPhoneNumber = ref(false)

  function setItems(value: ProposeItem[]): void {
    items.value = value
  }

  function setLoading(value: boolean): void {
    loading.value = value
  }

  function setLoadingSearch(value: boolean): void {
    loadingSearch.value = value
  }

  function setLoadingAction(value: boolean): void {
    loadingAction.value = value
  }

  function setLoadingCreate(value: boolean): void {
    loadingCreate.value = value
  }

  function setError(message: string): void {
    errorMessage.value = message
  }

  function clearError(): void {
    errorMessage.value = ''
  }

  function setProfileUser(user: ProposeProfileUser | null): void {
    profileUser.value = user
  }

  function setDepartments(value: ProposeDepartment[]): void {
    departments.value = value
  }

  function resetFormState(): void {
    formState.value = createDefaultFormState()
    formErrors.value = createDefaultFormErrors()
    editPhoneNumber.value = false
  }

  function resetFormErrors(): void {
    formErrors.value = createDefaultFormErrors()
  }

  return {
    items,
    loading,
    loadingSearch,
    loadingAction,
    loadingCreate,
    errorMessage,
    profileUser,
    departments,
    formState,
    formErrors,
    editPhoneNumber,
    setItems,
    setLoading,
    setLoadingSearch,
    setLoadingAction,
    setLoadingCreate,
    setError,
    clearError,
    setProfileUser,
    setDepartments,
    resetFormState,
    resetFormErrors,
  }
}
