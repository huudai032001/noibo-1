import ApiService from '@/services/api-service'
import { ADVISE_CENTER_API } from '../constants'
import type {
  AdviseListRequestQuery,
  AdviseListResponseApi,
  ProvincesRequestQuery,
  ProvincesResponseApi,
  DistrictsRequestQuery,
  DistrictsResponseApi,
  CentersRequestQuery,
  CentersResponseApi,
  CenterDetailRequestQuery,
  CenterDetailResponseApi,
} from '../models/advise-center.model'

export async function fetchAdviseList(
  params: AdviseListRequestQuery,
): Promise<AdviseListResponseApi> {
  return ApiService.get<AdviseListRequestQuery, AdviseListResponseApi>(
    ADVISE_CENTER_API.list,
    params,
  )
}

export async function fetchProvinces(
  params: ProvincesRequestQuery,
): Promise<ProvincesResponseApi> {
  return ApiService.get<ProvincesRequestQuery, ProvincesResponseApi>(
    ADVISE_CENTER_API.provinces,
    params,
  )
}

export async function fetchDistricts(
  params: DistrictsRequestQuery,
): Promise<DistrictsResponseApi> {
  return ApiService.get<DistrictsRequestQuery, DistrictsResponseApi>(
    ADVISE_CENTER_API.districts,
    params,
  )
}

export async function fetchCenters(params: CentersRequestQuery): Promise<CentersResponseApi> {
  return ApiService.get<CentersRequestQuery, CentersResponseApi>(
    ADVISE_CENTER_API.centerList,
    params,
  )
}

export async function fetchCenterDetail(
  params: CenterDetailRequestQuery,
): Promise<CenterDetailResponseApi> {
  return ApiService.get<CenterDetailRequestQuery, CenterDetailResponseApi>(
    ADVISE_CENTER_API.detail,
    params,
  )
}
