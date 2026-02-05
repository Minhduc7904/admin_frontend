export const ExamSectionDetail = ({ section, questionsCount }) => {
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
                    {section.description && (
                        <p className="text-sm text-gray-600">
                            {section.description}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
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
