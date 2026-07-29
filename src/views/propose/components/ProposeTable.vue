<script setup lang="ts">
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import { useFormatter } from '@/composables/use-formatter'
import type { ProposeItem } from '../models/propose.model'
import { canDeletePropose, truncateText } from '../utils/propose-helpers'
import ProposeCategoryBadge from './ProposeCategoryBadge.vue'
import ProposeEmptyState from './ProposeEmptyState.vue'
import ProposeStatusBadge from './ProposeStatusBadge.vue'
import ProposeTableSkeleton from './ProposeTableSkeleton.vue'

defineProps<{
  items: ProposeItem[]
  loading: boolean
  total: number
  showCreateEmpty?: boolean
}>()

const emit = defineEmits<{
  view: [item: ProposeItem]
  delete: [item: ProposeItem]
  create: []
  'clear-filters': []
}>()

const { formatDate } = useFormatter()
</script>

<template>
  <div class="col-span-12">
    <div class="box overflow-hidden">
      <div
        class="flex flex-col items-start justify-between gap-2 border-b border-slate-200/60 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
      >
        <div>
          <h2 class="text-base font-semibold text-slate-800">Danh sách đề xuất</h2>
          <p class="mt-0.5 text-xs text-slate-500">Bấm vào dòng để xem chi tiết nhanh</p>
        </div>
        <p class="text-sm text-slate-500">
          Tổng:
          <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
          bản ghi
        </p>
      </div>

      <ProgressBar v-if="loading" mode="indeterminate" class="!h-[3px]" />

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600">
              <th class="whitespace-nowrap px-4 py-3 font-medium">Danh mục</th>
              <th class="whitespace-nowrap px-4 py-3 font-medium">Lý do</th>
              <th class="whitespace-nowrap px-4 py-3 font-medium">Trạng thái</th>
              <th class="whitespace-nowrap px-4 py-3 font-medium">Thời gian tạo</th>
              <th class="whitespace-nowrap px-4 py-3 font-medium text-center">Thao tác</th>
            </tr>
          </thead>

          <ProposeTableSkeleton v-if="loading" :columns="5" />

          <tbody v-else-if="items.length > 0">
            <tr
              v-for="item in items"
              :key="item.id"
              class="group cursor-pointer border-b border-slate-100 transition hover:bg-[rgba(var(--app-primary-rgb),0.03)]"
              @click="emit('view', item)"
            >
              <td class="px-4 py-3.5">
                <ProposeCategoryBadge :category="item.category" />
              </td>
              <td class="max-w-xs px-4 py-3.5">
                <p class="font-medium text-slate-800">{{ truncateText(item.reason, 48) }}</p>
                <p v-if="item.startDate" class="mt-0.5 text-xs text-slate-500">
                  Ngày áp dụng: {{ formatDate(item.startDate, 'date') }}
                </p>
              </td>
              <td class="px-4 py-3.5">
                <ProposeStatusBadge :status="item.status" />
              </td>
              <td class="whitespace-nowrap px-4 py-3.5 text-slate-600">
                {{ formatDate(item.createdAt, 'datetime') }}
              </td>
              <td class="px-4 py-3.5" @click.stop>
                <div class="flex items-center justify-center gap-1 opacity-90 transition group-hover:opacity-100">
                  <Button
                    type="button"
                    icon="pi pi-eye"
                    severity="secondary"
                    outlined
                    rounded
                    size="small"
                    title="Xem chi tiết"
                    @click="emit('view', item)"
                  />
                  <Button
                    v-if="canDeletePropose(item.status)"
                    type="button"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    rounded
                    size="small"
                    title="Xoá yêu cầu"
                    @click="emit('delete', item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <ProposeEmptyState
          v-if="!loading && items.length === 0"
          :show-create="showCreateEmpty"
          @create="emit('create')"
          @clear-filters="emit('clear-filters')"
        />
      </div>
    </div>
  </div>
</template>
