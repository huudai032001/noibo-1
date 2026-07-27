export const PayslipType = {
  gdkv: 'gdkv',
  gdvp: 'gdvp',
  headOffice: 'head_office',
  qlhv: 'qlhv',
  hckv: 'hckv',
  saleExpert: 'sale_expert',
  saleIntern: 'sale_intern',
  saleLeader: 'sale_leader',
  saleLeaderProvince: 'sale_leader_province',
  saleLeaderCenter: 'sale_leader_center',
  saleMember: 'sale_member',
  saleLuongCungV3: 'sale_luong_cung_v3',
  saleLuongMemV3: 'sale_luong_mem_v3',
} as const

export type PayslipTypeValue = (typeof PayslipType)[keyof typeof PayslipType]

export const headOfficeType = {
  logAccountType: new Set(['bod', 'teamleader', 'nhân viên', 'v2_vp_tong']),
  userAccountType: new Set(['bod', 'teamleader', 'nhân viên', 'nhan-vien']),
}

export const gdvpType = {
  logAccountType: new Set(['giám đốc văn phòng', 'v2_gdvp']),
  userAccountType: new Set(['gdvp', 'gdvp tt', 'gđvp']),
}

export const gdkvType = {
  logAccountType: new Set(['gdkv', 'gdkv tt', 'gđkv', 'gđkv tt', 'v2_gdkv']),
  userAccountType: new Set(['gdkv', 'gdkv tt', 'gđkv', 'gđkv tt']),
}

export const qlhvType = {
  logAccountType: new Set(['qlhv', 'center_assign', 'Quản Lý Học Viên', 'quản lý học viên']),
  userAccountType: new Set(['qlhv', 'center_assign', 'quan-ly-hoc-vien', 'quan-ly-hoc-vien']),
}

export const hckvType = {
  logAccountType: new Set(['hckv']),
  userAccountType: new Set(['hckv']),
}

export const saleInternType = {
  logAccountType: new Set(['sales intern', 'sale intern', 'sales thử việc']),
  userAccountType: new Set(['sales-intern', 'sales intern', 'quan-ly-hoc-vien']),
}

export const saleMemberType = {
  logAccountType: new Set(['sale member', 'sales']),
  userAccountType: new Set(['sale-member', 'sale member', 'sales']),
}

export const saleExpertType = {
  logAccountType: new Set(['sale expert', 'sales-expert', 'sales expert']),
  userAccountType: new Set(['sale-expert', 'sales-expert']),
}

export const saleLeaderType = {
  logAccountType: new Set(['sales leader', 'sale-leader']),
  userAccountType: new Set(['sale', 'sales-leader', 'sale-leader']),
}

export const saleLeaderCenterType = {
  logAccountType: new Set(['v2_sl_trung_tam']),
  userAccountType: new Set(['sale', 'sales-leader', 'sale-leader']),
}

export const saleLeaderProvinceType = {
  logAccountType: new Set(['v2_sl_tinh']),
  userAccountType: new Set(['sale', 'sales-leader', 'sale-leader']),
}

export const saleLuongCungType = {
  logAccountType: new Set(['v2_sale_luong_cung']),
  userAccountType: new Set(['sale', 'sales-leader', 'sale-leader']),
}

export const saleLuongMemType = {
  logAccountType: new Set(['v2_sale_luong_mem']),
  userAccountType: new Set(['sale', 'sales-leader', 'sale-leader']),
}

export const DetailGdkv = 'gdkv_chi_tiet'
export const DetailGdvp = 'gdvp_chi_tiet'
export const DetailTinh = 'tinh_chi_tiet'
export const DetailTrungTam = 'trung_tam_chi_tiet'

export const CategoryThuNhapRsm = 'thu_nhap_rsm'
export const CategoryDoanhSoDoiVp = 'doanh_so_doi_van_phong'
export const CategoryDoanhSoDoi = 'doanh_so_doi'
export const CategoryTongDoanhSo = 'tong_doanh_so'
export const CategoryDoanhSoKey = 'doanh_so_key'
export const ThuongTraiPhieuTichLuy = 'thuong_trai_phieu_tich_luy'
export const GiaTriTraiPhieuTichLuy = 'gia_tri_trai_phieu_tich_luy'
export const CategoryPhat = 'phat'
export const CategoryPhuCapMienThue = 'phu_cap_mien_thue'
export const CategoryPhuCapKhac = 'phu_cap_khac'
export const CategoryTruKhac = 'tru_khac'
export const CategoryThueTncn = 'thue_tncn'
export const CategoryTangCa = 'tang_ca'
export const CategoryThuong = 'thuong'
export const CategoryTamUng = 'tam_ung'

export type PayslipCategory =
  | typeof CategoryThuNhapRsm
  | typeof CategoryDoanhSoDoiVp
  | typeof CategoryDoanhSoDoi
  | typeof CategoryTongDoanhSo
  | typeof CategoryDoanhSoKey
  | typeof ThuongTraiPhieuTichLuy
  | typeof GiaTriTraiPhieuTichLuy
  | typeof CategoryPhat
  | typeof CategoryPhuCapMienThue
  | typeof CategoryPhuCapKhac
  | typeof CategoryTruKhac
  | typeof CategoryThueTncn
  | typeof CategoryTangCa
  | typeof CategoryThuong
  | typeof CategoryTamUng

export const ConvertCategoryToKey: Partial<Record<PayslipCategory, string>> = {
  [CategoryThuNhapRsm]: 'Thu nhập RSM',
  [CategoryPhat]: 'Phạt',
  [CategoryTruKhac]: 'Trừ khác',
  [CategoryPhuCapMienThue]: 'Phụ cấp miễn thuế',
  [CategoryPhuCapKhac]: 'Phụ cấp khác',
  [CategoryThueTncn]: 'Xem chi tiết hướng dẫn tính thuế',
}

export const NameStatusBond: { [status: number]: string } = {
  0: 'Đang tích lũy',
  1: 'Có hiệu lực',
  2: 'Được chuyển nhượng/ bán',
  3: 'Đã chuyển nhượng/ bán',
}

export const TAX_INSTRUCTION_LINK_MANAGE =
  'https://docs.google.com/spreadsheets/d/1daS3r2QqaXSViPGAIPP0_JMVH4JKIY6RmZTKJH01__Y/edit?gid=0#gid=0'

export const TAX_INSTRUCTION_LINK_SALE =
  'https://docs.google.com/spreadsheets/d/1W9AEmiROXlo9VO_-TfsC1Y4ySGNsTQla9T7O8730IKA/edit?gid=0#gid=0'

export const TAX_DETAIL_LINK =
  'https://docs.google.com/spreadsheets/d/1aUCnmLkZ6akdeEqAAW98UUB1ew_e4TAzTeIo96WXZfI/edit?gid=0#gid=0'

export const DETAIL_CATEGORIES_WITH_DIALOG: PayslipCategory[] = [
  CategoryThuNhapRsm,
  CategoryPhat,
  CategoryPhuCapMienThue,
  CategoryPhuCapKhac,
  CategoryTangCa,
  CategoryTruKhac,
  CategoryThuong,
  CategoryTamUng,
]

export const HEAD_OFFICE_TAX_PAYSLIP_TYPES: PayslipTypeValue[] = [
  PayslipType.headOffice,
  PayslipType.saleLeaderProvince,
  PayslipType.saleLeaderCenter,
  PayslipType.saleLuongCungV3,
  PayslipType.saleLuongMemV3,
  PayslipType.gdkv,
  PayslipType.gdvp,
]
