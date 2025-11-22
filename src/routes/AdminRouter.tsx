import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '@/features/dashboard';
import { AdminListPage, AdminDetailPage } from '@/features/admin/pages';

export const AdminRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="list" element={<AdminListPage />} />
            <Route path="detail/:id" element={<AdminDetailPage />} />
        </Routes>
    );
};