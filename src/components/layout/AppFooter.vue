<script setup>
defineProps({
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
})
</script>

<template>
  <footer class="app-footer">
    <slot>
      Copyright &copy; {{ year }}
      <span class="font-medium text-theme-1">Edutalk</span>
    </slot>
  </footer>
</template>
