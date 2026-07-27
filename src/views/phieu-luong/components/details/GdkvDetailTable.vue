<script setup lang="ts">
import { useFormatter } from '@/composables/use-formatter'
import type { PayslipDetailItem } from '../../models/phieu-luong.model'

defineProps<{
  details: PayslipDetailItem[]
}>()

const { formatCurrency, formatPercent } = useFormatter()

function formatPrice(value: string | number | undefined): string {
  if (typeof value === 'string' && value.includes('đ')) return value
  return formatCurrency(value)
}

function formatPercentValue(value: string | number | undefined): string {
  if (typeof value === 'string' && value.includes('%')) return value
  return formatPercent(value)
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[960px] text-sm">
      <thead>
        <tr class="bg-slate-100 text-left">
          <th class="px-3 py-2 font-medium">Khu vực</th>
          <th class="px-3 py-2 font-medium">Bậc</th>
          <th class="px-3 py-2 font-medium">Chỉ tiêu Doanh số</th>
          <th class="px-3 py-2 font-medium">Doanh số khu vực</th>
          <th class="px-3 py-2 font-medium">KPI Doanh số</th>
          <th class="px-3 py-2 font-medium">Lợi nhuận kinh doanh</th>
          <th class="px-3 py-2 font-medium">50% lợi nhuận chia trong tháng</th>
          <th class="px-3 py-2 font-medium">% Thưởng KPI</th>
          <th class="px-3 py-2 font-medium">Thưởng KPI</th>
          <th class="px-3 py-2 font-medium">% Cổ phần</th>
          <th class="px-3 py-2 font-medium">Thu nhập cổ tức theo tháng</th>
          <th class="px-3 py-2 font-medium">Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in details" :key="index" class="border-t border-slate-100">
          <td class="px-3 py-2">{{ item.khuVuc }}</td>
          <td class="px-3 py-2">{{ item.bac }}</td>
          <td class="px-3 py-2">{{ formatPrice(item.chiTieuDoanhSo) }}</td>
          <td class="px-3 py-2">{{ formatPrice(item.doanhSoKhuVuc) }}</td>
          <td class="px-3 py-2">{{ formatPercentValue(item.kpiDoanhSo) }}</td>
          <td class="px-3 py-2">{{ formatPrice(item.loiNhuanKinhDoanh) }}</td>
          <td class="px-3 py-2">{{ formatPrice(item.loiNhuanChiaTrongThang) }}</td>
          <td class="px-3 py-2">{{ formatPercentValue(item.thuongKpi) }}</td>
          <td class="px-3 py-2">{{ formatPrice(item.thuongKpi) }}</td>
          <td class="px-3 py-2">{{ formatPercentValue(item.phanTramCoPhan) }}</td>
          <td class="px-3 py-2">{{ formatPrice(item.thuNhapCoTucTheoThang) }}</td>
          <td class="px-3 py-2 whitespace-pre-line">{{ item.ghiChu }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
