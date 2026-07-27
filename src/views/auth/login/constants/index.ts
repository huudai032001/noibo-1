/** Roles that must complete profile verification before accessing app */
export const PROFILE_VERIFY_ROLE_IDS = ['30', '31', '32', '33', '37', '38'] as const

/** Candidate status that redirects to profile (except excluded role) */
export const CANDIDATE_PROFILE_STATUS = 3

/** Role excluded from candidate → profile redirect */
export const CANDIDATE_EXCLUDED_ROLE_ID = '32'

/** Confirmed account statuses that can enter the app */
export const ACCOUNT_CONFIRMED_STATUSES = [2, 4] as const

/** Profile verify statuses that force redirect to profile */
export const PROFILE_PENDING_VERIFY_STATUSES = [0, 3] as const

export const AUTH_ROUTES = {
  dashboard: 'dashboard',
  login: 'login',
  forgotPassword: '/forgot-password',
  profile: '/profile',
  updateUser: (userId: number) => `/update-user/${userId}`,
} as const

export const MIN_CREDENTIAL_LENGTH = 6
