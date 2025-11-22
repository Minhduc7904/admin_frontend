// Quick reference for all routes in the application

export const APP_ROUTES = {
  // ===== PUBLIC ROUTES =====
  PUBLIC: {
    LOGIN: '/login',              // Trang đăng nhập
    REGISTER: '/register',        // Trang đăng ký (chưa implement)
    FORGOT_PASSWORD: '/forgot-password', // Quên mật khẩu (chưa implement)
    DEMO: '/demo',                // Demo page
  },

  // ===== PROTECTED ROUTES =====
  PROTECTED: {
    HOME: '/',                    // Redirect to dashboard
    DASHBOARD: '/dashboard',      // Trang dashboard chính
    PROFILE: '/profile',          // Trang profile (chưa implement)
    SETTINGS: '/settings',        // Trang settings (chưa implement)
  },
} as const;

// Print routes to console for quick reference
console.table({
  'Login Page': APP_ROUTES.PUBLIC.LOGIN,
  'Dashboard': APP_ROUTES.PROTECTED.DASHBOARD,
  'Home (redirect)': APP_ROUTES.PROTECTED.HOME,
  'Demo': APP_ROUTES.PUBLIC.DEMO,
});
