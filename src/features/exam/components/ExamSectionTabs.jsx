import { Plus } from 'lucide-react';
import { SectionTab } from './SectionTab';

export const ExamSectionTabs = ({ sections, activeTab, onTabChange, onAddSection }) => {
    return (
        <div className="relative flex items-end border-b border-border px-2">
            {/* Scrollable tabs */}
            <div className="flex items-end overflow-x-auto scrollbar-thin pt-2 gap-1">
                {/* Fixed tab - Uncategorized */}
                <SectionTab
                    section={{ title: 'Chưa phân loại' }}
                    isActive={activeTab === null}
                    onClick={() => onTabChange(null)}
                    isFixed
                />

                {/* Section tabs */}
                {sections.map((section) => (
                    <SectionTab
                        key={section.sectionId}
                        section={section}
                        isActive={activeTab === section.sectionId}
                        onClick={() => onTabChange(section.sectionId)}
                    />
                ))}
            </div>

            {/* Add section button */}
            <button
                onClick={onAddSection}
                title="Tạo Section mới"
                className="
                    ml-2 mb-1
                    h-8 w-8
                    flex items-center justify-center
                    rounded-md
                    border border-gray-300
                    bg-white
                    text-gray-600
                    hover:bg-gray-50
                    transition
                "
            >
                <Plus size={16} />
            </button>
        </div>
    );
};
