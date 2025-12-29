import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authRouter } from './routes';
import { ProtectedRoute } from './shared/components';
import { NotFound } from './shared/pages';
import { ROUTES } from './core/constants';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          
          {/* Auth Routes */}
          {authRouter.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}

          {/* Protected Dashboard Route */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <div className="flex items-center justify-center h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      AD Frontend Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      Ứng dụng React + Vite + Tailwind + Redux + Axios
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
                      <span className="px-3 py-1 bg-info-bg text-info-text rounded-full">React 19</span>
                      <span className="px-3 py-1 bg-success-bg text-success-text rounded-full">Vite 7</span>
                      <span className="px-3 py-1 bg-warning-bg text-warning-text rounded-full">Tailwind 3</span>
                      <span className="px-3 py-1 bg-error-bg text-error-text rounded-full">Redux Toolkit</span>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
