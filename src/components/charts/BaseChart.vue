<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  DoughnutController,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
  DoughnutController,
)

const props = defineProps({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  options: { type: Object, default: () => ({}) },
  height: { type: [Number, String], default: 160 },
})

const canvas = ref(null)
let chart = null

function render() {
  if (!canvas.value) return
  if (chart) chart.destroy()
  chart = new Chart(canvas.value, {
    type: props.type,
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options,
    },
  })
}

onMounted(render)
watch(() => [props.type, props.data, props.options], render, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div :style="{ height: typeof height === 'number' ? `${height}px` : height }">
    <canvas ref="canvas" />
  </div>
</template>
