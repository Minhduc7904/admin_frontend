import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES } from '@/core/constants';

export const DashboardRouter: React.FC = () => {
    const { selectedModule } = useAppSelector((state) => state.module);

    // Route based on selected module for /dashboard path
    switch (selectedModule) {
        case 'admin':
            return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
        case 'education':
            return <Navigate to={ROUTES.EDUCATION.DASHBOARD} replace />;
        case 'student':
            return <Navigate to={ROUTES.STUDENT.DASHBOARD} replace />;
        case 'public':
            return <Navigate to={ROUTES.PUBLIC.DASHBOARD} replace />;
        default:
            return <Navigate to={ROUTES.MODULE_SELECTION} replace />;
    }
};
