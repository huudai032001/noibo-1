import ApiService from '@/services/api-service'
import { JOB_KPI_TEAMLEAD_API } from '../constants'
import type {
  JobKpiCreateKraPayload,
  JobKpiDepartmentOption,
  JobKpiDetailQuery,
  JobKpiDetailResponse,
  JobKpiKraHistoryQuery,
  JobKpiKraHistoryResponse,
  JobKpiTeamleadListQuery,
  JobKpiTeamleadListResponse,
  JobKpiUpdateKraPayload,
  JobKpiUpdateTeamLeadPayload,
} from '../models/job-kpi-teamlead.model'
import { serializeUpdatePayload } from '../utils/job-kpi-teamlead-helpers'

export async function fetchKpiPersonalList(
  params: JobKpiTeamleadListQuery,
): Promise<JobKpiTeamleadListResponse> {
  return ApiService.get<JobKpiTeamleadListQuery, JobKpiTeamleadListResponse>(
    JOB_KPI_TEAMLEAD_API.listPersonal,
    params,
  )
}

export async function fetchKpiDetail(
  params: JobKpiDetailQuery,
): Promise<JobKpiDetailResponse> {
  return ApiService.get<JobKpiDetailQuery, JobKpiDetailResponse>(
    JOB_KPI_TEAMLEAD_API.detail,
    params,
  )
}

export async function updateKpiTeamLead(
  payload: JobKpiUpdateTeamLeadPayload,
): Promise<unknown> {
  return ApiService.put<object, unknown>(
    JOB_KPI_TEAMLEAD_API.updateTeamLead,
    serializeUpdatePayload(payload),
  )
}

export async function updateKraInfo(payload: JobKpiUpdateKraPayload): Promise<unknown> {
  return ApiService.post<JobKpiUpdateKraPayload, unknown>(
    JOB_KPI_TEAMLEAD_API.updateKra,
    payload,
  )
}

export async function createKra(payload: JobKpiCreateKraPayload): Promise<unknown> {
  return ApiService.post<JobKpiCreateKraPayload, unknown>(
    JOB_KPI_TEAMLEAD_API.createKra,
    payload,
  )
}

export async function fetchKraHistory(
  params: JobKpiKraHistoryQuery,
): Promise<JobKpiKraHistoryResponse> {
  return ApiService.get<JobKpiKraHistoryQuery, JobKpiKraHistoryResponse>(
    JOB_KPI_TEAMLEAD_API.kraHistory,
    params,
  )
}

export async function fetchDepartmentsByHead(
  userId: number,
): Promise<JobKpiDepartmentOption[]> {
  const response = await ApiService.get<{ userId: number }, JobKpiDepartmentOption[] | { data?: JobKpiDepartmentOption[] }>(
    JOB_KPI_TEAMLEAD_API.departmentsByHead,
    { userId },
  )

  if (Array.isArray(response)) return response
  if (response && typeof response === 'object' && Array.isArray(response.data)) {
    return response.data
  }
  return []
}
