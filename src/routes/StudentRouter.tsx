import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StudentDashboard, StudentListPage, StudentDetailPage } from '@/features/dashboard';

export const StudentRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="list" element={<StudentListPage />} />
            <Route path="detail/:id" element={<StudentDetailPage />} />
        </Routes>
    );
};