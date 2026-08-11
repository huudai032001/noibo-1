export interface Area {
  id: number
  name: string
}

export interface Branch {
  id: number
  name: string
  nameAlias?: string
}

export interface SalaryMechanism {
  id: number
  name: string
}

export interface HumanResourceReportRequest {
  branchId?: number
  salaryMechanismId?: number
  year?: string | number
}

export interface TotalLevelItem {
  [key: string]: number
}

export interface Pluralities {
  slx?: number
  tvv?: number
  tpOnline?: number
  tptt?: number
}

export interface HumanResourceReportResponse {
  total?: number
  total_accounts?: Record<string, any>
  totalAccounts?: Record<string, any>
  total_level?: Record<string, number>
  totalLevel?: Record<string, number>
  dataStart?: number[]
  dataOff?: number[]
  dataTotal?: number[]
  dataTototal?: number[]
  data_percent?: number[]
  dataPercent?: number[]
  pluralities?: Pluralities
}

export interface ChartDataSeries {
  type: string
  values: number[]
  backgroundColor?: string
  text: string
  lineColor?: string
  marker?: {
    backgroundColor: string
  }
  scales?: string
}

export interface ChartConfig {
  type: string
  title: {
    fontSize: number
    adjustLayout: boolean
    flat: boolean
  }
  gui: {
    contextMenu: {
      empty: boolean
    }
  }
  globals: {
    fontFamily: string
  }
  plot: {
    tooltip: {
      text: string
      padding: string
      borderRadius: string
      sticky: boolean
      timeout: number
    }
    animation: {
      effect: string
      method: string
      sequence: string
      speed: number
    }
  }
  legend: Record<string, any>
  scalableYaxis: Record<string, any>
  scaleX: Record<string, any>
  scaleY: Record<string, any>
  scaleY2?: Record<string, any>
  plotarea: Record<string, any>
  series: ChartDataSeries[]
}

export interface StaffCountsByPosition {
  [key: string]: number | Record<string, number>
}
