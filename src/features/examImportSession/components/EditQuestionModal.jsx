import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Input, Dropdown } from '../../../shared/components';
import { MarkdownEditorModal } from '../../../shared/components/markdown/MarkdownEditorModal';
import { Edit } from 'lucide-react';
import { updateTempQuestionAsync } from '../../tempQuestion/store/tempQuestionSlice';
import { QuestionType, Difficulty } from '../../../core/constants/question-constants';

export const EditQuestionModal = ({
    isOpen,
    onClose,
    question,
    onSuccess,
}) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [isEditingSolution, setIsEditingSolution] = useState(false);

    const [formData, setFormData] = useState({
        content: '',
        solution: '',
        type: '',
        difficulty: '',
        grade: '',
        pointsOrigin: '',
        correctAnswer: '',
        processedContent: '',
        processedSolution: '',
        solutionYoutubeUrl: '',
    });

    /* ------------------------------------------------------------------
     * Sync form data when modal opens
     * ------------------------------------------------------------------ */
    useEffect(() => {
        if (question && isOpen) {
            setFormData({
                content: question.content || '',
                solution: question.solution || '',
                type: question.type || '',
                difficulty: question.difficulty || '',
                grade: question.grade?.toString() || '',
                pointsOrigin: question.pointsOrigin?.toString() || '',
                correctAnswer: question.correctAnswer || '',
                processedContent: question.processedContent || '',
                processedSolution: question.processedSolution || '',
                solutionYoutubeUrl: question.solutionYoutubeUrl || '',
            });
            setErrors({});
        }
    }, [question, isOpen]);

    /* ------------------------------------------------------------------
     * Handlers
     * ------------------------------------------------------------------ */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSaveContent = (content) => {
        setFormData((prev) => ({ ...prev, processedContent: content }));
        setIsEditingContent(false);
    };

    const handleSaveSolution = (solution) => {
        setFormData((prev) => ({ ...prev, processedSolution: solution }));
        setIsEditingSolution(false);
    };

    /* ------------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------------ */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.processedContent?.trim()) {
            newErrors.processedContent = 'Nội dung câu hỏi không được để trống';
        }

        if (!formData.type) {
            newErrors.type = 'Loại câu hỏi không được để trống';
        }

        if (
            formData.grade &&
            (parseInt(formData.grade) < 1 ||
                parseInt(formData.grade) > 12)
        ) {
            newErrors.grade = 'Khối phải từ 1 đến 12';
        }

        if (
            formData.pointsOrigin &&
            parseFloat(formData.pointsOrigin) < 0
        ) {
            newErrors.pointsOrigin = 'Điểm phải là số dương';
        }

        if (
            [QuestionType.ESSAY, QuestionType.TRUE_FALSE].includes(
                formData.type,
            ) &&
            !formData.correctAnswer?.trim()
        ) {
            newErrors.correctAnswer =
                'Đáp án đúng không được để trống';
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
            const allowManualCorrectAnswer =
                formData.type === QuestionType.ESSAY ||
                formData.type === QuestionType.TRUE_FALSE;

            const updateData = {
                content: formData.processedContent.trim(),
                solution: formData.processedSolution?.trim() || undefined,
                type: formData.type,
                difficulty: formData.difficulty || undefined,
                correctAnswer: formData.correctAnswer.trim() || undefined,
                grade: formData.grade
                    ? parseInt(formData.grade)
                    : undefined,
                pointsOrigin: formData.pointsOrigin
                    ? parseFloat(formData.pointsOrigin)
                    : undefined,
                solutionYoutubeUrl: formData.solutionYoutubeUrl?.trim() || undefined,

                ...(allowManualCorrectAnswer && {
                    correctAnswer:
                        formData.correctAnswer.trim(),
                }),
            };

            await dispatch(
                updateTempQuestionAsync({
                    tempQuestionId: question.tempQuestionId,
                    data: updateData,
                }),
            ).unwrap();

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Error updating question:', err);
        } finally {
            setLoading(false);
        }
    };

    /* ------------------------------------------------------------------
     * Options
     * ------------------------------------------------------------------ */
    const typeOptions = [
        { value: '', label: 'Chọn loại câu hỏi' },
        { value: QuestionType.SINGLE_CHOICE, label: 'Trắc nghiệm đơn' },
        { value: QuestionType.MULTIPLE_CHOICE, label: 'Trắc nghiệm nhiều đáp án' },
        { value: QuestionType.TRUE_FALSE, label: 'Đúng / Sai' },
        { value: QuestionType.SHORT_ANSWER, label: 'Trả lời ngắn' },
        { value: QuestionType.ESSAY, label: 'Tự luận' },
    ];

    const difficultyOptions = [
        { value: '', label: 'Không chọn' },
        { value: Difficulty.NB, label: 'Nhận biết' },
        { value: Difficulty.TH, label: 'Thông hiểu' },
        { value: Difficulty.VD, label: 'Vận dụng' },
        { value: Difficulty.VDC, label: 'Vận dụng cao' },
    ];

    const gradeOptions = [
        { value: '', label: 'Không chọn' },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `Khối ${i + 1}`,
        })),
    ];

    /* ------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------ */
    return (
        <>
            <Modal
                isOpen={isOpen && !isEditingContent && !isEditingSolution}
                onClose={onClose}
                title="Chỉnh sửa câu hỏi"
                size="large"
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col h-[80vh]"
                >
                    <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung câu hỏi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="border rounded p-3 bg-gray-50 min-h-[100px] max-h-[200px] overflow-y-auto">
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
                                    className="absolute top-2 right-2 p-2 bg-white border rounded hover:bg-gray-100"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        {/* Solution */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lời giải
                            </label>
                            <div className="relative">
                                <div className="border rounded p-3 bg-gray-50 min-h-[100px] max-h-[200px] overflow-y-auto">
                                    <div className="prose prose-sm max-w-none text-sm">
                                        {formData.solution || (
                                            <span className="text-gray-400">
                                                Chưa có lời giải
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingSolution(true)}
                                    className="absolute top-2 right-2 p-2 bg-white border rounded hover:bg-gray-100"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>

                        {/* ===== Row 1: Type - Difficulty - Grade - Points ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Dropdown
                                label="Loại câu hỏi"
                                required
                                disabled={true}
                                value={formData.type}
                                onChange={(value) =>
                                    setFormData((p) => ({ ...p, type: value }))
                                }
                                options={typeOptions}
                                error={errors.type}
                            />

                            <Dropdown
                                label="Độ khó"
                                value={formData.difficulty}
                                onChange={(value) =>
                                    setFormData((p) => ({ ...p, difficulty: value }))
                                }
                                options={difficultyOptions}
                            />

                            <Dropdown
                                label="Khối"
                                value={formData.grade}
                                onChange={(value) =>
                                    setFormData((p) => ({ ...p, grade: value }))
                                }
                                options={gradeOptions}
                                error={errors.grade}
                            />

                            <Input
                                name="pointsOrigin"
                                label="Điểm"
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.pointsOrigin}
                                onChange={handleChange}
                                error={errors.pointsOrigin}
                                placeholder="VD: 1.0"
                            />
                        </div>

                        {/* ===== Row 2: Correct Answer (ONLY ESSAY / SHORT_ANSWER) ===== */}
                        {(formData.type === QuestionType.ESSAY ||
                            formData.type === QuestionType.SHORT_ANSWER) && (
                                <div className="max-w-md">
                                    <Input
                                        name="correctAnswer"
                                        label="Đáp án đúng"
                                        value={formData.correctAnswer}
                                        onChange={handleChange}
                                        error={errors.correctAnswer}
                                        placeholder={
                                            formData.type === QuestionType.TRUE_FALSE
                                                ? 'Đúng hoặc Sai'
                                                : 'Nhập đáp án đúng'
                                        }
                                    />
                                </div>
                            )}

                        {/* ===== YouTube Solution URL ===== */}
                        <div>
                            <Input
                                name="solutionYoutubeUrl"
                                label="Link YouTube hướng dẫn giải"
                                value={formData.solutionYoutubeUrl}
                                onChange={handleChange}
                                error={errors.solutionYoutubeUrl}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" loading={loading}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </form>
            </Modal>

            <MarkdownEditorModal
                isOpen={isEditingContent}
                onClose={() => setIsEditingContent(false)}
                initialValue={formData.processedContent}
                onSave={handleSaveContent}
            />

            <MarkdownEditorModal
                isOpen={isEditingSolution}
                onClose={() => setIsEditingSolution(false)}
                initialValue={formData.processedSolution}
                onSave={handleSaveSolution}
            />
        </>
    );
};
