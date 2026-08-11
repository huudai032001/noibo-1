<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import type { CandidateInfo } from '../models/list-course.model'

const router = useRouter()

interface Props {
  candidate?: CandidateInfo | null
  loading?: boolean
  coursesCount?: number
}

withDefaults(defineProps<Props>(), {
  loading: false,
  coursesCount: 0,
})

function formatDeadline(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}
</script>

<template>
  <section
    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
  >
    <!-- Background decorations -->
    <div
      class="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-[rgba(var(--app-primary-rgb),0.07)] blur-2xl dark:bg-[rgba(var(--app-primary-rgb),0.15)]"
    />
    <div
      class="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-200/25 blur-3xl dark:bg-blue-500/10"
    />

    <!-- Content -->
    <div class="relative space-y-6 p-4 sm:p-6">
      <!-- Title block -->
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-primary)]">
          Phát triển bản thân
        </p>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Danh sách khóa học
        </h1>
        <p class="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Khám phá và học các khóa học để nâng cao kỹ năng, kiến thức của bạn. Hãy bắt đầu hành trình
          học tập ngay hôm nay.
        </p>
      </div>

      <!-- Info cards -->
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <!-- Deadline card -->
        <div v-if="candidate?.deadline" class="flex shrink-0 items-stretch gap-3">
          <div
            class="flex flex-col justify-center rounded-2xl border border-orange-200/80 bg-orange-50 px-5 py-3 dark:border-orange-900/40 dark:bg-orange-950/20"
          >
            <p class="text-[10px] font-semibold uppercase tracking-widest text-orange-600/70 dark:text-orange-400/70">
              Deadline
            </p>
            <p class="mt-1 text-lg font-bold text-orange-700 dark:text-orange-400">
              {{ formatDeadline(candidate.deadline) }}
            </p>
          </div>

          <!-- Courses count -->
          <div v-if="coursesCount > 0" class="flex flex-col justify-center rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/50">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Khóa học
            </p>
            <p class="mt-1 text-lg font-bold text-slate-700 dark:text-slate-200">
              {{ coursesCount }}
            </p>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="flex gap-3">
          <div class="h-20 w-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div class="h-20 w-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

    </div>
  </section>
</template>
