import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, Toggle } from '@/shared/components/ui';

export interface PermissionItem {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
}

export interface PermissionModule {
    id: string;
    title: string;
    description: string;
    permissions: PermissionItem[];
}

interface PermissionsModuleCardProps {
    module: PermissionModule;
    onToggle: (moduleId: string, permissionId: string) => void;
    onEditModule?: (moduleId: string) => void;
    onDeleteModule?: (moduleId: string) => void;
    onAddPermission?: (moduleId: string) => void;
}

export const PermissionsModuleCard: React.FC<PermissionsModuleCardProps> = ({
    module,
    onToggle,
    onEditModule,
    onDeleteModule,
    onAddPermission,
}) => {
    return (
        <Card>
            {/* Module Header */}
            <div className="mb-4 pb-3 border-b border-gray-200 flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{module.title}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                            {module.permissions.length} quyền
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{module.description}</p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onAddPermission?.(module.id)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Thêm quyền"
                    >
                        <Plus size={16} />
                    </button>
                    <button
                        onClick={() => onEditModule?.(module.id)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDeleteModule?.(module.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Permissions List */}
            <div className="space-y-2">
                {module.permissions.map((permission) => (
                    <div
                        key={permission.id}
                        className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-900">
                                    {permission.name}
                                </span>
                                <code className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded font-mono">
                                    {permission.id}
                                </code>
                            </div>
                            {permission.description && (
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    {permission.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Status Badge */}
                            <span
                                className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                                    permission.enabled
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {permission.enabled ? 'Hoạt động' : 'Tắt'}
                            </span>

                            {/* Toggle Switch */}
                            <Toggle
                                checked={permission.enabled}
                                onChange={() => onToggle(module.id, permission.id)}
                                label={`Toggle ${permission.name}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
