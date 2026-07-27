import ApiService from '@/services/api-service'
import type {
  BondValueResponse,
  PayslipApiResponse,
  PayslipQueryParams,
} from '../models/phieu-luong.model'
import { PHIEU_LUONG_API } from '../constants'

export async function fetchPayslip(params: PayslipQueryParams): Promise<PayslipApiResponse> {
  return ApiService.get<PayslipQueryParams, PayslipApiResponse>(PHIEU_LUONG_API.payslip, params)
}

export async function fetchBondValues(): Promise<BondValueResponse> {
  return ApiService.get<undefined, BondValueResponse>(PHIEU_LUONG_API.bondValues)
}
