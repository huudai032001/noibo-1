import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { AccountPositionGroup } from '@/constants/account-position'
import { CANDIDATE_AUTH, HONOR_MENU_NAME } from '@/constants/menu'
import type { PermissionValue } from '@/constants/permission'
import type { MenuItem } from '@/models/menu.model'
import { useAuthStore } from '@/stores/auth'

type MenuAuth = PermissionValue | 'all' | '' | undefined

function hasPermission(permissions: string[], auth: MenuAuth): boolean {
  if (!auth) return false
  return permissions.includes(auth)
}

function hasPosition(
  userPositions: Array<{ position?: string }> | undefined,
  positionGroup: AccountPositionGroup | undefined,
): boolean {
  if (!positionGroup?.length || !userPositions?.length) return false

  return userPositions.some((userPosition) => {
    if (!userPosition.position) return false
    return positionGroup.includes(userPosition.position)
  })
}

export function useMenuPermission() {
  const authStore = useAuthStore()
  const { currentUser } = storeToRefs(authStore)

  const permissions = computed(() => currentUser.value?.permission ?? [])
  const userPositions = computed(() => currentUser.value?.userPositions ?? [])
  const userId = computed(() => currentUser.value?.id ?? null)

  function permissionForPosition(position: AccountPositionGroup | undefined): boolean {
    return hasPosition(userPositions.value, position)
  }

  function canViewTopMenuItem(item: MenuItem): boolean {
    return (
      hasPermission(permissions.value, item.auth) ||
      permissionForPosition(item.position) ||
      item.auth === CANDIDATE_AUTH ||
      item.name === HONOR_MENU_NAME
    )
  }

  function canViewChildMenuItem(item: MenuItem, parent: MenuItem): boolean {
    return (
      hasPermission(permissions.value, item.auth) ||
      permissionForPosition(item.position) ||
      item.auth === 'all' ||
      parent.auth === CANDIDATE_AUTH
    )
  }

  function canViewMenuItem(item: MenuItem, parent?: MenuItem): boolean {
    if (!parent) return canViewTopMenuItem(item)
    return canViewChildMenuItem(item, parent)
  }

  return {
    currentUser,
    permissions,
    userPositions,
    userId,
    permissionForPosition,
    canViewTopMenuItem,
    canViewChildMenuItem,
    canViewMenuItem,
  }
}
