import ApiService from '@/services/api-service'
import { THONG_BAO_API } from '../constants'
import type {
  ThongBaoListQuery,
  ThongBaoListResponse,
  ThongBaoDetailResponse,
} from '../models/thong-bao.model'

export async function fetchThongBaoList(
  params: ThongBaoListQuery,
): Promise<ThongBaoListResponse> {
  return ApiService.get<ThongBaoListQuery, ThongBaoListResponse>(THONG_BAO_API.list, params)
}

export async function fetchThongBaoDetail(slug: string): Promise<ThongBaoDetailResponse> {
  return ApiService.get<never, ThongBaoDetailResponse>(`${THONG_BAO_API.detail}/${slug}`)
}
