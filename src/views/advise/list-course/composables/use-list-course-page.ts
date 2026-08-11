import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { CourseProgram, CandidateInfo } from '../models/list-course.model'
import {
  fetchCourseList,
  fetchCandidateInfo,
  openQuantumLeap,
} from '../services/list-course.service'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const e = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return e.data?.message || e.response?.data?.message || e.message || fallback
}

export function useListCoursePage() {
  const toast = useToast()

  const coursesStudying = ref<CourseProgram[]>([])
  const coursesPassed = ref<CourseProgram[]>([])
  const candidate = ref<CandidateInfo | null>(null)
  const loading = ref(false)
  const loadingQuantumLeap = ref(false)

  const hasCoursesStudying = computed(() => coursesStudying.value.length > 0)
  const hasCoursesPassed = computed(() => coursesPassed.value.length > 0)
  const hasAnyCourse = computed(() => hasCoursesStudying.value || hasCoursesPassed.value)

  function showError(detail: string): void {
    toast.add({ severity: 'error', summary: 'Lỗi', detail, life: 5000 })
  }

  async function fetchCourses(): Promise<void> {
    loading.value = true
    try {
      // Fetch studying courses
      const studyingRes = await fetchCourseList({ status: 0 })
      const studyingPrograms = (studyingRes?.data?.data || []).filter((d) => !d.isCompleted)
      coursesStudying.value = studyingPrograms

      // Fetch passed courses
      const passedRes = await fetchCourseList({ status: 1 })
      const passedPrograms = (passedRes?.data?.data || []).filter((d) => d.isCompleted)
      coursesPassed.value = passedPrograms

      // Fetch candidate info
      try {
        const candidateRes = await fetchCandidateInfo()
        if (candidateRes?.data) {
          candidate.value = candidateRes.data
        }
      } catch {
        // Candidate info is optional
      }
    } catch (error) {
      showError(getApiErrorMessage(error, 'Lỗi khi tải danh sách khóa học'))
    } finally {
      loading.value = false
    }
  }

  async function handleOpenQuantumLeap(courseId: number): Promise<void> {
    loadingQuantumLeap.value = true
    try {
      const response = await openQuantumLeap(courseId, '')
      if (response?.data) {
        window.open(response.data, '_blank')
      }
    } catch (error) {
      showError(getApiErrorMessage(error, 'Lỗi khi mở khóa học'))
    } finally {
      loadingQuantumLeap.value = false
    }
  }

  return {
    coursesStudying,
    coursesPassed,
    candidate,
    loading,
    loadingQuantumLeap,
    hasCoursesStudying,
    hasCoursesPassed,
    hasAnyCourse,
    fetchCourses,
    handleOpenQuantumLeap,
  }
}
