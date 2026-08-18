export const HUMAN_RESOURCE_REPORT_API = {
  report: '/report/human-resource',
  branches: '/branch',
  branch_list: '/branch/list',
  regions: '/region',
} as const

export const ACCOUNT_TYPES = {
  SALE_INTERN: 4,
  SALE_MEMBER: 3,
  SALE_LEADER: 1,
  GDVP: 'GDVP',
  QLHV: 'QLHV',
  HANH_CHINH_KHU_VUC: 18,
  GDKV: 6,
} as const

export const SALARY_MECHANISMS = [
  { id: 1, name: 'Lương cứng' },
  { id: 2, name: 'Lương mềm' },
  { id: 3, name: 'Lương cứng theo bậc' },
  { id: 4, name: 'Lương cứng cố định' },
  { id: 5, name: 'Lương cứng partime' },
] as const

export const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

export const POSITION_GROUPS = {
  SALES_INTERN: 'Sales Intern',
  SALES: 'Sales',
  SALES_LEADER: 'Sales Leader',
  DIRECTOR: 'Giám đốc văn phòng',
} as const

export const POSITION_RANKS = ['Intern', 'Rookie', 'Junior', 'Executive', 'Pro', 'Master']
