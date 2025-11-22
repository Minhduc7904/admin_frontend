# Error Pages Module

Module xử lý các trang lỗi (error pages) trong ứng dụng.

## 📁 Cấu trúc

```
features/errors/
├── pages/
│   ├── NotFoundPage.tsx     # 404 - Không tìm thấy trang
│   ├── ForbiddenPage.tsx    # 403 - Truy cập bị từ chối
│   └── index.ts            # Barrel export
└── index.ts                # Main export
```

## 🎨 Pages

### NotFoundPage (404)

**Mục đích**: Hiển thị khi URL không tồn tại hoặc route không được định nghĩa.

**Tính năng**:
- Hiển thị mã lỗi 404
- Icon AlertCircle từ lucide-react
- Nút "Về trang chủ" (navigate to dashboard)
- Nút "Quay lại" (navigate back)
- Thông báo lỗi thân thiện bằng tiếng Việt

**Routes kích hoạt**:
- `/404` - Route trực tiếp
- `/*` - Catch-all route cho mọi URL không khớp

**Sử dụng**:
```tsx
import { NotFoundPage } from '@/features/errors';

// Trong router
{
  path: '*',
  element: <NotFoundPage />,
}

// Hoặc navigate programmatically
navigate('/404');
```

### ForbiddenPage (403)

**Mục đích**: Hiển thị khi người dùng không có quyền truy cập trang.

**Tính năng**:
- Hiển thị mã lỗi 403
- Icon ShieldAlert màu đỏ từ lucide-react
- Warning box về yêu cầu quyền truy cập
- Nút "Về trang chủ" và "Quay lại"
- Thông báo lỗi bằng tiếng Việt

**Routes kích hoạt**:
- `/403` - Route trực tiếp

**Sử dụng**:
```tsx
import { ForbiddenPage } from '@/features/errors';

// Navigate khi kiểm tra quyền thất bại
if (!hasPermission) {
  navigate('/403');
}
```

## 🎨 Style

Cả hai trang đều sử dụng style guide chung:

### Layout
```tsx
// Full-screen gradient background
className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black"

// White card container
className="bg-white rounded-2xl shadow-xl p-8"
```

### Typography
```tsx
// Error code
className="text-6xl font-bold text-gray-900 mb-2"

// Title
className="text-2xl font-semibold text-gray-900 mb-3"

// Description
className="text-gray-600 mb-8"
```

### Buttons
```tsx
// Primary button (Home)
className="bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-900"

// Secondary button (Back)
className="text-gray-600 hover:text-gray-900 border border-gray-300"
```

## 🔄 Navigation

### Các cách navigate đến error pages:

#### 1. Navigate programmatically
```tsx
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

const navigate = useNavigate();

// 404
navigate(ROUTES.ERRORS.NOT_FOUND);

// 403
navigate(ROUTES.ERRORS.FORBIDDEN);
```

#### 2. Link component
```tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

<Link to={ROUTES.ERRORS.NOT_FOUND}>404 Page</Link>
<Link to={ROUTES.ERRORS.FORBIDDEN}>403 Page</Link>
```

#### 3. Redirect trong route guard
```tsx
// Trong ProtectedRoute hoặc custom route guard
if (!isAuthenticated) {
  return <Navigate to={ROUTES.ERRORS.FORBIDDEN} replace />;
}
```

## 🔐 Use Cases

### 404 - Not Found
- User nhập URL không tồn tại
- Route không được định nghĩa trong router
- Link bị hỏng hoặc resource đã bị xóa
- API endpoint không tồn tại (có thể redirect từ API error)

### 403 - Forbidden
- User không có quyền truy cập trang
- User chưa xác thực (có thể dùng thay cho redirect về login)
- Role/permission không đủ để truy cập resource
- IP bị chặn hoặc account bị khóa

## 📝 Route Configuration

Các error routes được cấu hình trong `src/routes/index.tsx`:

```tsx
{
  path: ROUTES.ERRORS.NOT_FOUND,
  element: <NotFoundPage />,
},
{
  path: ROUTES.ERRORS.FORBIDDEN,
  element: <ForbiddenPage />,
},
{
  path: '*',
  element: <NotFoundPage />,
},
```

Route constants trong `src/core/constants/routes.constants.ts`:

```tsx
ERRORS: {
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
}
```

## 🎯 Best Practices

### 1. Sử dụng catch-all route
```tsx
// Đặt ở cuối cùng trong router config
{
  path: '*',
  element: <NotFoundPage />,
}
```

### 2. API error handling
```tsx
// Trong axios interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      navigate('/403');
    }
    if (error.response?.status === 404) {
      navigate('/404');
    }
    return Promise.reject(error);
  }
);
```

### 3. Permission checking
```tsx
// Trong component hoặc route guard
const hasPermission = checkUserPermission(requiredRole);

if (!hasPermission) {
  return <Navigate to="/403" replace />;
}
```

### 4. User-friendly messages
- Sử dụng tiếng Việt cho error messages
- Cung cấp actions rõ ràng (Về trang chủ, Quay lại)
- Không hiển thị technical error details cho user

## 🧪 Testing

### Test navigation
```tsx
// Test 404 catch-all
visit('/random-url-that-does-not-exist');
expect(screen.getByText('404')).toBeInTheDocument();

// Test 403 direct
visit('/403');
expect(screen.getByText('403')).toBeInTheDocument();
```

### Test buttons
```tsx
// Test "Về trang chủ"
const homeButton = screen.getByText('Về trang chủ');
fireEvent.click(homeButton);
expect(mockNavigate).toHaveBeenCalledWith('/dashboard');

// Test "Quay lại"
const backButton = screen.getByText('Quay lại');
fireEvent.click(backButton);
expect(mockNavigate).toHaveBeenCalledWith(-1);
```

## 🚀 Future Enhancements

- **500 Internal Server Error page**
- **503 Service Unavailable page**
- **Error tracking**: Gửi error logs về server
- **Custom error pages**: Cho từng feature module
- **Animation effects**: Thêm animations khi load error page
- **Error recovery**: Suggestions để fix lỗi

---

**Last Updated:** November 22, 2025  
**Version:** 1.0.0
