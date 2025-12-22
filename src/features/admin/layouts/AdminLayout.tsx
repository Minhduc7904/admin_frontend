import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/shared/components/sidebar/AdminSidebar';

export const AdminLayout: React.FC = () => {
    return (
        <div className="flex w-full gap-6 -mx-4 -my-8 h-full">
            {/* Sidebar - persistent across routes, sticky */}
                <AdminSidebar />
            
            {/* Content area with Outlet */}
            <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};
