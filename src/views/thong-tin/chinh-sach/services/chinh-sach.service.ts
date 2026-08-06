import ApiService from '@/services/api-service'
import { CHINH_SACH_API } from '../constants'
import type { ChinhSachListResponse } from '../models/chinh-sach.model'

export async function fetchChinhSachList(): Promise<ChinhSachListResponse> {
  return ApiService.get<never, ChinhSachListResponse>(CHINH_SACH_API.list)
}
