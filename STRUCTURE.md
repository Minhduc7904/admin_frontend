# Cấu trúc Clean Architecture - Admin Frontend

## 📁 Tổng quan cấu trúc

```
src/
├── core/                          # Core application (business logic, data)
│   ├── api/                      # API configuration & services
│   │   └── axios.ts             # Axios instance với interceptors
│   ├── constants/               # Application constants
│   │   ├── api.constants.ts    # API endpoints, HTTP status
│   │   ├── routes.constants.ts # Route paths
│   │   ├── storage.constants.ts # Storage keys
│   │   └── index.ts            # Barrel export
│   ├── store/                   # Redux global store
│   │   ├── store.ts            # Store configuration
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   └── features/           # Global slices (counter example)
│   ├── types/                   # Common types & interfaces
│   │   └── common.types.ts     # ApiResponse, BaseEntity, etc.
│   └── utils/                   # Utility functions
│       ├── storage.utils.ts    # LocalStorage helpers
│       ├── format.utils.ts     # Formatting helpers
│       ├── validation.utils.ts # Validation helpers
│       └── index.ts            # Barrel export
│
├── features/                     # Feature modules (domain-driven)
│   ├── auth/                    # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/              # Auth custom hooks
│   │   │   └── useAuth.ts
│   │   ├── services/           # Auth API services
│   │   │   └── auth.service.ts
│   │   ├── store/              # Auth Redux slice
│   │   │   └── authSlice.ts
│   │   ├── types/              # Auth types & interfaces
│   │   │   └── auth.types.ts
│   │   └── index.ts            # Barrel export
│   │
│   └── dashboard/               # Dashboard feature
│       ├── components/         # Dashboard components
│       ├── pages/              # Dashboard pages
│       │   └── DashboardPage.tsx
│       └── index.ts            # Barrel export
│
├── shared/                       # Shared/reusable components
│   ├── components/              # Shared components
│   │   ├── ui/                 # UI components library
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── index.ts
│   │   └── sidebar/            # Sidebar components
│   │       ├── Sidebar.tsx
│   │       ├── AdminSidebar.tsx
│   │       └── index.ts
│   ├── layouts/                 # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── index.ts
│   ├── store/                   # Shared Redux slices
│   │   ├── uiSlice.ts          # UI state (sidebar, theme, etc.)
│   │   └── index.ts
│   └── hooks/                   # Shared custom hooks
│
├── routes/                       # Routing configuration
│   └── (route files)
│
├── App.tsx                       # Root component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles (Tailwind)
```

## 🏗️ Nguyên tắc Clean Architecture

### 1. **Core Layer** (Lớp cốt lõi)
- **Mục đích**: Chứa logic nghiệp vụ, cấu hình, và utilities độc lập
- **Không phụ thuộc**: Vào UI framework hay bất kỳ feature cụ thể nào
- **Bao gồm**:
  - API configuration
  - Global state management
  - Constants
  - Common types
  - Utility functions

### 2. **Features Layer** (Lớp tính năng)
- **Mục đích**: Tổ chức code theo domain/feature
- **Cấu trúc mỗi feature**:
  - `components/` - UI components cho feature
  - `hooks/` - Custom hooks cho feature
  - `services/` - API calls liên quan đến feature
  - `store/` - Redux slice cho feature (nếu cần)
  - `types/` - Types/interfaces cho feature
  - `pages/` - Page components (nếu có)
- **Lợi ích**: Dễ maintain, scale, và tái sử dụng

### 3. **Shared Layer** (Lớp chia sẻ)
- **Mục đích**: Components, hooks, layouts dùng chung
- **Bao gồm**:
  - UI component library
  - Layout components
  - Shared hooks
- **Nguyên tắc**: Chỉ chứa code có thể tái sử dụng ở nhiều features

### 4. **Routes Layer** (Lớp định tuyến)
- **Mục đích**: Cấu hình routing cho app
- **Tách biệt**: Routing logic khỏi business logic

## 📋 Best Practices

### Import Paths
```typescript
// ✅ Sử dụng path aliases
import { Button } from '@/shared/components/ui';
import { useAuth } from '@/features/auth';
import { API_ENDPOINTS } from '@/core/constants';

// ❌ Tránh relative paths dài
import { Button } from '../../../shared/components/ui/Button';
```

### Feature Module Structure
Mỗi feature nên tự chứa (self-contained):
```typescript
// features/auth/index.ts
export * from './types/auth.types';
export * from './hooks/useAuth';
export * from './components/LoginForm';
export { default as authReducer } from './store/authSlice';
```

### Type Safety
```typescript
// Luôn định nghĩa types cho data
interface User {
  id: string;
  email: string;
  name: string;
}

// Sử dụng generic types cho API responses
interface ApiResponse<T> {
  data: T;
  success: boolean;
}
```

### Service Layer
```typescript
// Tách API calls ra services
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },
};
```

### Custom Hooks
```typescript
// Đóng gói logic phức tạp trong hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const login = async (credentials: LoginCredentials) => {
    await dispatch(loginThunk(credentials));
  };
  
  return { user, isAuthenticated, login };
};
```

## 🔄 Data Flow

```
UI Component
    ↓ (user action)
Custom Hook
    ↓ (call)
Service Layer
    ↓ (API request)
Backend
    ↓ (response)
Redux Store (if needed)
    ↓ (state update)
UI Component (re-render)
```

## 📦 Adding New Features

1. Tạo folder trong `features/`
2. Tạo cấu trúc chuẩn:
   ```
   features/new-feature/
   ├── components/
   ├── hooks/
   ├── services/
   ├── store/
   ├── types/
   └── index.ts
   ```
3. Implement business logic
4. Export qua `index.ts`
5. Import và sử dụng: `import { ... } from '@/features/new-feature'`

## 🎯 Lợi ích

✅ **Scalability**: Dễ mở rộng khi thêm features mới  
✅ **Maintainability**: Code tổ chức rõ ràng, dễ maintain  
✅ **Testability**: Từng layer có thể test riêng  
✅ **Reusability**: Shared components có thể tái sử dụng  
✅ **Team collaboration**: Nhiều dev có thể làm việc song song  
✅ **Clear dependencies**: Dependencies rõ ràng, tránh circular imports
