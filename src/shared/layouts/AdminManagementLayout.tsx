import React from 'react';
import { AdminSidebar } from '@/shared/components/sidebar/AdminSidebar';

export const AdminManagementLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex w-full gap-6 -mx-4 -my-8">
            <AdminSidebar />
            <div className="flex-1 py-4 space-y-4">
                {children}
            </div>
        </div>
    );
}