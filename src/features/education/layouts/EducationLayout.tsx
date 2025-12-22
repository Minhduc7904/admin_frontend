import React from 'react';
import { Outlet } from 'react-router-dom';
import { EducationSidebar } from '@/shared/components/sidebar/EducationSidebar';

export const EducationLayout: React.FC = () => {
    return (
        <div className="flex w-full gap-6 -mx-4 -my-8 h-full">
            {/* Sidebar - persistent across routes, sticky */}
            <EducationSidebar />

            {/* Content area with Outlet */}
            <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};
