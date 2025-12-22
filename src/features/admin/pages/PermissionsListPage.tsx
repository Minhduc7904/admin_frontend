import React, { useState } from 'react';
import {
    PermissionsPageHeader,
    PermissionsFilters,
    PermissionsStats,
    PermissionsModuleCard,
    type PermissionModule,
} from '../components/permissions';

export const PermissionsListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
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
    };

    const handleEditModule = (moduleId: string) => {
        console.log('Edit module:', moduleId);
    };

    const handleDeleteModule = (moduleId: string) => {
        console.log('Delete module:', moduleId);
    };

    const handleAddPermission = (moduleId: string) => {
        console.log('Add permission to module:', moduleId);
    };

    const handleAddModule = () => {
        console.log('Add new module');
    };

    const filteredModules = modules.filter((module) =>
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.permissions.some((perm) =>
            perm.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Calculate stats
    const totalModules = modules.length;
    const totalPermissions = modules.reduce((sum, module) => sum + module.permissions.length, 0);
    const activePermissions = modules.reduce(
        (sum, module) => sum + module.permissions.filter((p) => p.enabled).length,
        0
    );
    const inactivePermissions = totalPermissions - activePermissions;

    return (
        <div className="space-y-4">
            {/* Header */}
            <PermissionsPageHeader onAddClick={handleAddModule} />

            {/* Stats */}
            <PermissionsStats
                totalModules={totalModules}
                totalPermissions={totalPermissions}
                activePermissions={activePermissions}
                inactivePermissions={inactivePermissions}
            />

            {/* Filters */}
            <PermissionsFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Permissions Modules */}
            <div className="space-y-3">
                {filteredModules.map((module) => (
                    <PermissionsModuleCard
                        key={module.id}
                        module={module}
                        onToggle={handleToggle}
                        onEditModule={handleEditModule}
                        onDeleteModule={handleDeleteModule}
                        onAddPermission={handleAddPermission}
                    />
                ))}
            </div>

            {/* No Results */}
            {filteredModules.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-xs text-gray-500">Không tìm thấy kết quả phù hợp</p>
                </div>
            )}
        </div>
    );
};
