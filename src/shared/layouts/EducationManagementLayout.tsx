import React from 'react';
import { EducationSidebar } from '@/shared/components/sidebar/EducationSidebar';

export const EducationManagementLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex gap-6 -mx-4 -my-8">
            <EducationSidebar />
            <div className="flex-1 py-4 space-y-4">
                {children}
            </div>
        </div>
    );
}