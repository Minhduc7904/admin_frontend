# Module Selection Feature

Feature quản lý việc chọn module và môn học sau khi đăng nhập.

## 📁 Cấu trúc

```
features/modules/
├── components/
│   ├── ModuleCard.tsx          # Card hiển thị từng module
│   ├── SubjectModal.tsx        # Modal chọn môn học
│   └── index.ts               # Barrel export
├── constants/
│   └── modules.constants.ts   # Danh sách modules và subjects
├── pages/
│   ├── ModuleSelectionPage.tsx # Trang chọn module
│   └── index.ts               # Barrel export
├── store/
│   └── moduleSlice.ts         # Redux slice cho module state
├── types/
│   └── module.types.ts        # Types và interfaces
└── index.ts                   # Main export
```

## 🎯 Management Modules

### 1. Quản lý Admin
**ID**: `admin`  
**Icon**: Shield  
**Features**:
- Phân quyền người dùng
- Thêm quản trị viên
- Sửa thông tin admin
- Xóa quản trị viên

### 2. Quản lý Học tập ⭐ (Yêu cầu chọn môn)
**ID**: `education`  
**Icon**: GraduationCap  
**Features**:
- Quản lý lớp học
- Quản lý đề thi
- Quản lý câu hỏi
- Theo dõi tiến độ

**Môn học**:
- Toán (Math) - Blue
- Lý (Physics) - Purple
- Hóa (Chemistry) - Green
- Văn (Literature) - Pink
- Sinh (Biology) - Emerald
- Anh (English) - Red

### 3. Quản lý Học sinh
**ID**: `student`  
**Icon**: Users  
**Features**:
- Thêm/Sửa/Xóa học sinh
- Quản lý điểm danh
- Quản lý học phí
- Theo dõi tiến độ

### 4. Quản lý Trang Public
**ID**: `public`  
**Icon**: Globe  
**Features**:
- Thêm ảnh
- Xóa ảnh
- Quản lý banner
- Cập nhật nội dung

## 🔄 User Flow

```
Login Page
    ↓
Module Selection Page
    ↓
[User chọn module]
    ↓
    ├─→ Nếu module = "Quản lý Học tập"
    │       ↓
    │   Subject Modal (chọn môn: Toán/Lý/Hóa/Văn/Sinh/Anh)
    │       ↓
    │   Dashboard (với module + subject)
    │
    └─→ Nếu module khác
            ↓
        Dashboard (chỉ với module)
```

## 🎨 Components

### ModuleCard

**Props**:
```tsx
interface ModuleCardProps {
    module: ManagementModule;
    onSelect: (moduleId: string) => void;
}
```

**Features**:
- Icon động dựa vào module.icon
- Hover effects (border black, icon background black)
- Hiển thị features list
- Arrow animation on hover

**Styling**:
- White card với shadow
- Border transition từ gray-100 → black
- Icon background transition từ gray-100 → black

### SubjectModal

**Props**:
```tsx
interface SubjectModalProps {
    subjects: Subject[];
    onSelect: (subjectId: string) => void;
    onClose: () => void;
}
```

**Features**:
- Fixed overlay với backdrop blur
- Grid layout responsive (1/2/3 columns)
- Color-coded subject cards
- Close button

**Styling**:
- Modal center screen
- Subject cards với màu riêng cho từng môn
- Hover effects: border black + shadow

## 📦 Redux State

### Module Slice

**State**:
```tsx
interface ModuleState {
    selectedModule: ManagementModuleType | null;
    selectedSubject: SubjectType | null;
}
```

**Actions**:
- `setSelectedModule(module)` - Chọn module
- `setSelectedSubject(subject)` - Chọn môn học
- `clearModuleSelection()` - Clear selection

**Persistence**: LocalStorage sync

## 🛣️ Routes

### Module Selection Route
```tsx
{
  path: '/modules',
  element: <ModuleSelectionPage />,
}
```

**Protection**: ProtectedRoute (yêu cầu login)

### Navigation Flow
```tsx
Login Success → /modules
Module Selected → /dashboard
```

## 💾 Data Persistence

### LocalStorage Keys
```tsx
- 'selectedModule': ManagementModuleType
- 'selectedSubject': SubjectType (if applicable)
```

### Redux Sync
State được khôi phục từ localStorage khi app khởi động:
```tsx
const initialState: ModuleState = {
    selectedModule: localStorage.getItem('selectedModule') || null,
    selectedSubject: localStorage.getItem('selectedSubject') || null,
};
```

## 🎯 Usage Examples

### Navigate to Module Selection
```tsx
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

const navigate = useNavigate();
navigate(ROUTES.MODULE_SELECTION);
```

### Get Current Module
```tsx
import { useAppSelector } from '@/core/store/hooks';

const { selectedModule, selectedSubject } = useAppSelector((state) => state.module);
```

### Display Module Name
```tsx
import { MANAGEMENT_MODULES, SUBJECTS } from '@/features/modules';

const moduleName = MANAGEMENT_MODULES.find(m => m.id === selectedModule)?.name;
const subjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name;
```

### Clear Selection on Logout
```tsx
import { clearModuleSelection } from '@/features/modules/store/moduleSlice';

dispatch(clearModuleSelection());
localStorage.clear();
```

## 🎨 Styling

### Color Palette

**Module Cards**:
- Background: White
- Border: Gray-100 → Black (hover)
- Icon BG: Gray-100 → Black (hover)
- Text: Gray-900

**Subject Cards**:
- Math: Blue-500
- Physics: Purple-500
- Chemistry: Green-500
- Literature: Pink-500
- Biology: Emerald-500
- English: Red-500

### Responsive Design
```tsx
// Module Grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// Subject Grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

## 🔐 Access Control

### Protected Route
Module selection page yêu cầu user đã đăng nhập:
```tsx
{
    path: '/',
    element: <ProtectedRoute />,
    children: [
        { path: '/modules', element: <ModuleSelectionPage /> }
    ]
}
```

### Logout
```tsx
const handleLogout = () => {
    localStorage.clear(); // Clear module selection
    navigate(ROUTES.AUTH.LOGIN);
};
```

## 🚀 Future Enhancements

- **Permission-based module visibility**: Chỉ hiển thị modules user có quyền
- **Recent selections**: Ghi nhớ module gần đây
- **Quick switch**: Chuyển đổi module không cần logout
- **Module-specific layouts**: Layout khác nhau cho từng module
- **Subject-based themes**: Theme màu theo môn học đã chọn
- **Module settings**: Cấu hình riêng cho từng module
- **Analytics**: Tracking module usage

## 📝 Types Reference

```tsx
// Management Modules
type ManagementModuleType = 'admin' | 'education' | 'student' | 'public';

// Subjects
type SubjectType = 'math' | 'physics' | 'chemistry' | 'literature' | 'biology' | 'english';

// Module Interface
interface ManagementModule {
    id: ManagementModuleType;
    name: string;
    description: string;
    icon: string;
    features: string[];
    requiresSubject?: boolean;
}

// Subject Interface
interface Subject {
    id: SubjectType;
    name: string;
    nameEn: string;
    color: string;
    icon: string;
}
```

---

**Last Updated:** November 22, 2025  
**Version:** 1.0.0
