import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { MANAGE_OKRS_STATUS_OPTIONS, MANAGE_OKRS_TYPE_OPTIONS } from '../constants'
import type {
  ManageOkrsFormData,
  ManageOkrsHuman,
  ManageOkrsItemApi,
  ManageOkrsListItem,
  ManageOkrsShareExpRow,
} from '../models/manage-okrs.model'
import {
  createManageOkr,
  fetchManageOkrDetail,
  fetchManageOkrsList,
  filterManageOkrUsers,
  shareManageOkrExp,
  updateManageOkr,
  updateManageOkrStatus,
} from '../services/manage-okrs.service'
import { useManageOkrsDialogs } from './use-manage-okrs-dialogs'
import { useManageOkrsFilters } from './use-manage-okrs-filters'
import { useManageOkrsPagination } from './use-manage-okrs-pagination'

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback
  const maybeResponse = error as {
    data?: { message?: string }
    response?: { data?: { message?: string } }
    message?: string
  }
  return (
    maybeResponse.data?.message ||
    maybeResponse.response?.data?.message ||
    maybeResponse.message ||
    fallback
  )
}

function getQuarterLabel(quarter: number | undefined, year: number | undefined): string {
  if (!quarter || !year) return ''
  return `Quý ${quarter}/${year}`
}

function getTypeLabel(type: number | undefined): string {
  const option = MANAGE_OKRS_TYPE_OPTIONS.find((item) => item.value === type)
  return option?.label.replace('OKR ', '') ?? ''
}

function getTypeClass(type: number | undefined): string {
  if (type === 1) return 'text-emerald-600 dark:text-emerald-400'
  if (type === 2) return 'text-violet-700 dark:text-violet-400'
  return 'text-slate-600 dark:text-slate-300'
}

function getHumanSummary(humans: ManageOkrsHuman[] | undefined): string {
  if (!humans || humans.length === 0) return ''
  if (humans.length === 1) return humans[0]?.name ?? ''
  return `${humans[0]?.name ?? ''} và ${humans.length - 1} người khác`
}

function getExpText(completionRate: number | undefined, expTarget: number | undefined): {
  text: string
  total: number
  target: number
} {
  if (!expTarget) return { text: '', total: 0, target: 0 }
  const total = ((completionRate ?? 0) * expTarget) / 100
  return { text: `${total}/${expTarget}`, total, target: expTarget }
}

function toListItem(item: ManageOkrsItemApi): ManageOkrsListItem {
  const exp = getExpText(item.completionRate, item.expTarget)
  return {
    id: item.id,
    name: item.name ?? '',
    departmentName: item.department?.name ?? '',
    quarterLabel: getQuarterLabel(item.quarter, item.year),
    typeLabel: getTypeLabel(item.type),
    typeValue: item.type ?? 0,
    typeClass: getTypeClass(item.type),
    humans: item.okrUsers ?? [],
    humanSummary: getHumanSummary(item.okrUsers),
    expText: exp.text,
    totalExp: exp.total,
    expTarget: exp.target,
    leaderName: item.leader?.name ?? '',
    status: item.status ?? 0,
    completionRate: item.completionRate ?? null,
  }
}

function toShareExpRows(humans: ManageOkrsHuman[]): ManageOkrsShareExpRow[] {
  return humans.map((item) => ({
    id: item.id,
    name: item.name,
    userId: item.pivot?.userId ?? item.id,
    exp: item.pivot?.exp ?? null,
    feedback: item.pivot?.feedback ?? '',
  }))
}

export function useManageOkrsPage() {
  const toast = useToast()
  const filters = useManageOkrsFilters()
  const pagination = useManageOkrsPagination()
  const dialogs = useManageOkrsDialogs()
  const items = ref<ManageOkrsListItem[]>([])
  const loading = ref(false)
  const loadingSubmit = ref(false)
  const loadingDetail = ref(false)
  const errorMessage = ref('')

  const statusOptions = MANAGE_OKRS_STATUS_OPTIONS
  const typeOptions = MANAGE_OKRS_TYPE_OPTIONS

  function showSuccess(detail: string): void {
    toast.add({ severity: 'success', summary: 'Thành công', detail, life: 3500 })
  }

  function showError(detail: string): void {
    toast.add({ severity: 'error', summary: 'Lỗi', detail, life: 5000 })
  }

  function showWarning(detail: string): void {
    toast.add({ severity: 'warn', summary: 'Cảnh báo', detail, life: 4000 })
  }

  const selectedExpRows = computed(() =>
    dialogs.selectedItem.value ? toShareExpRows(dialogs.selectedItem.value.humans) : [],
  )

  async function fetchList(): Promise<void> {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await fetchManageOkrsList({
        page: pagination.currentPage.value,
        name: filters.name.value.trim() || undefined,
        quarter: filters.quarterForQuery.value,
        year: filters.yearForQuery.value,
      })
      const data = response?.data
      const rows = data?.data ?? []
      items.value = rows.map(toListItem)
      pagination.setMeta({
        total: data?.total,
        currentPage: data?.currentPage,
        lastPage: data?.lastPage,
        perPage: data?.perPage,
      })
    } catch (error) {
      errorMessage.value = getApiErrorMessage(error, 'Không thể tải danh sách OKR')
      showError(errorMessage.value)
    } finally {
      loading.value = false
    }
  }

  async function refreshFromFirstPage(): Promise<void> {
    pagination.resetPage()
    await fetchList()
  }

  async function updateStatus(item: ManageOkrsListItem, status: number): Promise<void> {
    try {
      await updateManageOkrStatus({ id: item.id, status })
      showSuccess('Cập nhật trạng thái thành công')
      await fetchList()
    } catch (error) {
      showError(getApiErrorMessage(error, 'Cập nhật trạng thái thất bại'))
    }
  }

  async function submitShareExp(rows: ManageOkrsShareExpRow[]): Promise<boolean> {
    if (!dialogs.selectedItem.value) return false
    const target = dialogs.selectedItem.value.expTarget
    const total = rows.reduce((sum, row) => sum + Number(row.exp ?? 0), 0)
    if (total > target) {
      showWarning('Tổng điểm EXP đã vượt giới hạn, vui lòng kiểm tra lại')
      return false
    }

    loadingSubmit.value = true
    try {
      await shareManageOkrExp({
        id: dialogs.selectedItem.value.id,
        data: rows.map((item) => ({
          userId: item.userId,
          exp: item.exp,
          feedback: item.feedback || null,
        })),
      })
      showSuccess('Chia EXP thành công')
      dialogs.closeShareExp()
      await fetchList()
      return true
    } catch (error) {
      showError(getApiErrorMessage(error, 'Chia EXP thất bại'))
      return false
    } finally {
      loadingSubmit.value = false
    }
  }

  async function searchUsers(keyword: string): Promise<ManageOkrsHuman[]> {
    if (!keyword.trim()) return []
    try {
      const response = await filterManageOkrUsers({ keyword: keyword.trim() })
      return response?.data ?? []
    } catch (_error) {
      return []
    }
  }

  async function loadDetailForm(
    itemId: number,
  ): Promise<{ form: ManageOkrsFormData; selectedUsers: ManageOkrsHuman[] } | null> {
    loadingDetail.value = true
    try {
      const response = await fetchManageOkrDetail(itemId)
      const data = response?.data
      if (!data) return null
      return {
        form: {
          name: data.name ?? '',
          type: data.type ?? 1,
          kpiTarget: String(data.kpiTarget ?? ''),
          kpiMin: String(data.kpiMin ?? ''),
          expTarget: String(data.expTarget ?? ''),
          result: data.result ?? '',
          userIds: (data.okrUsers ?? []).map((user) => user.id),
        },
        selectedUsers: data.okrUsers ?? [],
      }
    } catch (error) {
      showError(getApiErrorMessage(error, 'Không thể tải chi tiết OKR'))
      return null
    } finally {
      loadingDetail.value = false
    }
  }

  async function submitUpsert(form: ManageOkrsFormData, itemId?: number): Promise<boolean> {
    const payload = {
      name: form.name.trim(),
      type: form.type,
      kpiTarget: form.kpiTarget.trim(),
      kpiMin: form.kpiMin.trim(),
      userIds: form.userIds,
      expTarget: form.expTarget.trim(),
      result: form.result.trim(),
    }
    if (!payload.name || !payload.kpiTarget || !payload.expTarget || payload.userIds.length === 0) {
      showWarning('Vui lòng nhập đầy đủ các trường bắt buộc')
      return false
    }

    loadingSubmit.value = true
    try {
      if (itemId) {
        await updateManageOkr({ id: itemId, ...payload })
        showSuccess('Cập nhật OKR thành công')
        dialogs.closeEdit()
      } else {
        await createManageOkr(payload)
        showSuccess('Tạo OKR thành công')
        dialogs.closeCreate()
      }
      await fetchList()
      return true
    } catch (error) {
      showError(getApiErrorMessage(error, itemId ? 'Cập nhật OKR thất bại' : 'Tạo OKR thất bại'))
      return false
    } finally {
      loadingSubmit.value = false
    }
  }

  function onPageChange(page: number): void {
    pagination.currentPage.value = page
  }

  return {
    filters,
    pagination,
    dialogs,
    items,
    loading,
    loadingSubmit,
    loadingDetail,
    errorMessage,
    statusOptions,
    typeOptions,
    selectedExpRows,
    fetchList,
    refreshFromFirstPage,
    updateStatus,
    submitShareExp,
    searchUsers,
    loadDetailForm,
    submitUpsert,
    onPageChange,
  }
}
