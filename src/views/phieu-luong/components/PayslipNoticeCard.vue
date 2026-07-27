<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isBackOffice: boolean
}>()

const expanded = ref(false)
</script>

<template>
  <aside class="payslip-notice">
    <button
      type="button"
      class="payslip-notice__toggle"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <span class="payslip-notice__toggle-main">
        <i class="pi pi-shield"></i>
        Lưu ý bảo mật thông tin
      </span>
      <i :class="['pi', expanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
    </button>

    <div v-show="expanded" class="payslip-notice__body">
      <template v-if="isBackOffice">
        <p>Đề nghị CBNV bảo mật thông tin thu nhập của mình.</p>
        <p>Mọi thắc mắc vui lòng liên hệ Phòng Nhân sự.</p>
      </template>
      <template v-else>
        <p>Đề nghị nhân sự bảo mật thông tin thu nhập của mình.</p>
        <p>Mọi thắc mắc vui lòng liên hệ Trung tâm hỗ trợ theo cú pháp:</p>
        <ul>
          <li>Họ và tên + Mã TV</li>
          <li>Tên văn phòng</li>
          <li>Chi tiết vấn đề cần giải đáp</li>
        </ul>
      </template>
      <p class="payslip-notice__footer">Cảm ơn sự đóng góp của bạn vào kết quả chung của Công ty.</p>
    </div>
  </aside>
</template>

<style scoped>
.payslip-notice {
  margin-top: 1rem;
  border: 1px solid #fde68a;
  border-radius: var(--pl-radius, 12px);
  background: #fffbeb;
  overflow: hidden;
}

.payslip-notice__toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #92400e;
  cursor: pointer;
}

.payslip-notice__toggle-main {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.payslip-notice__toggle-main .pi-shield {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 8px;
  background: #fef3c7;
  font-size: 0.875rem;
}

.payslip-notice__body {
  padding: 0 1.25rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #78350f;
}

.payslip-notice__body p {
  margin: 0 0 0.5rem;
}

.payslip-notice__body ul {
  margin: 0.25rem 0 0.75rem;
  padding-left: 1.25rem;
}

.payslip-notice__body li {
  margin-bottom: 0.25rem;
}

.payslip-notice__footer {
  margin-top: 0.5rem !important;
  font-size: 0.75rem;
  color: #a16207;
}
</style>
