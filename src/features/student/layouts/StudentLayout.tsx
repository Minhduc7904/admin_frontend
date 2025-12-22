import React from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from '@/shared/components/sidebar/StudentSidebar';

export const StudentLayout: React.FC = () => {
    return (
        <div className="flex w-full gap-6 -mx-4 -my-8 h-full">
            {/* Sidebar - persistent across routes, sticky */}
                <StudentSidebar />
            
            {/* Content area with Outlet */}
            <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};
