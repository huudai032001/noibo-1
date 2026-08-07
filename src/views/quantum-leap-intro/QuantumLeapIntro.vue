<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QuantumLeapFeatures from './components/QuantumLeapFeatures.vue'
import { useQuantumLeapPage } from './composables/use-quantum-leap-page'

const router = useRouter()
const { infoItems, loading, redirecting, fetchInfo, handleRedirect } = useQuantumLeapPage()

function handleGoBack(): void {
  router.back()
}

onMounted(() => {
  void fetchInfo()
})
</script>

<template>
  <div class="space-y-6 py-3 sm:py-4">
    <!-- Back Button -->
    <div class="flex items-center gap-2">
      <button
        @click="handleGoBack"
        class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Quay lại</span>
      </button>
    </div>

    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-8 shadow-lg sm:p-12">
      <!-- Background decorations -->
      <div class="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-3xl"></div>

      <!-- Content -->
      <div class="relative flex flex-col gap-4">
        <div class="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
          <span class="text-2xl">🚀</span>
          <span class="text-sm font-semibold text-white">Quantum Leap</span>
        </div>

        <div>
          <h1 class="text-4xl font-bold text-white md:text-5xl">
            Khám phá Quantum Leap
          </h1>
          <p class="mt-3 max-w-xl text-lg text-white/90">
            Nền tảng học tập hiện đại, giúp bạn phát triển kỹ năng và theo bước tiến của mình
          </p>
        </div>

        <!-- CTA Button -->
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            @click="handleRedirect"
            :disabled="redirecting"
            class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-purple-700 transition-all hover:bg-white/95 disabled:opacity-60"
          >
            <span v-if="redirecting" class="h-4 w-4 animate-spin rounded-full border-2 border-purple-700 border-t-transparent"></span>
            <span v-else>Truy cập ngay</span>
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            @click="handleGoBack"
            class="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div>
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full bg-purple-600"></div>
        <h2 class="text-base font-semibold text-gray-800">Các tính năng chính</h2>
      </div>
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div class="p-6">
          <QuantumLeapFeatures :items="infoItems" :loading="loading" />
        </div>
      </div>
    </div>

    <!-- Benefits Section -->
    <div>
      <div class="mb-4 flex items-center gap-3">
        <div class="h-5 w-1 rounded-full bg-indigo-600"></div>
        <h2 class="text-base font-semibold text-gray-800">Lợi ích khi tham gia</h2>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-2xl">
              🎯
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Học tập có mục tiêu</h3>
              <p class="mt-1 text-sm text-gray-600">
                Thiết kế chương trình học tập phù hợp với mục tiêu phát triển của bạn
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
              📊
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Theo dõi tiến độ</h3>
              <p class="mt-1 text-sm text-gray-600">
                Xem rõ tiến độ học tập và đạt được những cột mốc quan trọng
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-2xl">
              🤝
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Cộng đồng học tập</h3>
              <p class="mt-1 text-sm text-gray-600">
                Kết nối với những người học tập cùng mục tiêu và trao đổi kinh nghiệm
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-2xl">
              🏅
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Nhận chứng chỉ</h3>
              <p class="mt-1 text-sm text-gray-600">
                Hoàn thành khóa học và nhận các chứng chỉ để xác thực kỹ năng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-center shadow-lg sm:p-12">
      <h3 class="text-2xl font-bold text-white md:text-3xl">
        Sẵn sàng bắt đầu?
      </h3>
      <p class="mt-2 text-white/90">
        Truy cập Quantum Leap ngay để khám phá những khóa học mới
      </p>
      <button
        @click="handleRedirect"
        :disabled="redirecting"
        class="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-purple-700 transition-all hover:bg-white/95 disabled:opacity-60"
      >
        <span v-if="redirecting">Đang tải...</span>
        <span v-else>Truy cập Quantum Leap</span>
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  </div>
</template>
