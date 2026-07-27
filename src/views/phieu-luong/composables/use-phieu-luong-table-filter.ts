import { computed, ref, type Ref } from 'vue'
import type { PayslipTableRowView } from '../models/phieu-luong.model'
import { isSectionRow } from '../utils/payslip-helpers'

export interface PayslipSection {
  id: string
  title: string
}

export interface PayslipFilteredRow extends PayslipTableRowView {
  sectionId?: string
}

function getSectionId(item: PayslipTableRowView, index: number): string | undefined {
  const rowKey = typeof item.row.key === 'string' ? item.row.key : undefined
  if (!isSectionRow(rowKey)) return undefined
  return `payslip-section-${index}`
}

function isRowVisibleInSearch(
  index: number,
  rows: PayslipTableRowView[],
  matchedIndexes: Set<number>,
): boolean {
  if (matchedIndexes.has(index)) return true

  const currentKey = rows[index]?.row.key
  const rowKey = typeof currentKey === 'string' ? currentKey : undefined
  if (!isSectionRow(rowKey)) return false

  for (let next = index + 1; next < rows.length; next += 1) {
    const nextRowKey = rows[next].row.key
    const nextKey = typeof nextRowKey === 'string' ? nextRowKey : undefined
    if (isSectionRow(nextKey)) break
    if (rows[next].row.spaceBeforeRow) continue
    if (matchedIndexes.has(next)) return true
  }

  return false
}

export function usePhieuLuongTableFilter(tableRows: Ref<PayslipTableRowView[]>) {
  const searchQuery = ref('')

  const sections = computed<PayslipSection[]>(() => {
    return tableRows.value.reduce<PayslipSection[]>((result, item, index) => {
      const rowKey = typeof item.row.key === 'string' ? item.row.key : undefined
      if (!isSectionRow(rowKey) || !item.row.title) {
        return result
      }

      result.push({
        id: `payslip-section-${index}`,
        title: item.row.title,
      })
      return result
    }, [])
  })

  const filteredRows = computed<PayslipFilteredRow[]>(() => {
    const enriched = tableRows.value.map((item, index) => ({
      ...item,
      sectionId: getSectionId(item, index),
    }))

    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return enriched

    const matchedIndexes = new Set<number>()
    tableRows.value.forEach((item, index) => {
      if (item.row.spaceBeforeRow) return

      const rowKey = typeof item.row.key === 'string' ? item.row.key : undefined
      if (isSectionRow(rowKey)) return

      const title = item.row.title?.toLowerCase() ?? ''
      const value = String(item.value).toLowerCase()
      if (title.includes(query) || value.includes(query)) {
        matchedIndexes.add(index)
      }
    })

    return enriched.filter((_, index) =>
      isRowVisibleInSearch(index, tableRows.value, matchedIndexes),
    )
  })

  const hasSearchResults = computed(() => {
    if (!searchQuery.value.trim()) return true

    return filteredRows.value.some((item) => {
      const rowKey = typeof item.row.key === 'string' ? item.row.key : undefined
      return !isSectionRow(rowKey) && !item.row.spaceBeforeRow
    })
  })

  function scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function clearSearch(): void {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    sections,
    filteredRows,
    hasSearchResults,
    scrollToSection,
    clearSearch,
  }
}
