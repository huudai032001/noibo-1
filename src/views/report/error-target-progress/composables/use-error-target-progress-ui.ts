import { ref } from 'vue'

export function useErrorTargetProgressUI() {
  const isFullscreen = ref(false)
  const isTableFullscreen = ref(false)
  const showDialog = ref(false)
  const selectedRow = ref<any>(null)

  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }

  const toggleTableFullscreen = () => {
    isTableFullscreen.value = !isTableFullscreen.value
  }

  const openDialog = (row?: any) => {
    selectedRow.value = row || null
    showDialog.value = true
  }

  const closeDialog = () => {
    showDialog.value = false
    selectedRow.value = null
  }

  return {
    isFullscreen,
    isTableFullscreen,
    showDialog,
    selectedRow,
    toggleFullscreen,
    toggleTableFullscreen,
    openDialog,
    closeDialog,
  }
}
