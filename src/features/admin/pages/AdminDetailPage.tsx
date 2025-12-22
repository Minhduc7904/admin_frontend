import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    AdminDetailHeader,
    AdminDetailTabs,
    AdminInfoTab,
    AdminPermissionsTab,
    AdminActivityTab,
    AdminFilesTab,
} from '@/features/admin/components/list';

type TabType = 'info' | 'permissions' | 'activity' | 'files';

interface Admin {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    joinedDate: string;
    lastLogin: string;
    avatar?: string;
}

interface Permission {
    id: string;
    module: string;
    permissions: string[];
}

interface Activity {
    id: string;
    action: string;
    description: string;
    timestamp: string;
    status: 'success' | 'failed';
}

interface FileItem {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    downloads: number;
}

export const AdminDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<TabType>('info');

    // Mock data
    const admin: Admin = {
        id: id || '1',
        name: 'Nguyễn Văn A',
        email: 'admin@example.com',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam',
        role: 'Super Admin',
        status: 'active',
        joinedDate: '15/01/2025',
        lastLogin: '2 phút trước',
    };

    const permissions: Permission[] = [
        {
            id: '1',
            module: 'Quản lý Admin',
            permissions: ['Xem', 'Thêm', 'Sửa', 'Xóa'],
        },
        {
            id: '2',
            module: 'Quản lý Giáo dục',
            permissions: ['Xem', 'Thêm', 'Sửa'],
        },
        {
            id: '3',
            module: 'Quản lý Học sinh',
            permissions: ['Xem'],
        },
        {
            id: '4',
            module: 'Báo cáo & Thống kê',
            permissions: ['Xem', 'Xuất file'],
        },
    ];

    const activities: Activity[] = [
        {
            id: '1',
            action: 'Đăng nhập',
            description: 'Đăng nhập vào hệ thống',
            timestamp: '2 phút trước',
            status: 'success',
        },
        {
            id: '2',
            action: 'Chỉnh sửa',
            description: 'Cập nhật thông tin admin ID: 5',
            timestamp: '1 giờ trước',
            status: 'success',
        },
        {
            id: '3',
            action: 'Xóa',
            description: 'Xóa admin ID: 12',
            timestamp: '3 giờ trước',
            status: 'success',
        },
        {
            id: '4',
            action: 'Thêm mới',
            description: 'Thêm admin mới: Trần Văn B',
            timestamp: '5 giờ trước',
            status: 'success',
        },
        {
            id: '5',
            action: 'Đăng nhập',
            description: 'Đăng nhập thất bại - Sai mật khẩu',
            timestamp: '1 ngày trước',
            status: 'failed',
        },
    ];

    const files: FileItem[] = [
        {
            id: '1',
            name: 'Báo cáo tháng 11.pdf',
            type: 'PDF',
            size: '2.5 MB',
            uploadedAt: '20/11/2024',
            downloads: 45,
        },
        {
            id: '2',
            name: 'Danh sách học sinh.xlsx',
            type: 'Excel',
            size: '1.2 MB',
            uploadedAt: '18/11/2024',
            downloads: 32,
        },
        {
            id: '3',
            name: 'Tài liệu hướng dẫn.docx',
            type: 'Word',
            size: '850 KB',
            uploadedAt: '15/11/2024',
            downloads: 67,
        },
        {
            id: '4',
            name: 'Ảnh sự kiện.zip',
            type: 'ZIP',
            size: '15.3 MB',
            uploadedAt: '10/11/2024',
            downloads: 12,
        },
    ];

    // Handlers
    const handleEdit = () => {
        console.log('Edit admin info');
    };

    const handlePermissionToggle = (moduleId: string, permissionId: string, enabled: boolean) => {
        console.log('Toggle permission:', { moduleId, permissionId, enabled });
    };

    const handleDownloadFile = (fileId: string) => {
        console.log('Download file:', fileId);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <AdminInfoTab admin={admin} onEdit={handleEdit} />;
            case 'permissions':
                return <AdminPermissionsTab onPermissionToggle={handlePermissionToggle} />;
            case 'activity':
                return <AdminActivityTab activities={activities} />;
            case 'files':
                return <AdminFilesTab files={files} onDownload={handleDownloadFile} />;
            default:
                return null;
        }
    };

    return (
        <>
            <AdminDetailHeader />
            <AdminDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
        </>
    );
};
