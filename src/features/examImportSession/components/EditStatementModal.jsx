import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Dropdown, Checkbox } from '../../../shared/components';
import { MarkdownEditorModal } from '../../../shared/components/markdown/MarkdownEditorModal';
import { Edit } from 'lucide-react';
import { updateTempStatementAsync } from '../../tempStatement/store/tempStatementSlice';
import { Difficulty } from '../../../core/constants/question-constants';

export const EditStatementModal = ({
    isOpen,
    onClose,
    statement,
    question,
    onSuccess,
}) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isEditingContent, setIsEditingContent] = useState(false);

    const [formData, setFormData] = useState({
        content: '',
        isCorrect: false,
        difficulty: '',
    });

    /* ------------------------------------------------------------------
     * Sync data
     * ------------------------------------------------------------------ */
    useEffect(() => {
        if (statement && isOpen) {
            setFormData({
                content: statement.content || '',
                isCorrect: !!statement.isCorrect,
                difficulty: statement.difficulty || '',
            });
            setErrors({});
        }
    }, [statement, isOpen]);

    /* ------------------------------------------------------------------
     * Handlers
     * ------------------------------------------------------------------ */
    const handleSaveContent = (content) => {
        setFormData((prev) => ({ ...prev, content }));
        setIsEditingContent(false);
    };

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
            await dispatch(
                updateTempStatementAsync({
                    tempStatementId: statement.tempStatementId,
                    data: {
                        content: formData.content.trim(),
                        isCorrect: formData.isCorrect,
                        difficulty: formData.difficulty || undefined,
                    },
                }),
            ).unwrap();

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Error updating statement:', err);
        } finally {
            setLoading(false);
        }
    };

    const difficultyOptions = [
        { value: '', label: 'Không chọn' },
        { value: Difficulty.NB, label: 'Nhận biết' },
        { value: Difficulty.TH, label: 'Thông hiểu' },
        { value: Difficulty.VD, label: 'Vận dụng' },
        { value: Difficulty.VDC, label: 'Vận dụng cao' },
    ];

    /* ------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------ */
    return (
        <>
            <Modal
                isOpen={isOpen && !isEditingContent}
                onClose={onClose}
                title={`Chỉnh sửa đáp án – Câu ${question?.order ?? ''}`}
                size="medium"
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto max-h-[65vh]">
                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung đáp án <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <div className="border rounded-md p-3 bg-gray-50 min-h-[80px] max-h-[160px] overflow-y-auto">
                                    <div className="prose prose-sm max-w-none text-sm">
                                        {formData.content || (
                                            <span className="text-gray-400">
                                                Chưa có nội dung
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsEditingContent(true)}
                                    className="
                                        absolute top-2 right-2
                                        p-1.5 rounded border bg-white
                                        hover:bg-gray-100 transition
                                    "
                                    title="Chỉnh sửa nội dung"
                                >
                                    <Edit size={14} />
                                </button>
                            </div>

                            {errors.content && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-6">
                            <Checkbox
                                id="isCorrect"
                                checked={formData.isCorrect}
                                onChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isCorrect: checked,
                                    }))
                                }
                                label="Đáp án đúng"
                            />

                            <div className="w-56">
                                <Dropdown
                                    label="Độ khó"
                                    value={formData.difficulty}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            difficulty: value,
                                        }))
                                    }
                                    options={difficultyOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-3 border-t bg-gray-50 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" loading={loading}>
                            Lưu
                        </Button>
                    </div>
                </form>
            </Modal>

            <MarkdownEditorModal
                isOpen={isEditingContent}
                onClose={() => setIsEditingContent(false)}
                initialValue={formData.content}
                onSave={handleSaveContent}
            />
        </>
    );
};
