# Auth Components

Components cho tính năng Authentication được tổ chức theo Clean Architecture.

## 📦 Component Structure

### Page Level Component
- **LoginPage** (`pages/LoginPage.tsx`) - Container component chính

### Presentation Components

#### 1. **LoginHeader** 
- Hiển thị logo và tiêu đề
- Props: `title`, `subtitle`
- Icon: Lock từ lucide-react

#### 2. **LoginFormCard**
- Container cho toàn bộ form login
- Props: `formData`, `isLoading`, `error`, `onSubmit`, `onChange`
- Kết hợp tất cả sub-components

#### 3. **ErrorMessage**
- Hiển thị thông báo lỗi
- Props: `message`
- Icon: AlertCircle
- Tự ẩn khi không có lỗi

#### 4. **InputField**
- Input field tái sử dụng với icon
- Props: `id`, `name`, `type`, `label`, `value`, `placeholder`, `icon`, `required`, `onChange`
- Hỗ trợ mọi loại input (email, password, text, etc.)

#### 5. **RememberForgot**
- Checkbox "Ghi nhớ" và link "Quên mật khẩu"
- Props: `remember`, `onRememberChange`

#### 6. **SubmitButton**
- Button submit với loading state
- Props: `isLoading`, `text`, `loadingText`
- Icons: Loader2 (spinning), ArrowRight

#### 7. **DemoInfo**
- Hiển thị thông tin demo login
- Props: `email`, `password`

#### 8. **LoginFooter**
- Footer với copyright
- Không có props

## 🎯 Component Hierarchy

```
LoginPage (Container - State Management)
└── LoginHeader (Presentational)
└── LoginFormCard (Presentational)
    ├── ErrorMessage (Presentational)
    ├── InputField (Presentational - Email)
    ├── InputField (Presentational - Password)
    ├── RememberForgot (Presentational)
    ├── SubmitButton (Presentational)
    └── DemoInfo (Presentational)
└── LoginFooter (Presentational)
```

## 📝 Usage Example

```tsx
// LoginPage.tsx - Container Component
const LoginPage = () => {
  const [formData, setFormData] = useState({ ... });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => { ... };
  const handleChange = (e) => { ... };

  return (
    <div>
      <LoginHeader title="Admin" subtitle="Login" />
      <LoginFormCard 
        formData={formData}
        isLoading={isLoading}
        error={error}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
      <LoginFooter />
    </div>
  );
};
```

## 🔄 Data Flow

```
User Input
    ↓
InputField component
    ↓
onChange callback
    ↓
LoginPage (state update)
    ↓
Props down to components
    ↓
Re-render with new state
```

## ✅ Benefits

✅ **Reusable**: InputField, SubmitButton có thể dùng ở forms khác  
✅ **Testable**: Mỗi component độc lập, dễ test  
✅ **Maintainable**: Logic tách biệt, dễ sửa  
✅ **Scalable**: Dễ thêm components mới  
✅ **Clean**: Mỗi component có 1 trách nhiệm duy nhất
