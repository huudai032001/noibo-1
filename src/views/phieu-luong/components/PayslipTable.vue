<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import {
  CategoryThueTncn,
  type PayslipCategory,
  type PayslipTypeValue,
} from '../constants/payslip-config'
import type { PayslipFilteredRow } from '../composables/use-phieu-luong-table-filter'
import type { PayslipSection } from '../composables/use-phieu-luong-table-filter'
import { isSectionRow } from '../utils/payslip-helpers'
import PayslipTableRow from './PayslipTableRow.vue'

const props = defineProps<{
  rows: PayslipFilteredRow[]
  sections: PayslipSection[]
  searchQuery: string
  hasSearchResults: boolean
  loading: boolean
  isInitialLoading: boolean
  isRefreshing: boolean
  hasPayslip: boolean
  payslipType: PayslipTypeValue | ''
  linkManage: boolean
  monthYearLabel: string
  emptyMessage: string
  rowCount: number
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  clearSearch: []
  openDetail: [
    payload: {
      details: PayslipFilteredRow['details']
      category: PayslipCategory | null
      title?: string
    },
  ]
}>()

const tableScrollRef = ref<HTMLElement | null>(null)
const activeSectionId = ref<string | null>(null)
const showAllSections = ref(true)
let observer: IntersectionObserver | null = null

function getRowsForSection(allRows: PayslipFilteredRow[], sectionId: string): PayslipFilteredRow[] {
  const startIndex = allRows.findIndex((row) => row.sectionId === sectionId)
  if (startIndex === -1) return allRows

  const result: PayslipFilteredRow[] = [allRows[startIndex]]
  for (let i = startIndex + 1; i < allRows.length; i++) {
    const rowKey = typeof allRows[i].row.key === 'string' ? allRows[i].row.key : undefined
    if (isSectionRow(rowKey)) break
    result.push(allRows[i])
  }
  return result
}

const displayRows = computed(() => {
  if (showAllSections.value || !activeSectionId.value) {
    return props.rows
  }
  return getRowsForSection(props.rows, activeSectionId.value)
})

const activeSectionTitle = computed(() => {
  if (!activeSectionId.value) return null
  return props.sections.find((section) => section.id === activeSectionId.value)?.title ?? null
})

function isElementVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0
}

function findVisibleSectionElement(sectionId: string): HTMLElement | null {
  const container = tableScrollRef.value
  if (!container) return null

  const nodes = container.querySelectorAll(`[data-section-id="${sectionId}"]`)
  return (
    Array.from(nodes).find(
      (node) => node instanceof HTMLElement && isElementVisible(node),
    ) ?? null
  )
}

function handleSectionClick(sectionId: string): void {
  activeSectionId.value = sectionId
  showAllSections.value = false
  tableScrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleShowAllSections(): void {
  showAllSections.value = true
  activeSectionId.value = null
  tableScrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

async function setupSectionObserver(): Promise<void> {
  observer?.disconnect()
  observer = null

  await nextTick()

  if (!tableScrollRef.value || props.sections.length === 0 || !showAllSections.value) {
    observer?.disconnect()
    observer = null
    return
  }

  const sectionElements = props.sections
    .map((section) => findVisibleSectionElement(section.id))
    .filter((element): element is HTMLElement => Boolean(element))

  if (sectionElements.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible[0]?.target instanceof HTMLElement) {
        const sectionId = visible[0].target.dataset.sectionId
        if (sectionId) activeSectionId.value = sectionId
      }
    },
    {
      root: tableScrollRef.value,
      rootMargin: '-8% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 1],
    },
  )

  sectionElements.forEach((element) => observer?.observe(element))
}

onMounted(() => {
  void setupSectionObserver()
})

watch(
  () => [props.sections, props.hasPayslip, props.rows.length, showAllSections.value] as const,
  () => {
    void setupSectionObserver()
  },
)

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section class="payslip-card payslip-details">
    <div class="payslip-details__header">
      <div>
        <h2 class="payslip-details__title">Chi tiết các khoản</h2>
        <p class="payslip-details__subtitle">{{ rowCount }} mục · Tháng {{ monthYearLabel }}</p>
      </div>

      <IconField class="payslip-details__search">
        <InputIcon class="pi pi-search" />
        <InputText
          :model-value="searchQuery"
          placeholder="Tìm danh mục, số liệu..."
          class="w-full"
          size="small"
          @update:model-value="emit('update:searchQuery', ($event as string) ?? '')"
        />
      </IconField>
    </div>

    <div v-if="loading" class="payslip-details__loading">
      <Skeleton height="2.75rem" class="!rounded-lg" />
      <Skeleton height="2.75rem" class="!rounded-lg" />
      <Skeleton height="2.75rem" class="!rounded-lg" />
      <Skeleton height="2.75rem" class="!rounded-lg" />
      <Skeleton height="2.75rem" class="!rounded-lg" />
      <Skeleton height="2.75rem" class="!rounded-lg" />
    </div>

    <template v-else-if="hasPayslip">
      <div v-if="sections.length > 0" class="payslip-details__tabs">
        <button
          type="button"
          class="payslip-details__tab"
          :class="{ 'is-active': showAllSections }"
          @click="handleShowAllSections"
        >
          Tất cả
        </button>
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="payslip-details__tab"
          :class="{ 'is-active': !showAllSections && activeSectionId === section.id }"
          @click="handleSectionClick(section.id)"
        >
          {{ section.title }}
        </button>
      </div>

      <div class="payslip-details__body">
        <aside v-if="sections.length > 0" class="payslip-details__nav">
          <p class="payslip-details__nav-label">Mục lục</p>
          <nav aria-label="Điều hướng mục phiếu lương">
            <button
              type="button"
              class="payslip-details__nav-item"
              :class="{ 'is-active': showAllSections }"
              @click="handleShowAllSections"
            >
              Tất cả các khoản
            </button>
            <button
              v-for="section in sections"
              :key="`nav-${section.id}`"
              type="button"
              class="payslip-details__nav-item"
              :class="{ 'is-active': !showAllSections && activeSectionId === section.id }"
              @click="handleSectionClick(section.id)"
            >
              {{ section.title }}
            </button>
          </nav>
        </aside>

        <div ref="tableScrollRef" class="payslip-details__content">
          <div
            v-if="!showAllSections && activeSectionTitle"
            class="payslip-details__section-banner"
          >
            {{ activeSectionTitle }}
          </div>
          <div v-if="!hasSearchResults" class="payslip-details__empty-search">
            <i class="pi pi-search payslip-details__empty-icon"></i>
            <p>Không tìm thấy kết quả phù hợp.</p>
            <Button
              type="button"
              label="Xóa bộ lọc"
              link
              size="small"
              @click="emit('clearSearch')"
            />
          </div>

          <template v-else>
            <div class="payslip-details__mobile-list">
              <PayslipTableRow
                v-for="(item, index) in displayRows"
                :key="`m-${item.row.title}-${index}`"
                variant="mobile"
                :section-id="item.sectionId"
                :title="item.row.title"
                :value="item.value"
                :details="item.details"
                :category="item.category"
                :payslip-type="payslipType"
                :tooltip="item.row.tooltip"
                :note="item.row.note"
                :title-class-name="item.row.titleClassName"
                :class-name="item.row.className"
                :row-key="typeof item.row.key === 'string' ? item.row.key : undefined"
                :link-manage="linkManage"
                :period-label="item.periodLabel"
                :hide-title="item.hideTitle"
                :row-span="item.rowSpan"
                :space-before-row="item.row.spaceBeforeRow"
                :row-index="index"
                @open-detail="
                  emit('openDetail', {
                    details: item.details,
                    category: item.category,
                    title:
                      item.category === CategoryThueTncn
                        ? 'Xem chi tiết: Thuế thu nhập cá nhân'
                        : 'Xem chi tiết',
                  })
                "
              />
            </div>

            <table class="payslip-details__table">
              <thead>
                <tr>
                  <th>Danh mục</th>
                  <th>Số liệu</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                <PayslipTableRow
                  v-for="(item, index) in displayRows"
                  :key="`d-${item.row.title}-${index}`"
                  variant="desktop"
                  :section-id="item.sectionId"
                  :title="item.row.title"
                  :value="item.value"
                  :details="item.details"
                  :category="item.category"
                  :payslip-type="payslipType"
                  :tooltip="item.row.tooltip"
                  :note="item.row.note"
                  :title-class-name="item.row.titleClassName"
                  :class-name="item.row.className"
                  :row-key="typeof item.row.key === 'string' ? item.row.key : undefined"
                  :link-manage="linkManage"
                  :period-label="item.periodLabel"
                  :hide-title="item.hideTitle"
                  :row-span="item.rowSpan"
                  :space-before-row="item.row.spaceBeforeRow"
                  :row-index="index"
                  @open-detail="
                    emit('openDetail', {
                      details: item.details,
                      category: item.category,
                      title:
                        item.category === CategoryThueTncn
                          ? 'Xem chi tiết: Thuế thu nhập cá nhân'
                          : 'Xem chi tiết',
                    })
                  "
                />
              </tbody>
            </table>
          </template>
        </div>
      </div>
    </template>

    <div v-else class="payslip-details__empty">
      <i class="pi pi-file payslip-details__empty-icon"></i>
      <h3>Chưa có phiếu lương</h3>
      <p>{{ emptyMessage }}</p>
    </div>
  </section>
</template>

<style scoped>
.payslip-details__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.payslip-details__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--pl-border);
}

@media (min-width: 768px) {
  .payslip-details__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.75rem;
  }
}

.payslip-details__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--pl-text);
}

.payslip-details__subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: var(--pl-muted);
}

.payslip-details__search {
  width: 100%;
}

@media (min-width: 768px) {
  .payslip-details__search {
    max-width: 18rem;
  }
}

.payslip-details__tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--pl-border);
  background: var(--pl-surface-muted);
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.payslip-details__tabs::-webkit-scrollbar {
  display: none;
}

@media (min-width: 1024px) {
  .payslip-details__tabs {
    display: none;
  }
}

.payslip-details__tab {
  flex-shrink: 0;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--pl-border);
  border-radius: 999px;
  background: var(--pl-raised);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--pl-muted);
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.payslip-details__tab:hover {
  border-color: color-mix(in srgb, var(--pl-accent) 30%, var(--pl-border));
  color: var(--pl-text);
}

.payslip-details__tab.is-active {
  border-color: var(--pl-accent);
  background: var(--pl-accent-soft);
  color: var(--pl-accent);
  font-weight: 600;
}

.payslip-details__body {
  display: flex;
  min-height: 20rem;
}

.payslip-details__nav {
  display: none;
  width: 15rem;
  flex-shrink: 0;
  padding: 1rem;
  border-right: 1px solid var(--pl-border);
  background: var(--pl-surface-muted);
}

@media (min-width: 1024px) {
  .payslip-details__nav {
    display: block;
  }
}

.payslip-details__nav-label {
  margin: 0 0 0.75rem;
  padding: 0 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--pl-muted);
}

.payslip-details__nav-item {
  display: block;
  width: 100%;
  margin-bottom: 0.25rem;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--pl-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.payslip-details__nav-item:hover {
  background: var(--pl-raised);
  color: var(--pl-text);
}

.payslip-details__nav-item.is-active {
  background: var(--pl-raised);
  color: var(--pl-accent);
  font-weight: 600;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.06);
}

.payslip-details__content {
  flex: 1;
  min-width: 0;
  max-height: 65vh;
  overflow: auto;
}

.payslip-details__section-banner {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--pl-border);
  background: var(--pl-section-bg);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pl-text);
}

.payslip-details__mobile-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .payslip-details__mobile-list {
    display: none;
  }
}

.payslip-details__table {
  display: none;
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .payslip-details__table {
    display: table;
  }
}

.payslip-details__table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--pl-surface);
  box-shadow: 0 1px 0 var(--pl-border);
}

.payslip-details__table th {
  padding: 0.875rem 1.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: left;
  color: var(--pl-muted);
}

.payslip-details__table th:nth-child(2) {
  width: 11rem;
  text-align: right;
}

.payslip-details__table th:nth-child(3) {
  width: 28%;
}

.payslip-details__empty,
.payslip-details__empty-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.payslip-details__empty h3 {
  margin: 0.75rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--pl-text);
}

.payslip-details__empty p,
.payslip-details__empty-search p {
  margin: 0.5rem 0 0;
  max-width: 22rem;
  font-size: 0.875rem;
  color: var(--pl-muted);
}

.payslip-details__empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: var(--pl-hover);
  font-size: 1.25rem;
  color: var(--pl-muted);
}
</style>
