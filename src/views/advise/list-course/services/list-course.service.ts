import ApiService from '@/services/api-service'
import { LIST_COURSE_API } from '../constants'
import type {
  ListCourseRequestQuery,
  ListCourseResponseApi,
  CandidateInfo,
} from '../models/list-course.model'

export async function fetchCourseList(
  params: ListCourseRequestQuery,
): Promise<ListCourseResponseApi> {
  return ApiService.get<ListCourseRequestQuery, ListCourseResponseApi>(
    LIST_COURSE_API.list,
    params,
  )
}

export async function fetchCandidateInfo(): Promise<{ data: CandidateInfo }> {
  return ApiService.get<Record<string, never>, { data: CandidateInfo }>(
    LIST_COURSE_API.candidate,
    {},
  )
}

export async function openQuantumLeap(courseId: number, token: string): Promise<{ data: string }> {
  return ApiService.post<{ id: number; token: string }, { data: string }>(
    LIST_COURSE_API.showQuantumLeap,
    { id: courseId, token },
  )
}
