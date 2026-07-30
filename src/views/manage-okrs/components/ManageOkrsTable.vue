<script setup lang="ts">
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import ProgressBar from 'primevue/progressbar'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import type { ManageOkrsListItem } from '../models/manage-okrs.model'

const props = defineProps<{
  items: ManageOkrsListItem[]
  loading: boolean
  total: number
  currentPage: number
  perPage: number
  statusOptions: ReadonlyArray<{ label: string; value: number }>
}>()

const emit = defineEmits<{
  edit: [item: ManageOkrsListItem]
  shareExp: [item: ManageOkrsListItem]
  updateStatus: [payload: { item: ManageOkrsListItem; status: number }]
  pageChange: [page: number]
}>()

function getIndex(index: number): number {
  return (props.currentPage - 1) * props.perPage + index + 1
}

function onPageChange(event: { page: number }): void {
  emit('pageChange', event.page + 1)
}

function statusClass(status: number): string {
  if (status === 6) return 'text-emerald-600 dark:text-emerald-400'
  if (status === 1) return 'text-red-600 dark:text-red-400'
  if (status >= 2 && status <= 5) return 'text-amber-600 dark:text-amber-300'
  return 'text-slate-700 dark:text-slate-200'
}

function statusText(status: number): string {
  if (status === 6) return 'Hoàn thành'
  if (status === 1) return 'Cảnh báo'
  if (status >= 2 && status <= 5) return 'Đang theo dõi'
  return 'Chưa đánh giá'
}

function getStatusOptions(currentStatus: number): ReadonlyArray<{ label: string; value: number }> {
  const allowedValues = new Set([0, 4, 6])
  const currentOption = props.statusOptions.find((option) => option.value === currentStatus)
  const nextOptions = props.statusOptions.filter((option) => allowedValues.has(option.value))

  if (!currentOption || allowedValues.has(currentStatus)) {
    return nextOptions
  }

  return [currentOption, ...nextOptions]
}

function statusOptionText(status: number): string {
  if (status === 0) return 'Chưa đánh giá'
  if (status === 1) return 'Dưới 60% KPIs'
  if (status === 2) return 'Đạt 60% KPIs'
  if (status === 3) return 'Đạt 70% KPIs'
  if (status === 4) return 'Đạt KPI cam kết - 80% EXP'
  if (status === 5) return 'Đạt KPI tối thiểu'
  if (status === 6) return 'Hoàn thành (Đạt KPIs mục tiêu)'
  return 'Chưa đánh giá'
}

function typeBadgeClass(type: number): string {
  if (type === 1) {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
  }
  if (type === 2) {
    return 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
  }
  return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
}

function completionText(rate: number | null): string {
  if (rate === null) return 'Chưa có tiến độ'
  return `${rate}% hoàn thành`
}
</script>

<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div
      class="flex flex-col items-start justify-between gap-2 border-b border-slate-200/60 px-4 py-4 dark:border-slate-700/80 sm:flex-row sm:items-center sm:px-5"
    >
      <div>
        <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">
          Danh sách OKRs
        </h2>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Theo dõi trạng thái, nhân sự tham gia và tiến độ EXP của từng OKR
        </p>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Tổng
        <span class="font-semibold text-[var(--app-primary)]">{{ total }}</span>
        bản ghi
      </p>
    </div>

    <ProgressBar v-if="loading" mode="indeterminate" class="!h-[3px]" />

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
            <th class="min-w-[180px] px-4 py-3 font-medium">Nhân sự</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">EXP đạt/được giao</th>
            <th class="whitespace-nowrap px-4 py-3 font-medium">Người lead</th>
            <th class="min-w-[260px] px-4 py-3 font-medium">Trạng thái</th>
            <th class="whitespace-nowrap px-4 py-3 text-center font-medium">Thao tác</th>
          </tr>
        </thead>

        <tbody v-if="loading">
          <tr
            v-for="row in 5"
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
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="4rem" height="0.9rem" />
              </div>
            </td>
            <td class="px-4 py-3.5"><Skeleton width="6rem" height="1.75rem" /></td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="7rem" height="0.95rem" />
                <Skeleton width="3.5rem" height="0.7rem" />
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="4.5rem" height="0.95rem" />
                <Skeleton width="5.5rem" height="0.7rem" />
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="5rem" height="0.95rem" />
                <Skeleton width="5.5rem" height="0.7rem" />
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="space-y-2">
                <Skeleton width="100%" height="2rem" />
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center justify-center gap-1.5">
                <Skeleton shape="circle" size="2rem" />
                <Skeleton shape="circle" size="2rem" />
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
                <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Không có dữ liệu
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Chưa có OKR phù hợp với bộ lọc hiện tại.
                </p>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="group border-b border-slate-100 align-top text-sm transition hover:bg-[rgba(var(--app-primary-rgb),0.03)] dark:border-slate-800 dark:hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
          >
            <td class="px-4 py-3.5 text-slate-500 dark:text-slate-400">{{ getIndex(index) }}</td>
            <td class="px-4 py-3.5">
              <p class="max-w-[320px] font-medium leading-5 text-slate-800 dark:text-slate-100">
                {{ item.name }}
              </p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {{ completionText(item.completionRate) }}
              </p>
            </td>
            <td class="px-4 py-3.5">
              <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {{ item.departmentName || '—' }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <p class="text-slate-700 dark:text-slate-200">{{ item.quarterLabel }}</p>
            </td>
            <td class="px-4 py-3.5">
              <span
                class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="typeBadgeClass(item.typeValue)"
              >
                {{ item.typeLabel }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div class="space-y-0.5">
                <p class="font-medium text-slate-700 dark:text-slate-200">
                  {{ item.humanSummary || '—' }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.humans.length }} nhân sự</p>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <p class="font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                {{ item.expText || '—' }}
              </p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {{ completionText(item.completionRate) }}
              </p>
            </td>
            <td class="px-4 py-3.5">
              <p class="text-slate-700 dark:text-slate-200">{{ item.leaderName || '—' }}</p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Người phụ trách</p>
            </td>
            <td class="px-4 py-3.5">
              <div class="space-y-1">
                <Select
                  :model-value="item.status"
                  :options="[...getStatusOptions(item.status)]"
                  option-label="label"
                  option-value="value"
                  size="small"
                  fluid
                  :disabled="item.typeValue === 2"
                  :pt="{
                    root: { class: 'rounded-xl' },
                    label: { class: ['text-sm font-medium', statusClass(item.status)] },
                    overlay: { class: 'rounded-xl border border-slate-200 shadow-lg dark:border-slate-700' },
                    option: { class: 'rounded-lg mx-1' },
                  }"
                  @update:model-value="emit('updateStatus', { item, status: Number($event ?? 0) })"
                >
                  <template #value="{ value, placeholder }">
                    <span
                      v-if="value !== null && value !== undefined"
                      class="block truncate text-sm font-medium"
                      :class="statusClass(Number(value))"
                    >
                      {{ statusOptionText(Number(value)) }}
                    </span>
                    <span v-else class="text-sm text-slate-400">
                      {{ placeholder }}
                    </span>
                  </template>
                  <template #option="{ option }">
                    <div class="py-1">
                      <p class="text-sm font-medium" :class="statusClass(option.value)">
                        {{ statusOptionText(option.value) }}
                      </p>
                    </div>
                  </template>
                </Select>
              </div>
            </td>
            <td class="px-4 py-3.5 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <Button
                  type="button"
                  icon="pi pi-pencil"
                  size="small"
                  severity="warn"
                  outlined
                  rounded
                  title="Sửa OKR"
                  aria-label="Sửa OKR"
                  @click="emit('edit', item)"
                />
                <Button
                  type="button"
                  icon="pi pi-chart-pie"
                  size="small"
                  severity="info"
                  outlined
                  rounded
                  title="Chia EXP"
                  aria-label="Chia EXP"
                  @click="emit('shareExp', item)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="total > 0"
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
