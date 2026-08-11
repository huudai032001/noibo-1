export interface Province {
  id?: number
  name?: string
}

export interface District {
  id?: number
  name?: string
}

export interface AdviseCenter {
  id?: number
  name?: string
  shortDescription?: string
  address?: string
  branchName?: string
  totalStudent?: number
  avg?: number
  combo?: boolean
  createdAt?: string
}

export interface CenterDetailInformation {
  intro?: string
  schedule?: string
  special?: string
  general?: string
  payment?: string
  promotion?: string
  feedback?: string
  teacher?: string
  priceList?: string
}

export interface CenterDetailData {
  center?: AdviseCenter
  information?: CenterDetailInformation
}

export interface CenterDetailRequestQuery {
  center_id?: number
}

export interface CenterDetailResponseApi {
  error?: boolean
  data?: CenterDetailData
}

export interface AdviseCenterListData {
  data?: AdviseCenter[]
  total?: number
  lastPage?: number
  isRemaining?: number
}

export interface AdviseListResponseApi {
  error?: boolean
  data?: AdviseCenterListData
}

export interface ProvincesResponseApi {
  error?: boolean
  data?: Province[]
}

export interface DistrictsResponseApi {
  error?: boolean
  data?: District[]
}

export interface CentersResponseApi {
  error?: boolean
  data?: AdviseCenter[]
}

export interface AdviseListRequestQuery {
  province_id?: number
  district_id?: number
  center_id?: number
  customer_id?: string
  payment?: string
  page?: number
}

export interface ProvincesRequestQuery {
  province_ids?: number[]
}

export interface DistrictsRequestQuery {
  province_id?: number
}

export interface CentersRequestQuery {
  province_id?: number
  district_id?: number
  status?: number
}
