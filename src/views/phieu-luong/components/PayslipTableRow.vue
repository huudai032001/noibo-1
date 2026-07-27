<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import {
  CategoryThueTncn,
  DETAIL_CATEGORIES_WITH_DIALOG,
  GiaTriTraiPhieuTichLuy,
  HEAD_OFFICE_TAX_PAYSLIP_TYPES,
  ThuongTraiPhieuTichLuy,
  TAX_INSTRUCTION_LINK_MANAGE,
  TAX_INSTRUCTION_LINK_SALE,
  type PayslipCategory,
  type PayslipTypeValue,
} from '../constants/payslip-config'
import type { PayslipDetailItem } from '../models/phieu-luong.model'
import LinkInstruct from './details/LinkInstruct.vue'
import TraiPhieuDetailLink from './TraiPhieuDetailLink.vue'

const props = defineProps<{
  title?: string
  value: string | number
  details: PayslipDetailItem[]
  category: PayslipCategory | null
  payslipType: PayslipTypeValue | ''
  tooltip?: string
  note?: string
  titleClassName?: string
  className?: string
  rowKey?: string
  linkManage?: boolean
  periodLabel?: string
  hideTitle?: boolean
  rowSpan?: number
  spaceBeforeRow?: boolean
  rowIndex?: number
  variant?: 'mobile' | 'desktop'
  sectionId?: string
}>()

const emit = defineEmits<{
  openDetail: []
}>()

const viewMode = computed(() => props.variant ?? 'desktop')

const isSectionHeader = computed(() => {
  if (props.spaceBeforeRow) return false
  return props.rowKey === 'none'
})

const isTotalRow = computed(() => props.className === 'total-get')

const isCurrencyValue = computed(() => {
  const text = String(props.value)
  return text.includes('đ') || text.includes('₫')
})

const showDetailButton = computed(() => {
  if (!props.details?.length || !props.category) return false
  return DETAIL_CATEGORIES_WITH_DIALOG.includes(props.category)
})

const showTaxInstruction = computed(() => {
  if (!props.category || props.category !== CategoryThueTncn) return false
  if (!props.payslipType) return false
  return HEAD_OFFICE_TAX_PAYSLIP_TYPES.includes(props.payslipType)
})

const showBondLink = computed(() => {
  if (!props.category) return false
  return [ThuongTraiPhieuTichLuy, GiaTriTraiPhieuTichLuy].includes(props.category)
})

const taxLink = computed(() => (props.linkManage ? TAX_INSTRUCTION_LINK_MANAGE : TAX_INSTRUCTION_LINK_SALE))

const hasDetailColumn = computed(
  () =>
  Boolean(
    props.periodLabel ||
      props.note ||
      showDetailButton.value ||
      showTaxInstruction.value ||
      showBondLink.value,
  ),
)
</script>

<template>
  <template v-if="viewMode === 'mobile'">
    <div v-if="spaceBeforeRow" class="payslip-row-spacer"></div>

    <div v-else-if="isSectionHeader" :data-section-id="sectionId" class="payslip-section payslip-section--mobile">
      {{ title }}
    </div>

    <div
      v-else
      class="payslip-row payslip-row--mobile"
      :class="{ 'payslip-row--total': isTotalRow }"
    >
      <div class="payslip-row__main">
        <p class="payslip-row__label" :class="{ 'payslip-row__label--total': isTotalRow }">
          <span v-if="!hideTitle">{{ title }}</span>
          <i v-if="tooltip" class="pi pi-info-circle payslip-row__tooltip" :title="tooltip"></i>
        </p>
        <p class="payslip-row__value" :class="{ 'payslip-row__value--total': isTotalRow, 'is-currency': isCurrencyValue }">
          {{ value }}
        </p>
      </div>

      <div v-if="hasDetailColumn" class="payslip-row__extra">
        <span v-if="periodLabel" class="payslip-row__badge">
          <i class="pi pi-calendar"></i>
          {{ periodLabel }}
        </span>
        <p v-if="note" class="payslip-row__note">{{ note }}</p>
        <Button
          v-if="showDetailButton"
          type="button"
          label="Xem chi tiết"
          icon="pi pi-external-link"
          size="small"
          text
          class="payslip-row__link"
          @click="emit('openDetail')"
        />
        <LinkInstruct v-if="showTaxInstruction" :link-manage="linkManage" :link="taxLink" />
        <TraiPhieuDetailLink v-if="showBondLink" />
      </div>
    </div>
  </template>

  <template v-else>
    <tr v-if="spaceBeforeRow">
      <td colspan="3" class="payslip-row-spacer"></td>
    </tr>

    <tr v-else-if="isSectionHeader" :data-section-id="sectionId" class="payslip-section-row">
      <td colspan="3" class="payslip-section">
        {{ title }}
      </td>
    </tr>

    <tr v-else class="payslip-row" :class="{ 'payslip-row--total': isTotalRow }">
      <td
        v-if="!hideTitle"
        :rowspan="rowSpan"
        class="payslip-row__label-cell"
        :class="{ 'payslip-row__label-cell--total': isTotalRow }"
        :title="tooltip"
      >
        <span :class="titleClassName">{{ title }}</span>
        <i v-if="tooltip" class="pi pi-info-circle payslip-row__tooltip"></i>
      </td>
      <td class="payslip-row__value-cell" :class="{ 'payslip-row__value-cell--total': isTotalRow, 'is-currency': isCurrencyValue }">
        {{ value }}
      </td>
      <td class="payslip-row__detail-cell">
        <span v-if="periodLabel" class="payslip-row__badge">
          <i class="pi pi-calendar"></i>
          {{ periodLabel }}
        </span>
        <p v-if="note" class="payslip-row__note">{{ note }}</p>
        <Button
          v-if="showDetailButton"
          type="button"
          label="Xem chi tiết"
          icon="pi pi-external-link"
          size="small"
          text
          class="payslip-row__link"
          @click="emit('openDetail')"
        />
        <LinkInstruct v-if="showTaxInstruction" :link-manage="linkManage" :link="taxLink" />
        <TraiPhieuDetailLink v-if="showBondLink" />
      </td>
    </tr>
  </template>
</template>

<style scoped>
.payslip-row-spacer {
  height: 0.75rem;
}

.payslip-section-row:first-child .payslip-section {
  border-top: none;
}

.payslip-section {
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--pl-border);
  background: var(--pl-section-bg);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pl-text);
  scroll-margin-top: 0.75rem;
}

.payslip-section--mobile {
  margin-top: 0.5rem;
  border: 1px solid var(--pl-border);
  border-radius: 8px;
  background: var(--pl-section-bg);
}

.payslip-row {
  border-top: 1px solid #f1f5f9;
  transition: background 0.12s;
}

.payslip-row:hover {
  background: #fafbfc;
}

.payslip-row--total {
  background: var(--pl-accent-soft);
}

.payslip-row--total:hover {
  background: color-mix(in srgb, var(--pl-accent) 10%, white);
}

.payslip-row--mobile {
  padding: 0.875rem 1rem;
  border: 1px solid var(--pl-border);
  border-radius: 8px;
  background: #fff;
}

.payslip-row--mobile.payslip-row--total {
  border-color: color-mix(in srgb, var(--pl-accent) 25%, var(--pl-border));
}

.payslip-row__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.payslip-row__label,
.payslip-row__label-cell {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--pl-muted);
}

.payslip-row__label-cell {
  padding: 0.875rem 1.25rem;
  vertical-align: top;
}

.payslip-row__label--total,
.payslip-row__label-cell--total {
  font-weight: 600;
  color: var(--pl-text);
}

.payslip-row__value,
.payslip-row__value-cell {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pl-text);
  white-space: nowrap;
}

.payslip-row__value-cell {
  padding: 0.875rem 1.25rem;
  text-align: right;
  vertical-align: top;
}

.payslip-row__value.is-currency,
.payslip-row__value-cell.is-currency {
  font-variant-numeric: tabular-nums;
}

.payslip-row__value--total,
.payslip-row__value-cell--total {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--pl-accent);
}

.payslip-row__detail-cell {
  padding: 0.875rem 1.25rem;
  vertical-align: top;
  font-size: 0.8125rem;
  color: var(--pl-muted);
}

.payslip-row__extra {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.payslip-row__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 0.6875rem;
  color: var(--pl-muted);
}

.payslip-row__badge .pi {
  font-size: 0.625rem;
}

.payslip-row__note {
  margin: 0;
  padding: 0.5rem 0.625rem;
  border-radius: 6px;
  background: #f8fafc;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--pl-muted);
  white-space: pre-line;
}

.payslip-row__tooltip {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--pl-accent) 70%, white);
  cursor: help;
}

.payslip-row__link {
  padding: 0 !important;
  height: auto !important;
}
</style>
