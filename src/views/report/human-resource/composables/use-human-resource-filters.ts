import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { SALARY_MECHANISMS } from '../constants'
import type { Area, Branch, SalaryMechanism } from '../models/human-resource.model'

export interface HumanResourceFilters {
  branchId: number | null
  areaId: number | null
  year: string | null
  salaryMechanismId: number | null
}

export function useHumanResourceFilters() {
  const form: Ref<HumanResourceFilters> = ref({
    branchId: null,
    areaId: null,
    year: null,
    salaryMechanismId: null,
  })

  const branches: Ref<Branch[]> = ref([])
  const areas: Ref<Area[]> = ref([])
  const mechanisms: Ref<SalaryMechanism[]> = ref(SALARY_MECHANISMS as SalaryMechanism[])

  const isValidBranch = computed(() => form.value.branchId !== null)

  const resetFilters = () => {
    form.value = {
      branchId: null,
      areaId: null,
      year: null,
      salaryMechanismId: null,
    }
  }

  return {
    form,
    branches,
    areas,
    mechanisms,
    isValidBranch,
    resetFilters,
  }
}
