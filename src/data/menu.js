/**
 * Top Menu — từ Source/top-menu-dashboard.html (bản trong screenshot)
 */
export const topMenuItems = [
  {
    title: 'Dashboard',
    icon: 'Home',
    to: '/',
  },
  {
    title: 'Menu Layout',
    icon: 'Box',
    subMenu: [
      { title: 'Side Menu', icon: 'Activity', to: '/' },
      { title: 'Simple Menu', icon: 'Activity', to: '/' },
      { title: 'Top Menu', icon: 'Activity', to: '/' },
    ],
  },
  {
    title: 'Apps',
    icon: 'Activity',
    subMenu: [
      { title: 'Inbox', icon: 'Activity', to: '/inbox' },
      { title: 'File Manager', icon: 'Activity', to: '/file-manager' },
      { title: 'Chat', icon: 'Activity', to: '/chat' },
      { title: 'Post', icon: 'Activity', to: '/post' },
      {
        title: 'Crud',
        icon: 'Activity',
        subMenu: [
          { title: 'Data List', icon: 'Zap', to: '/crud/list' },
          { title: 'Form', icon: 'Zap', to: '/crud/form' },
        ],
      },
      { title: 'Users', icon: 'Activity', to: '/users' },
    ],
  },
  {
    title: 'Pages',
    icon: 'Layout',
    subMenu: [
      { title: 'Login', icon: 'Activity', to: '/login' },
      { title: 'Register', icon: 'Activity', to: '/register' },
      { title: 'Update profile', icon: 'Activity', to: '/profile/update' },
      { title: 'Change Password', icon: 'Activity', to: '/profile/password' },
    ],
  },
  {
    title: 'Components',
    icon: 'Inbox',
    subMenu: [
      { title: 'Button', icon: 'Activity', to: '/components/button' },
      { title: 'Alert', icon: 'Activity', to: '/components/alert' },
      { title: 'Modal', icon: 'Activity', to: '/components/modal' },
      { title: 'Table', icon: 'Activity', to: '/components/table' },
    ],
  },
  {
    title: 'Forms',
    icon: 'Sidebar',
    subMenu: [
      { title: 'Regular Form', icon: 'Activity', to: '/forms/regular' },
      { title: 'Validation', icon: 'Activity', to: '/forms/validation' },
    ],
  },
  {
    title: 'Widgets',
    icon: 'HardDrive',
    subMenu: [
      { title: 'Chart', icon: 'Activity', to: '/components/button' },
      { title: 'Slider', icon: 'Activity', to: '/components/alert' },
    ],
  },
]

/** Alias cho MobileMenu */
export const sideMenuItems = topMenuItems

export const breadcrumbs = {
  '/': [{ label: 'Application', to: '/' }, { label: 'Dashboard', active: true }],
  '/inbox': [{ label: 'Application', to: '/' }, { label: 'Inbox', active: true }],
  '/file-manager': [{ label: 'Application', to: '/' }, { label: 'File Manager', active: true }],
  '/chat': [{ label: 'Application', to: '/' }, { label: 'Chat', active: true }],
  '/post': [{ label: 'Application', to: '/' }, { label: 'Post', active: true }],
  '/crud/list': [
    { label: 'Application', to: '/' },
    { label: 'Crud' },
    { label: 'Data List', active: true },
  ],
  '/crud/form': [
    { label: 'Application', to: '/' },
    { label: 'Crud' },
    { label: 'Form', active: true },
  ],
  '/users': [{ label: 'Application', to: '/' }, { label: 'Users', active: true }],
  '/users/profile': [
    { label: 'Application', to: '/' },
    { label: 'Users' },
    { label: 'Profile', active: true },
  ],
}
