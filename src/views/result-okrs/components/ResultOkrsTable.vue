<script setup lang="ts">
import Paginator from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'
import type { ResultOkrsListItem } from '../models/result-okrs.model'

const props = defineProps<{
  items: ResultOkrsListItem[]
  loading: boolean
  total: number
  currentPage: number
  perPage: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

function getIndex(index: number): number {
  return (props.currentPage - 1) * props.perPage + index + 1
}

function onPageChange(event: { page: number }): void {
  emit('pageChange', event.page + 1)
}
</script>

<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div
      class="flex flex-col items-start justify-between gap-2 border-b border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:px-5"
    >
      <div>
        <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">Danh sách kết quả OKRs</h2>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Theo dõi EXP, tiến độ và phản hồi của từng OKR đã tham gia
        </p>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Tổng
        <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
        bản ghi
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[1100px] border-collapse text-sm">
        <thead>
          <tr
            class="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
          >
            <th class="whitespace-nowrap px-4 py-3 font-medium">STT</th>
            <th class="min-w-[260px] px-4 py-3 font-medium">Tên OKR</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Phòng ban</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Quý</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Phân loại</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">EXP đạt được</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Người lead</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Trạng thái</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Tiến độ</th>
            <th class="min-w-[260px] px-4 py-3 font-medium">Nhận xét</th>
          </tr>
        </thead>

        <tbody v-if="loading">
          <tr
            v-for="row in 6"
            :key="row"
            class="border-b border-slate-100 dark:border-slate-800"
          >
            <td class="px-4 py-3.5"><Skeleton width="1rem" height="1rem" /></td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="85%" height="1rem" />
                <Skeleton width="40%" height="0.75rem" />
              </div>
            </td>
            <td class="px-4 py-3.5"><Skeleton width="6.5rem" height="1.75rem" /></td>
            <td class="px-4 py-3.5"><Skeleton width="4rem" height="0.9rem" /></td>
            <td class="px-4 py-3.5"><Skeleton width="6rem" height="1.75rem" /></td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="5rem" height="0.95rem" />
                <Skeleton width="4rem" height="0.7rem" />
              </div>
            </td>
            <td class="px-4 py-3.5"><Skeleton width="6rem" height="0.95rem" /></td>
            <td class="px-4 py-3.5"><Skeleton width="7rem" height="1.75rem" /></td>
            <td class="px-4 py-3.5"><Skeleton width="4rem" height="0.95rem" /></td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="100%" height="0.95rem" />
                <Skeleton width="75%" height="0.95rem" />
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else-if="items.length === 0">
          <tr>
            <td colspan="10" class="px-4 py-14 text-center text-sm text-slate-500">
              <div class="flex flex-col items-center gap-2">
                <span
                  class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)]"
                >
                  <i class="pi pi-inbox text-xl" />
                </span>
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">Không có dữ liệu</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Chưa có kết quả OKR phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="border-b border-slate-100 align-top transition hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-800 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
          >
            <td class="px-4 py-3.5 text-slate-500 dark:text-slate-400">{{ getIndex(index) }}</td>
            <td class="px-4 py-3.5">
              <div class="space-y-1">
                <p class="font-medium leading-5 text-slate-800 dark:text-slate-100">{{ item.name || '—' }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.completionRateLabel }}</p>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {{ item.departmentName || '—' }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-slate-700 dark:text-slate-200">{{ item.quarterLabel || '—' }}</td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="item.typeClass"
              >
                {{ item.typeLabel || '—' }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div class="space-y-1">
                <p class="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                  {{ item.expLabel }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">EXP thực nhận</p>
              </div>
            </td>
            <td class="px-4 py-3.5 text-slate-700 dark:text-slate-200">{{ item.leaderName || '—' }}</td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="item.statusClass"
              >
                {{ item.statusLabel }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <span class="font-medium text-slate-700 dark:text-slate-200">
                {{ item.completionRateLabel }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <p class="max-w-[320px] whitespace-pre-line text-slate-700 dark:text-slate-200">
                {{ item.feedback || '—' }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="total > perPage"
      class="flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 px-4 py-3 dark:border-slate-700 sm:flex-row sm:px-5"
    >
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Trang <span class="font-semibold">{{ currentPage }}</span> · Tổng
        <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span> bản ghi
      </p>
      <Paginator
        :rows="perPage"
        :total-records="total"
        :first="(currentPage - 1) * perPage"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="!border-0 !bg-transparent !p-0"
        @page="onPageChange"
      />
    </div>
  </section>
</template>
