export interface QuantumLeapRedirectResponse {
  redirect_url?: string
  message?: string
}

export interface QuantumLeapInfoItem {
  id?: string
  title?: string
  description?: string
  icon?: string
  image_url?: string
  order?: number
}

export interface QuantumLeapInfoResponse {
  data?: QuantumLeapInfoItem[]
  message?: string
}
