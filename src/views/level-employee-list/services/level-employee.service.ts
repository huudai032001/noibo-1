import ApiService from '@/services/api-service'
import { LEVEL_EMPLOYEE_API } from '../constants'
import type {
  LevelEmployeeListQuery,
  LevelEmployeeListResponseApi,
  LevelEmployeeCreatePayload,
  LevelEmployeeEditCriteriaPayload,
} from '../models/level-employee.model'

export async function fetchLevelEmployeeList(
  params: LevelEmployeeListQuery,
): Promise<LevelEmployeeListResponseApi> {
  return ApiService.get<LevelEmployeeListQuery, LevelEmployeeListResponseApi>(
    LEVEL_EMPLOYEE_API.list,
    params,
  )
}

export async function createLevelEmployeeCriteria(
  payload: LevelEmployeeCreatePayload,
): Promise<any> {
  return ApiService.post(LEVEL_EMPLOYEE_API.create, payload)
}

export async function updateLevelEmployeeCriteria(
  payload: LevelEmployeeEditCriteriaPayload,
): Promise<any> {
  const { id, ...data } = payload
  return ApiService.post(`${LEVEL_EMPLOYEE_API.update}/${id}`, data)
}
