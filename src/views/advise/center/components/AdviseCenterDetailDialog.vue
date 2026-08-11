<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanel from 'primevue/tabpanel'
import { useToast } from 'primevue/usetoast'
import type { AdviseCenter, CenterDetailData } from '../models/advise-center.model'
import { fetchCenterDetail } from '../services/advise-center.service'

interface Props {
  visible: boolean
  center: AdviseCenter | null
}

const props = withDefaults(defineProps<Props>(), {
  center: null,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const toast = useToast()
const loading = ref(false)
const detailData = ref<CenterDetailData | null>(null)

function close(): void {
  emit('update:visible', false)
  detailData.value = null
}

function getStarColor(avg: number | undefined, starIndex: number): string {
  if (!avg) return 'text-slate-200 dark:text-slate-700'
  if (avg >= starIndex) return 'text-yellow-400'
  if (avg >= starIndex - 0.5) return 'text-yellow-300'
  return 'text-slate-200 dark:text-slate-700'
}

async function copyAddress(): Promise<void> {
  const address = detailData.value?.center?.address || props.center?.address
  if (!address) return
  try {
    await navigator.clipboard.writeText(address)
    toast.add({ severity: 'success', summary: 'Đã sao chép', detail: 'Địa chỉ đã được sao chép vào clipboard', life: 2500 })
  } catch {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể sao chép, vui lòng thử lại', life: 3000 })
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

async function fetchDetail(): Promise<void> {
  if (!props.center?.id) return

  loading.value = true
  try {
    const response = await fetchCenterDetail({ center_id: props.center.id })
    if (response.data) {
      detailData.value = response.data
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi khi tải chi tiết trung tâm'
    toast.add({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 })
  } finally {
    loading.value = false
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && !detailData.value && props.center?.id) {
      void fetchDetail()
    }
  },
)
</script>

<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="true"
    :draggable="false"
    :style="{ width: '95vw', maxWidth: '95vw' }"
    class="advise-center-detail-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <!-- Icon -->
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--app-primary-rgb),0.1)] text-[var(--app-primary)]"
        >
          <i class="pi pi-building text-base" />
        </div>
        <div class="min-w-0">
          <h3 class="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
            {{ detailData?.center?.name || 'Chi tiết trung tâm' }}
          </h3>
          <p v-if="detailData?.center?.branchName" class="mt-0.5 truncate text-xs text-[var(--app-primary)]">
            {{ detailData.center.branchName }}
          </p>
        </div>
        <!-- Combo badge -->
        <span
          v-if="detailData?.center?.combo"
          class="ml-auto shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--app-primary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
        >
          <i class="pi pi-star-fill text-[8px]" />
          Combo
        </span>
      </div>
    </template>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-3 py-4">
      <div class="h-16 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
      <div class="h-10 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
      <div class="h-20 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
    </div>

    <!-- Content state -->
    <div v-else-if="detailData" class="space-y-5">
      <!-- Rating -->
      <div
        v-if="detailData?.center?.avg"
        class="flex items-center gap-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 p-3 dark:from-yellow-900/10 dark:to-amber-900/10"
      >
        <div class="flex items-center gap-0.5">
          <svg
            v-for="star in 5"
            :key="star"
            class="h-4 w-4 transition-colors"
            :class="getStarColor(detailData?.center?.avg, star)"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <span class="text-sm font-bold text-amber-700 dark:text-amber-400">
          {{ detailData?.center?.avg.toFixed(1) }}
        </span>
        <span class="text-xs text-amber-600/70 dark:text-amber-400/60">/ 5.0</span>
      </div>

      <!-- Info list -->
      <div class="divide-y divide-slate-100 dark:divide-slate-700/60">
        <!-- Address -->
        <div v-if="detailData?.center?.address" class="flex items-start gap-3 py-3">
          <span
            class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(var(--app-primary-rgb),0.08)] text-[var(--app-primary)]"
          >
            <i class="pi pi-map-marker text-xs" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Địa chỉ
            </p>
            <p class="text-sm text-slate-700 dark:text-slate-200">{{ detailData.center.address }}</p>
          </div>
          <button
            type="button"
            title="Sao chép địa chỉ"
            class="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[var(--app-primary)] dark:hover:bg-slate-700"
            @click="copyAddress"
          >
            <i class="pi pi-copy text-xs" />
          </button>
        </div>

        <!-- Description -->
        <div v-if="detailData?.center?.shortDescription" class="flex items-start gap-3 py-3">
          <span
            class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
          >
            <i class="pi pi-file-edit text-xs" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Mô tả
            </p>
            <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
              {{ detailData.center.shortDescription }}
            </p>
          </div>
        </div>

        <!-- Total students -->
        <div v-if="detailData?.center?.totalStudent" class="flex items-center gap-3 py-3">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          >
            <i class="pi pi-users text-xs" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Học viên
            </p>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {{ detailData.center.totalStudent.toLocaleString('vi-VN') }}
              <span class="font-normal text-slate-400">học viên đang theo học</span>
            </p>
          </div>
        </div>

        <!-- Branch name -->
        <div v-if="detailData?.center?.branchName" class="flex items-center gap-3 py-3">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <i class="pi pi-sitemap text-xs" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Chi nhánh
            </p>
            <p class="text-sm text-slate-700 dark:text-slate-200">{{ detailData.center.branchName }}</p>
          </div>
        </div>

        <!-- Created date -->
        <div v-if="detailData?.center?.createdAt" class="flex items-center gap-3 py-3">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
          >
            <i class="pi pi-calendar text-xs" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Ngày thành lập
            </p>
            <p class="text-sm text-slate-700 dark:text-slate-200">{{ formatDate(detailData.center.createdAt) }}</p>
          </div>
        </div>

        <!-- Thông tin chung (intro) -->
        <div v-if="detailData?.information?.intro" class="flex items-start gap-3 py-3">
          <span
            class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
          >
            <i class="pi pi-info-circle text-xs" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Thông tin chung
            </p>
            <div class="text-sm leading-6 text-slate-700 dark:text-slate-200 prose prose-sm max-w-none" v-html="detailData.information.intro" />
          </div>
        </div>
      </div>

      <!-- Additional sections tabs -->
      <Tabs v-if="detailData?.information" class="mt-6">
        <TabList>
          <Tab v-if="detailData.information.schedule" label="Công cụ bán hàng" />
          <Tab v-if="detailData.information.special" label="Khai giảng" />
          <Tab v-if="detailData.information.promotion" label="Khuyến mãi" />
          <Tab v-if="detailData.information.feedback" label="Phản hồi" />
          <Tab v-if="detailData.information.teacher" label="Giáo viên" />
          <Tab v-if="detailData.information.payment" label="Thanh toán" />
          <Tab v-if="detailData.information.priceList" label="Bảng giá" />
        </TabList>

        <!-- Công cụ bán hàng (schedule/roadmap) -->
        <TabPanel v-if="detailData.information.schedule">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.schedule" />
        </TabPanel>

        <!-- Khai giảng (special/opening) -->
        <TabPanel v-if="detailData.information.special">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.special" />
        </TabPanel>

        <!-- Khuyến mãi (promotion) -->
        <TabPanel v-if="detailData.information.promotion">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.promotion" />
        </TabPanel>

        <!-- Phản hồi (feedback) -->
        <TabPanel v-if="detailData.information.feedback">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.feedback" />
        </TabPanel>

        <!-- Giáo viên (teacher) -->
        <TabPanel v-if="detailData.information.teacher">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.teacher" />
        </TabPanel>

        <!-- Thanh toán (payment) -->
        <TabPanel v-if="detailData.information.payment">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.payment" />
        </TabPanel>

        <!-- Bảng giá (priceList) -->
        <TabPanel v-if="detailData.information.priceList">
          <div class="prose prose-sm max-w-none text-slate-700 dark:text-slate-200" v-html="detailData.information.priceList" />
        </TabPanel>
      </Tabs>
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-3">
        <Button
          v-if="detailData?.center?.address"
          label="Sao chép địa chỉ"
          icon="pi pi-copy"
          severity="secondary"
          size="small"
          outlined
          @click="copyAddress"
        />
        <div class="ml-auto">
          <Button
            label="Đóng"
            icon="pi pi-times"
            size="small"
            severity="secondary"
            @click="close"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
