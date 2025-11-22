// Application routes

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  MODULE_SELECTION: '/modules',
  DASHBOARD: '/dashboard',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    LIST: '/admin/list',
    DETAIL: '/admin/detail/:id',
  },
  EDUCATION: {
    DASHBOARD: '/education/dashboard',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    LIST: '/student/list',
    DETAIL: '/student/detail/:id',
  },
  PUBLIC: {
    DASHBOARD: '/public/dashboard',
  },
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ERRORS: {
    NOT_FOUND: '/404',
    FORBIDDEN: '/403',
  },
} as const;
