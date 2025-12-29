/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colors - trắng đen xám
        primary: {
          DEFAULT: "#FFFFFF",
          dark: "#F8F9FA",
          darker: "#E9ECEF",
        },
        foreground: {
          DEFAULT: "#212529",
          light: "#495057",
          lighter: "#6C757D",
        },
        // Grayscale
        gray: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        // Success - xanh lá
        success: {
          DEFAULT: "#10B981",
          light: "#34D399",
          dark: "#059669",
          bg: "#D1FAE5",
          text: "#065F46",
        },
        // Error/Danger - đỏ
        error: {
          DEFAULT: "#EF4444",
          light: "#F87171",
          dark: "#DC2626",
          bg: "#FEE2E2",
          text: "#991B1B",
        },
        // Warning - vàng (bonus)
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
          bg: "#FEF3C7",
          text: "#92400E",
        },
        // Info - xanh dương (bonus)
        info: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
          bg: "#DBEAFE",
          text: "#1E3A8A",
        },
        // Border colors
        border: {
          DEFAULT: "#E9ECEF",
          light: "#F1F3F5",
          dark: "#DEE2E6",
        },
      },
    },
  },
  plugins: [],
};
