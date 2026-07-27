# Nội bộ EduTalk

Vue 3 admin app chuyển từ template Midone HTML trong thư mục `Source/`.

## Chạy project

```bash
npm install
npm run dev
```

## Cấu trúc layout tái sử dụng

```
src/components/layout/
├── MainLayout.vue    # Shell: MobileMenu + SideMenu + TopBar + Footer + RouterView
├── AuthLayout.vue    # Layout trang đăng nhập / đăng ký
├── SideMenu.vue      # Menu bên (từ Source side-nav)
├── SideMenuItem.vue  # Item menu đệ quy (submenu)
├── MobileMenu.vue    # Menu mobile
├── TopBar.vue        # Header: breadcrumb, search, notification, account
├── Breadcrumb.vue
├── AppFooter.vue
└── index.js          # Export chung
```

Menu cấu hình tại `src/data/menu.js` — dùng chung cho SideMenu và MobileMenu.

## Theme

Màu theme Midone được port trong `tailwind.config.js` và style component trong `src/assets/css/app.css`.
