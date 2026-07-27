import { computed } from 'vue'
import { useMenuPermission } from '@/composables/use-menu-permission'
import {
  ADMINISTRATION_MENU_TITLE,
  SPECIAL_ADMINISTRATION_LINKS,
  SPECIAL_MENU_USER_IDS,
} from '@/constants/menu'
import { topMenuItems } from '@/data/menu'
import type { MenuItem } from '@/models/menu.model'

export function useFilteredMenu() {
  const { userId, canViewTopMenuItem, canViewChildMenuItem } = useMenuPermission()

  const isSpecialUser = computed(() => {
    if (!userId.value) return false
    return SPECIAL_MENU_USER_IDS.includes(userId.value as (typeof SPECIAL_MENU_USER_IDS)[number])
  })

  function filterMenuItems(items: MenuItem[], parent?: MenuItem): MenuItem[] {
    return items.reduce<MenuItem[]>((visibleItems, item) => {
      const isVisible = parent ? canViewChildMenuItem(item, parent) : canViewTopMenuItem(item)
      if (!isVisible) return visibleItems

      if (!item.subMenu?.length) {
        visibleItems.push({ ...item })
        return visibleItems
      }

      const visibleChildren = filterMenuItems(item.subMenu, item)
      if (!visibleChildren.length) return visibleItems

      visibleItems.push({
        ...item,
        subMenu: visibleChildren,
      })

      return visibleItems
    }, [])
  }

  const filteredMenuItems = computed<MenuItem[]>(() => {
    const items = filterMenuItems(topMenuItems)

    if (!isSpecialUser.value) return items

    return items.map((item) => {
      if (item.title !== ADMINISTRATION_MENU_TITLE) return item

      const specialLinks: MenuItem[] = SPECIAL_ADMINISTRATION_LINKS.map((link) => ({
        title: link.title,
        icon: link.icon ?? 'Activity',
        to: link.to,
        name: link.name,
      }))

      return {
        ...item,
        subMenu: [...(item.subMenu ?? []), ...specialLinks],
      }
    })
  })

  return {
    filteredMenuItems,
    isSpecialUser,
  }
}
