import React from 'react';
import { User, Shield, Clock, FileText } from 'lucide-react';

type TabType = 'info' | 'permissions' | 'activity' | 'files';

interface AdminDetailTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const AdminDetailTabs: React.FC<AdminDetailTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'info' as TabType, label: 'Thông tin cá nhân', icon: User },
        { id: 'permissions' as TabType, label: 'Phân quyền', icon: Shield },
        { id: 'activity' as TabType, label: 'Lịch sử hoạt động', icon: Clock },
        { id: 'files' as TabType, label: 'File đã đăng', icon: FileText },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
