import { BookOpen, Edit2, Hash } from 'lucide-react';

export const SectionDetailPanel = ({
    section,
    questionsCount,
    onEdit,
}) => {
    /* ================= Uncategorized ================= */
    if (!section) {
        return (
            <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <BookOpen size={22} className="text-gray-500" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Câu hỏi chưa phân loại
                        </h3>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            Danh sách các câu hỏi chưa được gán vào Section
                            nào. Bạn có thể di chuyển câu hỏi vào Section
                            bằng thao tác kéo thả hoặc menu chức năng.
                        </p>

                        <div className="flex items-center gap-2 text-sm pt-2">
                            <Hash size={16} className="text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {questionsCount} câu hỏi
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ================= Section detail ================= */
    return (
        <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <BookOpen size={22} className="text-gray-600" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {section.title}
                        </h3>

                        {onEdit && (
                            <button
                                onClick={onEdit}
                                title="Chỉnh sửa Section"
                                className="
                                    p-1.5 rounded
                                    border border-gray-300
                                    text-gray-600
                                    hover:bg-gray-100
                                    hover:text-gray-800
                                    transition
                                "
                            >
                                <Edit2 size={15} />
                            </button>
                        )}
                    </div>

                    {section.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {section.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-sm pt-1">
                        <div className="flex items-center gap-2">
                            <Hash size={16} className="text-gray-400" />
                            <span className="text-gray-700 font-medium">
                                {questionsCount} câu hỏi
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                                Thứ tự:
                            </span>
                            <span className="text-gray-700 font-medium">
                                {section.order}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
