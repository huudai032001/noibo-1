<script setup>
import { ChevronRight } from '../../utils/icons'
import { RouterLink } from 'vue-router'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  light: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="-intro-x breadcrumb mr-auto"
    :class="light ? 'breadcrumb--light' : 'hidden sm:flex'"
  >
    <template v-for="(item, index) in items" :key="index">
      <ChevronRight v-if="index > 0" class="breadcrumb__icon" :size="14" />
      <a v-if="item.active" href="javascript:;" class="breadcrumb--active">{{ item.label }}</a>
      <RouterLink v-else-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
      <a v-else href="javascript:;">{{ item.label }}</a>
    </template>
  </div>
</template>
