import type { PayslipRowConfig } from '../../models/phieu-luong.model'
import { PayslipType, type PayslipTypeValue } from '../payslip-config'

import { data as gdkv } from './gdkv/gdkv'
import { data as gdkvV1 } from './gdkv/gdkv-v1'
import { data as gdkvV3 } from './gdkv/gdkv-v3'

import { data as gdvp } from './gdvp/gdvp'
import { data as gdvpV1 } from './gdvp/gdvp-v1'
import { data as gdvpV3 } from './gdvp/gdvp-v3'

import { data as headOffice } from './headOffice/head-office'
import { data as headOfficeV1 } from './headOffice/head-office-v1'
import { data as headOfficeV2 } from './headOffice/head-office-v2'
import { data as headOfficeV3 } from './headOffice/head-office-v3'
import { data as headOfficeV4 } from './headOffice/head-office-v4'

import { data as qlhv } from './qlhv/qlhv'
import { data as qlhvV2 } from './qlhv/qlhv-v2'
import { data as hckvV2 } from './hckv/hckv-v2'

import { data as saleExpert } from './saleExpert/sale-expert'
import { data as saleExpertV1 } from './saleExpert/sale-expert-v1'
import { data as saleIntern } from './saleIntern/sale-intern'

import { data as saleLeader } from './saleLeader/sale-leader'
import { data as saleLeaderV1 } from './saleLeader/sale-leader-v1'
import { data as saleLeaderCenterV3 } from './saleLeader/sale-leader-center-v3'
import { data as saleLeaderProvinceV3 } from './saleLeader/sale-leader-province-v3'

import { data as saleLuongCungV3 } from './sales/sale-luong-cung'
import { data as saleLuongMemV3 } from './sales/sale-luong-mem'
import { data as saleMember } from './saleMember/sale-member'

type PayslipVersionMap = Partial<Record<PayslipTypeValue, PayslipRowConfig[]>>

const versionOld: PayslipVersionMap = {
  [PayslipType.gdkv]: gdkv,
  [PayslipType.gdvp]: gdvp,
  [PayslipType.headOffice]: headOffice,
  [PayslipType.qlhv]: qlhv,
  [PayslipType.saleExpert]: saleExpert,
  [PayslipType.saleIntern]: saleIntern,
  [PayslipType.saleLeader]: saleLeader,
  [PayslipType.saleMember]: saleMember,
}

const versionV1: PayslipVersionMap = {
  [PayslipType.gdkv]: gdkvV1,
  [PayslipType.gdvp]: gdvpV1,
  [PayslipType.headOffice]: headOfficeV1,
  [PayslipType.qlhv]: qlhv,
  [PayslipType.saleExpert]: saleExpertV1,
  [PayslipType.saleIntern]: saleIntern,
  [PayslipType.saleLeader]: saleLeaderV1,
  [PayslipType.saleMember]: saleMember,
}

const versionV2: PayslipVersionMap = {
  [PayslipType.gdkv]: gdkvV1,
  [PayslipType.gdvp]: gdvpV1,
  [PayslipType.headOffice]: headOfficeV2,
  [PayslipType.qlhv]: qlhvV2,
  [PayslipType.hckv]: hckvV2,
  [PayslipType.saleExpert]: saleExpertV1,
  [PayslipType.saleIntern]: saleIntern,
  [PayslipType.saleLeader]: saleLeaderV1,
  [PayslipType.saleMember]: saleMember,
}

const versionV3: PayslipVersionMap = {
  [PayslipType.gdkv]: gdkvV3,
  [PayslipType.gdvp]: gdvpV3,
  [PayslipType.headOffice]: headOfficeV3,
  [PayslipType.qlhv]: qlhvV2,
  [PayslipType.hckv]: hckvV2,
  [PayslipType.saleExpert]: saleExpertV1,
  [PayslipType.saleIntern]: saleIntern,
  [PayslipType.saleMember]: saleMember,
  [PayslipType.saleLeaderCenter]: saleLeaderCenterV3,
  [PayslipType.saleLeaderProvince]: saleLeaderProvinceV3,
  [PayslipType.saleLuongCungV3]: saleLuongCungV3,
  [PayslipType.saleLuongMemV3]: saleLuongMemV3,
}

const versionV4: PayslipVersionMap = {
  ...versionV3,
  [PayslipType.headOffice]: headOfficeV4,
}

export interface PayslipTimeConfig {
  from: string | null
  to: string | null
  version: PayslipVersionMap
}

export const configPaySlipTime: PayslipTimeConfig[] = [
  { from: null, to: '2022-03-31', version: versionOld },
  { from: '2022-04-01', to: '2022-07-31', version: versionV1 },
  { from: '2022-08-01', to: '2022-10-31', version: versionV2 },
  { from: '2022-11-01', to: '2025-08-31', version: versionV3 },
  { from: '2025-09-01', to: null, version: versionV4 },
]

export function getPayslipRowsForMonth(
  payslipType: PayslipTypeValue | '',
  startOfMonth: string,
): PayslipRowConfig[] {
  if (!payslipType) return []

  for (const payslip of configPaySlipTime) {
    const { from, to, version } = payslip

    if (from && to) {
      if (startOfMonth >= from && startOfMonth <= to) {
        return version[payslipType] ?? []
      }
    } else if (from) {
      if (startOfMonth >= from) {
        return version[payslipType] ?? []
      }
    } else if (to) {
      if (startOfMonth <= to) {
        return version[payslipType] ?? []
      }
    }
  }

  return []
}
