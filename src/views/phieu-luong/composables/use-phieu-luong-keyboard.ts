import { onMounted, onUnmounted, type Ref } from 'vue'

export function usePhieuLuongKeyboard(
  selectedDate: Ref<Date>,
  onMonthChange: (date: Date) => void,
  options?: { disabled?: Ref<boolean> },
) {
  function canGoNext(date: Date): boolean {
    const now = new Date()
    const current = new Date(date.getFullYear(), date.getMonth(), 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return current < thisMonth
  }

  function shiftMonth(offset: number): void {
    const next = new Date(selectedDate.value)
    next.setMonth(next.getMonth() + offset)

    if (offset > 0 && !canGoNext(selectedDate.value)) return

    onMonthChange(next)
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (options?.disabled?.value) return

    const target = event.target
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      shiftMonth(-1)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      shiftMonth(1)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })

  return { shiftMonth, canGoNext }
}
