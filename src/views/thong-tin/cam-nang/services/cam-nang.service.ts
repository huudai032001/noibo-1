import ApiService from '@/services/api-service'
import { CAM_NANG_API } from '../constants'
import type { CamNangListQuery, CamNangListResponse } from '../models/cam-nang.model'

export async function fetchCamNangList(params?: CamNangListQuery): Promise<CamNangListResponse> {
  return ApiService.get<CamNangListQuery, CamNangListResponse>(CAM_NANG_API.list, params)
}
