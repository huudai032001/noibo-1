export interface CamNangItem {
  category?: string
  content?: string
  createdAt?: string
  updatedAt?: string
}

export interface CamNangListResponse {
  data?: CamNangItem[]
}

export interface CamNangListQuery {
  category?: string
}
