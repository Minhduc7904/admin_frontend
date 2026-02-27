import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RightPanel, Button, Input, Dropdown } from '../../../shared/components';
import { MarkdownEditorPreview } from '../../../shared/components/markdown/MarkdownEditorPreview';
import { updateTempQuestionAsync } from '../../tempQuestion/store/tempQuestionSlice';
import { QuestionType, Difficulty } from '../../../core/constants/question-constants';
import { SubjectSearchSelect } from '../../subject/components/SubjectSearchSelect';
import { ChapterSearchMultiSelect } from '../../chapter/components/ChapterSearchMultiSelect';

const TYPE_OPTIONS = [
    { value: '', label: 'Chọn loại câu hỏi' },
    { value: QuestionType.SINGLE_CHOICE, label: 'Trắc nghiệm đơn' },
    { value: QuestionType.MULTIPLE_CHOICE, label: 'Trắc nghiệm nhiều đáp án' },
    { value: QuestionType.TRUE_FALSE, label: 'Đúng / Sai' },
    { value: QuestionType.SHORT_ANSWER, label: 'Trả lời ngắn' },
    { value: QuestionType.ESSAY, label: 'Tự luận' },
];

const DIFFICULTY_OPTIONS = [
    { value: '', label: 'Không chọn' },
    { value: Difficulty.NB, label: 'Nhận biết' },
    { value: Difficulty.TH, label: 'Thông hiểu' },
    { value: Difficulty.VD, label: 'Vận dụng' },
    { value: Difficulty.VDC, label: 'Vận dụng cao' },
];

const GRADE_OPTIONS = [
    { value: '', label: 'Không chọn' },
    ...Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Khối ${i + 1}`,
    })),
];

export const EditTempQuestionPanel = ({
    isOpen,
    onClose,
    question,
    onSuccess,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        content: '',
        solution: '',
        type: '',
        difficulty: '',
        grade: '',
        pointsOrigin: '',
        correctAnswer: '',
        solutionYoutubeUrl: '',
        subject: null,
        chapters: [],
    });

    /* ------------------------------------------------------------------
     * Sync when panel opens
     * ------------------------------------------------------------------ */
    useEffect(() => {
        if (question && isOpen) {
            setFormData({
                content: question.processedContent || '',
                solution: question.processedSolution || '',
                type: question.type || '',
                difficulty: question.difficulty || '',
                grade: question.grade?.toString() || '',
                pointsOrigin: question.pointsOrigin?.toString() || '',
                correctAnswer: question.correctAnswer || '',
                solutionYoutubeUrl: question.solutionYoutubeUrl || '',
                subject: question.subject || null,
                chapters: question.chapters || [],
            });
            setErrors({});
        }
    }, [question, isOpen]);

    /* ------------------------------------------------------------------
     * Validation
     * ------------------------------------------------------------------ */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.content?.trim()) {
            newErrors.content = 'Nội dung câu hỏi không được để trống';
        }
        if (!formData.type) {
            newErrors.type = 'Loại câu hỏi không được để trống';
        }
        if (formData.grade && (parseInt(formData.grade) < 1 || parseInt(formData.grade) > 12)) {
            newErrors.grade = 'Khối phải từ 1 đến 12';
        }
        if (formData.pointsOrigin && parseFloat(formData.pointsOrigin) < 0) {
            newErrors.pointsOrigin = 'Điểm phải là số không âm';
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

        const allowManualCorrectAnswer =
            formData.type === QuestionType.ESSAY ||
            formData.type === QuestionType.SHORT_ANSWER;

        const updateData = {
            content: formData.content.trim(),
            solution: formData.solution?.trim() || undefined,
            type: formData.type,
            difficulty: formData.difficulty || undefined,
            grade: formData.grade ? parseInt(formData.grade) : undefined,
            pointsOrigin: formData.pointsOrigin ? parseFloat(formData.pointsOrigin) : undefined,
            solutionYoutubeUrl: formData.solutionYoutubeUrl?.trim() || undefined,
            subjectId: formData.subject?.subjectId || undefined,
            chapterIds: formData.chapters?.length > 0 ? formData.chapters.map(c => c.chapterId) : [],
            ...(allowManualCorrectAnswer && {
                correctAnswer: formData.correctAnswer?.trim() || undefined,
            }),
        };

        setLoading(true);
        try {
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

    const showCorrectAnswer =
        formData.type === QuestionType.ESSAY ||
        formData.type === QuestionType.SHORT_ANSWER;

    /* ------------------------------------------------------------------
     * Render
     * ------------------------------------------------------------------ */
    return (
        <RightPanel
            isOpen={isOpen}
            onClose={onClose}
            title={`Chỉnh sửa câu hỏi${question?.order ? ` – Câu ${question.order}` : ''}`}
            width="w-[800px]"
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung câu hỏi <span className="text-red-500">*</span>
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

                    {/* Solution */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lời giải
                        </label>
                        <MarkdownEditorPreview
                            value={formData.solution}
                            onChange={(value) => setFormData(prev => ({ ...prev, solution: value }))}
                            height="280px"
                            editable={true}
                        />
                    </div>

                    {/* Subject + Chapters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SubjectSearchSelect
                            label="Môn học"
                            value={formData.subject}
                            onSelect={(subject) => setFormData(prev => ({ ...prev, subject }))}
                            error={errors.subjectId}
                        />
                        <ChapterSearchMultiSelect
                            label="Chương"
                            value={formData.chapters}
                            onChange={(chapters) => setFormData(prev => ({ ...prev, chapters }))}
                            filterSubjectId={formData.subject?.subjectId}
                            error={errors.chapterIds}
                        />
                    </div>

                    {/* Type / Difficulty / Grade / Points */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Dropdown
                            label="Loại câu hỏi"
                            required
                            disabled
                            value={formData.type}
                            onChange={(value) => setFormData(p => ({ ...p, type: value }))}
                            options={TYPE_OPTIONS}
                            error={errors.type}
                        />
                        <Dropdown
                            label="Độ khó"
                            value={formData.difficulty}
                            onChange={(value) => setFormData(p => ({ ...p, difficulty: value }))}
                            options={DIFFICULTY_OPTIONS}
                        />
                        <Dropdown
                            label="Khối"
                            value={formData.grade}
                            onChange={(value) => setFormData(p => ({ ...p, grade: value }))}
                            options={GRADE_OPTIONS}
                            error={errors.grade}
                        />
                        <Input
                            name="pointsOrigin"
                            label="Điểm"
                            type="number"
                            step="0.1"
                            min="0"
                            value={formData.pointsOrigin}
                            onChange={(e) => setFormData(p => ({ ...p, pointsOrigin: e.target.value }))}
                            error={errors.pointsOrigin}
                            placeholder="VD: 1.0"
                        />
                    </div>

                    {/* Correct Answer (ESSAY / SHORT_ANSWER only) */}
                    {showCorrectAnswer && (
                        <div className="max-w-sm">
                            <Input
                                name="correctAnswer"
                                label="Đáp án đúng"
                                value={formData.correctAnswer}
                                onChange={(e) => setFormData(p => ({ ...p, correctAnswer: e.target.value }))}
                                error={errors.correctAnswer}
                                placeholder="Nhập đáp án đúng"
                            />
                        </div>
                    )}

                    {/* YouTube Solution */}
                    <div>
                        <Input
                            name="solutionYoutubeUrl"
                            label="Link YouTube hướng dẫn giải"
                            value={formData.solutionYoutubeUrl}
                            onChange={(e) => setFormData(p => ({ ...p, solutionYoutubeUrl: e.target.value }))}
                            error={errors.solutionYoutubeUrl}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
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
