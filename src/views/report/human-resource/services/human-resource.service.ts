import ApiService from '@/services/api-service'
import { HUMAN_RESOURCE_REPORT_API } from '../constants'
import type {
  Area,
  Branch,
  HumanResourceReportRequest,
  HumanResourceReportResponse,
} from '../models/human-resource.model'

export interface ListResponse<T> {
  data?: T[]
  total?: number
  currentPage?: number
  lastPage?: number
  perPage?: number
}

export interface BranchListResponse {
  data?: Branch[]
}

export interface AreaListResponse {
  data?: Area[]
}

export async function fetchHumanResourceReport(
  params: HumanResourceReportRequest,
): Promise<HumanResourceReportResponse> {
  const queryParams = {
    ...(params.branchId && { branchId: params.branchId }),
    ...(params.salaryMechanismId && {
      salaryMechanismId: params.salaryMechanismId,
      mechanism: params.salaryMechanismId,
    }),
    ...(params.year && { year: params.year }),
  }
  return ApiService.get<any, HumanResourceReportResponse>(
    HUMAN_RESOURCE_REPORT_API.report,
    queryParams,
  )
}

export async function fetchBranches(params?: { areaId?: number }): Promise<BranchListResponse> {
  const queryParams = params?.areaId ? { area_id: params.areaId } : undefined
  return ApiService.get<{ area_id?: number } | undefined, BranchListResponse>(
    HUMAN_RESOURCE_REPORT_API.branch_list,
    queryParams,
  )
}

export async function fetchAreas(): Promise<AreaListResponse> {
  return ApiService.get<undefined, AreaListResponse>(HUMAN_RESOURCE_REPORT_API.regions)
}
