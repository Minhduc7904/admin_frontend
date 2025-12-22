import React from 'react';
import { Info, List, Eye } from 'lucide-react';

type TabType = 'info' | 'questions' | 'preview';

interface ExamDetailTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const ExamDetailTabs: React.FC<ExamDetailTabsProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'info' as TabType, label: 'Thông tin', icon: Info },
        { id: 'questions' as TabType, label: 'Danh sách câu hỏi', icon: List },
        { id: 'preview' as TabType, label: 'Xem trước', icon: Eye },
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
