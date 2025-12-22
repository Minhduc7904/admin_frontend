import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserPlus, DollarSign, Calendar, CheckCircle, FileText, BarChart2, Award } from 'lucide-react';
import { ROUTES } from '@/core/constants';
import { Sidebar, type SidebarMenuItem } from './Sidebar';

export const StudentSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine active item based on current route
    const getActiveItem = () => {
        if (location.pathname === ROUTES.STUDENT.LIST) return 'students';
        if (location.pathname === ROUTES.STUDENT.DASHBOARD) return 'overview';
        if (location.pathname === ROUTES.STUDENT.TUITION) return 'tuition';
        return 'overview';
    };
    
    const [activeItem, setActiveItem] = React.useState<string>(getActiveItem());

    // Update active item when route changes
    React.useEffect(() => {
        setActiveItem(getActiveItem());
    }, [location.pathname]);

    const menuItems: SidebarMenuItem[] = [
        { id: 'overview', icon: <BarChart2 size={20} />, label: 'Tổng quan' },
        { id: 'students', icon: <Users size={20} />, label: 'Danh sách học sinh', badge: '485' },
        { id: 'tuition', icon: <DollarSign size={20} />, label: 'Quản lý học phí' },
        // { id: 'schedule', icon: <Calendar size={20} />, label: 'Lịch học' },
        // { id: 'grades', icon: <Award size={20} />, label: 'Kết quả học tập' },
        // { id: 'reports', icon: <FileText size={20} />, label: 'Báo cáo & Thống kê' },
    ];

    const footerContent = (
        <div className="space-y-3">
            <div className="text-xs text-gray-600">
                <p className="font-medium text-gray-900 mb-2">Học phí tháng này</p>
                <div className="flex justify-between mb-1">
                    <span>Đã đóng:</span>
                    <span className="font-semibold text-green-600">89%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
            </div>
            <div className="text-xs text-gray-600">
                <div className="flex justify-between">
                    <span>Chưa đóng:</span>
                    <span className="font-semibold text-orange-600">53 học sinh</span>
                </div>
            </div>
        </div>
    );

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        if (itemId === 'overview') {
            navigate(ROUTES.STUDENT.DASHBOARD);
        } else if (itemId === 'students') {
            navigate(ROUTES.STUDENT.LIST);
        } else if (itemId === 'tuition') {
            navigate(ROUTES.STUDENT.TUITION);
        }
    };

    return (
        <Sidebar
            title="Học sinh"
            subtitle="Quản lý học tập"
            menuItems={menuItems}
            activeItem={activeItem}
            onItemClick={handleItemClick}
            footerContent={footerContent}
        />
    );
};
