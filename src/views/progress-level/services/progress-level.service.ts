import ApiService from '@/services/api-service'
import { PROGRESS_LEVEL_API } from '../constants'
import type {
  ProgressLevelListQuery,
  ProgressLevelListResponseApi,
  ProgressLevelMinusPointQuery,
  ProgressLevelMinusPointResponseApi,
} from '../models/progress-level.model'

export async function fetchProgressLevelList(
  params: ProgressLevelListQuery,
): Promise<ProgressLevelListResponseApi> {
  return ApiService.get<ProgressLevelListQuery, ProgressLevelListResponseApi>(
    PROGRESS_LEVEL_API.list,
    params,
  )
}

export async function fetchProgressLevelMinusPointDetail(
  params: ProgressLevelMinusPointQuery,
): Promise<ProgressLevelMinusPointResponseApi> {
  return ApiService.get<ProgressLevelMinusPointQuery, ProgressLevelMinusPointResponseApi>(
    PROGRESS_LEVEL_API.minusPointDetail,
    params,
  )
}
