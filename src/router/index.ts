import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/confirm-sms-test-input',
    name: 'confirm-sms-test-input',
    component: () => import('../views/confirm-sms-test-input/ConfirmSmsTestInput.vue'),
    meta: { title: 'Xác nhận ca test speaking', bodyClass: 'confirm-sms' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/login/Login.vue'),
    meta: { title: 'Đăng nhập', bodyClass: 'login' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { title: 'Đăng ký', bodyClass: 'login' },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404 - Không tìm thấy trang' },
  },
  {
    path: '/',
    component: () => import('../components/layout/MainLayout.vue'),
    meta: { bodyClass: 'app' },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'phieu-luong',
        name: 'phieu-luong',
        component: () => import('../views/phieu-luong/PhieuLuong.vue'),
        meta: { title: 'Phiếu lương' },
      },
      {
        path: 'cham-cong',
        name: 'cham-cong',
        component: () => import('../views/cham-cong/ChamCong.vue'),
        meta: { title: 'Chấm công' },
      },
      {
        path: 'propose',
        name: 'list-propose-application',
        component: () => import('../views/propose/ProposeApplication.vue'),
        meta: { title: 'Đề xuất' },
      },
      {
        path: 'propose/decided/teamlead-bod',
        name: 'list-propose-lead-bod',
        component: () => import('../views/propose/ProposeApproval.vue'),
        meta: { title: 'Duyệt đề xuất' },
      },
      {
        path: 'job-kpi/staff',
        name: 'job-kpi-staff',
        component: () => import('../views/job-kpi/staff/JobKpiStaff.vue'),
        meta: { title: 'KPI công việc' },
      },
      {
        path: 'job-kpi/teamlead',
        name: 'score-meeting-kpi',
        component: () => import('../views/job-kpi/teamlead/JobKpiTeamlead.vue'),
        meta: { title: 'Chấm KPI và họp tuần' },
      },
      {
        path: 'manage-okrs',
        name: 'ManageOkrs',
        component: () => import('../views/manage-okrs/ManageOkrs.vue'),
        meta: { title: 'Quản lý OKRs' },
      },
      {
        path: 'result-okrs',
        name: 'ResultOkrs',
        component: () => import('../views/result-okrs/ResultOkrs.vue'),
        meta: { title: 'Kết quả OKRs' },
      },
      {
        path: 'progress-level',
        name: 'ProgressLevel',
        component: () => import('../views/progress-level/ProgressLevel.vue'),
        meta: { title: 'Tiến trình Level' },
      },
      {
        path: 'level/level-employee',
        name: 'level-employee-list',
        component: () => import('../views/level-employee-list/LevelEmployeeList.vue'),
        meta: { title: 'Bảng tiêu chuẩn chỉ số' },
      },
      {
        path: 'level/level-employee/:id',
        name: 'level-employee-detail',
        component: () => import('../views/level-employee-list/LevelEmployeeDetail.vue'),
        meta: { title: 'Chi tiết nhân viên' },
      },
      {
        path: 'thong-tin/thong-bao',
        name: 'thong-bao',
        component: () => import('../views/thong-tin/thong-bao/ThongBao.vue'),
        meta: { title: 'Thông báo' },
      },
      {
        path: 'thong-tin/thong-bao/:slug',
        name: 'thong-bao-detail',
        component: () => import('../views/thong-tin/thong-bao/ThongBaoDetail.vue'),
        meta: { title: 'Chi tiết thông báo' },
      },
      {
        path: 'thong-tin/chinh-sach-nhan-su',
        name: 'chinh-sach-nhan-su',
        component: () => import('../views/thong-tin/chinh-sach/ChinhSach.vue'),
        meta: { title: 'Chính sách nhân sự' },
      },
      {
        path: 'thong-tin/cam-nang-van-hanh',
        name: 'cam-nang-van-hanh',
        component: () => import('../views/thong-tin/cam-nang/CamNang.vue'),
        meta: { title: 'Cẩm nang vận hành' },
      },
      {
        path: 'quantum-leap-intro',
        name: 'quantum-leap-intro',
        component: () => import('../views/quantum-leap-intro/QuantumLeapIntro.vue'),
        meta: { title: 'Giới thiệu Quantum Leap' },
      },
      {
        path: 'advise/center',
        name: 'advise-center',
        component: () => import('../views/advise/center/AdviseCenter.vue'),
        meta: { title: 'Giới thiệu Quantum Leap' },
      },
      {
        path: 'inbox',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Hộp thư' },
      },
      {
        path: 'file-manager',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Quản lý file' },
      },
      {
        path: 'chat',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Chat' },
      },
      {
        path: 'post',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Bài viết' },
      },
      {
        path: 'crud/list',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Danh sách' },
      },
      {
        path: 'crud/form',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Form' },
      },
      {
        path: 'users',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Người dùng' },
      },
      {
        path: 'users/profile',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Hồ sơ' },
      },
      {
        path: 'profile/update',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Cập nhật hồ sơ' },
      },
      {
        path: 'profile/password',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Đổi mật khẩu' },
      },
      
      {
        path: 'components/:name',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Component' },
      },
      {
        path: 'forms/:name',
        component: () => import('../views/PlaceholderPage.vue'),
        meta: { title: 'Form' },
      },
      {
        path: ':pathMatch(.*)*',
        redirect: '/404',
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = `${(to.meta.title as string) || 'Edutalk'} — Nội bộ Edutalk`

  const bodyClass =
    (to.meta.bodyClass as string | undefined) ||
    (to.matched.find((record) => record.meta.bodyClass)?.meta.bodyClass as string | undefined) ||
    'app'

  document.body.classList.remove('login', 'app', 'confirm-sms')
  document.body.classList.add(bodyClass)
})

export default router
