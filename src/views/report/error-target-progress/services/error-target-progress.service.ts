import ApiService from '@/services/api-service'
import { ERROR_TARGET_PROGRESS_API } from '../constants'
import type {
  Area,
  Branch,
  ErrorTargetProgressFilters,
  ErrorTargetProgressListResponse,
  ErrorCardListResponse,
  ChildUser,
} from '../models/error-target-progress.model'

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

export interface ChildUsersResponse {
  data?: ChildUser[]
}

export async function fetchErrorTargetProgressList(
  params: ErrorTargetProgressFilters & { page?: number },
): Promise<ErrorTargetProgressListResponse> {
  // Filter out undefined values
  const cleanParams = Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>,
  )

  console.log('Fetching error target progress list with params:', cleanParams)

  // ApiService automatically converts camelCase to snake_case
  // Returns individual error records with pagination
  return ApiService.get<Record<string, any>, ErrorTargetProgressListResponse>(
    ERROR_TARGET_PROGRESS_API.list,
    cleanParams,
  )
}

export async function fetchErrorSummary(
  params: ErrorTargetProgressFilters,
): Promise<{ data: any[] }> {
  // Filter out undefined values
  const cleanParams = Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, any>,
  )

  console.log('Fetching error summary with params:', cleanParams)

  // ApiService automatically converts camelCase to snake_case
  // Returns summary statistics (title, type, totalError, etc.)
  return ApiService.get<Record<string, any>, { data: any[] }>(
    ERROR_TARGET_PROGRESS_API.total,
    cleanParams,
  )
}

export async function fetchBranches(params?: { areaId?: number }): Promise<BranchListResponse> {
  // ApiService automatically converts camelCase to snake_case (areaId -> area_id)
  return ApiService.get<{ areaId?: number } | undefined, BranchListResponse>(
    ERROR_TARGET_PROGRESS_API.branch_list,
    params,
  )
}

export async function fetchAreas(): Promise<AreaListResponse> {
  return ApiService.get<undefined, AreaListResponse>(ERROR_TARGET_PROGRESS_API.regions)
}

export async function fetchChildUsers(branchId?: number): Promise<ChildUsersResponse> {
  const params = branchId ? { branchId } : undefined
  // ApiService automatically converts camelCase to snake_case (branchId -> branch_id)
  return ApiService.get<{ branchId?: number } | undefined, ChildUsersResponse>(
    ERROR_TARGET_PROGRESS_API.child_users,
    params,
  )
}

export function getExportUrl(params: ErrorTargetProgressFilters): string {
  const baseUrl = import.meta.env.VITE_APP_API_URL || window.location.origin
  const parts: string[] = []

  // Manually convert to snake_case for export URL
  const snakeParams = convertToSnakeCase({ ...params, isExport: 1 })

  Object.entries(snakeParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => {
        parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(val ?? '')}`)
      })
    } else if (value !== null && value !== undefined) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    }
  })

  const queryString = parts.join('&')
  return `${baseUrl}${ERROR_TARGET_PROGRESS_API.export}?${queryString}`
}

function convertToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }

    // Convert camelCase to snake_case
    const snakeKey = key
      .replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`)
      .replace(/^_/, '')

    result[snakeKey] = value
  })

  return result
}
