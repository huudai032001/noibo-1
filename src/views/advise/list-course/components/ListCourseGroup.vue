<script setup lang="ts">
import type { CourseProgram } from '../models/list-course.model'
import { COURSE_STATUS } from '../constants'

interface Props {
  program: CourseProgram
  isCompleted: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'open-course': [courseId: number]
}>()

function getStatusColor(status?: number): string {
  const statusConfig = COURSE_STATUS[status as keyof typeof COURSE_STATUS]
  return statusConfig?.color || 'bg-slate-300'
}

function getStatusText(status?: number): string {
  const statusConfig = COURSE_STATUS[status as keyof typeof COURSE_STATUS]
  return statusConfig?.text || 'N/A'
}

function handleCourseClick(courseId?: number): void {
  if (courseId) {
    emit('open-course', courseId)
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="h-5 w-1 rounded-full bg-[var(--app-primary)]" />
      <div>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {{ program.title }}
        </h3>
        <p v-if="program.shortDescription" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ program.shortDescription }}
        </p>
      </div>
      <div v-if="isCompleted" class="ml-auto flex items-center gap-2">
        <i class="pi pi-check-circle text-lg text-emerald-500" />
        <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">Đã cấp</span>
      </div>
    </div>

    <!-- Courses Grid -->
    <div v-if="program.courses && program.courses.length > 0" class="mt-4">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="course in program.courses"
          :key="course.id"
          class="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <!-- Image -->
          <div class="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              v-if="course.image"
              :src="course.image"
              :alt="course.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              v-else
              class="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
            >
              <i class="pi pi-book text-5xl text-slate-400 dark:text-slate-500" />
            </div>

            <!-- Gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-yellow-300">
              Khóa học
            </p>
            <h4 class="mb-3 line-clamp-2 text-sm font-semibold leading-snug">
              {{ course.title }}
            </h4>

            <!-- Status -->
            <div class="flex items-center justify-between">
              <span
                :class="[
                  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                  getStatusColor(course.status),
                ]"
              >
                <i class="pi pi-circle-fill text-[4px]" />
                {{ getStatusText(course.status) }}
              </span>

              <!-- Progress indicator for studying courses -->
              <div
                v-if="!isCompleted && course.progress"
                class="flex items-center gap-1"
              >
                <i class="pi pi-bolt text-xs text-yellow-300" />
                <span class="text-xs font-medium">{{ course.progress }}%</span>
              </div>
            </div>
          </div>

          <!-- Click area button -->
          <button
            class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40"
            @click="handleCourseClick(course.id)"
          >
            <i class="pi pi-play-fill text-4xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50"
    >
      <i class="pi pi-inbox text-4xl text-slate-300 dark:text-slate-600" />
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Chưa có khóa học nào trong danh mục này
      </p>
    </div>
  </div>
</template>
