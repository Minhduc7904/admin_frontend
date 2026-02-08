# Hướng dẫn thêm Permission vào các Component

## Mục lục
1. [Tổng quan về hệ thống Permission](#1-tổng-quan-về-hệ-thống-permission)
2. [Cấu trúc Permission Code](#2-cấu-trúc-permission-code)
3. [Các Component và Hook có sẵn](#3-các-component-và-hook-có-sẵn)
4. [Template Comment cho Permission Documentation](#4-template-comment-cho-permission-documentation)
5. [Cách thêm Permission vào Router](#5-cách-thêm-permission-vào-router)
6. [Cách thêm Permission vào Component](#6-cách-thêm-permission-vào-component)
7. [Best Practices](#7-best-practices)
8. [Ví dụ thực tế](#8-ví-dụ-thực-tế)

---

## 1. Tổng quan về hệ thống Permission

Hệ thống permission của chúng ta có 2 loại:

### **API Permissions** (Backend operations)
- Format: `resource:action` (ví dụ: `exam:create`, `course:update`)
- Dùng để kiểm soát quyền gọi API backend
- Được định nghĩa trong các nhóm như `EXAM`, `COURSE`, `STUDENT`, etc.

### **Page Permissions** (Frontend access)
- Format: `admin:page:page-name` (ví dụ: `admin:page:dashboard`)
- Dùng để kiểm soát quyền truy cập các trang trong admin panel
- Được định nghĩa trong nhóm `ADMIN_PAGE`

---

## 2. Cấu trúc Permission Code

File: `src/core/constants/permission/permission.codes.js`

```javascript
export const PERMISSIONS = {
  // API Permissions - Cho các thao tác backend
  EXAM: {
    GET_ALL: 'exam:get-all',
    GET_BY_ID: 'exam:get-by-id',
    CREATE: 'exam:create',
    UPDATE: 'exam:update',
    DELETE: 'exam:delete',
  },
  
  COURSE: {
    GET_ALL: 'course:get-all',
    CREATE: 'course:create',
    UPDATE: 'course:update',
    DELETE: 'course:delete',
  },
  
  // Page Permissions - Cho truy cập trang
  ADMIN_PAGE: {
    DASHBOARD: 'admin:page:dashboard',
    COURSES: 'admin:page:courses',
    STUDENTS: 'admin:page:students',
    EXAMS: 'admin:page:exams',
    // ...
  }
}
```

---

## 3. Các Component và Hook có sẵn

### 3.1. **Hook: `useHasPermission`**

File: `src/shared/hooks/permissions/useHasPermission.js`

**Mục đích**: Kiểm tra xem user hiện tại có permission hay không.

**Cách dùng**:
```jsx
import { useHasPermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/core/constants';

function MyComponent() {
  const canCreate = useHasPermission(PERMISSIONS.EXAM.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.EXAM.UPDATE);
  
  return (
    <div>
      {canCreate && <button>Tạo mới</button>}
      {canUpdate && <button>Cập nhật</button>}
    </div>
  );
}
```

**Khi nào dùng**:
- ✅ Cần kiểm tra permission trong logic (if/else)
- ✅ Cần disable/enable button dựa trên permission
- ✅ Cần thay đổi behavior của component dựa trên permission

---

### 3.2. **Component: `CanAccess`**

File: `src/shared/components/permissions/Can.jsx`

**Mục đích**: Ẩn/hiện component dựa trên permission.

**Cách dùng**:
```jsx
import { CanAccess } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

function MyComponent() {
  return (
    <div>
      <CanAccess permission={PERMISSIONS.EXAM.CREATE}>
        <button>Tạo đề thi mới</button>
      </CanAccess>
      
      <CanAccess permission={PERMISSIONS.EXAM.DELETE}>
        <button>Xóa đề thi</button>
      </CanAccess>
    </div>
  );
}
```

**Khi nào dùng**:
- ✅ Đơn giản chỉ cần ẩn/hiện component
- ✅ Không cần logic phức tạp
- ✅ Code ngắn gọn, dễ đọc

---

### 3.3. **Component: `NoPermission`**

File: `src/shared/components/permissions/NoPermission.jsx`

**Mục đích**: Hiển thị thông báo khi user không có quyền.

**3 variants**:

#### **Variant 1: `page`** (Toàn trang)
```jsx
import { NoPermission } from '@/shared/components/permissions';

function RestrictedPage() {
  const hasPermission = useHasPermission(PERMISSIONS.ADMIN_PAGE.DASHBOARD);
  
  if (!hasPermission) {
    return <NoPermission variant="page" />;
  }
  
  return <div>Nội dung trang</div>;
}
```

#### **Variant 2: `card`** (Dạng thẻ)
```jsx
function DashboardWidget() {
  const canViewStats = useHasPermission(PERMISSIONS.EXAM.GET_ALL);
  
  return (
    <div className="widget">
      {canViewStats ? (
        <StatisticsChart />
      ) : (
        <NoPermission 
          variant="card" 
          title="Không thể xem thống kê"
          message="Bạn cần quyền xem danh sách đề thi để xem thống kê này"
        />
      )}
    </div>
  );
}
```

#### **Variant 3: `inline`** (Nhỏ gọn)
```jsx
function TableActionCell({ item }) {
  const canDelete = useHasPermission(PERMISSIONS.EXAM.DELETE);
  
  return (
    <td>
      {canDelete ? (
        <button onClick={() => handleDelete(item.id)}>Xóa</button>
      ) : (
        <NoPermission variant="inline" message="Không có quyền xóa" />
      )}
    </td>
  );
}
```

---

### 3.4. **Component: `IfAllowed`**

File: `src/shared/components/permissions/Can.jsx`

**Mục đích**: Ẩn/hiện component dựa trên boolean condition (không phải permission code).

**Cách dùng**:
```jsx
import { IfAllowed } from '@/shared/components/permissions';

function MyComponent({ isOwner, canEdit }) {
  const allowed = isOwner && canEdit;
  
  return (
    <div>
      <IfAllowed allowed={allowed}>
        <button>Chỉnh sửa</button>
      </IfAllowed>
    </div>
  );
}
```

**Khi nào dùng**:
- ✅ Logic phức tạp (kết hợp nhiều điều kiện)
- ✅ Không phải check permission code đơn giản
- ✅ Kết hợp nhiều permissions hoặc business logic

---

## 4. Template Comment cho Permission Documentation

**Mục đích**: Tạo documentation rõ ràng về tất cả permissions cần thiết cho mỗi trang.

**Vị trí**: Đặt comment block ngay sau phần imports, trước khai báo component.

### Template chuẩn:

```jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// ... other imports
import { PERMISSIONS } from '../../../core/constants';
import { CanAccess } from '../../../shared/components/permissions';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * 
 * Router Level (AdminRouter.jsx):
 * - PERMISSIONS.ADMIN_PAGE.XXX ('admin:page:xxx')
 *   → Quyền truy cập trang [Tên trang]
 * 
 * Page Operations:
 * - PERMISSIONS.RESOURCE.ACTION ('resource:action')
 *   → Mô tả quyền này làm gì (function/feature sử dụng)
 * 
 * - PERMISSIONS.RESOURCE.ACTION ('resource:action')
 *   → Mô tả quyền này làm gì (button/action sử dụng)
 */

export const MyPage = () => {
  // Component code...
}
```

### Ví dụ thực tế (AdminList.jsx):

```jsx
/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * 
 * Router Level (AdminRouter.jsx):
 * - PERMISSIONS.ADMIN_PAGE.ADMINS ('admin:page:admins')
 *   → Quyền truy cập trang quản lý admin
 * 
 * Page Operations:
 * - PERMISSIONS.ADMIN.GET_ALL ('admin:get-all')
 *   → Quyền xem danh sách tất cả admin (getAllAdminsAsync)
 * 
 * - PERMISSIONS.ADMIN.CREATE ('admin:create')
 *   → Quyền tạo admin mới (nút "Thêm quản trị viên mới")
 * 
 * - PERMISSIONS.ADMIN.GET_BY_ID ('admin:get-by-id')
 *   → Quyền xem chi tiết admin (nút "Xem" trong bảng)
 * 
 * - PERMISSIONS.USER.TOGGLE_ACTIVATION ('user:toggle-activation')
 *   → Quyền kích hoạt/vô hiệu hóa tài khoản admin
 */
```

### Lợi ích của Documentation Pattern này:

1. **Dễ hiểu**: Developer mới dễ dàng biết trang này cần những quyền gì
2. **Maintainable**: Khi thêm feature mới, dễ dàng cập nhật permissions
3. **Debugging**: Nhanh chóng identify permission issues
4. **Audit**: Review code dễ dàng kiểm tra permission coverage
5. **Onboarding**: Team members mới hiểu flow permission nhanh hơn

### Checklist khi viết Permission Comment:

- [ ] Luôn bắt đầu với **Router Level** permission (ADMIN_PAGE.XXX)
- [ ] List tất cả **API permissions** được dùng trong page
- [ ] Ghi rõ **permission code string** trong ngoặc đơn
- [ ] Giải thích **mục đích sử dụng** của từng permission
- [ ] Đề cập **UI element** hoặc **function** liên quan
- [ ] Cập nhật comment khi thêm/xóa permissions
- [ ] Giữ format nhất quán across all pages

---

## 5. Cách thêm Permission vào Router

File: `src/routes/AdminRouter.jsx`

### Bước 1: Import ProtectedRoute và PERMISSIONS
```jsx
import { PERMISSIONS } from '@/core/constants';
```

### Bước 2: Bọc route với ProtectedRoute
```jsx
const adminRoutes = [
  {
    element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.DASHBOARD} />,
    children: [
      { path: ROUTES.DASHBOARD, element: <Dashboard /> }
    ]
  },
  {
    element: <ProtectedRoute permission={PERMISSIONS.ADMIN_PAGE.COURSES} />,
    children: [
      { path: ROUTES.COURSES, element: <CourseListPage /> }
    ]
  }
];
```

**Lưu ý**: 
- Dùng **ADMIN_PAGE permissions** cho router
- Một route có thể có nhiều children routes
- Nếu không có permission, user sẽ bị redirect về trang chủ hoặc hiển thị NoPermission

---

## 6. Cách thêm Permission vào Component

### 6.0. **Documentation Comment** (Bắt buộc cho mọi page)

**LUÔN LUÔN** thêm permission documentation comment ở đầu mỗi page component:

```jsx
import { PERMISSIONS } from '../../../core/constants';
import { CanAccess, NoPermission } from '../../../shared/components/permissions';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * 
 * Router Level (AdminRouter.jsx):
 * - PERMISSIONS.ADMIN_PAGE.ADMINS ('admin:page:admins')
 *   → Quyền truy cập trang quản lý admin
 * 
 * Page Operations:
 * - PERMISSIONS.ADMIN.GET_ALL ('admin:get-all')
 *   → Quyền xem danh sách tất cả admin
 * 
 * - PERMISSIONS.ADMIN.CREATE ('admin:create')
 *   → Quyền tạo admin mới
 */

export const AdminList = () => {
  // Component code...
}
```

---

### 6.1. **Page-level Component** (Toàn trang)

**Option 1: Router đã protect (Recommended)**

Nếu route đã được bọc với `ProtectedRoute`, không cần check lại trong component:

```jsx
import { useHasPermission } from '@/shared/hooks';
import { CanAccess } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * Router Level: PERMISSIONS.ADMIN_PAGE.ADMINS
 * Operations: PERMISSIONS.ADMIN.CREATE, PERMISSIONS.ADMIN.GET_BY_ID
 */

export const AdminList = () => {
  // Permission hooks cho các thao tác cụ thể
  const canCreate = useHasPermission(PERMISSIONS.ADMIN.CREATE);
  const canView = useHasPermission(PERMISSIONS.ADMIN.GET_BY_ID);
  
  return (
    <div>
      <CanAccess permission={PERMISSIONS.ADMIN.CREATE}>
        <button onClick={handleCreate}>Tạo mới</button>
      </CanAccess>
      {/* Nội dung trang */}
    </div>
  );
};
```

**Option 2: Thêm double-check trong component (Extra security)**

```jsx
import { useHasPermission } from '@/shared/hooks';
import { NoPermission } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * Router Level: PERMISSIONS.ADMIN_PAGE.ADMINS
 * Page Access: PERMISSIONS.ADMIN_PAGE.ADMINS (double-check)
 */

export const AdminList = () => {
  // Double-check quyền truy cập trang
  const hasPageAccess = useHasPermission(PERMISSIONS.ADMIN_PAGE.ADMINS);
  
  if (!hasPageAccess) {
    return <NoPermission variant="page" />;
  }
  
  return (
    <div>
      {/* Nội dung trang */}
    </div>
  );
};
```

---

### 6.2. **Button-level Permission** (Nút bấm)

#### **Cách 1: Dùng `CanAccess`** (Ẩn hoàn toàn)
```jsx
import { CanAccess } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

export const CourseList = () => {
  return (
    <div>
      <CanAccess permission={PERMISSIONS.COURSE.CREATE}>
        <Button onClick={handleCreate}>
          Tạo khóa học mới
        </Button>
      </CanAccess>
      
      <CanAccess permission={PERMISSIONS.COURSE.DELETE}>
        <Button onClick={handleDelete} variant="danger">
          Xóa khóa học
        </Button>
      </CanAccess>
    </div>
  );
};
```

#### **Cách 2: Dùng `useHasPermission`** (Disable button)
```jsx
import { useHasPermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/core/constants';

export const CourseList = () => {
  const canCreate = useHasPermission(PERMISSIONS.COURSE.CREATE);
  const canDelete = useHasPermission(PERMISSIONS.COURSE.DELETE);
  
  return (
    <div>
      <Button 
        onClick={handleCreate}
        disabled={!canCreate}
        title={!canCreate ? 'Bạn không có quyền tạo khóa học' : ''}
      >
        Tạo khóa học mới
      </Button>
      
      <Button 
        onClick={handleDelete}
        disabled={!canDelete}
        variant="danger"
      >
        Xóa khóa học
      </Button>
    </div>
  );
};
```

---

### 6.3. **Action Handler Permission** (Hàm xử lý)

```jsx
import { useHasPermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/core/constants';
import { toast } from 'react-toastify';

export const AdminList = () => {
  const canDelete = useHasPermission(PERMISSIONS.ADMIN.DELETE);
  const canToggleActivation = useHasPermission(PERMISSIONS.USER.TOGGLE_ACTIVATION);
  
  const handleDelete = (adminId) => {
    if (!canDelete) {
      toast.error('Bạn không có quyền xóa admin');
      return;
    }
    // Logic xóa
  };
  
  const handleToggleActivation = (userId) => {
    if (!canToggleActivation) {
      toast.error('Bạn không có quyền kích hoạt/vô hiệu hóa tài khoản');
      return;
    }
    // Logic toggle activation
  };
  
  return (
    <AdminTable 
      onDelete={handleDelete}
      onToggleActivation={handleToggleActivation}
    />
  );
};
```

---

### 5.4. **Table Column Permission** (Cột trong bảng)

```jsx
import { CanAccess } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

export const AdminTable = ({ admins, onView, onDelete, canViewAdmin, canToggleActivation }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Email</th>
---

### 6.4. **Table Column Permission** (Cột trong bảng)

```jsx
import { CanAccess } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

export const AdminTable = ({ admins, onView, onDelete, canViewAdmin, canToggleActivation }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Email</th>
          <CanAccess permission={PERMISSIONS.ADMIN.GET_BY_ID}>
            <th>Thao tác</th>
          </CanAccess>
        </tr>
      </thead>
      <tbody>
        {admins.map(admin => (
          <tr key={admin.id}>
            <td>{admin.name}</td>
            <td>{admin.email}</td>
            <CanAccess permission={PERMISSIONS.ADMIN.GET_BY_ID}>
              <td>
                {canViewAdmin && (
                  <button onClick={() => onView(admin)}>Xem</button>
                )}
                {canToggleActivation && (
                  <button onClick={() => onToggleActivation(admin)}>
                    {admin.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  </button>
                )}
              </td>
            </CanAccess>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

### 6.5. **Section/Widget Permission** (Phần tử con)

```jsx
import { CanAccess, NoPermission } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Stats Section */}
      <CanAccess permission={PERMISSIONS.EXAM.GET_ALL}>
        <StatsCard title="Tổng số đề thi" value={150} />
      </CanAccess>
      
      {/* Chart Section */}
      <div className="chart-section">
        <CanAccess permission={PERMISSIONS.COURSE.GET_ALL}>
          <CourseChart />
        </CanAccess>
        
        <CanAccess permission={PERMISSIONS.STUDENT.GET_ALL}>
          <StudentChart />
        </CanAccess>
      </div>
    </div>
  );
};
```

---

### 6.6. **Multiple Permissions** (Nhiều quyền kết hợp)

#### **AND Logic** (Cần tất cả quyền)
```jsx
import { useHasPermission } from '@/shared/hooks';
import { IfAllowed } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

export const AdvancedActions = () => {
  const canView = useHasPermission(PERMISSIONS.COURSE.GET_BY_ID);
  const canUpdate = useHasPermission(PERMISSIONS.COURSE.UPDATE);
  
  // Cần CẢ 2 quyền
  const canManage = canView && canUpdate;
  
  return (
    <IfAllowed allowed={canManage}>
      <button>Quản lý khóa học</button>
    </IfAllowed>
  );
};
```

#### **OR Logic** (Cần ít nhất 1 quyền)
```jsx
export const FlexibleActions = () => {
  const canCreate = useHasPermission(PERMISSIONS.EXAM.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.EXAM.UPDATE);
  
  // Cần ÍT NHẤT 1 trong 2 quyền
  const canManageExam = canCreate || canUpdate;
  
  return (
    <IfAllowed allowed={canManageExam}>
      <button>Thao tác với đề thi</button>
    </IfAllowed>
  );
};
```

---

## 7. Best Practices

### ✅ **DO's** (Nên làm)

1. **Luôn thêm Permission Documentation Comment ở đầu mỗi page**
```jsx
// ✅ Good
/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * Router Level: PERMISSIONS.ADMIN_PAGE.ADMINS
 * Operations: PERMISSIONS.ADMIN.CREATE, PERMISSIONS.ADMIN.GET_BY_ID
 */
export const AdminList = () => { /* ... */ }

// ❌ Bad - Không có documentation
export const AdminList = () => { /* ... */ }
```

2. **Luôn check permission ở cả handler và UI**
```jsx
// ✅ Good
const canDelete = useHasPermission(PERMISSIONS.COURSE.DELETE);

const handleDelete = (id) => {
  if (!canDelete) return; // Check ở handler
  // Logic xóa
};

return (
  <CanAccess permission={PERMISSIONS.COURSE.DELETE}> {/* Check ở UI */}
    <button onClick={handleDelete}>Xóa</button>
  </CanAccess>
);
```

3. **Dùng descriptive variable names**
```jsx
// ✅ Good
const canCreateExam = useHasPermission(PERMISSIONS.EXAM.CREATE);
const canDeleteExam = useHasPermission(PERMISSIONS.EXAM.DELETE);

// ❌ Bad
const perm1 = useHasPermission(PERMISSIONS.EXAM.CREATE);
const p = useHasPermission(PERMISSIONS.EXAM.DELETE);
```

4. **Nhóm các permission hooks ở đầu component**
```jsx
// ✅ Good
export const CourseList = () => {
  // Permission hooks
  const canCreate = useHasPermission(PERMISSIONS.COURSE.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.COURSE.UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.COURSE.DELETE);
  
  // State hooks
  const [courses, setCourses] = useState([]);
  
  // Rest of component...
};
```

5. **Truyền permission flags xuống child components**
```jsx
// ✅ Good - Parent kiểm tra, child nhận props
const ParentComponent = () => {
  const canEdit = useHasPermission(PERMISSIONS.COURSE.UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.COURSE.DELETE);
  
  return (
    <ChildTable 
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
};
```

6. **Hiển thị thông báo rõ ràng với NoPermission component**
```jsx
// ✅ Good - Dùng NoPermission component
<NoPermission 
  variant="card"
  title="Không thể xem thống kê"
  message="Bạn cần quyền 'exam:get-all' để xem thống kê đề thi"
/>

// ✅ Good - Variant phù hợp với context
// Page level: variant="page"
// Widget/Section: variant="card"  
// Table cell: variant="inline"
```
// ✅ Good
<NoPermission 
  variant="card"
  title="Không thể xem thống kê"
  message="Bạn cần quyền 'exam:get-all' để xem thống kê đề thi"
/>
```

---

### ❌ **DON'Ts** (Không nên làm)

1. **Không check permission trong handler**
```jsx
// ❌ Bad - UI ẩn nhưng handler vẫn chạy được
const handleDelete = (id) => {
  dispatch(deleteExam(id)); // Không check permission!
};

return (
  <CanAccess permission={PERMISSIONS.EXAM.DELETE}>
    <button onClick={handleDelete}>Xóa</button>
  </CanAccess>
);
```

2. **Không hardcode permission strings**
```jsx
// ❌ Bad
const canCreate = useHasPermission('exam:create');

// ✅ Good
const canCreate = useHasPermission(PERMISSIONS.EXAM.CREATE);
```

3. **Không dùng nhiều useHasPermission cho cùng 1 permission**
```jsx
// ❌ Bad - Gọi hook nhiều lần
function MyComponent() {
  if (useHasPermission(PERMISSIONS.EXAM.CREATE)) {
    // ...
  }
  if (useHasPermission(PERMISSIONS.EXAM.CREATE)) {
    // ...
  }
}

// ✅ Good - Gọi 1 lần, dùng nhiều lần
function MyComponent() {
  const canCreate = useHasPermission(PERMISSIONS.EXAM.CREATE);
  
  if (canCreate) { /* ... */ }
  if (canCreate) { /* ... */ }
}
```

4. **Không lồng CanAccess không cần thiết**
```jsx
// ❌ Bad
<CanAccess permission={PERMISSIONS.EXAM.CREATE}>
  <CanAccess permission={PERMISSIONS.EXAM.UPDATE}>
    <button>Quản lý đề thi</button>
  </CanAccess>
</CanAccess>

// ✅ Good
const canCreate = useHasPermission(PERMISSIONS.EXAM.CREATE);
const canUpdate = useHasPermission(PERMISSIONS.EXAM.UPDATE);
const canManage = canCreate && canUpdate;

<IfAllowed allowed={canManage}>
  <button>Quản lý đề thi</button>
</IfAllowed>
```

---

## 8. Ví dụ thực tế

### Example 1: AdminList Page - Complete Implementation

Ví dụ hoàn chỉnh từ trang AdminList với tất cả best practices:

```jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components';
import { useHasPermission } from '@/shared/hooks';
import { CanAccess, NoPermission } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * 
 * Router Level (AdminRouter.jsx):
 * - PERMISSIONS.ADMIN_PAGE.ADMINS ('admin:page:admins')
 *   → Quyền truy cập trang quản lý admin
 * 
 * Page Operations:
 * - PERMISSIONS.ADMIN.GET_ALL ('admin:get-all')
 *   → Quyền xem danh sách tất cả admin (getAllAdminsAsync)
 * 
 * - PERMISSIONS.ADMIN.CREATE ('admin:create')
 *   → Quyền tạo admin mới (nút "Thêm quản trị viên mới")
 * 
 * - PERMISSIONS.ADMIN.GET_BY_ID ('admin:get-by-id')
 *   → Quyền xem chi tiết admin (nút "Xem" trong bảng)
 * 
 * - PERMISSIONS.USER.TOGGLE_ACTIVATION ('user:toggle-activation')
 *   → Quyền kích hoạt/vô hiệu hóa tài khoản admin
 */

export const AdminList = () => {
  const dispatch = useDispatch();
  
  // Permission hooks - nhóm ở đầu
  const canCreateAdmin = useHasPermission(PERMISSIONS.ADMIN.CREATE);
  const canViewAdmin = useHasPermission(PERMISSIONS.ADMIN.GET_BY_ID);
  const canToggleActivation = useHasPermission(PERMISSIONS.USER.TOGGLE_ACTIVATION);
  
  // Handlers với permission check
  const handleCreate = () => {
    if (!canCreateAdmin) return;
    // Logic tạo mới
  };
  
  const handleView = (admin) => {
    if (!canViewAdmin) return;
    navigate(ROUTES.ADMIN_DETAIL(admin.adminId));
  };
  
  const handleToggleActivation = async (admin) => {
    if (!canToggleActivation) return;
    await dispatch(toggleUserActivationAsync(admin.userId)).unwrap();
  };
  
  return (
    <>
      {/* Header với permission check */}
      <div className="page-header">
        <h1>Quản lý Admin</h1>
        
        <CanAccess permission={PERMISSIONS.ADMIN.CREATE}>
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Thêm quản trị viên mới
          </Button>
        </CanAccess>
      </div>
      
      {/* Table với permission props */}
      <AdminTable
        admins={admins}
        onView={handleView}
        onToggleActivation={handleToggleActivation}
        canViewAdmin={canViewAdmin}
        canToggleActivation={canToggleActivation}
      />
    </>
  );
};
```

---

### Example 2: Course List Page (Trang danh sách khóa học)

```jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components';
import { useHasPermission } from '@/shared/hooks';
import { CanAccess, NoPermission } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';
import { getAllCoursesAsync } from './store/courseSlice';

export const CourseList = () => {
  const dispatch = useDispatch();
  const courses = useSelector(state => state.course.courses);
  
  // Permission hooks - nhóm ở đầu
  const hasPageAccess = useHasPermission(PERMISSIONS.ADMIN_PAGE.COURSES);
  const canCreate = useHasPermission(PERMISSIONS.COURSE.CREATE);
  const canUpdate = useHasPermission(PERMISSIONS.COURSE.UPDATE);
  const canDelete = useHasPermission(PERMISSIONS.COURSE.DELETE);
  const canViewDetail = useHasPermission(PERMISSIONS.COURSE.GET_BY_ID);
  
  // Kiểm tra quyền truy cập trang
  if (!hasPageAccess) {
    return <NoPermission variant="page" />;
  }
  
  // Handlers với permission check
  const handleCreate = () => {
    if (!canCreate) {
      toast.error('Bạn không có quyền tạo khóa học');
      return;
    }
    // Logic tạo mới
  };
  
  const handleUpdate = (courseId) => {
    if (!canUpdate) {
      toast.error('Bạn không có quyền cập nhật khóa học');
      return;
    }
    // Logic cập nhật
  };
  
  const handleDelete = (courseId) => {
    if (!canDelete) {
      toast.error('Bạn không có quyền xóa khóa học');
      return;
    }
    // Logic xóa
  };
  
  useEffect(() => {
    dispatch(getAllCoursesAsync());
  }, []);
  
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Quản lý Khóa học</h1>
          <p>Danh sách tất cả khóa học trong hệ thống</p>
        </div>
        
        {/* Button tạo mới - ẩn nếu không có quyền */}
        <CanAccess permission={PERMISSIONS.COURSE.CREATE}>
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Tạo khóa học mới
          </Button>
        </CanAccess>
      </div>
      
      {/* Table */}
      <CourseTable
        courses={courses}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        canUpdate={canUpdate}
        canDelete={canDelete}
        canViewDetail={canViewDetail}
      />
    </div>
  );
};
```

---

### Example 2: Course Table Component (Component bảng)

```jsx
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { CanAccess, NoPermission } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

export const CourseTable = ({ 
  courses, 
  onUpdate, 
  onDelete,
  canUpdate,
  canDelete,
  canViewDetail 
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Tên khóa học</th>
          <th>Môn học</th>
          <th>Giá</th>
          {/* Chỉ hiện cột Actions nếu có ít nhất 1 quyền */}
          {(canViewDetail || canUpdate || canDelete) && (
            <th>Thao tác</th>
          )}
        </tr>
      </thead>
      <tbody>
        {courses.map(course => (
          <tr key={course.id}>
            <td>{course.name}</td>
            <td>{course.subject.name}</td>
            <td>{course.price.toLocaleString()} VNĐ</td>
            
            {/* Actions cell */}
            {(canViewDetail || canUpdate || canDelete) && (
              <td className="action-cell">
                {/* View button */}
                {canViewDetail ? (
                  <button onClick={() => navigate(`/courses/${course.id}`)}>
                    <Eye size={16} />
                  </button>
                ) : null}
                
                {/* Update button */}
                {canUpdate ? (
                  <button onClick={() => onUpdate(course.id)}>
                    <Edit2 size={16} />
                  </button>
                ) : null}
                
                {/* Delete button */}
                {canDelete ? (
                  <button onClick={() => onDelete(course.id)}>
                    <Trash2 size={16} />
                  </button>
                ) : null}
                
                {/* Nếu không có quyền nào */}
                {!canViewDetail && !canUpdate && !canDelete && (
                  <NoPermission variant="inline" message="Không có quyền" />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

### Example 3: Dashboard với nhiều widgets và NoPermission

```jsx
import { useHasPermission } from '@/shared/hooks';
import { CanAccess, NoPermission } from '@/shared/components/permissions';
import { PERMISSIONS } from '@/core/constants';

/**
 * PERMISSIONS REQUIRED FOR THIS PAGE
 * ===================================
 * Router Level: PERMISSIONS.ADMIN_PAGE.DASHBOARD
 * Operations: PERMISSIONS.COURSE.GET_ALL, PERMISSIONS.EXAM.GET_ALL, PERMISSIONS.STUDENT.GET_ALL
 */

export const Dashboard = () => {
  const canViewCourses = useHasPermission(PERMISSIONS.COURSE.GET_ALL);
  const canViewExams = useHasPermission(PERMISSIONS.EXAM.GET_ALL);
  const canViewStudents = useHasPermission(PERMISSIONS.STUDENT.GET_ALL);
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Stats Row */}
      <div className="stats-row">
        <CanAccess permission={PERMISSIONS.COURSE.GET_ALL}>
          <StatsCard 
            title="Tổng khóa học" 
            value={120}
            icon={<BookOpen />}
          />
        </CanAccess>
        
        <CanAccess permission={PERMISSIONS.EXAM.GET_ALL}>
          <StatsCard 
            title="Tổng đề thi" 
            value={350}
            icon={<FileText />}
          />
        </CanAccess>
        
        <CanAccess permission={PERMISSIONS.STUDENT.GET_ALL}>
          <StatsCard 
            title="Tổng học sinh" 
            value={1200}
            icon={<Users />}
          />
        </CanAccess>
      </div>
      
      {/* Charts với NoPermission fallback */}
      <div className="charts-grid">
        {/* Course Chart */}
        <div className="chart-card">
          {canViewCourses ? (
            <CourseChart />
          ) : (
            <NoPermission 
              variant="card"
              title="Biểu đồ khóa học"
              message="Bạn cần quyền xem danh sách khóa học để xem biểu đồ này"
            />
          )}
        </div>
        
        {/* Exam Chart */}
        <div className="chart-card">
          {canViewExams ? (
            <ExamChart />
          ) : (
            <NoPermission 
              variant="card"
              title="Biểu đồ đề thi"
              message="Bạn cần quyền xem danh sách đề thi để xem biểu đồ này"
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## Checklist khi thêm Permission

### ✅ Documentation Level
- [ ] Thêm Permission Documentation Comment ở đầu file
- [ ] List Router Level permission (ADMIN_PAGE.XXX)
- [ ] List tất cả Page Operations permissions
- [ ] Ghi rõ permission code strings
- [ ] Giải thích mục đích của từng permission

### ✅ Router Level
- [ ] Route được bọc với `<ProtectedRoute permission={...} />`
- [ ] Sử dụng `ADMIN_PAGE` permission (không phải API permission)

### ✅ Page Level
- [ ] Import `useHasPermission`, `CanAccess`, `NoPermission`
- [ ] (Optional) Kiểm tra page access permission ở đầu component
- [ ] (Optional) Return `<NoPermission variant="page" />` nếu không có quyền

### ✅ Component Level
- [ ] Khai báo permission hooks ở đầu component (sau state hooks)
- [ ] Kiểm tra permission trong handlers trước khi thực hiện action
- [ ] Dùng `CanAccess` hoặc conditional rendering cho UI elements
- [ ] Hiển thị `NoPermission` component khi cần

### ✅ Table/List Level
- [ ] Truyền permission flags xuống child components qua props
- [ ] Ẩn/hiện columns dựa trên permissions
- [ ] Disable/hide action buttons khi không có quyền
- [ ] Dùng `NoPermission variant="inline"` cho table cells

### ✅ UX
- [ ] Hiển thị thông báo rõ ràng khi không có quyền
- [ ] Chọn variant phù hợp của `NoPermission` component
- [ ] Disable buttons với tooltip thay vì ẩn (nếu cần UX tốt hơn)
- [ ] Test với user không có quyền để đảm bảo UX tốt

---

## Tổng kết

### Quick Reference

1. **Documentation**: Luôn thêm Permission Comment ở đầu mỗi page
   ```jsx
   /**
    * PERMISSIONS REQUIRED FOR THIS PAGE
    * Router Level: PERMISSIONS.ADMIN_PAGE.XXX
    * Operations: PERMISSIONS.RESOURCE.ACTION, ...
    */
   ```

2. **Router**: Dùng `ProtectedRoute` với `ADMIN_PAGE` permissions

3. **Page**: Check permission ở đầu (optional), return `NoPermission` nếu cần

4. **Buttons/Actions**: Dùng `CanAccess` để ẩn hoặc `useHasPermission` để disable

5. **Handlers**: Luôn check permission trước khi thực hiện action

6. **Tables**: Truyền permission flags xuống props

7. **UX**: Hiển thị `NoPermission` component với message rõ ràng
   - `variant="page"` - Toàn trang
   - `variant="card"` - Widgets/Sections
   - `variant="inline"` - Table cells/Small elements

### Files Reference

- **Permission Codes**: `src/core/constants/permission/permission.codes.js`
- **Hooks**: `src/shared/hooks/permissions/useHasPermission.js`
- **Components**: 
  - `src/shared/components/permissions/Can.jsx` - CanAccess, IfAllowed
  - `src/shared/components/permissions/NoPermission.jsx` - NoPermission
- **Router**: `src/routes/AdminRouter.jsx`

**Luôn nhớ**: Permission phải được check ở **cả frontend và backend**. Frontend permission chỉ là UI/UX, backend permission mới là security thực sự!

## Checklist khi thêm Permission

### ✅ Router Level
- [ ] Route được bọc với `<ProtectedRoute permission={...} />`
- [ ] Sử dụng `ADMIN_PAGE` permission (không phải API permission)

### ✅ Page Level
- [ ] Kiểm tra page access permission ở đầu component
- [ ] Return `<NoPermission variant="page" />` nếu không có quyền

### ✅ Component Level
- [ ] Import `useHasPermission` hook và `PERMISSIONS`
- [ ] Khai báo permission hooks ở đầu component
- [ ] Kiểm tra permission trong handlers
- [ ] Dùng `CanAccess` hoặc conditional rendering cho UI elements

### ✅ Table/List Level
- [ ] Truyền permission flags xuống child components
- [ ] Ẩn/hiện columns dựa trên permissions
- [ ] Disable/hide action buttons khi không có quyền

### ✅ UX
- [ ] Hiển thị thông báo rõ ràng khi không có quyền
- [ ] Dùng `NoPermission` component với variant phù hợp
- [ ] Disable buttons thay vì ẩn (nếu cần UX tốt hơn)

---

## Tổng kết

1. **Router**: Dùng `ProtectedRoute` với `ADMIN_PAGE` permissions
2. **Page**: Check permission ở đầu, return `NoPermission` nếu cần
3. **Buttons/Actions**: Dùng `CanAccess` để ẩn hoặc `useHasPermission` để disable
4. **Handlers**: Luôn check permission trước khi thực hiện action
5. **Tables**: Truyền permission flags xuống props
6. **UX**: Hiển thị `NoPermission` component với message rõ ràng

**Luôn nhớ**: Permission phải được check ở **cả frontend và backend**. Frontend permission chỉ là UI/UX, backend permission mới là security thực sự!
