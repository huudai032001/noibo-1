import ApiService from '@/services/api-service'
import type { ChamCongApiResponse, ChamCongQueryParams } from '../models/cham-cong.model'
import { CHAM_CONG_API } from '../constants'

export async function fetchTimeKeeping(
  params: ChamCongQueryParams,
): Promise<ChamCongApiResponse> {
  return ApiService.get<ChamCongQueryParams, ChamCongApiResponse>(
    CHAM_CONG_API.timeKeeping,
    params,
  )
}
