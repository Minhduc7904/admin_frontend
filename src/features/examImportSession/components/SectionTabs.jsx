import { Plus } from 'lucide-react';
import { SectionTab } from './SectionTab';

export const SectionTabs = ({
    sections,
    activeTab,
    onTabChange,
    onCreateSection,
    onCloseTab,
}) => {
    return (
        <div className="relative flex items-end  border-b border-border px-2">
            {/* Scrollable tabs */}
            <div className="flex items-end overflow-x-auto scrollbar-thin pt-2">
                {/* Fixed tab */}
                <SectionTab
                    section={{ title: 'Chưa phân loại' }}
                    isActive={activeTab === null}
                    onClick={() => onTabChange(null)}
                    isFixed
                />

                {/* Section tabs */}
                {sections.map((section) => (
                    <SectionTab
                        key={section.tempSectionId}
                        section={section}
                        isActive={activeTab === section.tempSectionId}
                        onClick={() =>
                            onTabChange(section.tempSectionId)
                        }
                        onClose={() =>
                            onCloseTab(section.tempSectionId)
                        }
                    />
                ))}
            </div>

            {/* Add section */}
            <button
                onClick={onCreateSection}
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
