import React from 'react';
import { Card } from '@/shared/components/ui';

interface Permission {
    id: string;
    module: string;
    permissions: string[];
}

interface AdminPermissionsTabProps {
    permissions: Permission[];
    onEdit?: (permissionId: string) => void;
}

export const AdminPermissionsTab: React.FC<AdminPermissionsTabProps> = ({ permissions, onEdit }) => {
    return (
        <div className="space-y-4">
            {permissions.map((permission) => (
                <Card key={permission.id}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">{permission.module}</h4>
                            <p className="text-xs text-gray-500 mt-1">{permission.permissions.length} quyền</p>
                        </div>
                        <button
                            onClick={() => onEdit?.(permission.id)}
                            className="text-xs text-gray-600 hover:text-gray-900"
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {permission.permissions.map((perm, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                            >
                                {perm}
                            </span>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};
