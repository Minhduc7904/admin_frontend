import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Input, Dropdown } from '../../../shared/components';
import { MarkdownEditorModal } from '../../../shared/components/markdown/MarkdownEditorModal';
import { Edit } from 'lucide-react';
import { createTempQuestionAsync } from '../../tempQuestion/store/tempQuestionSlice';
import { QuestionType, Difficulty } from '../../../core/constants/question-constants';
import { SubjectSearchSelect } from '../../subject/components/SubjectSearchSelect';
import { ChapterSearchMultiSelect } from '../../chapter/components/ChapterSearchMultiSelect';

export const CreateQuestionModal = ({ isOpen, onClose, sessionId, onSuccess }) => {
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
        subject: null,
        chapters: [],
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                content: '',
                solution: '',
                type: '',
                difficulty: '',
                grade: '',
                pointsOrigin: '',
                correctAnswer: '',
                subject: null,
                chapters: [],
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

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
            newErrors.pointsOrigin = 'Điểm phải là số dương';
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
                solution: formData.solution?.trim() || undefined,
                type: formData.type,
                difficulty: formData.difficulty || undefined,
                grade: formData.grade ? parseInt(formData.grade) : undefined,
                pointsOrigin: formData.pointsOrigin ? parseFloat(formData.pointsOrigin) : undefined,
                correctAnswer: formData.correctAnswer?.trim() || undefined,
                subjectId: formData.subject?.subjectId || undefined,
                chapterIds: formData.chapters?.length > 0 ? formData.chapters.map(c => c.chapterId) : undefined,
            };

            await dispatch(createTempQuestionAsync({
                sessionId,
                data: createData
            })).unwrap();

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error creating question:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContent = async (content) => {
        setFormData(prev => ({ ...prev, content }));
        setIsEditingContent(false);
    };

    const handleSaveSolution = async (solution) => {
        setFormData(prev => ({ ...prev, solution }));
        setIsEditingSolution(false);
    };

    const typeOptions = [
        { value: '', label: 'Chọn loại câu hỏi' },
        { value: QuestionType.SINGLE_CHOICE, label: 'Trắc nghiệm đơn' },
        { value: QuestionType.MULTIPLE_CHOICE, label: 'Trắc nghiệm nhiều đáp án' },
        { value: QuestionType.TRUE_FALSE, label: 'Đúng/Sai' },
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
            label: `Khối ${i + 1}`
        }))
    ];

    return (
        <>
            <Modal
                isOpen={isOpen && !isEditingContent && !isEditingSolution}
                onClose={onClose}
                title="Tạo câu hỏi mới"
                size="large"
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto max-h-[70vh]">
                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung câu hỏi <span className="text-red-500">*</span>
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

                        {/* Solution */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lời giải
                            </label>
                            <div className="relative">
                                <div className="border rounded p-3 bg-gray-50 min-h-[100px] max-h-[200px] overflow-y-auto">
                                    <div className="prose prose-sm max-w-none text-sm">
                                        {formData.solution || <span className="text-gray-400">Chưa có lời giải</span>}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingSolution(true)}
                                    className="absolute top-2 right-2 p-2 bg-white border rounded hover:bg-gray-100 transition"
                                    title="Chỉnh sửa lời giải"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Subject */}
                            <SubjectSearchSelect
                                label="Môn học"
                                value={formData.subject}
                                onSelect={(subject) => setFormData(prev => ({ ...prev, subject }))}
                                error={errors.subjectId}
                            />

                            {/* Chapters */}
                            <ChapterSearchMultiSelect
                                label="Chương"
                                value={formData.chapters}
                                onChange={(chapters) => setFormData(prev => ({ ...prev, chapters }))}
                                error={errors.chapterIds}
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <Dropdown
                                label="Loại câu hỏi"
                                required={true}
                                value={formData.type}
                                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                                options={typeOptions}
                                error={errors.type}
                            />
                        </div>

                        {/* Correct Answer (for non-choice types) */}
                        {(formData.type === QuestionType.ESSAY || formData.type === QuestionType.TRUE_FALSE) && (
                            <div>
                                <Input
                                    name="correctAnswer"
                                    label="Đáp án đúng"
                                    value={formData.correctAnswer}
                                    onChange={handleChange}
                                    placeholder="Nhập đáp án đúng"
                                />
                            </div>
                        )}

                        {/* Difficulty, Grade, Points */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Dropdown
                                    label="Độ khó"
                                    value={formData.difficulty}
                                    onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                                    options={difficultyOptions}
                                    error={errors.difficulty}
                                />
                            </div>
                            <div>
                                <Dropdown
                                    label="Khối"
                                    value={formData.grade}
                                    onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                                    options={gradeOptions}
                                    error={errors.grade}
                                />
                            </div>
                            <div>
                                <Input
                                    name="pointsOrigin"
                                    label="Điểm"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.pointsOrigin}
                                    onChange={handleChange}
                                    placeholder="VD: 1.0"
                                    error={errors.pointsOrigin}
                                />
                            </div>
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
                            Tạo câu hỏi
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

            {/* Markdown Editor for Solution */}
            <MarkdownEditorModal
                isOpen={isEditingSolution}
                onClose={() => setIsEditingSolution(false)}
                initialValue={formData.solution}
                onSave={handleSaveSolution}
            />
        </>
    );
};
