import React from 'react';
import { StudentSidebar } from '@/shared/components/sidebar/StudentSidebar';

export const StudentManagementLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex gap-6 -mx-4 -my-8">
            <StudentSidebar />
            <div className="flex-1 py-4 space-y-4">
                {children}
            </div>
        </div>
    );
}