import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BreadcrumbItem } from '@/models/menu.model'

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  const items = ref<BreadcrumbItem[]>([])

  function setItems(next: BreadcrumbItem[]): void {
    items.value = next
  }

  function clear(): void {
    items.value = []
  }

  return {
    items,
    setItems,
    clear,
  }
})
