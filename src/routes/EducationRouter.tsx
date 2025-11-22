import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EducationDashboard } from '@/features/dashboard';

export const EducationRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<EducationDashboard />} />
        </Routes>
    );
};