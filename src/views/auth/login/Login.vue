<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { AuthLayout } from '@/components/layout'
import { useAuthStore } from '@/stores/auth'
import { AUTH_ROUTES } from './constants'
import { useLoginForm } from './composables/use-login-form'
import { useLoginRedirect } from './composables/use-login-redirect'
import { useLoginSso } from './composables/use-login-sso'
import type { LoginFormValues } from './models/login.model'

const { form, loading, loginError, resolveFormErrors, submitLogin } = useLoginForm()
const authStore = useAuthStore()
const { errors: storeErrors } = storeToRefs(authStore)
const router = useRouter()
const route = useRoute()
const { redirectIfAuthenticated } = useLoginRedirect(router, route)
useLoginSso(router)

const resolver = ({ values }: { values: LoginFormValues }) => {
  return resolveFormErrors({
    email: String(values.email ?? ''),
    password: String(values.password ?? ''),
  })
}

async function onFormSubmit(event: FormSubmitEvent) {
  const { valid, states } = event
  if (!valid || loading.value) return

  await submitLogin({
    email: String(states.email?.value ?? '').trim(),
    password: String(states.password?.value ?? ''),
  })
}

onMounted(async () => {
  const authenticated = await authStore.isAuthenticated()
  await redirectIfAuthenticated(authenticated)
})
</script>

<template>
  <AuthLayout description="Website dành riêng cho nhân sự tại Edutalk">
    <template #info-title>
      A few more clicks to
      <br />
      sign in to your account
    </template>
    <template #info-description>
      Nền tảng nội bộ quản lý và hỗ trợ nhân sự Edutalk
    </template>

    <div class="w-full xl:w-[350px]">
      <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
        Đăng nhập tài khoản
      </h2>
      <div class="intro-x mt-2 text-slate-500 xl:hidden text-center">
        Chào mừng bạn đến Edutalk — website dành riêng cho
        <span class="text-theme-6">Nhân sự</span> tại Edutalk!
      </div>
      <p class="intro-x mt-2 text-slate-500 hidden xl:block text-sm">
        Website dành riêng cho
        <span class="text-theme-6">Nhân sự</span> tại Edutalk!
      </p>

      <Message
        v-if="loginError || storeErrors"
        severity="error"
        size="small"
        variant="simple"
        class="intro-x mt-4"
      >
        {{ loginError || storeErrors }}
      </Message>

      <Form
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="intro-x mt-6"
        @submit="onFormSubmit"
      >
        <div>
          <InputText
            name="email"
            type="text"
            class="intro-x login__input block w-full px-4 py-3 border border-slate-300"
            :invalid="$form.email?.invalid"
            placeholder="Nhập email hoặc số điện thoại"
          />
          <Message
            v-if="$form.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ $form.email.error?.message }}
          </Message>
        </div>

        <div class="mt-3">
          <InputText
            name="password"
            type="password"
            class="intro-x login__input block w-full px-4 py-3 border border-slate-300"
            :invalid="$form.password?.invalid"
            placeholder="Mật khẩu"
          />
          <Message
            v-if="$form.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
            class="mt-1"
          >
            {{ $form.password.error?.message }}
          </Message>
        </div>

        <div class="flex justify-end text-slate-600 text-xs sm:text-sm mt-3">
          <RouterLink :to="AUTH_ROUTES.forgotPassword" class="text-theme-1 hover:underline">
            Quên mật khẩu?
          </RouterLink>
        </div>

        <div class="mt-4 text-center xl:text-left">
          <Button
            type="submit"
            label="Đăng nhập"
            :loading="loading"
            :disabled="loading"
            class="w-full"
          />
        </div>
      </Form>

      <div class="intro-x mt-8 xl:mt-12 text-slate-600 text-center xl:text-left text-sm">
        2021 © Edutalk by
        <a
          class="text-theme-1"
          href="https://edutalk.edu.vn"
          target="_blank"
          rel="noopener noreferrer"
        >
          edutalk.edu.vn
        </a>
      </div>
    </div>
  </AuthLayout>
</template>
