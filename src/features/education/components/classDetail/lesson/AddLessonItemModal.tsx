import React, { useState } from 'react';
import { Input } from '@/shared/components/ui';
import { X, Plus } from 'lucide-react';
import type { LessonItemType } from './LessonItemCard';

interface AddLessonItemModalProps {
    lessonId: string;
    onClose: () => void;
    onSubmit: (item: {
        title: string;
        type: LessonItemType;
        content: string;
        examId?: string;
        examTitle?: string;
    }) => void;
}

export const AddLessonItemModal: React.FC<AddLessonItemModalProps> = ({ lessonId, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'video' as LessonItemType,
        content: '',
        examId: '',
        examTitle: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData: any = {
            title: formData.title,
            type: formData.type,
            content: formData.content,
        };

        if (formData.type === 'online-exercise') {
            submitData.examId = formData.examId;
            submitData.examTitle = formData.examTitle;
        }

        onSubmit(submitData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Thêm mục học tập</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Loại mục học tập <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as LessonItemType })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            >
                                <option value="video">Video (YouTube)</option>
                                <option value="online-exercise">Bài tập online</option>
                                <option value="assignment">Bài tập nộp file</option>
                                <option value="document">Tài liệu</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tiêu đề <span className="text-red-600">*</span>
                            </label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="VD: Video bài giảng: Khái niệm đạo hàm"
                                required
                            />
                        </div>

                        {formData.type === 'online-exercise' ? (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Mã kỳ thi <span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        value={formData.examId}
                                        onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                                        placeholder="VD: EXAM001"
                                        required
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Nhập ID của kỳ thi có sẵn trong hệ thống
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Tên kỳ thi <span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        value={formData.examTitle}
                                        onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
                                        placeholder="VD: Kiểm tra định nghĩa đạo hàm - Chương 1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Mô tả về bài tập..."
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                        rows={2}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    {formData.type === 'video' && 'Link YouTube'}
                                    {formData.type === 'document' && 'Link tài liệu'}
                                    {formData.type === 'assignment' && 'Mô tả bài tập'}
                                    {' '}<span className="text-red-600">*</span>
                                </label>
                                <Input
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder={
                                        formData.type === 'video' 
                                            ? 'https://youtube.com/watch?v=...' 
                                            : formData.type === 'document'
                                            ? 'https://drive.google.com/file/d/...'
                                            : 'Hoàn thành bài tập trong file đính kèm'
                                    }
                                    required
                                />
                                {formData.type === 'video' && (
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Nhập link video YouTube
                                    </p>
                                )}
                                {formData.type === 'document' && (
                                    <p className="text-[10px] text-gray-500 mt-1">
                                        Nhập link Google Drive, Dropbox hoặc link tài liệu khác
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Thêm mục
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
