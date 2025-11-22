import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Image as ImageIcon, Globe, Upload, Settings, FileText, Eye, Palette } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import { Sidebar, type SidebarMenuItem } from './Sidebar';

export const PublicSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = React.useState<string>('overview');

    const menuItems: SidebarMenuItem[] = [
        { id: 'overview', icon: <Globe size={20} />, label: 'Tổng quan' },
        { id: 'banners', icon: <Layout size={20} />, label: 'Quản lý Banner', badge: '8' },
        { id: 'gallery', icon: <ImageIcon size={20} />, label: 'Thư viện ảnh', badge: '348' },
        { id: 'pages', icon: <FileText size={20} />, label: 'Quản lý Trang' },
        { id: 'news', icon: <FileText size={20} />, label: 'Tin tức & Sự kiện' },
        { id: 'upload', icon: <Upload size={20} />, label: 'Upload Media' },
        { id: 'theme', icon: <Palette size={20} />, label: 'Giao diện' },
        { id: 'settings', icon: <Settings size={20} />, label: 'Cài đặt SEO' },
    ];

    const footerContent = (
        <div className="space-y-3">
            <div className="text-xs text-gray-600">
                <p className="font-medium text-gray-900 mb-2">Thống kê tháng này</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye size={14} className="text-blue-600" />
                            <span>Lượt xem:</span>
                        </div>
                        <span className="font-semibold text-gray-900">12.5K</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Upload size={14} className="text-green-600" />
                            <span>Upload mới:</span>
                        </div>
                        <span className="font-semibold text-gray-900">34</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ImageIcon size={14} className="text-purple-600" />
                            <span>Tổng ảnh:</span>
                        </div>
                        <span className="font-semibold text-gray-900">348</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        if (itemId === 'home') {
            navigate(ROUTES.PUBLIC.DASHBOARD);
        }
    };

    return (
        <Sidebar
            title="Public Portal"
            subtitle="Cổng thông tin công cộng"
            menuItems={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            footerContent={footerContent}
        />
    );
};
