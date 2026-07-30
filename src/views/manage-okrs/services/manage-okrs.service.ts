import ApiService from '@/services/api-service'
import { MANAGE_OKRS_API } from '../constants'
import type {
  ManageOkrsDetailResponseApi,
  ManageOkrsFilterUserQuery,
  ManageOkrsFilterUserResponseApi,
  ManageOkrsListQuery,
  ManageOkrsListResponseApi,
  ManageOkrsShareExpPayload,
  ManageOkrsUpdatePayload,
  ManageOkrsUpdateStatusPayload,
  ManageOkrsUpsertPayload,
} from '../models/manage-okrs.model'

export async function fetchManageOkrsList(
  params: ManageOkrsListQuery,
): Promise<ManageOkrsListResponseApi> {
  return ApiService.get<ManageOkrsListQuery, ManageOkrsListResponseApi>(
    MANAGE_OKRS_API.list,
    params,
  )
}

export async function fetchManageOkrDetail(id: number): Promise<ManageOkrsDetailResponseApi> {
  return ApiService.get<undefined, ManageOkrsDetailResponseApi>(`${MANAGE_OKRS_API.detail}/${id}`)
}

export async function createManageOkr(payload: ManageOkrsUpsertPayload): Promise<unknown> {
  return ApiService.post<ManageOkrsUpsertPayload, unknown>(MANAGE_OKRS_API.create, payload)
}

export async function updateManageOkr(payload: ManageOkrsUpdatePayload): Promise<unknown> {
  const { id, ...rest } = payload
  return ApiService.put<ManageOkrsUpsertPayload, unknown>(`${MANAGE_OKRS_API.detail}/${id}`, rest)
}

export async function updateManageOkrStatus(
  payload: ManageOkrsUpdateStatusPayload,
): Promise<unknown> {
  const { id, ...rest } = payload
  return ApiService.post<{ status: number }, unknown>(`${MANAGE_OKRS_API.updateStatus}/${id}`, rest)
}

export async function shareManageOkrExp(payload: ManageOkrsShareExpPayload): Promise<unknown> {
  const { id, data } = payload
  return ApiService.post<{ data: ManageOkrsShareExpPayload['data'] }, unknown>(
    `${MANAGE_OKRS_API.shareExp}/${id}`,
    { data },
  )
}

export async function filterManageOkrUsers(
  params: ManageOkrsFilterUserQuery,
): Promise<ManageOkrsFilterUserResponseApi> {
  return ApiService.get<ManageOkrsFilterUserQuery, ManageOkrsFilterUserResponseApi>(
    MANAGE_OKRS_API.usersFilter,
    params,
  )
}
