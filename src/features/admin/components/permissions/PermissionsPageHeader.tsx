import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface PermissionsPageHeaderProps {
    onAddClick?: () => void;
}

export const PermissionsPageHeader: React.FC<PermissionsPageHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Phân quyền</h1>
                <p className="text-xs text-gray-600 mt-1">Quản lý các quyền hạn trong hệ thống</p>
            </div>
        </div>
    );
};
