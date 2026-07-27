<script setup lang="ts">
import type { PayslipDetailItem } from '../../models/phieu-luong.model'

defineProps<{
  details: PayslipDetailItem[]
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[480px] text-sm">
      <thead>
        <tr class="bg-slate-100 text-left">
          <th class="px-3 py-2 font-medium">Nội dung</th>
          <th class="px-3 py-2 font-medium">Số tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in details" :key="index" class="border-t border-slate-100">
          <td class="px-3 py-2">{{ item.noiDung }}</td>
          <td class="px-3 py-2">{{ item.soTien }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
