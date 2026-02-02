import { useState } from 'react';
import { Sparkles, Info } from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { SplitMethodSelector } from './SplitMethodSelector';
import { CustomContentInput } from './CustomContentInput';
import { SessionContentPreview } from './SessionContentPreview';

export const ProcessQuestionsSidebar = ({ 
    sessionId,
    sessionRawContentData,
    sessionRawContentLoading,
    onSplit, 
    loading, 
    splitResult,
    onRefreshSessionContent
}) => {
    const [splitMethod, setSplitMethod] = useState('session');
    const [customContent, setCustomContent] = useState('');

    const handleSplitClick = () => {
        if (splitMethod === 'session') {
            // Với method session, truyền rawContent string
            const content = sessionRawContentData?.rawContent || '';
            onSplit(content, splitMethod);
        } else {
            // Với method custom, truyền customContent
            onSplit(customContent, splitMethod);
        }
    };

    const isReadyToSplit = () => {
        if (splitMethod === 'session') {
            const content = sessionRawContentData?.rawContent || '';
            return content && content.length > 0 && content.length <= 15000;
        }
        return customContent && customContent.length > 0 && customContent.length <= 15000;
    };

    return (
        <div className="bg-white rounded-lg border border-border p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Xử lý câu hỏi
                </h2>
                <p className="text-sm text-foreground-light">
                    Sử dụng AI để tự động tách và phân tích câu hỏi từ nội dung đề thi
                </p>
            </div>

            {/* Method Selector */}
            <SplitMethodSelector
                selectedMethod={splitMethod}
                onChange={setSplitMethod}
                disabled={loading}
            />

            {/* Content based on method */}
            {splitMethod === 'session' ? (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">
                        Nội dung từ Session
                    </h3>
                    <SessionContentPreview
                        rawContentData={sessionRawContentData}
                        isLoading={sessionRawContentLoading}
                    />
                </div>
            ) : (
                <CustomContentInput
                    value={customContent}
                    onChange={setCustomContent}
                    disabled={loading}
                />
            )}

            {/* Split Button */}
            <div className="space-y-3">
                <Button
                    onClick={handleSplitClick}
                    disabled={loading || !isReadyToSplit()}
                    variant="primary"
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Sparkles size={18} className="animate-pulse" />
                            Đang tách câu hỏi...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Tách câu hỏi tự động
                        </>
                    )}
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-2">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Lưu ý:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>Nội dung tối đa 15,000 ký tự</li>
                                <li>AI sẽ tự động phân tích và tách câu hỏi</li>
                                <li>Câu hỏi mới được thêm vào danh sách hiện có (không ghi đè)</li>
                                <li>Hình ảnh (media) được tự động gắn kết với câu hỏi</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {splitResult && (
                <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-3">
                        Thống kê lần tách gần nhất
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-foreground-light mb-1">Tổng câu hỏi</p>
                            <p className="text-2xl font-bold text-foreground">
                                {splitResult.totalQuestions}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-foreground-light mb-1">Thời gian xử lý</p>
                            <p className="text-2xl font-bold text-foreground">
                                {(splitResult.processingTimeMs / 1000).toFixed(1)}s
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
