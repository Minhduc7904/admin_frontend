import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES } from '@/core/constants';
import { Loading } from '@/shared/components/ui';

export const ProtectedRoute = () => {
    // const { isAuthenticated, status } = useAppSelector((state) => state.auth);

    // if (status === 'pending') {
    //     return <Loading fullScreen />;
    // }

    // if (!isAuthenticated) {
    //     return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    // }

    return <Outlet />;
};
