import type { PayslipCategory } from '../constants/payslip-config'

export type PayslipPrefix = 'currency' | '%' | '%%'
export type PayslipConvertValue = 'boolean'

export interface PayslipRowConfig {
  key?: string | ((row: PayslipData) => string | number | null | undefined)
  title?: string
  prefix?: PayslipPrefix
  extraTime?: boolean
  logsArray?: boolean
  tooltip?: string
  note?: string
  titleClassName?: string
  spaceBeforeRow?: boolean
  bold?: boolean
  className?: string
  convertValue?: PayslipConvertValue
}

export interface PayslipDetailItem {
  danhMuc?: string
  noiDung?: string
  soTien?: string | number
  type?: string
  khuVuc?: string
  bac?: string
  chiTieuDoanhSo?: number
  doanhSoKhuVuc?: number
  kpiDoanhSo?: number
  loiNhuanKinhDoanh?: number
  loiNhuanChiaTrongThang?: number
  thuongKpi?: number
  phanTramCoPhan?: number
  thuNhapCoTucTheoThang?: number
  ghiChu?: string
}

export interface PayslipLogHumanResource {
  giaidoan?: string
  revenuePersonal?: number
  attendance?: number
  salary?: number
  thuong?: number
  phat?: number
}

export interface PayslipData {
  id?: number
  isV2?: boolean
  hoVaTen?: string
  hoTen?: string
  maNhanSu?: string
  viTri?: string
  chucVu?: string
  capBac?: string
  khuVuc?: string
  vanPhong?: string
  accountType?: string
  levelChuyenMon?: string
  levelQuanTri?: string
  office?: string
  details?: PayslipDetailItem[]
  logHumanResources?: PayslipLogHumanResource[]
  [key: string]: string | number | boolean | PayslipDetailItem[] | PayslipLogHumanResource[] | undefined
}

export interface PayslipQueryParams {
  month: number
  year: number
}

export interface PayslipApiResponse {
  data: PayslipData
  message?: string
}

export interface PayslipTableRowView {
  row: PayslipRowConfig
  index: number
  value: string | number
  details: PayslipDetailItem[]
  category: PayslipCategory | null
  periodLabel?: string
  log?: PayslipLogHumanResource
  hideTitle?: boolean
  rowSpan?: number
}

export interface BondValueItem {
  milestone?: number
  startDate?: string
  endDate?: string
  allowedSaleDate?: string
  amountTotal?: number
  amountSold?: number
  amountBalance?: number
  items?: Array<{ yearNumber?: number; amount?: number }>
}

export interface BondValueResponse {
  data?: BondValueItem[]
}
