import React from 'react';
import { User, ClipboardCheck, BookOpen, DollarSign, GraduationCap } from 'lucide-react';

type TabType = 'info' | 'attendance' | 'assignments' | 'tuition' | 'classes';

interface StudentDetailTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const StudentDetailTabs: React.FC<StudentDetailTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'info' as TabType, label: 'Thông tin học sinh', icon: User },
        { id: 'attendance' as TabType, label: 'Điểm danh', icon: ClipboardCheck },
        { id: 'assignments' as TabType, label: 'Lịch sử làm bài', icon: BookOpen },
        { id: 'tuition' as TabType, label: 'Học phí', icon: DollarSign },
        { id: 'classes' as TabType, label: 'Lớp học', icon: GraduationCap },
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
