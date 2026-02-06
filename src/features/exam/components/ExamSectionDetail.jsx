import { Pencil } from 'lucide-react';
import { MarkdownRenderer } from '../../../shared/components/markdown/MarkdownRenderer';

export const ExamSectionDetail = ({ section, questionsCount, onEditSection }) => {
    if (!section) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Câu hỏi chưa phân loại
                </h3>
                <p className="text-sm text-gray-600">
                    Các câu hỏi chưa được gán vào phần nào.
                </p>
                <div className="mt-3 text-sm text-gray-500">
                    <span className="font-medium">{questionsCount}</span> câu hỏi
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {section.title}
                    </h3>
                    {(section.processedDescription || section.description) && (
                        <div className="mt-2 prose prose-sm max-w-none">
                            <MarkdownRenderer 
                                content={section.processedDescription || section.description} 
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEditSection?.(section)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Chỉnh sửa phần"
                    >
                        <Pencil size={18} />
                    </button>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                        Thứ tự: {section.order}
                    </span>
                </div>
            </div>
            
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <div>
                    <span className="font-medium text-gray-900">{questionsCount}</span> câu hỏi
                </div>
            </div>
        </div>
    );
};
