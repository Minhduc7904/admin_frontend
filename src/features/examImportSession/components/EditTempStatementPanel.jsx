import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RightPanel, Button, Dropdown, Checkbox } from '../../../shared/components';
import { MarkdownEditorPreview } from '../../../shared/components/markdown/MarkdownEditorPreview';
import { updateTempStatementAsync } from '../../tempStatement/store/tempStatementSlice';
import { Difficulty } from '../../../core/constants/question-constants';

const DIFFICULTY_OPTIONS = [
    { value: '', label: 'Không chọn' },
    { value: Difficulty.NB, label: 'Nhận biết' },
    { value: Difficulty.TH, label: 'Thông hiểu' },
    { value: Difficulty.VD, label: 'Vận dụng' },
    { value: Difficulty.VDC, label: 'Vận dụng cao' },
];

export const EditTempStatementPanel = ({
    isOpen,
    onClose,
    statement,
    question,
    onSuccess,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        content: '',
        isCorrect: false,
        difficulty: '',
    });

    /* ------------------------------------------------------------------
     * Sync when panel opens
     * ------------------------------------------------------------------ */
    useEffect(() => {
        if (statement && isOpen) {
            setFormData({
                content: statement.processedContent || '',
                isCorrect: !!statement.isCorrect,
                difficulty: statement.difficulty || '',
            });
            setErrors({});
        }
    }, [statement, isOpen]);

    /* ------------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------------ */
    const validateForm = () => {
        const newErrors = {};
        if (!formData.content?.trim()) {
            newErrors.content = 'Nội dung đáp án không được để trống';
        }
        return newErrors;
    };

    /* ------------------------------------------------------------------
     * Submit
     * ------------------------------------------------------------------ */
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

    /* ------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------ */
    return (
        <RightPanel
            isOpen={isOpen}
            onClose={onClose}
            title={`Chỉnh sửa đáp án${question?.order ? ` – Câu ${question.order}` : ''}`}
            width="w-[700px]"
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung đáp án <span className="text-red-500">*</span>
                        </label>
                        <MarkdownEditorPreview
                            value={formData.content}
                            onChange={(value) => {
                                setFormData(prev => ({ ...prev, content: value }));
                                if (errors.content) setErrors(prev => ({ ...prev, content: null }));
                            }}
                            height="320px"
                            editable={true}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                        )}
                    </div>

                    {/* isCorrect + Difficulty */}
                    <div className="flex flex-wrap items-center gap-6">
                        <Checkbox
                            id="isCorrect"
                            checked={formData.isCorrect}
                            onChange={(checked) => setFormData(prev => ({ ...prev, isCorrect: checked }))}
                            label="Đáp án đúng"
                        />
                        <div className="w-56">
                            <Dropdown
                                label="Độ khó"
                                value={formData.difficulty}
                                onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                                options={DIFFICULTY_OPTIONS}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" loading={loading}>
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </RightPanel>
    );
};
