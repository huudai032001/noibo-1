export interface ProgressLevelDepartment {
  id?: number
  name?: string
}

export interface ProgressLevelTopTeam {
  rank?: number
  score?: number
}

export interface ProgressLevelTopCompany {
  rank?: number
  score?: number
  total_score?: number
}

export interface ProgressLevelCurrentLevel {
  level?: string
}

export interface ProgressLevelRequestedLevel {
  level?: string
  score?: number
}

export interface ProgressLevelTarget {
  level?: string
  score?: number
}

export interface ProgressLevelMinusPoint {
  point?: number
  description?: string
}

export interface ProgressLevelItemApi {
  id?: string
  userId?: number
  quarter?: number
  year?: number
  rank?: number
  department?: ProgressLevelDepartment
  expPoints?: number
  top_team?: ProgressLevelTopTeam
  topCompany?: ProgressLevelTopCompany
  kraScore?: number
  meetingPoints?: number
  total_minus_point?: number
  currentLevel?: ProgressLevelCurrentLevel
  requestedLevel?: ProgressLevelRequestedLevel
  levelTarget?: ProgressLevelTarget
  approveType?: number
  minusPoint?: ProgressLevelMinusPoint[]
  _isBanner?: boolean
  _minusLoading?: boolean
}

export interface ProgressLevelListResponseApi {
  data?: ProgressLevelItemApi[]
}

export interface ProgressLevelListQuery {
  year: number
}

export interface ProgressLevelMinusPointQuery {
  user_id: number
  year: number
  quarter: number
}

export interface ProgressLevelMinusPointResponseApi {
  data?: ProgressLevelMinusPoint[]
}
