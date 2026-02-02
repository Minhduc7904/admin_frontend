import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Dropdown, Checkbox } from '../../../shared/components';
import { MarkdownEditorModal } from '../../../shared/components/markdown/MarkdownEditorModal';
import { Edit } from 'lucide-react';
import { createTempStatementAsync } from '../../tempStatement/store/tempStatementSlice';
import { Difficulty } from '../../../core/constants/question-constants';

export const CreateStatementModal = ({ isOpen, onClose, tempQuestionId, question, onSuccess }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isEditingContent, setIsEditingContent] = useState(false);

    const [formData, setFormData] = useState({
        content: '',
        isCorrect: false,
        difficulty: '',
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                content: '',
                isCorrect: false,
                difficulty: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.content?.trim()) {
            newErrors.content = 'Nội dung đáp án không được để trống';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const createData = {
                content: formData.content.trim(),
                isCorrect: formData.isCorrect,
                difficulty: formData.difficulty || undefined,
            };

            await dispatch(createTempStatementAsync({
                tempQuestionId,
                data: createData
            })).unwrap();

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error creating statement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContent = async (content) => {
        setFormData(prev => ({ ...prev, content }));
        setIsEditingContent(false);
    };

    const difficultyOptions = [
        { value: '', label: 'Không chọn' },
        { value: Difficulty.NB, label: 'Nhận biết' },
        { value: Difficulty.TH, label: 'Thông hiểu' },
        { value: Difficulty.VD, label: 'Vận dụng' },
        { value: Difficulty.VDC, label: 'Vận dụng cao' },
    ];

    return (
        <>
            <Modal
                isOpen={isOpen && !isEditingContent}
                onClose={onClose}
                title={`Tạo đáp án mới - Câu ${question?.order || ''}`}
                size="large"
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto max-h-[70vh]">
                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung đáp án <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="border rounded p-3 bg-gray-50 min-h-[100px] max-h-[200px] overflow-y-auto">
                                    <div className="prose prose-sm max-w-none text-sm">
                                        {formData.content || <span className="text-gray-400">Chưa có nội dung</span>}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingContent(true)}
                                    className="absolute top-2 right-2 p-2 bg-white border rounded hover:bg-gray-100 transition"
                                    title="Chỉnh sửa nội dung"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                            )}
                        </div>

                        {/* Is Correct */}
                        <div>
                            <Checkbox
                                id="isCorrect"
                                checked={formData.isCorrect}
                                onChange={(checked) => setFormData(prev => ({ ...prev, isCorrect: checked }))}
                                label="Đáp án đúng"
                            />
                        </div>

                        {/* Difficulty */}
                        <div>
                            <Dropdown
                                label="Độ khó"
                                value={formData.difficulty}
                                onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                                options={difficultyOptions}
                                error={errors.difficulty}
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                        >
                            Tạo đáp án
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Markdown Editor for Content */}
            <MarkdownEditorModal
                isOpen={isEditingContent}
                onClose={() => setIsEditingContent(false)}
                initialValue={formData.content}
                onSave={handleSaveContent}
            />
        </>
    );
};
