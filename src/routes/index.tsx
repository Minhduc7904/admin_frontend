import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout, AuthLayout } from '@/shared/layouts';
import { LoginPage } from '@/features/auth';
import { NotFoundPage, ForbiddenPage } from '@/features/errors';
import { ModuleSelectionPage } from '@/features/modules';
import { DashboardRouter } from './DashboardRouter.tsx';
import { AdminRouter } from './AdminRouter.tsx';
import { EducationRouter } from './EducationRouter.tsx';
import { StudentRouter } from './StudentRouter.tsx';
import { PublicRouter } from './PublicRouter.tsx';
import App from '@/App';

// Protected Route Component
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { ROUTES } from '@/core/constants';

export const router = createBrowserRouter([
    {
        path: ROUTES.AUTH.LOGIN,
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
        ],
    },
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <Navigate to={ROUTES.MODULE_SELECTION} replace />,
            },
            {
                path: ROUTES.MODULE_SELECTION,
                element: <ModuleSelectionPage />,
            },
            {
                element: <MainLayout />,
                children: [
                    {
                        path: ROUTES.DASHBOARD,
                        element: <DashboardRouter />,
                    },
                    {
                        path: '/admin/*',
                        element: <AdminRouter />,
                    },
                    {
                        path: '/education/*',
                        element: <EducationRouter />,
                    },
                    {
                        path: '/student/*',
                        element: <StudentRouter />,
                    },
                    {
                        path: '/public/*',
                        element: <PublicRouter />,
                    },
                ],
            },
        ],
    },
    // Demo route (temporary)
    {
        path: '/demo',
        element: <App />,
    },
    // Error routes
    {
        path: ROUTES.ERRORS.NOT_FOUND,
        element: <NotFoundPage />,
    },
    {
        path: ROUTES.ERRORS.FORBIDDEN,
        element: <ForbiddenPage />,
    },
    // Catch-all route for 404
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);
