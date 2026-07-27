export const CONFIRM_SMS_API = {
  show: '/show-confirm-test-input',
  confirm: '/confirm-test-input',
} as const

export const CONFIRM_SMS_SCHEDULE_TYPE = {
  speaking: 0,
} as const

export const CONFIRM_SMS_STATUS = {
  cancelled: 4,
  scheduleCancelled: 5,
} as const

export const CONFIRM_SMS_DATE_FORMAT = 'schedule' as const

export const CONFIRM_MIN_HOURS_BEFORE = 1
