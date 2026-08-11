<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

interface Props {
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const router = useRouter()
</script>

<template>
  <div
    class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800/50"
  >
    <div class="mx-auto w-fit">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
      >
        <i class="pi pi-book text-3xl text-slate-400 dark:text-slate-500" />
      </div>
    </div>

    <h3 class="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
      Chưa có khóa học nào
    </h3>
    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
      Hiện tại bạn chưa đăng ký khóa học nào. Hãy ghé thăm trung tâm để tìm khóa học phù hợp.
    </p>

    <div class="mt-6 flex items-center justify-center gap-3">
      <Button
        label="Liên hệ tư vấn"
        icon="pi pi-phone"
        severity="secondary"
        outlined
      />
    </div>
  </div>
</template>
