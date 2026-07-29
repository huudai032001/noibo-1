<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFormatter } from '@/composables/use-formatter'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  officeLabel?: string
  loading?: boolean
}>()

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)
const { formatEmployeeCode } = useFormatter()

const displayName = computed(() => currentUser.value?.name?.trim() || 'Nhân viên')

const employeeCode = computed(() => {
  if (!currentUser.value?.id) return '—'
  return String(formatEmployeeCode(currentUser.value.id))
})

const office = computed(() => props.officeLabel?.trim() || '—')

const initial = computed(() => {
  const name = displayName.value.trim()
  return name ? name.charAt(0).toUpperCase() : 'N'
})
</script>

<template>
  <div class="box h-full overflow-hidden">
    <div class="border-b border-slate-200/60 cc-bg-primary-light px-5 py-5 text-center">
      <div
        class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full cc-bg-primary text-xl font-semibold text-white shadow-sm"
        aria-hidden="true"
      >
        <span v-if="loading" class="h-5 w-5 animate-pulse rounded bg-white/40" />
        <template v-else>{{ initial }}</template>
      </div>
      <h2 class="text-base font-medium text-slate-800">Chấm công nhân viên</h2>
      <p class="mt-1 text-sm font-semibold cc-text-primary">
        <span v-if="loading" class="inline-block h-4 w-28 animate-pulse rounded bg-slate-200" />
        <template v-else>{{ displayName }}</template>
      </p>
    </div>

    <div class="space-y-3 p-5">
      <div class="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-3">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Mã nhân sự</p>
        <p class="mt-1 text-sm font-semibold text-slate-800">
          <span v-if="loading" class="inline-block h-4 w-20 animate-pulse rounded bg-slate-200" />
          <template v-else>{{ employeeCode }}</template>
        </p>
      </div>
      <div class="rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-3">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Văn phòng</p>
        <p class="mt-1 text-sm font-semibold text-slate-800">
          <span v-if="loading" class="inline-block h-4 w-32 animate-pulse rounded bg-slate-200" />
          <template v-else>{{ office }}</template>
        </p>
      </div>
    </div>
  </div>
</template>
