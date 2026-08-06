export const LEVEL_EMPLOYEE_API = {
  list: 'teamlead/criteria-standard',
  create: 'teamlead/criteria-standard',
  update: 'teamlead/criteria-standard',
} as const

export const LEVEL_EMPLOYEE_DEFAULT_PAGE = 1
export const LEVEL_EMPLOYEE_DEFAULT_PAGE_SIZE = 20

export const LEVEL_EMPLOYEE_CRITERIA_TYPE_MAP = {
  1: 'Tháng',
  2: 'Quý',
} as const

export const LEVEL_EMPLOYEE_CRITERIA_TYPE_COLOR = {
  1: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  2: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
} as const
