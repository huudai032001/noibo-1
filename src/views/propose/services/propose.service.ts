import ApiService from '@/services/api-service'
import { PROPOSE_API } from '../constants'
import type {
  ProposeApprovalListResponse,
  ProposeCreatePayload,
  ProposeDecidePayload,
  ProposeDetailFingerprint,
  ProposeDepartment,
  ProposeEmployeeListResponse,
  ProposeItem,
  ProposeListQuery,
  ProposeProfileResponse,
} from '../models/propose.model'

export async function fetchProposeListByDepartment(
  params: ProposeListQuery,
): Promise<ProposeEmployeeListResponse> {
  return ApiService.get<ProposeListQuery, ProposeEmployeeListResponse>(
    PROPOSE_API.listByDepartment,
    params,
  )
}

export async function fetchProposeApprovalList(
  params: ProposeListQuery,
): Promise<ProposeApprovalListResponse> {
  return ApiService.get<ProposeListQuery, ProposeApprovalListResponse>(
    PROPOSE_API.listBod,
    params,
  )
}

export async function createPropose(payload: ProposeCreatePayload): Promise<ProposeItem> {
  return ApiService.post<ProposeCreatePayload, ProposeItem>(PROPOSE_API.create, payload)
}

export async function deletePropose(id: number): Promise<void> {
  return ApiService.delete<void>(`${PROPOSE_API.delete}/${id}`)
}

export async function fetchProposeDetail(params: {
  id: number
  category: number
  startDate: string
}): Promise<ProposeDetailFingerprint> {
  return ApiService.get<typeof params, ProposeDetailFingerprint>(
    PROPOSE_API.showDetail,
    params,
  )
}

export async function decidePropose(payload: ProposeDecidePayload): Promise<void> {
  return ApiService.post<ProposeDecidePayload, void>(PROPOSE_API.decide, payload)
}

export async function fetchUserProfile(): Promise<ProposeProfileResponse> {
  return ApiService.get<undefined, ProposeProfileResponse>(PROPOSE_API.profile)
}

export async function fetchDepartments(): Promise<ProposeDepartment[]> {
  return ApiService.get<undefined, ProposeDepartment[]>(PROPOSE_API.departments)
}
