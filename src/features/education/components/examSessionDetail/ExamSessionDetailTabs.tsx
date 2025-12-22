import React from 'react';

type TabType = 'info' | 'submissions' | 'preview' | 'cheat-log';

interface ExamSessionDetailTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const ExamSessionDetailTabs: React.FC<ExamSessionDetailTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const tabs = [
        { id: 'info' as TabType, label: 'Chi tiết' },
        { id: 'submissions' as TabType, label: 'Danh sách bài làm' },
        { id: 'preview' as TabType, label: 'Xem trước đề thi' },
        { id: 'cheat-log' as TabType, label: 'Log gian lận' },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? 'border-gray-900 text-gray-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
