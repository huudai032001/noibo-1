import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  createPropose,
  decidePropose,
  deletePropose,
  fetchDepartments,
  fetchProposeApprovalList,
  fetchProposeDetail,
  fetchProposeListByDepartment,
  fetchUserProfile,
} from '../services/propose.service'
import { PROPOSE_ACCOUNT_ROLES, PROPOSE_CATEGORY } from '../constants'
import type {
  ProposeApprovalRoleFlags,
  ProposeItem,
  ProposeProfileUser,
} from '../models/propose.model'

interface ProposeFetchState {
  items: Ref<ProposeItem[]>
  profileUser: Ref<ProposeProfileUser | null>
  setItems: (items: ProposeItem[]) => void
  setLoading: (value: boolean) => void
  setLoadingSearch: (value: boolean) => void
  setLoadingAction: (value: boolean) => void
  setLoadingCreate: (value: boolean) => void
  setError: (message: string) => void
  clearError: () => void
  setProfileUser: (user: ProposeProfileUser | null) => void
  setDepartments: (departments: { id: number; name: string }[]) => void
}

interface ProposeFetchPagination {
  currentPage: Ref<number>
  setTotal: (value: number) => void
  setLastPage: (value: number) => void
}

interface ProposeFetchFilter {
  buildQueryParams: (page: number) => import('../models/propose.model').ProposeListQuery
}

function resolvePrimaryDepartment(user: ProposeProfileUser): ProposeProfileUser {
  const primaryDepartment = user.useDepartment?.find(
    (item) => item.userProfileAccount?.type === 1,
  )
  return {
    ...user,
    department: primaryDepartment ?? user.department,
  }
}

export function resolveApprovalRoles(user: ProposeProfileUser | null): ProposeApprovalRoleFlags {
  const roleName = user?.profile?.accountType?.name ?? ''
  const isBod = roleName === PROPOSE_ACCOUNT_ROLES.bod
  const isTbp = roleName === PROPOSE_ACCOUNT_ROLES.departmentHead
  const isLeader = roleName === PROPOSE_ACCOUNT_ROLES.teamLead

  return {
    isBod,
    isTbp,
    isLeader,
    canCreate: !isBod && !isTbp && !isLeader,
  }
}

export function useProposeFetch(
  state: ProposeFetchState,
  pagination: ProposeFetchPagination,
  filter: ProposeFetchFilter,
) {
  const toast = useToast()

  function showSuccess(message: string): void {
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 4000,
    })
  }

  function showError(message: string): void {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 5000,
    })
  }

  async function loadEmployeeList(): Promise<void> {
    const softReload = state.items.value.length > 0
    if (!softReload) state.setLoading(true)
    state.setLoadingSearch(true)
    state.clearError()

    try {
      const response = await fetchProposeListByDepartment(
        filter.buildQueryParams(pagination.currentPage.value),
      )
      const payload = response.data
      state.setItems(payload?.data ?? [])
      pagination.setTotal(payload?.total ?? 0)
      pagination.setLastPage(payload?.lastPage ?? 1)
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tải danh sách đề xuất.'
      state.setError(message)
      state.setItems([])
      pagination.setTotal(0)
      pagination.setLastPage(1)
      showError(message)
    } finally {
      state.setLoading(false)
      state.setLoadingSearch(false)
    }
  }

  async function loadApprovalList(): Promise<void> {
    const softReload = state.items.value.length > 0
    if (!softReload) state.setLoading(true)
    state.setLoadingSearch(true)
    state.clearError()

    try {
      const response = await fetchProposeApprovalList(
        filter.buildQueryParams(pagination.currentPage.value),
      )
      state.setItems(response.data ?? [])
      pagination.setTotal(response.pagination?.total ?? 0)
      pagination.setLastPage(response.pagination?.lastPage ?? 1)
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể tải danh sách duyệt đề xuất.'
      state.setError(message)
      state.setItems([])
      pagination.setTotal(0)
      pagination.setLastPage(1)
      showError(message)
    } finally {
      state.setLoading(false)
      state.setLoadingSearch(false)
    }
  }

  async function loadProfile(): Promise<ProposeApprovalRoleFlags> {
    try {
      const response = await fetchUserProfile()
      const rawUser =
        'data' in response && response.data
          ? response.data
          : (response as unknown as ProposeProfileUser)
      const user = rawUser?.id ? resolvePrimaryDepartment(rawUser) : null
      state.setProfileUser(user)
      return resolveApprovalRoles(user)
    } catch {
      state.setProfileUser(null)
      return resolveApprovalRoles(null)
    }
  }

  async function loadDepartments(): Promise<void> {
    try {
      const departments = await fetchDepartments()
      state.setDepartments(departments ?? [])
    } catch {
      state.setDepartments([])
    }
  }

  async function submitCreate(
    payload: import('../models/propose.model').ProposeCreatePayload,
  ): Promise<boolean> {
    state.setLoadingCreate(true)
    try {
      await createPropose(payload)
      showSuccess('Gửi yêu cầu thành công')
      return true
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tạo yêu cầu thất bại'
      showError(message)
      return false
    } finally {
      state.setLoadingCreate(false)
    }
  }

  async function submitDelete(id: number): Promise<boolean> {
    state.setLoadingAction(true)
    try {
      await deletePropose(id)
      showSuccess('Xoá yêu cầu thành công')
      return true
    } catch {
      showError('Xoá yêu cầu thất bại')
      return false
    } finally {
      state.setLoadingAction(false)
    }
  }

  async function submitDecide(payload: {
    id: number
    status: boolean
    reasonForRefusal?: string
    typeArise?: number
  }): Promise<boolean> {
    state.setLoadingAction(true)
    try {
      await decidePropose(payload)
      showSuccess(payload.status ? 'Duyệt yêu cầu thành công' : 'Từ chối yêu cầu thành công')
      return true
    } catch {
      showError(payload.status ? 'Duyệt yêu cầu thất bại' : 'Từ chối yêu cầu thất bại')
      return false
    } finally {
      state.setLoadingAction(false)
    }
  }

  async function loadFingerprint(item: ProposeItem): Promise<{ start: string; end: string }> {
    if (item.category !== PROPOSE_CATEGORY.overtime || !item.startDate) {
      return { start: '', end: '' }
    }

    try {
      const response = await fetchProposeDetail({
        id: item.id,
        category: item.category,
        startDate: item.startDate,
      })
      return {
        start: response.fingerprintAttendanceStart ?? '',
        end: response.fingerprintAttendanceEnd ?? '',
      }
    } catch {
      return { start: '', end: '' }
    }
  }

  return {
    loadEmployeeList,
    loadApprovalList,
    loadProfile,
    loadDepartments,
    submitCreate,
    submitDelete,
    submitDecide,
    loadFingerprint,
    resolveApprovalRoles,
    showWarning: (message: string) => {
      toast.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: message,
        life: 4000,
      })
    },
  }
}
