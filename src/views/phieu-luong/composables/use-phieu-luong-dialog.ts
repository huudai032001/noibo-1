import { ref } from 'vue'
import type { PayslipCategory, PayslipTypeValue } from '../constants/payslip-config'
import type { PayslipDetailItem } from '../models/phieu-luong.model'

export function usePhieuLuongDialog() {
  const visible = ref(false)
  const title = ref('Xem chi tiết')
  const details = ref<PayslipDetailItem[]>([])
  const category = ref<PayslipCategory | null>(null)
  const payslipType = ref<PayslipTypeValue | ''>('')

  function openDialog(options: {
    details: PayslipDetailItem[]
    category: PayslipCategory | null
    payslipType: PayslipTypeValue | ''
    title?: string
  }): void {
    details.value = options.details
    category.value = options.category
    payslipType.value = options.payslipType
    title.value = options.title ?? 'Xem chi tiết'
    visible.value = true
  }

  function closeDialog(): void {
    visible.value = false
  }

  return {
    visible,
    title,
    details,
    category,
    payslipType,
    openDialog,
    closeDialog,
  }
}
