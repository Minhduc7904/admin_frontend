import React from 'react';
import { Info, Users, ClipboardCheck, BookOpen, Calendar, DollarSign } from 'lucide-react';

type TabType = 'info' | 'students' | 'attendance' | 'lessons' | 'schedule' | 'tuition';

interface ClassDetailTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const ClassDetailTabs: React.FC<ClassDetailTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'info' as TabType, label: 'Thông tin', icon: Info },
        { id: 'students' as TabType, label: 'Danh sách học sinh', icon: Users },
        { id: 'attendance' as TabType, label: 'Điểm danh', icon: ClipboardCheck },
        { id: 'lessons' as TabType, label: 'Buổi học', icon: BookOpen },
        { id: 'schedule' as TabType, label: 'Lịch học', icon: Calendar },
        { id: 'tuition' as TabType, label: 'Học phí', icon: DollarSign },
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
