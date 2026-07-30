<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import type { ManageOkrsShareExpRow } from '../models/manage-okrs.model'

const props = defineProps<{
  visible: boolean
  loading: boolean
  title: string
  totalExpTarget: number
  initialRows: ManageOkrsShareExpRow[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [rows: ManageOkrsShareExpRow[]]
}>()

const rows = ref<ManageOkrsShareExpRow[]>([])

watch(
  () => [props.visible, props.initialRows] as const,
  () => {
    if (!props.visible) return
    rows.value = props.initialRows.map((item) => ({ ...item }))
  },
  { immediate: true, deep: true },
)

const totalExp = computed(() => rows.value.reduce((sum, row) => sum + Number(row.exp ?? 0), 0))

const remainingExp = computed(() => props.totalExpTarget - totalExp.value)

const allocationPercent = computed(() => {
  if (!props.totalExpTarget) return 0
  const percent = Math.round((totalExp.value / props.totalExpTarget) * 100)
  if (percent < 0) return 0
  if (percent > 100) return 100
  return percent
})

const disableSubmit = computed(() => {
  const hasAnyPositive = rows.value.some((row) => Number(row.exp ?? 0) > 0)
  return !hasAnyPositive || remainingExp.value < 0
})

function closeDialog(): void {
  emit('update:visible', false)
}

function submit(): void {
  emit('submit', rows.value.map((item) => ({ ...item })))
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :closable="!loading"
    :dismissable-mask="!loading"
    :header="title"
    class="manage-okr-share-exp-dialog w-[95vw] max-w-4xl"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
      <p>
        Số EXP còn lại:
        <span class="font-semibold" :class="remainingExp < 0 ? 'text-red-600' : 'text-emerald-600'">
          {{ remainingExp }}
        </span>
      </p>
      <p>
        Tổng EXP:
        <span class="font-semibold text-[var(--app-primary)]">{{ totalExpTarget }}</span>
      </p>
    </div>

    <div class="mb-4 space-y-1.5">
      <div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          class="h-full rounded-full transition-all"
          :class="remainingExp < 0 ? 'bg-red-500' : 'bg-emerald-500'"
          :style="{ width: `${allocationPercent}%` }"
        />
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Đã phân bổ {{ totalExp }} / {{ totalExpTarget }} EXP ({{ allocationPercent }}%)
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-[760px] w-full rounded-xl border border-slate-200 dark:border-slate-700">
        <thead class="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
          <tr class="text-left text-sm">
            <th class="px-3 py-2.5">Nhân sự</th>
            <th class="px-3 py-2.5 w-[140px]">EXP</th>
            <th class="px-3 py-2.5">Nhận xét</th>
          </tr>
        </thead>
        <tbody class="bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <tr
            v-for="item in rows"
            :key="item.id"
            class="border-t border-slate-100 text-sm dark:border-slate-700"
          >
            <td class="px-3 py-2.5 text-slate-700 dark:text-slate-200">{{ item.name }}</td>
            <td class="px-3 py-2.5">
              <InputNumber
                v-model="item.exp"
                input-class="w-full"
                :use-grouping="false"
                :min="0"
                fluid
                size="small"
              />
            </td>
            <td class="px-3 py-2.5">
              <InputText v-model="item.feedback" fluid size="small" placeholder="Nhập nhận xét" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Hủy" severity="secondary" text :disabled="loading" @click="closeDialog" />
        <Button
          label="Lưu thông tin"
          icon="pi pi-save"
          :loading="loading"
          :disabled="disableSubmit"
          @click="submit"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.manage-okr-share-exp-dialog :deep(.p-dialog-content) {
  color: #334155;
}

.manage-okr-share-exp-dialog :deep(tbody td) {
  color: #334155 !important;
}

.manage-okr-share-exp-dialog :deep(.p-inputtext),
.manage-okr-share-exp-dialog :deep(.p-inputnumber-input) {
  color: #334155 !important;
}

.manage-okr-share-exp-dialog :deep(.p-inputtext::placeholder),
.manage-okr-share-exp-dialog :deep(.p-inputnumber-input::placeholder) {
  color: #94a3b8;
}

:global(html.dark) .manage-okr-share-exp-dialog :deep(.p-dialog-content) {
  color: #e2e8f0;
}

:global(html.dark) .manage-okr-share-exp-dialog :deep(tbody td),
:global(html.dark) .manage-okr-share-exp-dialog :deep(.p-inputtext),
:global(html.dark) .manage-okr-share-exp-dialog :deep(.p-inputnumber-input) {
  color: #e2e8f0 !important;
}

:global(html.dark) .manage-okr-share-exp-dialog :deep(.p-inputtext::placeholder),
:global(html.dark) .manage-okr-share-exp-dialog :deep(.p-inputnumber-input::placeholder) {
  color: #94a3b8;
}
</style>
