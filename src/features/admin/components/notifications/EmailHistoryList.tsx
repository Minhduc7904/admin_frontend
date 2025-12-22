import React from 'react';
import { Mail, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SearchInput } from '@/shared/components/ui';

export interface SentEmail {
    id: string;
    subject: string;
    recipientType: 'all' | 'specific';
    recipientCount: number;
    sentAt: string;
    status: 'success' | 'failed' | 'pending';
}

interface EmailHistoryListProps {
    emails: SentEmail[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'success':
            return {
                icon: <CheckCircle size={12} />,
                bgColor: 'bg-green-100',
                textColor: 'text-green-700',
                label: 'Thành công',
            };
        case 'failed':
            return {
                icon: <XCircle size={12} />,
                bgColor: 'bg-red-100',
                textColor: 'text-red-700',
                label: 'Thất bại',
            };
        case 'pending':
        default:
            return {
                icon: <Clock size={12} />,
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-700',
                label: 'Đang gửi',
            };
    }
};

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const EmailHistoryList: React.FC<EmailHistoryListProps> = ({
    emails,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="space-y-3">
            {/* Search */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm theo tiêu đề..."
                    className="w-full"
                />
            </div>

            {/* History List */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="space-y-2">
                    {emails.length > 0 ? (
                        emails.map((email) => {
                            const statusConfig = getStatusConfig(email.status);
                            return (
                                <div
                                    key={email.id}
                                    className="flex items-start gap-3 p-3 rounded hover:bg-gray-50 transition-colors border border-gray-100"
                                >
                                    <div className={`p-1.5 rounded ${statusConfig.bgColor}`}>
                                        <Mail size={16} className={statusConfig.textColor} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-semibold text-gray-900 truncate">
                                                    {email.subject}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={12} />
                                                        {email.recipientType === 'all'
                                                            ? 'Tất cả người dùng'
                                                            : `${email.recipientCount} người dùng`}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(email.sentAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-1 ${statusConfig.bgColor} ${statusConfig.textColor} flex-shrink-0`}
                                            >
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <Mail size={32} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Không tìm thấy kết quả phù hợp</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
