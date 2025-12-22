import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface EmailContentFormProps {
    subject: string;
    onSubjectChange: (subject: string) => void;
    content: string;
    onContentChange: (content: string) => void;
    onSend: () => void;
    onClear: () => void;
    canSend: boolean;
}

export const EmailContentForm: React.FC<EmailContentFormProps> = ({
    subject,
    onSubjectChange,
    content,
    onContentChange,
    onSend,
    onClear,
    canSend,
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Nội dung email</h3>
            <div className="space-y-3">
                {/* Subject */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                        placeholder="Nhập tiêu đề email..."
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        placeholder="Nhập nội dung email..."
                        rows={8}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                        Sử dụng {'{{'} name {'}}'}  để thêm tên người nhận, {'{{'} date {'}}'} để thêm ngày
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={onSend}
                        disabled={!canSend}
                        className="flex items-center gap-2 text-xs"
                    >
                        <Send size={14} />
                        Gửi email
                    </Button>
                    <Button variant="outline" onClick={onClear} className="text-xs">
                        Xóa form
                    </Button>
                </div>
            </div>
        </div>
    );
};
