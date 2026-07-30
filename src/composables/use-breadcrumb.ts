import type { BreadcrumbItem } from '@/models/menu.model'
import { useBreadcrumbStore } from '@/stores/breadcrumb'

/** Đẩy breadcrumb lên Pinia — gọi ở setup của từng trang. */
export function useBreadcrumb(items: BreadcrumbItem[]): void {
  useBreadcrumbStore().setItems(items)
}
