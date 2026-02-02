import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const PreviewSidebar = ({ sessionId, questionsCount = 0, onConfirm, loading = false }) => {
    const hasQuestions = questionsCount > 0;

    return (
        <div className="bg-white rounded-lg border border-border h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-gray-800">
                    Xem trước & xác nhận
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Kiểm tra lại thông tin trước khi hoàn tất
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Summary Card */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Tóm tắt
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tổng số câu hỏi:</span>
                            <span className="font-medium text-gray-900">
                                {questionsCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                {hasQuestions ? (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-green-800 mb-1">
                                    Sẵn sàng hoàn tất
                                </h4>
                                <p className="text-xs text-green-700">
                                    Đã có {questionsCount} câu hỏi. Bạn có thể xác nhận để hoàn tất quá trình import.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                                    Chưa có câu hỏi
                                </h4>
                                <p className="text-xs text-yellow-700">
                                    Vui lòng quay lại bước xử lý câu hỏi để tạo câu hỏi trước khi xác nhận.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                        Lưu ý
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                        <li>Kiểm tra kỹ nội dung các câu hỏi</li>
                        <li>Đảm bảo thứ tự câu hỏi chính xác</li>
                        <li>Sau khi xác nhận, dữ liệu sẽ được lưu vào hệ thống</li>
                    </ul>
                </div>
            </div>

            {/* Footer - Action Button */}
            <div className="p-6 border-t border-border">
                <button
                    onClick={onConfirm}
                    disabled={!hasQuestions || loading}
                    className={`
                        w-full px-4 py-3 rounded-lg font-medium
                        flex items-center justify-center gap-2
                        transition
                        ${hasQuestions && !loading
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            Xác nhận & hoàn tất
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
