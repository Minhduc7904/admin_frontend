import { useState } from 'react';
import { Sparkles, PenLine } from 'lucide-react';
import { AutoSplitTab } from './AutoSplitTab';
import { ManualSplitTab } from './ManualSplitTab';

const TABS = [
    {
        id: 'auto',
        label: 'Tự động',
        description: 'AI phân tích & tách câu hỏi tự động',
        icon: Sparkles,
        activeClass: 'border-blue-500 bg-blue-50',
        iconActiveClass: 'bg-blue-600 text-white',
        iconIdleClass: 'bg-zinc-100 text-zinc-600',
    },
    {
        id: 'manual',
        label: 'Thủ công',
        description: 'Tách từng phần theo cấu trúc đề thi',
        icon: PenLine,
        activeClass: 'border-emerald-500 bg-emerald-50',
        iconActiveClass: 'bg-emerald-600 text-white',
        iconIdleClass: 'bg-zinc-100 text-zinc-600',
    },
];

export const ProcessQuestionsSidebar = ({
    sessionId,
    sessionRawContentData,
    sessionRawContentLoading,
    onSplit,
    loading,
    splitResult,
    onRefreshSessionContent,
    onSplitSuccess,
}) => {
    const [activeTab, setActiveTab] = useState('manual');

    return (
        <div className="bg-white rounded-lg border border-border p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                    Xử lý câu hỏi
                </h2>
                <p className="text-sm text-foreground-light">
                    Chọn phương thức xử lý câu hỏi từ nội dung đề thi
                </p>
            </div>

            {/* Tab selector */}
            <div className="grid grid-cols-2 gap-3">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            disabled={tab.id === 'auto'}
                            className={`
                                flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-center
                                transition cursor-pointer select-none
                                ${tab.id === 'auto'
                                    ? 'border-border opacity-40 cursor-not-allowed'
                                    : isActive
                                        ? tab.activeClass
                                        : 'border-border hover:border-zinc-300 hover:bg-zinc-50'
                                }
                            `}
                        >
                            <div
                                className={`
                                    p-2.5 rounded-lg transition
                                    ${isActive ? tab.iconActiveClass : tab.iconIdleClass}
                                `}
                            >
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground leading-tight">
                                    {tab.label}
                                </p>
                                <p className="text-xs text-foreground-light mt-0.5 leading-snug">
                                    {tab.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Divider + Tab content */}
            {activeTab && (
                <>
                    <div className="border-t border-border" />

                    {activeTab === 'auto' && (
                        <AutoSplitTab
                            sessionRawContentData={sessionRawContentData}
                            sessionRawContentLoading={sessionRawContentLoading}
                            onSplit={onSplit}
                            loading={loading}
                            splitResult={splitResult}
                        />
                    )}

                    {activeTab === 'manual' && (
                        <ManualSplitTab
                            sessionId={sessionId}
                            sessionRawContentData={sessionRawContentData}
                            sessionRawContentLoading={sessionRawContentLoading}
                            loading={loading}
                            onSplitSuccess={onSplitSuccess}
                        />
                    )}
                </>
            )}
        </div>
    );
};
