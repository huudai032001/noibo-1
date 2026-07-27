<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'error'
    title: string
  }>(),
  {
    type: 'success',
  },
)

const isSuccess = computed(() => props.type === 'success')
</script>

<template>
  <div class="flex flex-col items-center px-2 py-4 text-center">
    <div
      class="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
      :class="isSuccess ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'"
    >
      <i
        class="text-3xl"
        :class="isSuccess ? 'pi pi-check-circle' : 'pi pi-times-circle'"
      />
    </div>

    <h2
      class="m-0 text-lg font-bold"
      :class="isSuccess ? 'text-emerald-600' : 'text-red-600'"
    >
      {{ title }}
    </h2>

    <div v-if="$slots.default" class="mt-3 text-sm text-slate-600">
      <slot />
    </div>
  </div>
</template>
