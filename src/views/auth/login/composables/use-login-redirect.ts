import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import type { AuthCandidate, AuthUser, LoginResponse } from '../models/auth-user.model'
import {
  ACCOUNT_CONFIRMED_STATUSES,
  AUTH_ROUTES,
  CANDIDATE_EXCLUDED_ROLE_ID,
  CANDIDATE_PROFILE_STATUS,
  PROFILE_PENDING_VERIFY_STATUSES,
  PROFILE_VERIFY_ROLE_IDS,
} from '../constants'

function getNoiboRoleId(user: AuthUser): string {
  const fromAccountType = user.accountType?.noiboRoleId
  if (fromAccountType !== undefined && fromAccountType !== null) {
    return String(fromAccountType)
  }

  const fromProfile = user.profile?.accountType?.noiboRoleId
  if (fromProfile !== undefined && fromProfile !== null) {
    return String(fromProfile)
  }

  return ''
}

function isAccountConfirmed(user: AuthUser): boolean {
  return ACCOUNT_CONFIRMED_STATUSES.includes(
    (user.isConfirm ?? -1) as (typeof ACCOUNT_CONFIRMED_STATUSES)[number],
  )
}

function needsProfileVerification(user: AuthUser, roleId: string): boolean {
  if (!PROFILE_VERIFY_ROLE_IDS.includes(roleId as (typeof PROFILE_VERIFY_ROLE_IDS)[number])) {
    return false
  }

  const statusVerify = user.profile?.statusVerify
  return PROFILE_PENDING_VERIFY_STATUSES.includes(
    (statusVerify ?? -1) as (typeof PROFILE_PENDING_VERIFY_STATUSES)[number],
  )
}

function resolvePostLoginPath(
  user: AuthUser,
  candidate?: AuthCandidate,
  preferredPath = AUTH_ROUTES.dashboard,
): string {
  if (!isAccountConfirmed(user)) {
    return AUTH_ROUTES.updateUser(user.id)
  }

  let path = preferredPath
  const authPaths = ['/reset-password', '/forgot-password', '/register']
  if (
    path === AUTH_ROUTES.login ||
    authPaths.includes(path) ||
    path.includes('update-user')
  ) {
    path = `/${AUTH_ROUTES.dashboard}`
  }

  // Named dashboard route maps to `/`
  if (path === AUTH_ROUTES.dashboard || path === `/${AUTH_ROUTES.dashboard}`) {
    path = '/'
  }

  const roleId = getNoiboRoleId(user)
  const candidateStatus = candidate?.status

  if (
    candidateStatus === CANDIDATE_PROFILE_STATUS &&
    roleId !== CANDIDATE_EXCLUDED_ROLE_ID &&
    user.isConfirm !== 2
  ) {
    path = AUTH_ROUTES.profile
  }

  if (needsProfileVerification(user, roleId)) {
    path = AUTH_ROUTES.profile
  }

  return path
}

export function useLoginRedirect(router: Router, route: RouteLocationNormalizedLoaded) {
  async function redirectAfterLogin(response: LoginResponse): Promise<void> {
    const returnUrl = route.query.returnUrl
    if (typeof returnUrl === 'string' && returnUrl.length > 0) {
      await router.push(returnUrl)
      return
    }

    const path = resolvePostLoginPath(response.user, response.candidate)
    await router.push(path)
  }

  async function redirectIfAuthenticated(isAuthenticated: boolean): Promise<void> {
    if (isAuthenticated) {
      await router.push({ name: AUTH_ROUTES.dashboard })
    }
  }

  return {
    redirectAfterLogin,
    redirectIfAuthenticated,
    resolvePostLoginPath,
  }
}
