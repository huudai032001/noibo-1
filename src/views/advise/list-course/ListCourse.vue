<script setup lang="ts">
import { onMounted, computed } from 'vue'
import ListCourseHero from './components/ListCourseHero.vue'
import ListCourseGroup from './components/ListCourseGroup.vue'
import ListCourseEmpty from './components/ListCourseEmpty.vue'
import ListCourseSkeleton from './components/ListCourseSkeleton.vue'
import { useListCoursePage } from './composables/use-list-course-page'

const {
  coursesStudying,
  coursesPassed,
  candidate,
  loading,
  hasCoursesStudying,
  hasCoursesPassed,
  hasAnyCourse,
  fetchCourses,
  handleOpenQuantumLeap,
} = useListCoursePage()

const totalCourses = computed(() => {
  const studying = coursesStudying.value.reduce((acc, p) => acc + (p.courses?.length || 0), 0)
  const passed = coursesPassed.value.reduce((acc, p) => acc + (p.courses?.length || 0), 0)
  return studying + passed
})

async function handleOpenCourse(courseId: number): Promise<void> {
  await handleOpenQuantumLeap(courseId)
}

onMounted(() => {
  void fetchCourses()
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4 py-3 sm:gap-5 sm:py-4">
    <!-- Hero Section -->
    <div class="col-span-12">
      <ListCourseHero
        :candidate="candidate"
        :loading="loading"
        :courses-count="totalCourses"
      />
    </div>

    <!-- Content Section -->
    <div class="col-span-12">
      <!-- Loading State -->
      <ListCourseSkeleton v-if="loading" />

      <!-- Empty State -->
      <ListCourseEmpty v-else-if="!hasAnyCourse" :loading="loading" />

      <!-- Content -->
      <template v-else>
        <!-- Courses Studying Section -->
        <div v-if="hasCoursesStudying" class="space-y-8">
          <ListCourseGroup
            v-for="program in coursesStudying"
            :key="program.id"
            :program="program"
            :is-completed="false"
            :loading="loading"
            @open-course="handleOpenCourse"
          />

          <!-- Divider -->
          <div v-if="hasCoursesPassed" class="border-t border-slate-200 dark:border-slate-700" />
        </div>

        <!-- Courses Passed Section -->
        <div v-if="hasCoursesPassed" class="space-y-8 pt-8">
          <ListCourseGroup
            v-for="program in coursesPassed"
            :key="program.id"
            :program="program"
            :is-completed="true"
            :loading="loading"
            @open-course="handleOpenCourse"
          />
        </div>
      </template>
    </div>

    <!-- Info Banner -->
    <div class="col-span-12">
      <div
        class="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 sm:p-5"
      >
        <div class="flex gap-3">
          <i class="pi pi-info-circle text-xl text-blue-600 dark:text-blue-400" />
          <div class="flex-1">
            <p class="font-semibold text-blue-900 dark:text-blue-200">
              Mẹo: Quản lý thời gian học tập hiệu quả
            </p>
            <p class="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Hãy dành ít nhất 2-3 giờ mỗi ngày để học tập các khóa học. Kiên trì và disiplline là
              chìa khóa để đạt được thành công.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
