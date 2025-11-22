import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicDashboard } from '@/features/dashboard';

export const PublicRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<PublicDashboard />} />
        </Routes>
    );
};