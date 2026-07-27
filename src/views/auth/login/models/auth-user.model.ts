export interface AuthAccountType {
  id: number
  name?: string
  noiboRoleId?: number | string
}

export interface AuthUserProfile {
  statusVerify?: number
  accountTypeId?: number
  accountType?: AuthAccountType
  businessLevelId?: number
}

export interface AuthCandidate {
  status?: number
}

export interface AuthUserPosition {
  position?: string
}

export interface AuthUser {
  id: number
  email?: string
  name?: string
  image?: string
  isConfirm?: number
  accountType?: AuthAccountType
  profile?: AuthUserProfile
  permission?: string[]
  userPositions?: AuthUserPosition[]
}

export interface LoginResponse {
  user: AuthUser
  candidate?: AuthCandidate
  authTokennoibo?: string
  token?: string
  data?: {
    authTokennoibo?: string
    token?: string
  }
  message?: string
}
