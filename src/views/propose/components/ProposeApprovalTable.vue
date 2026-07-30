<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import { useFormatter } from '@/composables/use-formatter'
import type { ProposeApprovalRoleFlags, ProposeItem } from '../models/propose.model'
import { canApprovePropose, truncateText } from '../utils/propose-helpers'
import ProposeCategoryBadge from './ProposeCategoryBadge.vue'
import ProposeEmptyState from './ProposeEmptyState.vue'
import ProposeStatusBadge from './ProposeStatusBadge.vue'
import ProposeTableSkeleton from './ProposeTableSkeleton.vue'

const props = defineProps<{
  items: ProposeItem[]
  loading: boolean
  total: number
  roleFlags: ProposeApprovalRoleFlags
}>()

const emit = defineEmits<{
  view: [item: ProposeItem]
  approve: [item: ProposeItem]
  reject: [item: ProposeItem]
  'clear-filters': []
}>()

const { formatDate, formatEmployeeCode } = useFormatter()

const columnCount = computed(() => {
  if (props.roleFlags.isBod) return 7
  return 8
})
</script>

<template>
  <div class="col-span-12">
    <div class="box overflow-hidden">
      <div
        class="flex flex-col items-start justify-between gap-2 border-b border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:px-5"
      >
        <div>
          <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">
            Hàng đợi duyệt
          </h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Ưu tiên xử lý các đơn đang chờ duyệt trước
          </p>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Tổng:
          <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
          bản ghi
        </p>
      </div>

      <ProgressBar v-if="loading" mode="indeterminate" class="!h-[3px]" />

      <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr
              class="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
            >
              <th class="whitespace-nowrap px-4 py-3 font-medium">STT</th>
              <th class="whitespace-nowrap px-4 py-3 font-medium">Người đề xuất</th>
              <th v-if="!roleFlags.isBod" class="whitespace-nowrap px-4 py-3 font-medium">
                Danh mục
              </th>
              <th
                v-if="roleFlags.isLeader || roleFlags.isTbp || roleFlags.isBod"
                class="whitespace-nowrap px-4 py-3 font-medium"
              >
                {{ roleFlags.isBod ? 'Phòng ban' : 'Bộ phận' }}
              </th>
              <th class="whitespace-nowrap px-4 py-3 font-medium">Lý do</th>
              <th class="whitespace-nowrap px-4 py-3 font-medium">Trạng thái</th>
              <th v-if="!roleFlags.isBod" class="whitespace-nowrap px-4 py-3 font-medium">
                Thời gian tạo
              </th>
              <th class="whitespace-nowrap px-4 py-3 font-medium text-center">Thao tác</th>
            </tr>
          </thead>

          <ProposeTableSkeleton v-if="loading" :columns="columnCount" />

          <tbody v-else-if="items.length > 0">
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="group border-b border-slate-100 transition hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-800 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
              :class="
                canApprovePropose(item.status)
                  ? 'bg-amber-50/20 dark:bg-amber-950/20'
                  : ''
              "
            >
              <td class="px-4 py-3.5 text-slate-500 dark:text-slate-400">{{ index + 1 }}</td>
              <td class="px-4 py-3.5">
                <div v-if="item.user" class="min-w-0">
                  <p class="font-medium text-slate-800 dark:text-slate-100">
                    {{ item.user.name }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Mã NS: {{ formatEmployeeCode(item.user.id) }}
                  </p>
                </div>
              </td>
              <td v-if="!roleFlags.isBod" class="px-4 py-3.5">
                <ProposeCategoryBadge :category="item.category" compact />
              </td>
              <td class="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                {{ item.parentDepartment || '—' }}
              </td>
              <td class="max-w-xs px-4 py-3.5">
                <p class="text-slate-800 dark:text-slate-100">
                  {{ truncateText(item.reason, 42) }}
                </p>
              </td>
              <td class="px-4 py-3.5">
                <ProposeStatusBadge :status="item.status" />
              </td>
              <td
                v-if="!roleFlags.isBod"
                class="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400"
              >
                {{ formatDate(item.createdAt, 'datetime') }}
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center justify-center gap-1">
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
                  <template v-if="canApprovePropose(item.status)">
                    <Button
                      type="button"
                      icon="pi pi-check"
                      severity="success"
                      rounded
                      size="small"
                      title="Duyệt"
                      @click="emit('approve', item)"
                    />
                    <Button
                      type="button"
                      icon="pi pi-times"
                      severity="danger"
                      outlined
                      rounded
                      size="small"
                      title="Từ chối"
                      @click="emit('reject', item)"
                    />
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <ProposeEmptyState
          v-if="!loading && items.length === 0"
          title="Không có đề xuất cần xử lý"
          description="Không tìm thấy yêu cầu phù hợp. Hãy thử điều chỉnh bộ lọc hoặc quay lại sau."
          @clear-filters="emit('clear-filters')"
        />
      </div>
    </div>
  </div>
</template>
