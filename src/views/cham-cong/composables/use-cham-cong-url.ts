import { type Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
}

function parseMonthYear(month: unknown, year: unknown): Date | null {
  const monthValue = Number(month)
  const yearValue = Number(year)

  if (!Number.isInteger(monthValue) || !Number.isInteger(yearValue)) {
    return null
  }

  if (monthValue < 1 || monthValue > 12 || yearValue < 2000 || yearValue > 2100) {
    return null
  }

  return new Date(yearValue, monthValue - 1, 1)
}

export function useChamCongUrl(selectedDate: Ref<Date>, onMonthFromUrl: (date: Date) => void) {
  const route = useRoute()
  const router = useRouter()

  function readDateFromQuery(): Date | null {
    return parseMonthYear(route.query.month, route.query.year)
  }

  function initDateFromUrl(): Date {
    return readDateFromQuery() ?? new Date()
  }

  function syncUrl(date: Date): void {
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    if (Number(route.query.month) === month && Number(route.query.year) === year) {
      return
    }

    void router.replace({
      query: {
        ...route.query,
        month: String(month),
        year: String(year),
      },
    })
  }

  watch(
    () => [route.query.month, route.query.year] as const,
    ([month, year]) => {
      const parsed = parseMonthYear(month, year)
      if (!parsed || isSameMonth(parsed, selectedDate.value)) {
        return
      }

      onMonthFromUrl(parsed)
    },
  )

  return {
    initDateFromUrl,
    syncUrl,
  }
}
