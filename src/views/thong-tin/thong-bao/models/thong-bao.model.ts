export interface ThongBaoItem {
  slug?: string
  category?: string
  content?: string
  startDate?: string
  endDate?: string
  updatedAt?: string
  createdAt?: string
  isSpecial?: boolean
}

export interface ThongBaoPagination {
  currentPage?: number
  perPage?: number
  total?: number
}

export interface ThongBaoListResponse {
  data?: ThongBaoItem[]
  pagination?: ThongBaoPagination
}

export interface ThongBaoDetailResponse {
  data?: ThongBaoItem
}

export interface ThongBaoListQuery {
  page?: number
  per_page?: number
  category?: string
  is_special?: string
}
