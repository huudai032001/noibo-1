import { computed, type Ref } from 'vue'
import { useFormatter } from '@/composables/use-formatter'
import type { PayslipData, PayslipTableRowView } from '../models/phieu-luong.model'

interface PhieuLuongSummaryState {
  payslipData: Ref<PayslipData>
  tableRows: Ref<PayslipTableRowView[]>
  hasPayslip: Ref<boolean>
}

export interface PayslipHighlightStat {
  label: string
  value: string
  icon: string
}

const NET_SALARY_KEYS = ['luongThucNhan', 'salary', 'tongThuNhap'] as const

export function usePhieuLuongSummary(state: PhieuLuongSummaryState) {
  const { formatCurrency } = useFormatter()

  const netSalaryLabel = computed(() => {
    if (!state.hasPayslip.value) return null

    for (const key of NET_SALARY_KEYS) {
      const raw = state.payslipData.value[key]
      if (raw !== null && raw !== undefined && raw !== '') {
        return formatCurrency(raw as string | number)
      }
    }

    const totalRow = state.tableRows.value.find((item) => item.row.className === 'total-get')
    if (totalRow?.value) {
      return String(totalRow.value)
    }

    return null
  })

  const rowCount = computed(() => {
    return state.tableRows.value.filter(
      (item) => !item.row.spaceBeforeRow && item.row.key !== 'none',
    ).length
  })

  const highlightStats = computed<PayslipHighlightStat[]>(() => {
    if (!state.hasPayslip.value) return []

    const data = state.payslipData.value
    const stats: PayslipHighlightStat[] = []

    const baseSalary = data.mucLuong
    if (baseSalary !== null && baseSalary !== undefined && baseSalary !== '') {
      stats.push({
        label: 'Lương cơ bản',
        value: formatCurrency(baseSalary as string | number),
        icon: 'pi-wallet',
      })
    }

    const workDays = data.tongCongThang ?? data.congThang
    if (workDays !== null && workDays !== undefined && workDays !== '') {
      stats.push({
        label: 'Công tháng',
        value: String(workDays),
        icon: 'pi-calendar',
      })
    }

    const tax = data.thueTncn
    if (tax !== null && tax !== undefined && tax !== '') {
      stats.push({
        label: 'Thuế TNCN',
        value: formatCurrency(tax as string | number),
        icon: 'pi-percentage',
      })
    }

    return stats.slice(0, 3)
  })

  return {
    netSalaryLabel,
    rowCount,
    highlightStats,
  }
}
