import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '@/features/dashboard';
import { AdminListPage, AdminDetailPage, PermissionsListPage, SystemLogsPage, NotificationsPage } from '@/features/admin/pages';
import { AdminLayout } from '@/features/admin/layouts/AdminLayout';

export const AdminRouter: React.FC = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="list" element={<AdminListPage />} />
                <Route path="detail/:id" element={<AdminDetailPage />} />
                <Route path="permissions" element={<PermissionsListPage />} />
                <Route path="logs" element={<SystemLogsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
            </Route>
        </Routes>
    );
};