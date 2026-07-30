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
