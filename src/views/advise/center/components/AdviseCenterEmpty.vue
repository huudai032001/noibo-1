<script setup lang="ts">
interface Props {
  isSearched: boolean
}

withDefaults(defineProps<Props>(), {
  isSearched: false,
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-white to-slate-50 px-6 py-20 text-center dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
  >
    <!-- Icon -->
    <div
      class="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(var(--app-primary-rgb),0.08)] to-purple-50 dark:from-[rgba(var(--app-primary-rgb),0.14)] dark:to-purple-900/20"
    >
      <i
        v-if="isSearched"
        class="pi pi-inbox text-3xl text-[var(--app-primary)]/40"
      />
      <i
        v-else
        class="pi pi-search text-3xl text-[var(--app-primary)]/40"
      />
    </div>

    <!-- Text -->
    <h3 class="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
      {{ isSearched ? 'Không tìm thấy trung tâm nào' : 'Bắt đầu tìm kiếm' }}
    </h3>
    <p class="max-w-xs text-xs leading-6 text-slate-500 dark:text-slate-400">
      {{
        isSearched
          ? 'Thử thay đổi bộ lọc hoặc chọn khu vực khác để tìm được trung tâm phù hợp hơn'
          : 'Chọn tỉnh / thành phố rồi nhấn Tìm kiếm để xem danh sách trung tâm trong khu vực'
      }}
    </p>

    <!-- Hint chips (initial state) -->
    <div v-if="!isSearched" class="mt-5 flex flex-wrap justify-center gap-2">
      <span
        v-for="city in ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ']"
        :key="city"
        class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
      >
        {{ city }}
      </span>
    </div>
  </div>
</template>
