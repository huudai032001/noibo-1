import ApiService from '@/services/api-service'
import { JOB_KPI_STAFF_API } from '../constants'
import type {
  JobKpiStaffListQuery,
  JobKpiStaffListResponse,
  JobKpiUpdateResultPayload,
} from '../models/job-kpi-staff.model'

export async function fetchKraAndMeetingByUser(
  params: JobKpiStaffListQuery,
): Promise<JobKpiStaffListResponse> {
  return ApiService.get<JobKpiStaffListQuery, JobKpiStaffListResponse>(
    JOB_KPI_STAFF_API.kraAndMeetingByUser,
    params,
  )
}

export async function updatePersonalKraResult(
  payload: JobKpiUpdateResultPayload,
): Promise<unknown> {
  return ApiService.put<JobKpiUpdateResultPayload, unknown>(
    JOB_KPI_STAFF_API.updatePersonalResult,
    payload,
  )
}
