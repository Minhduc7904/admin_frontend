# Routes Configuration

## 📍 Danh sách Routes

### Public Routes (Không cần đăng nhập)
- `/login` - Trang đăng nhập
- `/demo` - Trang demo (temporary)

### Protected Routes (Cần đăng nhập)
- `/` - Redirect đến `/dashboard`
- `/dashboard` - Trang dashboard chính

## 🔐 Protected Routes

Tất cả routes được bảo vệ bởi `ProtectedRoute` component:
- Kiểm tra `isAuthenticated` từ Redux store
- Nếu chưa đăng nhập → redirect đến `/login`
- Nếu đã đăng nhập → cho phép truy cập

## 🗺️ Route Constants

Routes được định nghĩa trong `@/core/constants/routes.constants.ts`:

```typescript
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
}
```

## 📝 Cách sử dụng

### Navigation trong component:
```tsx
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

function MyComponent() {
  const navigate = useNavigate();
  
  const goToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };
}
```

### Link navigation:
```tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

<Link to={ROUTES.DASHBOARD}>Go to Dashboard</Link>
```

## ➕ Thêm route mới

1. Thêm constant vào `routes.constants.ts`
2. Tạo page component trong feature folder
3. Thêm route vào `routes/index.tsx`:

```tsx
{
  path: ROUTES.NEW_PAGE,
  element: <NewPage />,
}
```

## 🔄 Layout Structure

```
ProtectedRoute (kiểm tra auth)
  └── MainLayout (header, sidebar, footer)
      └── Page Component (DashboardPage, ProfilePage, etc.)

AuthLayout (cho login, register)
  └── Auth Components (LoginForm, RegisterForm)
```
