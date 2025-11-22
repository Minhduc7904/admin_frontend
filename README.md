# Admin Frontend

React + Vite + TypeScript project với Tailwind CSS v4, Axios, và Redux Toolkit.

## Công nghệ sử dụng

- ⚛️ **React 18** với **TypeScript**
- ⚡ **Vite** - Build tool cực nhanh
- 🎨 **Tailwind CSS v3** - Utility-first CSS framework
- 🔄 **Redux Toolkit** - State management
- 📡 **Axios** - HTTP client

## Cấu trúc thư mục

```
src/
├── store/                    # Redux store
│   ├── store.ts             # Cấu hình store
│   ├── hooks.ts             # Custom hooks (useAppDispatch, useAppSelector)
│   └── features/            # Redux slices
│       └── counter/         
│           └── counterSlice.ts
├── utils/                   # Utilities
│   └── axios.ts            # Cấu hình axios instance
├── App.tsx                 # Component chính
├── main.tsx               # Entry point
└── index.css              # Tailwind imports
```

## Cài đặt

```bash
npm install
```

## Chạy dự án

```bash
npm run dev
```

## Build production

```bash
npm run build
```

## Cấu hình

### Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### Axios Configuration

File `src/utils/axios.ts` đã được cấu hình sẵn với:
- Base URL từ environment variable
- Request interceptor để thêm JWT token
- Response interceptor để xử lý lỗi 401

### Redux Configuration

- Store được cấu hình trong `src/store/store.ts`
- Custom hooks trong `src/store/hooks.ts`
- Example slice (counter) trong `src/store/features/counter/counterSlice.ts`

### Tailwind CSS v3

- Đã cấu hình trong `tailwind.config.js` và `postcss.config.js`
- Directives trong `src/index.css`

## Sử dụng

### Redux

```tsx
import { useAppDispatch, useAppSelector } from './store/hooks'
import { increment } from './store/features/counter/counterSlice'

function MyComponent() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  
  return <button onClick={() => dispatch(increment())}>Count: {count}</button>
}
```

### Axios

```tsx
import axios from './utils/axios'

// GET request
const data = await axios.get('/users')

// POST request
const response = await axios.post('/users', { name: 'John' })
```

### Tailwind CSS

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello Tailwind!
</div>
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
