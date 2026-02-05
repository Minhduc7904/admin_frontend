import { ConfirmModal } from '../../../shared/components/ui';

export const QuestionDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    question,
    loading,
}) => {
    if (!question) return null;

    const hasStatements = question.statements && question.statements.length > 0;
    const hasChapters = question.questionChapters && question.questionChapters.length > 0;

    // Tạo preview nội dung câu hỏi (giới hạn 100 ký tự)
    const contentPreview = question.content && question.content.length > 100
        ? question.content.substring(0, 100) + '...'
        : question.content;

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa câu hỏi"
            message={
                <>
                    <div className="text-left mb-3">
                        <p className="text-sm text-foreground mb-2">
                            Bạn có chắc chắn muốn xóa câu hỏi sau?
                        </p>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <p className="text-xs text-foreground-lighter mb-1">
                                ID: <span className="font-mono">#{question.questionId}</span>
                            </p>
                            <p className="text-sm text-foreground line-clamp-2">
                                {contentPreview}
                            </p>
                        </div>
                    </div>

                    {(hasStatements || hasChapters) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
                            <p className="text-xs text-yellow-800 font-medium mb-1">
                                ⚠️ Dữ liệu liên quan sẽ bị xóa:
                            </p>
                            <ul className="text-xs text-yellow-700 list-disc list-inside space-y-0.5">
                                {hasStatements && (
                                    <li>{question.statements.length} phương án trả lời</li>
                                )}
                                {hasChapters && (
                                    <li>{question.questionChapters.length} liên kết chương</li>
                                )}
                            </ul>
                        </div>
                    )}

                    <p className="text-xs text-red-600 font-medium text-center">
                        ⚠️ Hành động này không thể hoàn tác
                    </p>
                </>
            }
            confirmText="Xóa câu hỏi"
            cancelText="Hủy"
            variant="danger"
            isLoading={loading}
        />
    );
};
