<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdviseCenterFilters from './components/AdviseCenterFilters.vue'
import AdviseCenterCard from './components/AdviseCenterCard.vue'
import AdviseCenterEmpty from './components/AdviseCenterEmpty.vue'
import AdviseCenterSkeleton from './components/AdviseCenterSkeleton.vue'
import AdviseCenterDetailDialog from './components/AdviseCenterDetailDialog.vue'
import { useAdviseCenterPage } from './composables/use-advise-center-page'
import type { AdviseCenter } from './models/advise-center.model'

const {
  centers,
  provinces,
  districts,
  centerOptions,
  loading,
  isSubmitted,
  currentPage,
  lastPage,
  totalCenters,
  filter,
  fetchProvincesList,
  handleProvinceChange,
  handleDistrictChange,
  searchCenters,
  handleLoadMore,
  resetFilters,
  initFromRoute,
} = useAdviseCenterPage()

const detailVisible = ref(false)
const selectedCenter = ref<AdviseCenter | null>(null)

function openDetail(center: AdviseCenter): void {
  selectedCenter.value = center
  detailVisible.value = true
}

onMounted(() => {
  initFromRoute()
  void fetchProvincesList()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <!-- Hero + Filters -->
    <div class="col-span-12">
      <section
        class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
      >
        <!-- Background decorations -->
        <div
          class="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-[rgba(var(--app-primary-rgb),0.07)] blur-2xl dark:bg-[rgba(var(--app-primary-rgb),0.15)]"
        />
        <div
          class="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-purple-200/25 blur-3xl dark:bg-purple-500/10"
        />

        <!-- Header -->
        <div class="relative p-4 sm:p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <!-- Title block -->
            <div class="min-w-0 space-y-1">
              <p
                class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]"
              >
                Thông tin sản phẩm
              </p>
              <h1 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                Tìm kiếm Trung tâm
              </h1>
              <p class="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Khám phá các trung tâm đào tạo trong hệ thống Edutalk theo khu vực
              </p>
            </div>

            <!-- Stats card (after search) -->
            <transition
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="isSubmitted"
                class="flex shrink-0 items-stretch gap-3 lg:self-start"
              >
                <div
                  class="flex flex-col justify-center rounded-2xl border border-[rgba(var(--app-primary-rgb),0.2)] bg-[rgba(var(--app-primary-rgb),0.04)] px-5 py-3 dark:border-[rgba(var(--app-primary-rgb),0.3)] dark:bg-[rgba(var(--app-primary-rgb),0.08)]"
                >
                  <p
                    class="text-[10px] font-semibold uppercase tracking-widest text-[var(--app-primary)]/70"
                  >
                    Kết quả
                  </p>
                  <p class="mt-0.5 text-2xl font-bold tabular-nums text-[var(--app-primary)]">
                    {{ totalCenters.toLocaleString('vi-VN') }}
                  </p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">trung tâm</p>
                </div>

                <div
                  v-if="lastPage > 1"
                  class="flex flex-col justify-center rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/50"
                >
                  <p
                    class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500"
                  >
                    Trang
                  </p>
                  <p class="mt-0.5 text-2xl font-bold tabular-nums text-slate-700 dark:text-slate-200">
                    {{ currentPage }}<span class="text-sm font-normal text-slate-400">/{{ lastPage }}</span>
                  </p>
                  <p class="text-[11px] text-slate-400 dark:text-slate-500">đã tải</p>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Divider + Filters -->
        <div
          class="border-t border-slate-200/70 bg-white/60 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 sm:px-5"
        >
          <AdviseCenterFilters
            :provinces="provinces"
            :districts="districts"
            :center-options="centerOptions"
            :loading="loading"
            :province-id="filter.province_id"
            :district-id="filter.district_id"
            :center-id="filter.center_id"
            @update:province-id="(val) => (filter.province_id = val)"
            @update:district-id="(val) => (filter.district_id = val)"
            @update:center-id="(val) => (filter.center_id = val)"
            @province-change="handleProvinceChange"
            @district-change="handleDistrictChange"
            @search="() => searchCenters(1)"
            @reset="resetFilters"
          />
        </div>
      </section>
    </div>

    <!-- Results section -->
    <template v-if="isSubmitted">
      <div class="col-span-12 space-y-4">
        <!-- Result header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-5 w-1 rounded-full bg-[var(--app-primary)]" />
            <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">
              Kết quả tìm kiếm
            </h2>
            <transition
              enter-active-class="transition-all duration-200"
              enter-from-class="opacity-0 scale-90"
              enter-to-class="opacity-100 scale-100"
            >
              <span
                v-if="!loading"
                class="rounded-full bg-[rgba(var(--app-primary-rgb),0.08)] px-2.5 py-0.5 text-xs font-semibold text-[var(--app-primary)]"
              >
                {{ totalCenters.toLocaleString('vi-VN') }} trung tâm
              </span>
            </transition>
          </div>

          <!-- Loading indicator for load-more -->
          <div
            v-if="loading && centers.length > 0"
            class="flex items-center gap-1.5 text-xs text-slate-400"
          >
            <i class="pi pi-spin pi-spinner text-[11px]" />
            Đang tải...
          </div>
        </div>

        <!-- Skeleton (first load) -->
        <AdviseCenterSkeleton v-if="loading && centers.length === 0" />

        <!-- Cards grid -->
        <template v-else-if="centers.length > 0">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AdviseCenterCard
              v-for="center in centers"
              :key="center.id"
              :center="center"
              @view-detail="openDetail"
            />
          </div>

          <!-- Load more -->
          <div v-if="currentPage < lastPage" class="mt-2 flex justify-center">
            <button
              type="button"
              :disabled="loading"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-[var(--app-primary)]/40 hover:bg-[rgba(var(--app-primary-rgb),0.04)] hover:text-[var(--app-primary)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[var(--app-primary)]/40 dark:hover:text-[var(--app-primary)]"
              @click="handleLoadMore"
            >
              <i v-if="loading" class="pi pi-spin pi-spinner text-xs" />
              <i v-else class="pi pi-chevron-down text-xs" />
              {{ loading ? 'Đang tải thêm...' : `Xem thêm (còn ${lastPage - currentPage} trang)` }}
            </button>
          </div>
        </template>

        <!-- Empty after search -->
        <AdviseCenterEmpty v-else :is-searched="true" />
      </div>
    </template>

    <!-- Initial empty state -->
    <div v-else class="col-span-12">
      <AdviseCenterEmpty :is-searched="false" />
    </div>

    <!-- Detail dialog -->
    <AdviseCenterDetailDialog
      v-model:visible="detailVisible"
      :center="selectedCenter"
    />
  </div>
</template>
