import React from 'react';
import { Download, Send } from 'lucide-react';

interface TuitionPageHeaderProps {
    onExport?: () => void;
    onSendReminder?: () => void;
}

export const TuitionPageHeader: React.FC<TuitionPageHeaderProps> = ({ 
    onExport, 
    onSendReminder 
}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Học phí</h1>
                <p className="text-xs text-gray-600 mt-1">Theo dõi và quản lý học phí theo tháng</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                    <Download size={16} />
                    Xuất báo cáo
                </button>
                <button
                    onClick={onSendReminder}
                    className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm"
                >
                    <Send size={16} />
                    Gửi nhắc nhở
                </button>
            </div>
        </div>
    );
};
