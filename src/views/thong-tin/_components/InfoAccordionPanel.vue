<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  title?: string
  content?: string
  createdAt?: string
  updatedAt?: string
  defaultExpanded?: boolean
}>()

const isExpanded = ref(props.defaultExpanded ?? false)

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

const badge = computed<'new' | 'update' | null>(() => {
  const now = Date.now()
  const sixDays = 6 * 24 * 60 * 60 * 1000
  if (props.createdAt && now - new Date(props.createdAt).getTime() <= sixDays) return 'new'
  if (props.updatedAt && now - new Date(props.updatedAt).getTime() <= sixDays) return 'update'
  return null
})
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
  >
    <!-- Header -->
    <button
      class="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 focus:outline-none"
      @click="isExpanded = !isExpanded"
    >
      <div
        class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-purple-50 transition-colors"
        :class="{ 'bg-purple-100': isExpanded }"
      >
        <svg
          class="h-4 w-4 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-semibold text-gray-800">
            {{ title || 'Không có tiêu đề' }}
          </span>
          <span
            v-if="badge === 'new'"
            class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
          >Mới</span>
          <span
            v-else-if="badge === 'update'"
            class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
          >Cập nhật</span>
        </div>
        <p v-if="updatedAt" class="mt-0.5 text-xs text-gray-400">
          Cập nhật: {{ formatDateTime(updatedAt) }}
        </p>
      </div>

      <svg
        class="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Body -->
    <div
      class="grid transition-all duration-300 ease-in-out"
      :class="isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <div class="border-t border-gray-100 px-5 py-5">
          <div
            v-if="content"
            v-html="content"
            class="thong-tin-content text-sm leading-relaxed text-gray-700"
          ></div>
          <p v-else class="text-sm italic text-gray-400">Chưa có nội dung</p>
        </div>
      </div>
    </div>
  </div>
</template>
