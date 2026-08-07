<script setup lang="ts">
import type { QuantumLeapInfoItem } from '../models/quantum-leap-intro.model'

interface Props {
  items: QuantumLeapInfoItem[]
  loading: boolean
}

withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
})

const featureIcons: Record<string, string> = {
  learning: '📚',
  training: '🎓',
  progress: '📈',
  reward: '🏆',
  challenge: '⚡',
  community: '👥',
}

function getIcon(item: QuantumLeapInfoItem): string {
  if (item.icon) return item.icon
  const key = item.id?.toLowerCase() || ''
  return featureIcons[key] || '✨'
}
</script>

<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-3 py-14">
      <div class="h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600"></div>
      <span class="text-sm text-gray-400">Đang tải thông tin...</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center gap-3 py-14">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <svg class="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p class="text-sm text-gray-400">Không có dữ liệu</p>
    </div>

    <!-- Features Grid -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-purple-200"
      >
        <!-- Background decoration -->
        <div class="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-50 transition-transform duration-300 group-hover:scale-150"></div>

        <!-- Content -->
        <div class="relative flex flex-col gap-3">
          <!-- Icon -->
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl transition-colors duration-300 group-hover:bg-purple-100">
            {{ getIcon(item) }}
          </div>

          <!-- Title -->
          <h3 class="text-base font-semibold text-gray-900 group-hover:text-purple-600">
            {{ item.title }}
          </h3>

          <!-- Description -->
          <p class="line-clamp-2 text-sm text-gray-600">
            {{ item.description }}
          </p>

          <!-- Image if available -->
          <div v-if="item.image_url" class="mt-2 overflow-hidden rounded-lg">
            <img
              :src="item.image_url"
              :alt="item.title"
              class="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <!-- Hover indicator -->
        <div class="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-400 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
    </div>
  </div>
</template>
