# AD Frontend

React application built with Vite, Tailwind CSS, Redux Toolkit, and Axios.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── core/              # Core functionality
│   ├── api/          # API clients
│   ├── constants/    # Constants
│   ├── store/        # Redux store
│   └── utils/        # Utilities
├── features/         # Feature modules
├── routes/           # Route definitions
├── shared/           # Shared components
│   ├── components/   # Reusable components
│   ├── layouts/      # Layout components
│   └── pages/        # Shared pages
└── assets/           # Static assets
```

## Development

The application uses path aliases for cleaner imports:
- `@/*` - src directory
- `@core/*` - src/core
- `@features/*` - src/features
- `@shared/*` - src/shared
- `@routes/*` - src/routes

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```
VITE_API_BASE_URL=your_api_url
```
