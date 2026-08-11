import { ref } from 'vue'

export function useHumanResourceUi() {
  const isFullTree = ref(false)
  const isFullDetail = ref(false)
  const isLoadingGDKV = ref(false)

  const pickerOptions = {
    disabledDate(time: Date) {
      return time.getTime() > Date.now()
    },
  }

  const toggleFullTree = () => {
    isFullTree.value = !isFullTree.value
  }

  const toggleFullDetail = () => {
    isFullDetail.value = !isFullDetail.value
  }

  return {
    isFullTree,
    isFullDetail,
    isLoadingGDKV,
    pickerOptions,
    toggleFullTree,
    toggleFullDetail,
  }
}
