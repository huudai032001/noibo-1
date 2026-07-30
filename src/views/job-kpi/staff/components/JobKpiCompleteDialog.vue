<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  isHappy: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const title = computed(() => (props.isHappy ? 'Xuất sắc!' : 'Chúc mừng!'))

const message = computed(() =>
  props.isHappy
    ? 'Bạn đã hoàn thành 100% KRA trong tháng này. Tiếp tục phát huy nhé!'
    : 'Bạn đã hoàn thành KRA. Hãy cố gắng đạt 100% ở các kỳ tiếp theo.',
)

function closeDialog(): void {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :show-header="false"
    class="w-[95vw] max-w-md overflow-hidden"
    :closable="false"
    :draggable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="relative overflow-hidden px-2 pb-1 pt-4 text-center">
      <div
        class="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full blur-2xl"
        :class="isHappy ? 'bg-emerald-300/40' : 'bg-[rgba(var(--app-primary-rgb),0.25)]'"
      />
      <div
        class="pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full blur-2xl"
        :class="isHappy ? 'bg-amber-200/50' : 'bg-sky-200/40'"
      />

      <div class="relative">
        <span
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
          :class="
            isHappy
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-[rgba(var(--app-primary-rgb),0.1)] text-[var(--app-primary)]'
          "
        >
          <i :class="isHappy ? 'pi pi-trophy' : 'pi pi-sparkles'" class="text-2xl" />
        </span>

        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
          {{ message }}
        </p>

        <div class="mt-5 flex justify-center">
          <Button
            type="button"
            :label="isHappy ? 'Tuyệt vời' : 'Đã hiểu'"
            :severity="isHappy ? 'success' : undefined"
            @click="closeDialog"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>
