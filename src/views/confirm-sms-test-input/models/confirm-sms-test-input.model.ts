export interface ConfirmSmsUser {
  id: number
  name: string
}

export interface ConfirmSmsScheduleItem {
  id: number
  typeItemId: number
  isConfirmComeTest: number
  status: number
  timeConfirm: string
  canceledAt: string
  schedule: string
  userCreated: ConfirmSmsUser | null
  canceller: ConfirmSmsUser | null
  checkConfirm?: number
  checkCancel?: number
}

export interface ConfirmSmsTestInputData {
  phone: string
  name: string
  status: number
  testInputScheduleItem: ConfirmSmsScheduleItem[]
}

export interface ShowConfirmTestInputResponse {
  data: ConfirmSmsTestInputData
}

export interface ConfirmTestInputPayload {
  id: number
  value: boolean
}

export interface ConfirmTestInputResponse {
  data: boolean | null
}

export interface ConfirmValidationState {
  checkCancel: boolean
  checkConfirm: boolean
}
