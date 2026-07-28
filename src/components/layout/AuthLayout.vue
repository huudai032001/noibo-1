<script setup>
import { RouterLink } from 'vue-router'
import logoEdutalk from '@/assets/logo_edutalk.svg'
import DarkModeToggle from './DarkModeToggle.vue'

defineProps({
  description: {
    type: String,
    default: 'Manage all your e-commerce accounts in one place',
  },
})
</script>

<template>
  <!-- class "login" gắn trên body (xem router) — giống Midone HTML -->
  <div class="container sm:px-10 relative">
    <div class="absolute top-5 right-0 z-10 xl:right-5">
      <DarkModeToggle compact />
    </div>
    <div class="block xl:grid grid-cols-2 gap-4">
      <!-- BEGIN: Login Info -->
      <div class="hidden xl:flex flex-col min-h-screen">
        <RouterLink to="/" class="-intro-x flex items-center pt-5">
          <img alt="Edutalk" class="w-24" :src="logoEdutalk" />
        </RouterLink>
        <div class="my-auto">
          <img
            alt="Edutalk"
            class="-intro-x w-1/2 -mt-16"
            src="/dist/images/illustration.svg"
          />
          <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
            <slot name="info-title">
              A few more clicks to
              <br />
              sign in to your account.
            </slot>
          </div>
          <div class="-intro-x mt-5 text-lg text-white">
            <slot name="info-description">{{ description }}</slot>
          </div>
        </div>
      </div>
      <!-- END: Login Info -->
      <!-- BEGIN: Login Form -->
      <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
        <div
          class="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
        >
          <slot />
        </div>
      </div>
      <!-- END: Login Form -->
    </div>
  </div>
</template>
