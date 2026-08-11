export interface Course {
  id?: number
  title?: string
  description?: string
  image?: string
  status?: number
  deadline?: string
  isCompleted?: boolean
  progress?: number
}

export interface CourseProgram {
  id?: number
  title?: string
  shortDescription?: string
  isCompleted?: boolean
  courses?: Course[]
  deadline?: string
}

export interface ListCourseResponseApi {
  error?: boolean
  data?: {
    data?: CourseProgram[]
    checkPass?: boolean
  }
}

export interface ListCourseRequestQuery {
  status?: number
}

export interface CandidateInfo {
  id?: number
  deadline?: string
  status?: number
}
