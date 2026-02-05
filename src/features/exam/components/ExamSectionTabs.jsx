import { PlusCircle } from 'lucide-react';

export const ExamSectionTabs = ({ sections, activeTab, onTabChange }) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
            {/* Uncategorized Tab */}
            <button
                onClick={() => onTabChange(null)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-t-lg border transition-colors whitespace-nowrap
                    ${activeTab === null
                        ? 'bg-white border-border border-b-white text-blue-600 font-medium -mb-[1px]'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                    }
                `}
            >
                <span>Chưa phân loại</span>
            </button>

            {/* Section Tabs */}
            {sections.map((section) => (
                <button
                    key={section.sectionId}
                    onClick={() => onTabChange(section.sectionId)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-t-lg border transition-colors whitespace-nowrap
                        ${activeTab === section.sectionId
                            ? 'bg-white border-border border-b-white text-blue-600 font-medium -mb-[1px]'
                            : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'
                        }
                    `}
                >
                    <span>{section.title}</span>
                </button>
            ))}
        </div>
    );
};
