<script setup>
import { RouterLink } from 'vue-router'
import { useBreadcrumb } from '@/composables/use-breadcrumb'
import errorIllustration from '@/assets/error-illustration.svg'

</script>

<template>
  <div class="container">
    <div
      class="error-page flex flex-col lg:flex-row items-center justify-center min-h-screen text-center lg:text-left"
    >
      <div class="-intro-x lg:mr-20">
        <img alt="Error illustration" class="h-48 lg:h-auto" :src="errorIllustration" />
      </div>
      <div class="text-white mt-10 lg:mt-0">
        <div class="intro-x text-6xl font-medium mb-3">404</div>
        <div class="intro-x text-xl lg:text-3xl font-medium mb-3">Oops. Trang này đã biến mất.</div>
        <div class="intro-x text-lg mt-3 mb-6">
          Bạn có thể đã nhập sai địa chỉ hoặc trang đã được chuyển đi.
        </div>
        <RouterLink to="/" class="intro-x button button--lg border border-white mt-12">
          Trở về trang chủ
        </RouterLink>
      </div>
    </div>
  </div>
</template>
