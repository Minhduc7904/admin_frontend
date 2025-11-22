# Style Guide - Admin Frontend

## 🎨 Color Palette

### Primary Colors
```css
/* Background Colors */
- Primary Background: bg-gradient-to-br from-gray-900 via-gray-800 to-black
- Card Background: bg-white (light mode), bg-gray-800 (dark contexts)
- Border: border-gray-200, border-gray-700

/* Text Colors */
- Primary Text: text-gray-900 (on light backgrounds)
- Secondary Text: text-gray-600, text-gray-400
- Light Text: text-white (on dark backgrounds)

/* Accent Colors */
- Primary Accent: bg-black, hover:bg-gray-900
- Error: text-red-600, bg-red-50, border-red-300
- Success: text-green-600
- Info: text-blue-500
```

### Color Scheme Philosophy
- **Chủ đạo**: Đen (Black) - Trắng (White) - Xám (Gray)
- **Minimalist**: Tập trung vào nội dung, không màu sắc rực rỡ
- **Professional**: Phù hợp cho admin panel và công cụ quản trị

## 📐 Layout & Spacing

### Container Sizes
```css
- Max Width Forms: max-w-md (448px)
- Max Width Content: max-w-7xl (1280px)
- Full Screen: min-h-screen
```

### Spacing Scale (Tailwind)
```css
- Extra Small: p-1, m-1 (4px)
- Small: p-2, m-2 (8px)
- Medium: p-4, m-4 (16px)
- Large: p-6, m-6 (24px)
- Extra Large: p-8, m-8 (32px)
```

### Common Patterns
```tsx
// Card Padding
className="p-8"

// Section Spacing
className="mb-6 space-y-2"

// Input Spacing
className="mt-1 mb-4"
```

## 🔤 Typography

### Font Families
```css
- Primary: font-sans (Inter, system-ui, sans-serif)
```

### Font Sizes
```css
- Heading XL: text-3xl (30px)
- Heading Large: text-2xl (24px)
- Heading Medium: text-xl (20px)
- Body: text-base (16px)
- Small: text-sm (14px)
- Extra Small: text-xs (12px)
```

### Font Weights
```css
- Bold: font-bold (700)
- Semibold: font-semibold (600)
- Medium: font-medium (500)
- Normal: font-normal (400)
```

### Text Styles
```tsx
// Page Title
<h2 className="text-3xl font-bold text-white mb-2">

// Section Title
<h3 className="text-xl font-semibold text-gray-900">

// Label
<label className="block text-sm font-medium text-gray-700">

// Body Text
<p className="text-gray-600">

// Small Text
<span className="text-xs text-gray-400">
```

## 🖼️ Components Style

### Button Styles

#### Primary Button
```tsx
<button className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium">
```

#### Secondary Button
```tsx
<button className="text-gray-600 hover:text-gray-900 transition-colors">
```

#### Disabled State
```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Input Styles

#### Text Input
```tsx
<input className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all" />
```

#### Input with Icon
```tsx
<div className="relative">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
  <input className="w-full px-4 py-3 pl-11 ..." />
</div>
```

### Card Styles

#### Standard Card
```tsx
<div className="bg-white rounded-2xl shadow-xl p-8">
```

#### Info Card (Light)
```tsx
<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
```

### Error Message
```tsx
<div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
```

## 🎭 Animations & Transitions

### Transition Classes
```css
- Standard: transition-colors
- All Properties: transition-all
- Transform: transition-transform
```

### Duration (default 150ms)
```css
duration-200, duration-300
```

### Hover Effects
```tsx
// Button Hover
hover:bg-gray-900

// Link Hover
hover:text-gray-900

// Scale Hover
hover:scale-105

// Shadow Hover
hover:shadow-lg
```

### Loading Animation
```tsx
<Loader2 className="animate-spin" size={20} />
```

## 🔲 Borders & Shadows

### Border Radius
```css
- Small: rounded (4px)
- Medium: rounded-lg (8px)
- Large: rounded-2xl (16px)
- Full: rounded-full (9999px)
```

### Box Shadow
```css
- Small: shadow-sm
- Medium: shadow-md
- Large: shadow-lg
- Extra Large: shadow-xl
```

### Border Width
```css
- Default: border (1px)
- Thick: border-2 (2px)
```

## 📱 Responsive Design

### Breakpoints (Tailwind Default)
```css
- Mobile: < 640px (default)
- Tablet: sm: >= 640px
- Desktop: md: >= 768px
- Large Desktop: lg: >= 1024px
- Extra Large: xl: >= 1280px
```

### Common Responsive Patterns
```tsx
// Padding Responsive
className="p-4 md:p-6 lg:p-8"

// Text Size Responsive
className="text-xl md:text-2xl lg:text-3xl"

// Grid Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## 🎯 Focus States

### Focus Ring (Accessibility)
```css
focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
```

### Focus Visible (Keyboard Navigation)
```css
focus-visible:ring-2 focus-visible:ring-gray-500
```

## 🌐 Icons (lucide-react)

### Icon Sizes
```tsx
- Small: size={16}
- Medium: size={20} (default)
- Large: size={24}
```

### Icon Colors
```tsx
- Default: text-gray-400
- Active: text-gray-900
- Light: text-white
- Error: text-red-600
```

### Common Icons
```tsx
import { 
  Lock,           // Authentication
  Mail,           // Email input
  Eye,            // Show password
  EyeOff,         // Hide password
  Loader2,        // Loading spinner
  ArrowRight,     // Submit action
  AlertCircle,    // Error/warning
  Check,          // Success
  X,              // Close/cancel
  Menu,           // Navigation menu
} from 'lucide-react';
```

## 📝 Form Patterns

### Form Container
```tsx
<form onSubmit={handleSubmit} className="space-y-6">
```

### Form Group
```tsx
<div className="space-y-2">
  <label />
  <input />
</div>
```

### Checkbox Pattern
```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input type="checkbox" className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500" />
  <span className="text-sm text-gray-700">Remember me</span>
</label>
```

## 🎨 Background Gradients

### Primary Gradient (Login Page)
```tsx
className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black"
```

### Subtle Gradients
```tsx
className="bg-gradient-to-r from-gray-50 to-gray-100"
```

## ✅ Best Practices

### 1. Consistency
- Sử dụng cùng một bộ màu xuyên suốt ứng dụng
- Giữ khoảng cách (spacing) nhất quán giữa các components
- Dùng chung font size và font weight scale

### 2. Accessibility
- Luôn có `focus` states cho interactive elements
- Contrast ratio đủ cao cho text (WCAG AA: 4.5:1)
- Sử dụng semantic HTML tags

### 3. Performance
- Sử dụng Tailwind utility classes thay vì custom CSS
- Tránh inline styles không cần thiết
- Optimize images và icons

### 4. Maintainability
- Tách components nhỏ, tái sử dụng được
- Tạo shared components cho UI patterns chung
- Document styles trong README của từng component

## 📦 Component Structure

```tsx
// Example Component với đầy đủ styles
import React from 'react';
import { Icon } from 'lucide-react';

interface Props {
  // Props definition
}

export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  return (
    <div className="container-classes">
      <div className="wrapper-classes">
        <Icon className="icon-classes" size={20} />
        <h2 className="heading-classes">Title</h2>
        <p className="text-classes">Description</p>
        <button className="button-classes">
          Action
        </button>
      </div>
    </div>
  );
};
```

## 🔍 Quick Reference

### Common Class Combinations

**Button Primary:**
```
bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium
```

**Input Field:**
```
w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none transition-all
```

**Card:**
```
bg-white rounded-2xl shadow-xl p-8
```

**Error Message:**
```
bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2
```

---

**Last Updated:** November 22, 2025  
**Version:** 1.0.0  
**Framework:** React + TypeScript + Tailwind CSS v3
