import React, { useState } from 'react';
import { Card, Toggle } from '@/shared/components/ui';

interface PermissionItem {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
}

interface PermissionModule {
    id: string;
    title: string;
    description: string;
    permissions: PermissionItem[];
}

interface AdminPermissionsTabProps {
    onPermissionToggle?: (moduleId: string, permissionId: string, enabled: boolean) => void;
}

export const AdminPermissionsTab: React.FC<AdminPermissionsTabProps> = ({ onPermissionToggle }) => {
    const [modules, setModules] = useState<PermissionModule[]>([
        {
            id: 'admin-management',
            title: 'Quyền quản lý Admin',
            description: 'Quản lý tài khoản và phân quyền cho admin',
            permissions: [
                { id: 'admin.view', name: 'Xem danh sách Admin', description: 'Cho phép xem danh sách tất cả admin', enabled: true },
                { id: 'admin.create', name: 'Thêm Admin mới', description: 'Cho phép tạo tài khoản admin mới', enabled: true },
                { id: 'admin.edit', name: 'Chỉnh sửa Admin', description: 'Cho phép cập nhật thông tin admin', enabled: true },
                { id: 'admin.delete', name: 'Xóa Admin', description: 'Cho phép xóa tài khoản admin', enabled: false },
                { id: 'admin.permissions', name: 'Quản lý phân quyền', description: 'Cho phép phân quyền cho admin khác', enabled: true },
            ],
        },
        {
            id: 'education-management',
            title: 'Quyền quản lý Giáo dục',
            description: 'Quản lý nội dung giảng dạy và khóa học',
            permissions: [
                { id: 'edu.courses.view', name: 'Xem khóa học', enabled: true },
                { id: 'edu.courses.create', name: 'Tạo khóa học', enabled: true },
                { id: 'edu.courses.edit', name: 'Chỉnh sửa khóa học', enabled: true },
                { id: 'edu.courses.delete', name: 'Xóa khóa học', enabled: false },
                { id: 'edu.lessons.manage', name: 'Quản lý bài học', enabled: true },
                { id: 'edu.exams.manage', name: 'Quản lý đề thi', enabled: true },
            ],
        },
        {
            id: 'student-management',
            title: 'Quyền quản lý Học sinh',
            description: 'Quản lý thông tin và hoạt động của học sinh',
            permissions: [
                { id: 'student.view', name: 'Xem danh sách học sinh', enabled: true },
                { id: 'student.create', name: 'Thêm học sinh mới', enabled: false },
                { id: 'student.edit', name: 'Chỉnh sửa thông tin học sinh', enabled: true },
                { id: 'student.delete', name: 'Xóa học sinh', enabled: false },
                { id: 'student.progress', name: 'Xem tiến độ học tập', enabled: true },
                { id: 'student.reports', name: 'Xuất báo cáo học sinh', enabled: true },
            ],
        },
        {
            id: 'public-management',
            title: 'Quyền quản lý Trang Public',
            description: 'Quản lý nội dung hiển thị công khai',
            permissions: [
                { id: 'public.content.view', name: 'Xem nội dung public', enabled: true },
                { id: 'public.content.edit', name: 'Chỉnh sửa nội dung public', enabled: true },
                { id: 'public.banners.manage', name: 'Quản lý banner', enabled: false },
                { id: 'public.news.manage', name: 'Quản lý tin tức', enabled: true },
                { id: 'public.seo.manage', name: 'Quản lý SEO', enabled: false },
            ],
        },
    ]);

    const handleToggle = (moduleId: string, permissionId: string) => {
        setModules((prevModules) =>
            prevModules.map((module) =>
                module.id === moduleId
                    ? {
                          ...module,
                          permissions: module.permissions.map((perm) =>
                              perm.id === permissionId
                                  ? { ...perm, enabled: !perm.enabled }
                                  : perm
                          ),
                      }
                    : module
            )
        );

        // Callback to parent if needed
        const module = modules.find((m) => m.id === moduleId);
        const permission = module?.permissions.find((p) => p.id === permissionId);
        if (permission) {
            onPermissionToggle?.(moduleId, permissionId, !permission.enabled);
        }
    };

    return (
        <div className="space-y-6">
            {modules.map((module) => (
                <Card key={module.id}>
                    {/* Module Header */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-3">
                        {module.permissions.map((permission) => (
                            <div
                                key={permission.id}
                                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {permission.name}
                                        </span>
                                    </div>
                                    {permission.description && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {permission.description}
                                        </p>
                                    )}
                                </div>

                                {/* Toggle Switch */}
                                <Toggle
                                    checked={permission.enabled}
                                    onChange={() => handleToggle(module.id, permission.id)}
                                    label={`Toggle ${permission.name}`}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
};
