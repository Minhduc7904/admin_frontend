# Style Guide - AD Frontend

## Code Style

### General Rules
- Use **JavaScript** (not TypeScript)
- Use **ES6+** syntax
- Use **functional components** with hooks
- Use **named exports** for components
- File names: PascalCase for components, camelCase for utilities

### Component Structure
```jsx
// 1. Imports
import { useState } from 'react';
import { useDispatch } from 'react-redux';

// 2. Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(null);
  const dispatch = useDispatch();

  // 4. Handlers
  const handleClick = () => {
    // ...
  };

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### Redux Patterns

#### Slice Structure
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Async thunks
export const fetchData = createAsyncThunk(
  'feature/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getData(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
};

// 3. Slice
const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Async action handlers
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 4. Export actions and selectors
export const { clearError } = featureSlice.actions;
export const selectData = (state) => state.feature.data;
export const selectLoading = (state) => state.feature.loading;

export default featureSlice.reducer;
```

### API Integration

#### API Client Pattern
```javascript
import axiosClient from './axiosClient';

export const featureApi = {
  getAll: (params) => {
    return axiosClient.get('/endpoint', { params });
  },
  
  getById: (id) => {
    return axiosClient.get(`/endpoint/${id}`);
  },
  
  create: (data) => {
    return axiosClient.post('/endpoint', data);
  },
  
  update: (id, data) => {
    return axiosClient.put(`/endpoint/${id}`, data);
  },
  
  delete: (id) => {
    return axiosClient.delete(`/endpoint/${id}`);
  },
};
```

### Tailwind CSS

#### Color Usage
```jsx
// Primary (White/Gray)
<div className="bg-primary text-foreground">

// Success (Green)
<div className="bg-success text-white">
<div className="bg-success-bg text-success-text">

// Error (Red)
<div className="bg-error text-white">
<div className="bg-error-bg text-error-text">

// Warning (Yellow)
<div className="bg-warning text-white">
<div className="bg-warning-bg text-warning-text">

// Info (Blue)
<div className="bg-info text-white">
<div className="bg-info-bg text-info-text">
```

#### Common Patterns
```jsx
// Button
<button className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info-dark transition-colors">
  Button
</button>

// Input
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent" />

// Card
<div className="bg-white rounded-lg shadow-md p-6">
  Content
</div>

// Container
<div className="container mx-auto px-4 py-8">
  Content
</div>
```

### File Organization

```
src/
├── core/                    # Core functionality
│   ├── api/                # API clients
│   │   ├── axiosClient.js  # Base axios instance
│   │   ├── authApi.js      # Auth API
│   │   └── index.js        # Exports
│   ├── constants/          # App constants
│   │   └── index.js
│   ├── store/              # Redux store
│   │   ├── index.js        # Store configuration
│   │   └── hooks.js        # Custom hooks
│   └── utils/              # Utilities
│       └── index.js
├── features/               # Feature modules
│   └── auth/
│       ├── components/     # Feature components
│       ├── layouts/        # Feature layouts
│       ├── pages/          # Feature pages
│       └── store/          # Feature state
│           └── authSlice.js
├── routes/                 # Route definitions
│   ├── AuthRouter.jsx
│   └── index.js
├── shared/                 # Shared across app
│   ├── components/         # Reusable components
│   ├── layouts/            # App layouts
│   └── pages/              # Shared pages
└── assets/                 # Static assets
```

### Naming Conventions

- **Components**: PascalCase - `UserProfile.jsx`
- **Utilities**: camelCase - `formatDate.js`
- **Constants**: UPPER_SNAKE_CASE - `API_BASE_URL`
- **CSS Classes**: Use Tailwind utilities
- **State Variables**: camelCase - `userData`, `isLoading`
- **API Functions**: camelCase - `fetchUsers()`, `createUser()`
- **Redux Slices**: camelCase + Slice - `authSlice.js`

### Best Practices

1. **Keep components small** - Single responsibility
2. **Use custom hooks** - Extract complex logic
3. **Avoid prop drilling** - Use Redux for global state
4. **Error boundaries** - Handle component errors
5. **Loading states** - Show feedback to users
6. **Accessibility** - Use semantic HTML and ARIA
7. **Performance** - Use React.memo, useMemo, useCallback when needed
8. **Code splitting** - Use React.lazy for large components

### Comments

```javascript
// Good: Explain WHY, not WHAT
// Update cache before making API call to prevent race condition
const updateCache = () => { ... }

// Bad: Stating the obvious
// Set loading to true
setLoading(true);
```

### Git Commit Messages

```
feat: Add user authentication
fix: Resolve login form validation
refactor: Simplify API error handling
style: Update button colors
docs: Add API documentation
test: Add login tests
chore: Update dependencies
```
