<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { AuthLayout } from '../components/layout'

const router = useRouter()
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm: '',
  agree: false,
})

function onSubmit() {
  router.push('/')
}
</script>

<template>
  <AuthLayout>
    <template #info-title>
      A few more clicks to
      <br />
      sign up to your account.
    </template>
    <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
      Sign Up
    </h2>
    <div class="intro-x mt-2 text-gray-500 xl:hidden text-center">
      A few more clicks to sign in to your account. Manage all your e-commerce accounts in one place
    </div>
    <form @submit.prevent="onSubmit">
      <div class="intro-x mt-8">
        <input
          v-model="form.firstName"
          type="text"
          class="intro-x login__input input input--lg border border-gray-300 block"
          placeholder="First Name"
        />
        <input
          v-model="form.lastName"
          type="text"
          class="intro-x login__input input input--lg border border-gray-300 block mt-4"
          placeholder="Last Name"
        />
        <input
          v-model="form.email"
          type="text"
          class="intro-x login__input input input--lg border border-gray-300 block mt-4"
          placeholder="Email"
        />
        <input
          v-model="form.password"
          type="password"
          class="intro-x login__input input input--lg border border-gray-300 block mt-4"
          placeholder="Password"
        />
        <div class="intro-x w-full grid grid-cols-12 gap-4 h-1 mt-3">
          <div class="col-span-3 h-full rounded bg-theme-9"></div>
          <div class="col-span-3 h-full rounded bg-theme-9"></div>
          <div class="col-span-3 h-full rounded bg-theme-9"></div>
          <div class="col-span-3 h-full rounded bg-gray-200"></div>
        </div>
        <a href="javascript:;" class="intro-x text-gray-600 block mt-2 text-xs sm:text-sm">
          What is a secure password?
        </a>
        <input
          v-model="form.confirm"
          type="password"
          class="intro-x login__input input input--lg border border-gray-300 block mt-4"
          placeholder="Password Confirmation"
        />
      </div>
      <div class="intro-x flex items-center text-gray-700 mt-4 text-xs sm:text-sm">
        <input
          id="remember-me"
          v-model="form.agree"
          type="checkbox"
          class="input border mr-2"
        />
        <label class="cursor-pointer select-none" for="remember-me">I agree to the Envato</label>
        <a class="text-theme-1 ml-1" href="javascript:;">Privacy Policy</a>.
      </div>
      <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
        <button type="submit" class="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3">
          Register
        </button>
        <RouterLink
          to="/login"
          class="button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0 inline-flex items-center justify-center"
        >
          Sign in
        </RouterLink>
      </div>
    </form>
  </AuthLayout>
</template>
