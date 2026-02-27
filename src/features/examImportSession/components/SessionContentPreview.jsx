import { useState } from 'react';
import { FileText, Eye, Code } from 'lucide-react';
import { ViewModeToggle, MarkdownRenderer } from '../../../shared/components';

/**
 * SessionContentPreview Component  
 * Hiển thị raw content của session (không có nút edit)
 */
export const SessionContentPreview = ({
    rawContentData,
    isLoading = false
}) => {
    const [viewMode, setViewMode] = useState('text');

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-foreground-light flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Xem trước nội dung
                </h4>

                {rawContentData && (
                    <ViewModeToggle
                        viewMode={viewMode}
                        onChange={setViewMode}
                        className="scale-90"
                    />
                )}
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-200 max-h-80 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                        <p className="text-xs text-foreground-light">Đang tải nội dung...</p>
                    </div>
                ) : !rawContentData ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-foreground-light">
                            Chưa có nội dung từ session
                        </p>
                        <p className="text-xs text-foreground-light mt-1">
                            Vui lòng upload và trích xuất PDF trước
                        </p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'preview' ? (
                            <MarkdownRenderer
                                content={rawContentData.processedContent || 'Không có nội dung để hiển thị'}
                                className="text-xs"
                            />
                        ) : (
                            <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                {rawContentData.rawContent || 'Không có nội dung để hiển thị'}
                            </pre>
                        )}
                    </>
                )}
            </div>

            {/* Character count */}
            {rawContentData && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                        <span className={rawContentData.rawContent?.length > 15000 ? 'text-red-600 font-medium' : 'text-foreground-light'}>
                            {rawContentData.rawContent?.length || 0} / 15,000 ký tự
                        </span>
                        {rawContentData.childMediaCount > 0 && (
                            <span className="text-purple-600">
                                🖼️ {rawContentData.childMediaCount} ảnh
                            </span>
                        )}
                    </div>
                    {rawContentData.rawContent?.length > 15000 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-xs text-red-700">
                                ⚠️ Nội dung vượt quá giới hạn. Chỉ cho phép tách tối đa 15,000 ký tự.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
