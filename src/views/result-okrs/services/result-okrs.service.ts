import ApiService from '@/services/api-service'
import { RESULT_OKRS_API } from '../constants'
import type { ResultOkrsListQuery, ResultOkrsListResponseApi } from '../models/result-okrs.model'

export async function fetchResultOkrsList(
  params: ResultOkrsListQuery,
): Promise<ResultOkrsListResponseApi> {
  return ApiService.get<ResultOkrsListQuery, ResultOkrsListResponseApi>(RESULT_OKRS_API.list, params)
}
