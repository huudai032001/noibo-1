<script setup lang="ts">
import { computed } from 'vue'
import logoEdutalk from '@/assets/logo_edutalk.svg'

export type ConfirmSmsPageState =
  | 'loading'
  | 'error'
  | 'confirm'
  | 'success'
  | 'warning'
  | 'result'

const props = defineProps<{
  pageState: ConfirmSmsPageState
}>()

const headerMeta = computed(() => {
  switch (props.pageState) {
    case 'loading':
      return {
        icon: 'pi pi-spin pi-spinner',
        title: 'Đang tải thông tin',
        subtitle: 'Vui lòng đợi trong giây lát',
      }
    case 'error':
      return {
        icon: 'pi pi-exclamation-triangle',
        title: 'Không tải được dữ liệu',
        subtitle: 'Không thể lấy thông tin lịch hẹn',
      }
    case 'confirm':
      return {
        icon: 'pi pi-microphone',
        title: 'Xác nhận ca test speaking',
        subtitle: 'Kiểm tra và xác nhận lịch hẹn',
      }
    case 'success':
      return {
        icon: 'pi pi-check-circle',
        title: 'Hoàn tất',
        subtitle: 'Lịch hẹn đã được cập nhật',
      }
    case 'warning':
      return {
        icon: 'pi pi-exclamation-circle',
        title: 'Không khả dụng',
        subtitle: 'Liên kết xác nhận đã hết hiệu lực',
      }
    default:
      return {
        icon: 'pi pi-info-circle',
        title: 'Trạng thái lịch hẹn',
        subtitle: 'Thông tin cập nhật mới nhất',
      }
  }
})
</script>

<template>
  <div class="confirm-sms-page">
    <div class="confirm-sms-page__inner">
      <div class="confirm-sms-card">
        <header
          class="confirm-sms-card__header"
          :class="`confirm-sms-card__header--${pageState}`"
        >
          <img alt="Edutalk" class="confirm-sms-card__logo" :src="logoEdutalk" />

          <div class="confirm-sms-card__icon-wrap">
            <i :class="headerMeta.icon" />
          </div>

          <h1 class="confirm-sms-card__title">{{ headerMeta.title }}</h1>
          <p class="confirm-sms-card__subtitle">{{ headerMeta.subtitle }}</p>
        </header>

        <main class="confirm-sms-card__body">
          <slot />
        </main>
      </div>

      <p class="confirm-sms-page__footer">© Edutalk — Hệ thống nội bộ</p>
    </div>
  </div>
</template>

<style scoped>
.confirm-sms-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: linear-gradient(160deg, #eef2ff 0%, #f8fafc 45%, #fef3c7 100%);
  padding: 1.5rem 1rem 2rem;
}

.confirm-sms-page__inner {
  margin: 0 auto;
  max-width: 26rem;
  min-height: calc(100dvh - 3.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.confirm-sms-card {
  overflow: hidden;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow:
    0 4px 6px -1px rgba(15, 23, 42, 0.06),
    0 20px 50px -12px rgba(15, 23, 42, 0.18);
}

.confirm-sms-card__header {
  padding: 1.75rem 1.5rem 1.5rem;
  text-align: center;
}

.confirm-sms-card__header--loading {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
}

.confirm-sms-card__header--error {
  background: linear-gradient(135deg, #e11d48, #dc2626);
  color: #fff;
}

.confirm-sms-card__header--confirm {
  background: linear-gradient(135deg, #f9c74f, #f3b942);
  color: #4a3f6b;
}

.confirm-sms-card__header--success {
  background: linear-gradient(135deg, #10b981, #0d9488);
  color: #fff;
}

.confirm-sms-card__header--warning {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: #fff;
}

.confirm-sms-card__header--result {
  background: linear-gradient(135deg, #475569, #334155);
  color: #fff;
}

.confirm-sms-card__logo {
  height: 2rem;
  width: auto;
  margin: 0 auto 1.25rem;
  display: block;
}

.confirm-sms-card__header--confirm .confirm-sms-card__logo {
  filter: brightness(0) saturate(100%) invert(28%) sepia(18%) saturate(1200%) hue-rotate(219deg)
    brightness(95%) contrast(90%);
}

.confirm-sms-card__header--loading .confirm-sms-card__logo,
.confirm-sms-card__header--error .confirm-sms-card__logo,
.confirm-sms-card__header--success .confirm-sms-card__logo,
.confirm-sms-card__header--warning .confirm-sms-card__logo,
.confirm-sms-card__header--result .confirm-sms-card__logo {
  filter: brightness(0) invert(1);
  opacity: 0.95;
}

.confirm-sms-card__icon-wrap {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 0.875rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.confirm-sms-card__header--confirm .confirm-sms-card__icon-wrap {
  background: rgba(255, 255, 255, 0.92);
  color: #65558f;
  box-shadow: 0 4px 14px rgba(101, 85, 143, 0.15);
}

.confirm-sms-card__header--loading .confirm-sms-card__icon-wrap,
.confirm-sms-card__header--error .confirm-sms-card__icon-wrap,
.confirm-sms-card__header--success .confirm-sms-card__icon-wrap,
.confirm-sms-card__header--warning .confirm-sms-card__icon-wrap,
.confirm-sms-card__header--result .confirm-sms-card__icon-wrap {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.confirm-sms-card__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.35;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.confirm-sms-card__subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  opacity: 0.85;
  line-height: 1.45;
}

.confirm-sms-card__body {
  padding: 1.25rem 1.25rem 1.5rem;
}

.confirm-sms-page__footer {
  margin: 1.25rem 0 0;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
