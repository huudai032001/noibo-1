import { computed, type Ref } from 'vue'
import { useFormatter } from '@/composables/use-formatter'
import {
  CategoryThuNhapRsm,
  ConvertCategoryToKey,
  gdkvType,
  gdvpType,
  hckvType,
  headOfficeType,
  PayslipType,
  qlhvType,
  saleExpertType,
  saleInternType,
  saleLeaderCenterType,
  saleLeaderProvinceType,
  saleLeaderType,
  saleLuongCungType,
  saleLuongMemType,
  saleMemberType,
  type PayslipCategory,
  type PayslipTypeValue,
} from '../constants/payslip-config'
import { getPayslipRowsForMonth } from '../constants/payslip-version'
import type {
  PayslipData,
  PayslipDetailItem,
  PayslipLogHumanResource,
  PayslipRowConfig,
  PayslipTableRowView,
} from '../models/phieu-luong.model'
import { getRangeMonthLabel, normalizeLabel, toCamelCaseKey } from '../utils/payslip-helpers'

interface PhieuLuongRowsState {
  payslipData: Ref<PayslipData>
  startOfMonth: Ref<string>
  selectedDate: Ref<Date>
}

export function usePhieuLuongRows(state: PhieuLuongRowsState) {
  const { formatCurrency, formatPercent } = useFormatter()

  const payslipType = computed<PayslipTypeValue | ''>(() => {
    const logAccountType = state.payslipData.value.accountType?.toLowerCase() ?? ''

    if (headOfficeType.logAccountType.has(logAccountType)) return PayslipType.headOffice
    if (gdvpType.logAccountType.has(logAccountType)) return PayslipType.gdvp
    if (gdkvType.logAccountType.has(logAccountType)) return PayslipType.gdkv
    if (hckvType.logAccountType.has(logAccountType)) return PayslipType.hckv
    if (qlhvType.logAccountType.has(logAccountType)) return PayslipType.qlhv
    if (saleInternType.logAccountType.has(logAccountType)) return PayslipType.saleIntern
    if (saleMemberType.logAccountType.has(logAccountType)) return PayslipType.saleMember
    if (saleExpertType.logAccountType.has(logAccountType)) return PayslipType.saleExpert
    if (saleLeaderType.logAccountType.has(logAccountType)) return PayslipType.saleLeader
    if (saleLeaderCenterType.logAccountType.has(logAccountType)) return PayslipType.saleLeaderCenter
    if (saleLeaderProvinceType.logAccountType.has(logAccountType)) return PayslipType.saleLeaderProvince
    if (saleLuongCungType.logAccountType.has(logAccountType)) return PayslipType.saleLuongCungV3
    if (saleLuongMemType.logAccountType.has(logAccountType)) return PayslipType.saleLuongMemV3

    return ''
  })

  const listRows = computed(() =>
    getPayslipRowsForMonth(payslipType.value, state.startOfMonth.value),
  )

  const rangeMonthLabel = computed(() => getRangeMonthLabel(state.selectedDate.value))

  function readDataValue(data: PayslipData, key: string): string | number | null | undefined {
    if (key === 'none') return ''
    const camelKey = toCamelCaseKey(key)
    return data[camelKey] as string | number | null | undefined
  }

  function formatRowValue(
    rawValue: string | number | null | undefined,
    row: PayslipRowConfig,
  ): string | number {
    let value: string | number = rawValue ?? ''

    switch (row.prefix) {
      case '%':
        value = `${value}%`
        break
      case '%%':
        if (typeof value === 'string' && value.includes('%')) {
          break
        }
        value = `${(Number(value) * 100).toFixed(2)}%`
        break
      case 'currency':
        value = formatCurrency(value)
        break
      default:
        break
    }

    if (row.convertValue === 'boolean') {
      value = Number(value) === 1 ? 'Có' : 'Không'
    }

    return value
  }

  function getValue(
    row: PayslipRowConfig,
    currentData?: PayslipLogHumanResource | PayslipData,
  ): string | number {
    const data = (currentData ?? state.payslipData.value) as PayslipData
    let rawValue: string | number | null | undefined = ''

    if (typeof row.key === 'string') {
      rawValue = readDataValue(data, row.key)
    } else if (typeof row.key === 'function') {
      rawValue = row.key(data)
    }

    return formatRowValue(rawValue, row)
  }

  function takeDetailHeadOffice(row: PayslipRowConfig): PayslipDetailItem[] {
    const pool = state.payslipData.value.details ?? []
    const categoryKey = typeof row.key === 'string' ? row.key : null
    let categoryLabel = categoryKey ? ConvertCategoryToKey[categoryKey as PayslipCategory] : undefined

    if (!categoryLabel) {
      categoryLabel = row.title || ''
    }

    const expected = normalizeLabel(categoryLabel)
    return pool.filter((detail) => normalizeLabel(detail.danhMuc) === expected)
  }

  function takeDetailGdkv(row: PayslipRowConfig): PayslipDetailItem[] {
    const key = typeof row.key === 'string' ? row.key : null
    if (!key) return []

    let category = ConvertCategoryToKey[key as PayslipCategory]
    if (payslipType.value === PayslipType.gdkv && key === CategoryThuNhapRsm) {
      category = ConvertCategoryToKey[CategoryThuNhapRsm]
    }

    const details = state.payslipData.value.details ?? []
    const filtered = details.filter((item) => item.danhMuc === category)
    return filtered.length > 0 ? filtered : []
  }

  function getDetail(row: PayslipRowConfig): PayslipDetailItem[] {
    if (payslipType.value === PayslipType.headOffice) {
      return takeDetailHeadOffice(row)
    }
    return takeDetailGdkv(row)
  }

  function getCategory(row: PayslipRowConfig): PayslipCategory | null {
    return typeof row.key === 'string' ? (row.key as PayslipCategory) : null
  }

  const tableRows = computed<PayslipTableRowView[]>(() => {
    const rows: PayslipTableRowView[] = []
    const logs = state.payslipData.value.logHumanResources ?? []

    listRows.value.forEach((row, index) => {
      if (row.logsArray) {
        if (logs.length === 0) {
          rows.push({
            row,
            index,
            value: getValue(row),
            details: getDetail(row),
            category: getCategory(row),
            periodLabel: rangeMonthLabel.value,
          })
          return
        }

        logs.forEach((log, logIndex) => {
          rows.push({
            row,
            index,
            value: getValue(row, log),
            details: getDetail(row),
            category: getCategory(row),
            periodLabel: log.giaidoan || rangeMonthLabel.value,
            log,
            hideTitle: logIndex !== 0,
            rowSpan: logs.length,
          })
        })
        return
      }

      rows.push({
        row,
        index,
        value: getValue(row),
        details: getDetail(row),
        category: getCategory(row),
        periodLabel: row.extraTime ? rangeMonthLabel.value : undefined,
      })
    })

    return rows
  })

  const hasPayslip = computed(() => Boolean(state.payslipData.value.id))

  return {
    payslipType,
    listRows,
    rangeMonthLabel,
    tableRows,
    hasPayslip,
    getValue,
    getDetail,
    getCategory,
  }
}
