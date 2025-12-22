import React from 'react';

interface EmailPreviewProps {
    recipientType: 'all' | 'specific';
    selectedUsersCount: number;
    totalUsersCount: number;
    subject: string;
    content: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
    recipientType,
    selectedUsersCount,
    totalUsersCount,
    subject,
    content,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sticky top-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Xem trước</h3>
            <div className="space-y-3">
                <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-1">Người nhận</p>
                    <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-900">
                            {recipientType === 'all'
                                ? `Tất cả người dùng (${totalUsersCount})`
                                : `${selectedUsersCount} người dùng được chọn`}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-1">Tiêu đề</p>
                    <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-900">
                            {subject || <span className="text-gray-400">Chưa có tiêu đề</span>}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-medium text-gray-600 mb-1">Nội dung</p>
                    <div className="p-2 bg-gray-50 rounded max-h-64 overflow-y-auto">
                        <p className="text-xs text-gray-900 whitespace-pre-wrap">
                            {content || <span className="text-gray-400">Chưa có nội dung</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
