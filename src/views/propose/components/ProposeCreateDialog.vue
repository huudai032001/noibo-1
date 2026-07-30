<script setup lang="ts">
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { computed } from 'vue'
import { useFormatter } from '@/composables/use-formatter'
import {
  PROPOSE_CATEGORY,
  PROPOSE_LEAVE_TYPE_OPTIONS,
  PROPOSE_SHIFT_OFF_OPTIONS,
  PROPOSE_TYPE_APPLICATION_OPTIONS,
  PROPOSE_WORK_SHIFT_OPTIONS,
} from '../constants'
import type { ProposeFormState, ProposeProfileUser } from '../models/propose.model'
import { getDepartmentLabel } from '../utils/propose-helpers'

const props = defineProps<{
  visible: boolean
  formState: ProposeFormState
  profileUser: ProposeProfileUser | null
  editPhoneNumber: boolean
  loadingCreate: boolean
  categoryTitle: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:formState': [value: ProposeFormState]
  'update:editPhoneNumber': [value: boolean]
  'category-change': [category: number]
  submit: []
  'validate-general-leave': []
  'validate-date-range': []
  'validate-time-range': []
  'validate-shift-change': []
  'validate-phone': [phone: string]
}>()

const { formatEmployeeCode } = useFormatter()

const departmentLabel = computed(() =>
  getDepartmentLabel(
    props.profileUser?.department?.department?.type,
    'Nhóm',
  ),
)

const minSelectableDate = computed(() => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)
})

function updateField<K extends keyof ProposeFormState>(
  field: K,
  value: ProposeFormState[K],
): void {
  emit('update:formState', {
    ...props.formState,
    [field]: value,
  })
}

function onCategoryChange(category: number): void {
  emit('category-change', category)
}

function onPhoneFocus(): void {
  emit('update:editPhoneNumber', true)
}

function onPhoneBlur(): void {
  emit('validate-phone', props.formState.phone)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="`Thêm mới đề xuất: ${categoryTitle}`"
    class="w-full max-w-5xl"
    :style="{ width: '95vw', maxWidth: '64rem' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="space-y-5">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Bạn đang sử dụng mẫu:</span>
        <Select
          :model-value="formState.category"
          :options="[...PROPOSE_TYPE_APPLICATION_OPTIONS]"
          option-label="type"
          option-value="id"
          placeholder="Mẫu đơn"
          class="w-full sm:max-w-xs"
          @update:model-value="onCategoryChange($event as number)"
        />
      </div>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Mã nhân sự</label>
          <InputText
            v-if="profileUser"
            :model-value="String(formatEmployeeCode(profileUser.id))"
            disabled
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Họ và tên</label>
          <InputText :model-value="profileUser?.name ?? ''" disabled fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Vị trí</label>
          <InputText
            :model-value="profileUser?.profile?.accountType?.name ?? ''"
            disabled
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ departmentLabel }}</label>
          <InputText
            :model-value="profileUser?.department?.department?.name ?? ''"
            disabled
            fluid
          />
        </div>
      </section>

      <section v-if="formState.category === PROPOSE_CATEGORY.leave" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tổng số công nghỉ phép <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <InputNumber
              :model-value="formState.generalLeave"
              :min-fraction-digits="0"
              :max-fraction-digits="1"
              :step="0.5"
              placeholder="Tổng số công nghỉ phép"
              fluid
              @update:model-value="updateField('generalLeave', $event as number | null)"
              @blur="emit('validate-general-leave')"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ngày bắt đầu nghỉ phép <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <DatePicker
              :model-value="formState.startDate"
              date-format="dd/mm/yy"
              placeholder="Chọn ngày"
              show-icon
              fluid
              :min-date="minSelectableDate"
              @update:model-value="updateField('startDate', $event as Date | null)"
              @date-select="emit('validate-date-range')"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Buổi bắt đầu nghỉ phép <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <Select
              :model-value="formState.startShiftOff"
              :options="[...PROPOSE_SHIFT_OFF_OPTIONS]"
              option-label="label"
              option-value="value"
              placeholder="Chọn ca bắt đầu nghỉ"
              show-clear
              fluid
              @update:model-value="updateField('startShiftOff', $event as number | null)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ngày kết thúc nghỉ phép <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <DatePicker
              :model-value="formState.endDate"
              date-format="dd/mm/yy"
              placeholder="Chọn ngày"
              show-icon
              fluid
              @update:model-value="updateField('endDate', $event as Date | null)"
              @date-select="emit('validate-date-range')"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Lý do nghỉ phép <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <Textarea
            :model-value="formState.reason"
            rows="4"
            maxlength="500"
            placeholder="Nhập lý do nghỉ phép"
            fluid
            @update:model-value="updateField('reason', $event ?? '')"
          />
        </div>

        <div class="flex flex-col gap-3">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Loại nghỉ phép <span class="text-red-500 dark:text-red-400">*</span>
          </span>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="option in PROPOSE_LEAVE_TYPE_OPTIONS"
              :key="option.value"
              class="flex items-center gap-2"
            >
              <RadioButton
                :input-id="`leave-type-${option.value}`"
                :value="option.value"
                :model-value="formState.typeLeave"
                @update:model-value="updateField('typeLeave', $event as number)"
              />
              <label :for="`leave-type-${option.value}`" class="text-sm text-slate-700 dark:text-slate-300">
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>

        <p class="text-sm text-red-500 dark:text-red-400">
          Lưu ý: Sau khi nhân sự sử dụng hết ngày phép, thời gian nghỉ sẽ được tính là nghỉ không
          lương.
        </p>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Số điện thoại liên hệ khi cần <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <InputText
            v-if="!editPhoneNumber"
            :model-value="profileUser?.phone ?? ''"
            fluid
            @focus="onPhoneFocus"
          />
          <InputText
            v-else
            :model-value="formState.phone"
            placeholder="Nhập số điện thoại liên hệ"
            fluid
            @update:model-value="updateField('phone', $event ?? '')"
            @blur="onPhoneBlur"
          />
        </div>
      </section>

      <section
        v-else-if="
          formState.category === PROPOSE_CATEGORY.overtime ||
          formState.category === PROPOSE_CATEGORY.offSiteHours
        "
        class="space-y-4"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ formState.category === PROPOSE_CATEGORY.overtime ? 'Ngày tăng ca' : 'Ngày cần bổ sung' }}
              <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <DatePicker
              :model-value="formState.startDate"
              date-format="dd/mm/yy"
              placeholder="Chọn ngày"
              show-icon
              fluid
              :min-date="minSelectableDate"
              @update:model-value="updateField('startDate', $event as Date | null)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Giờ bắt đầu <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <DatePicker
              :model-value="formState.timeCheckin"
              time-only
              hour-format="24"
              placeholder="Chọn giờ"
              show-icon
              fluid
              @update:model-value="updateField('timeCheckin', $event as Date | null)"
              @hide="emit('validate-time-range')"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Giờ kết thúc <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <DatePicker
              :model-value="formState.timeCheckout"
              time-only
              hour-format="24"
              placeholder="Chọn giờ"
              show-icon
              fluid
              @update:model-value="updateField('timeCheckout', $event as Date | null)"
              @hide="emit('validate-time-range')"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            {{
              formState.category === PROPOSE_CATEGORY.overtime
                ? 'Lý do tăng ca'
                : 'Lý do bổ sung'
            }}
            <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <Textarea
            :model-value="formState.reason"
            rows="4"
            maxlength="500"
            :placeholder="
              formState.category === PROPOSE_CATEGORY.overtime
                ? 'Nhập lý do tăng ca'
                : 'Nhập lý do bổ sung'
            "
            fluid
            @update:model-value="updateField('reason', $event ?? '')"
          />
        </div>
      </section>

      <section v-else-if="formState.category === PROPOSE_CATEGORY.shiftChange" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ngày đổi ca <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <DatePicker
              :model-value="formState.startDate"
              date-format="dd/mm/yy"
              placeholder="Chọn ngày"
              show-icon
              fluid
              :min-date="minSelectableDate"
              @update:model-value="updateField('startDate', $event as Date | null)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ca hiện tại <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <Select
              :model-value="formState.currentWorkingHours"
              :options="[...PROPOSE_WORK_SHIFT_OPTIONS]"
              option-label="label"
              option-value="value"
              placeholder="Chọn ca hiện tại"
              show-clear
              fluid
              @update:model-value="updateField('currentWorkingHours', $event as number | null)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Ca thay đổi <span class="text-red-500 dark:text-red-400">*</span>
            </label>
            <Select
              :model-value="formState.currentWorkingChange"
              :options="[...PROPOSE_WORK_SHIFT_OPTIONS]"
              option-label="label"
              option-value="value"
              placeholder="Chọn ca thay đổi"
              show-clear
              fluid
              @update:model-value="updateField('currentWorkingChange', $event as number | null)"
              @change="emit('validate-shift-change')"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Lý do đổi ca <span class="text-red-500 dark:text-red-400">*</span>
          </label>
          <Textarea
            :model-value="formState.reason"
            rows="4"
            maxlength="500"
            placeholder="Nhập lý do đổi ca"
            fluid
            @update:model-value="updateField('reason', $event ?? '')"
          />
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          label="Huỷ bỏ"
          severity="secondary"
          outlined
          @click="emit('update:visible', false)"
        />
        <Button
          type="button"
          label="Gửi yêu cầu"
          icon="pi pi-send"
          :loading="loadingCreate"
          @click="emit('submit')"
        />
      </div>
    </template>
  </Dialog>
</template>
