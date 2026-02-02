import { AlertCircle, FileText, Sparkles, Loader2 } from 'lucide-react';
import { Modal, Button, ViewModeToggle, MarkdownRenderer } from '../../../shared/components';
import { useState } from 'react';

/**
 * SplitConfirmationModal Component
 * Modal xác nhận trước khi tách câu hỏi, hiển thị raw content
 */
export const SplitConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm,
    rawContent,
    method,
    loading = false
}) => {
    const [viewMode, setViewMode] = useState('preview');

    const handleConfirm = () => {
        onConfirm();
    };

    const getMethodLabel = () => {
        switch (method) {
            case 'session':
                return 'nội dung từ Session';
            case 'custom':
                return 'nội dung tùy chỉnh';
            default:
                return 'nội dung này';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Xác nhận tách câu hỏi"
            size="2xl"
        >
            <div className="space-y-4">
                {/* Warning message */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-amber-900 mb-1">
                                Bạn chắc chắn muốn tách {getMethodLabel()}?
                            </h4>
                            <p className="text-xs text-amber-700">
                                Quá trình này sẽ sử dụng AI để phân tích và tách câu hỏi. 
                                Các câu hỏi đã tách trước đó sẽ được giữ lại và có order tiếp tục tăng.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content preview */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Nội dung sẽ được tách
                        </h4>
                        <ViewModeToggle 
                            viewMode={viewMode} 
                            onChange={setViewMode} 
                        />
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 max-h-96 overflow-y-auto">
                        {viewMode === 'preview' ? (
                            rawContent ? (
                                <MarkdownRenderer
                                    content={rawContent}
                                    className="text-sm"
                                />
                            ) : (
                                <p className="text-sm text-foreground-light italic text-center py-8">
                                    Không có nội dung để hiển thị
                                </p>
                            )
                        ) : (
                            rawContent ? (
                                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                    {rawContent}
                                </pre>
                            ) : (
                                <p className="text-sm text-foreground-light italic text-center py-8">
                                    Không có nội dung để hiển thị
                                </p>
                            )
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="primary"
                        disabled={loading || !rawContent}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Xác nhận tách
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
