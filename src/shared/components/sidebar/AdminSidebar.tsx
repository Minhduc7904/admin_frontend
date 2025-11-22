import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Users, Settings, Key, Bell, FileText, Activity, Database } from 'lucide-react';
import { Sidebar, type SidebarMenuItem } from './Sidebar';
import { ROUTES } from '@/core/constants';

export const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine active item based on current route
    const getActiveItem = () => {
        if (location.pathname.includes('/admin/list')) return 'admins';
        return 'overview';
    };
    
    const [activeItem, setActiveItem] = React.useState<string>(getActiveItem());
    
    React.useEffect(() => {
        setActiveItem(getActiveItem());
    }, [location.pathname]);

    const menuItems: SidebarMenuItem[] = [
        { id: 'overview', icon: <Activity size={20} />, label: 'Tổng quan' },
        { id: 'admins', icon: <Shield size={20} />, label: 'Danh sách Admin', badge: '12' },
        // { id: 'users', icon: <Users size={20} />, label: 'Quản lý Users', badge: '245' },
        { id: 'roles', icon: <Key size={20} />, label: 'Phân quyền' },
        { id: 'permissions', icon: <Settings size={20} />, label: 'Cấu hình quyền' },
        { id: 'logs', icon: <FileText size={20} />, label: 'Nhật ký hệ thống' },
        { id: 'notifications', icon: <Bell size={20} />, label: 'Thông báo', badge: '3' },
        { id: 'database', icon: <Database size={20} />, label: 'Backup & Restore' },
    ];

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        
        // Navigate based on menu item
        switch (itemId) {
            case 'overview':
                navigate(ROUTES.ADMIN.DASHBOARD);
                break;
            case 'admins':
                navigate(ROUTES.ADMIN.LIST);
                break;
            case 'users':
            case 'roles':
            case 'permissions':
            case 'logs':
            case 'notifications':
            case 'database':
                // TODO: Implement these routes
                console.log(`Navigate to ${itemId}`);
                break;
        }
    };

    const footerContent = (
        <div className="text-xs text-gray-600">
            <p className="font-medium">Phiên bản: 1.0.0</p>
            <p className="mt-1">© 2025 Admin System</p>
        </div>
    );

    return (
        <Sidebar
            title="Admin Panel"
            subtitle="Quản trị hệ thống"
            menuItems={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            footerContent={footerContent}
        />
    );
};
