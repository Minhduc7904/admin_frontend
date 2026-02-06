import { updateQuestionAsync, selectQuestionLoadingUpdate, getQuestionByIdAsync } from "../store/questionSlice";
import { createStatementAsync, updateStatementAsync, deleteStatementAsync } from "../../statement/store/statementSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Button, Dropdown, YoutubeInput, Spinner } from "../../../shared/components";
import { SubjectSearchSelect } from "../../subject/components/SubjectSearchSelect";
import { ChapterSearchMultiSelect } from "../../chapter/components/ChapterSearchMultiSelect";
import { GRADE_OPTIONS } from "../../../core/constants/grade-constants";
import { MarkdownEditorPreview } from "../../../shared/components/markdown/MarkdownEditorPreview";
import { QuestionType, QUESTION_TYPE_OPTIONS, Difficulty, DIFFICULTY_OPTIONS } from "../../../core/constants/question-constants";
import { VISIBILITY_OPTIONS, VISIBILITY } from "../../../core/constants";
import { StatementEditor } from "./StatementEditor";

export const EditQuestion = ({ questionId, onClose, loadQuestions }) => {
    const dispatch = useDispatch();
    const question = useSelector((state) => state.question.currentQuestion);
    const loadingUpdate = useSelector(selectQuestionLoadingUpdate);
    const loadingGetById = useSelector((state) => state.question.loadingGetById);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);
    
    const [formData, setFormData] = useState({
        content: '',
        type: QuestionType.SINGLE_CHOICE,
        correctAnswer: '',
        solution: '',
        solutionYoutubeUrl: '',
        difficulty: Difficulty.TH,
        grade: '',
        subjectId: '',
        pointsOrigin: '',
        visibility: VISIBILITY.DRAFT,
        chapters: [],
    });

    const [selectedSubject, setSelectedSubject] = useState(null);

    // Load question data when component mounts
    useEffect(() => {
        if (questionId) {
            dispatch(getQuestionByIdAsync(questionId));
        }
    }, [questionId, dispatch]);

    // Initialize form data when question is loaded
    useEffect(() => {
        if (question && question.questionId === questionId && !isInitialized) {
            setFormData({
                content: question.processedContent || question.content || '',
                type: question.type || QuestionType.SINGLE_CHOICE,
                correctAnswer: question.correctAnswer || '',
                solution: question.processedSolution || question.solution || '',
                solutionYoutubeUrl: question.solutionYoutubeUrl || '',
                difficulty: question.difficulty || Difficulty.TH,
                grade: question.grade?.toString() || '',
                subjectId: question.subjectId?.toString() || '',
                pointsOrigin: question.pointsOrigin?.toString() || '',
                visibility: question.visibility || VISIBILITY.DRAFT,
                chapters: question.questionChapters?.map(qc => qc.chapter) || [],
            });
            setIsInitialized(true);
        }
    }, [question, questionId, isInitialized]);

    const typeOptions = QUESTION_TYPE_OPTIONS;
    const difficultyOptions = DIFFICULTY_OPTIONS;
    const visibilityOptions = VISIBILITY_OPTIONS;

    // Determine if statements are allowed based on question type
    const allowStatements = [
        QuestionType.SINGLE_CHOICE,
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.TRUE_FALSE
    ].includes(formData.type);

    // Determine if correct answer field is allowed (for essay types)
    const allowCorrectAnswer = [
        QuestionType.ESSAY,
        QuestionType.SHORT_ANSWER
    ].includes(formData.type);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateUpdateQuestion = (formData) => {
        const errors = {};

        if (!formData.content?.trim()) {
            errors.content = 'Nội dung câu hỏi không được để trống';
        } else if (formData.content.trim().length < 10) {
            errors.content = 'Nội dung câu hỏi phải có ít nhất 10 ký tự';
        }

        if (!formData.type) {
            errors.type = 'Vui lòng chọn loại câu hỏi';
        }

        if (formData.pointsOrigin && parseFloat(formData.pointsOrigin) <= 0) {
            errors.pointsOrigin = 'Điểm phải lớn hơn 0';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateUpdateQuestion(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            content: formData.content.trim(),
            correctAnswer: allowCorrectAnswer && formData.correctAnswer?.trim() 
                ? formData.correctAnswer.trim() 
                : undefined,
            solution: formData.solution?.trim() || undefined,
            solutionYoutubeUrl: formData.solutionYoutubeUrl?.trim() || undefined,
            difficulty: formData.difficulty || undefined,
            grade: formData.grade ? parseInt(formData.grade) : undefined,
            subjectId: formData.subjectId ? parseInt(formData.subjectId) : undefined,
            pointsOrigin: formData.pointsOrigin ? parseFloat(formData.pointsOrigin) : undefined,
            visibility: formData.visibility,
            chapterIds: formData.chapters && formData.chapters.length > 0 
                ? formData.chapters.map(ch => ch.chapterId) 
                : undefined,
        };

        try {
            await dispatch(updateQuestionAsync({ id: questionId, data })).unwrap();
            loadQuestions?.();
            onClose();
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    if (loadingGetById) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!question || question.questionId !== questionId) {
        return (
            <div className="text-center text-foreground-light py-8">
                Không tìm thấy câu hỏi
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <MarkdownEditorPreview
                        value={formData.content}
                        onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                        height="400px"
                        editable={true}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                    )}
                </div>

                {/* Type and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Dropdown
                            label="Loại câu hỏi"
                            required={true}
                            value={formData.type}
                            onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                            options={typeOptions}
                            error={errors.type}
                            disabled={true}
                        />
                        <p className="mt-1 text-xs text-foreground-light italic">Không thể thay đổi loại câu hỏi sau khi tạo</p>
                    </div>
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

                {/* Correct Answer */}
                {allowCorrectAnswer && (
                    <div>
                        <Input
                            error={errors.correctAnswer}
                            name="correctAnswer"
                            label="Đáp án đúng"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            placeholder="Nhập đáp án đúng cho câu tự luận..."
                        />
                    </div>
                )}

                {/* Solution */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lời giải
                    </label>
                    <MarkdownEditorPreview
                        value={formData.solution}
                        onChange={(value) => setFormData(prev => ({ ...prev, solution: value }))}
                        height="400px"
                        editable={true}
                    />
                    {errors.solution && (
                        <p className="mt-1 text-sm text-red-600">{errors.solution}</p>
                    )}
                </div>

                {/* Solution YouTube URL */}
                <div>
                    <YoutubeInput
                        name="solutionYoutubeUrl"
                        label="Link Youtube lời giải"
                        value={formData.solutionYoutubeUrl}
                        onChange={handleChange}
                        error={errors.solutionYoutubeUrl}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>

                {/* Grade and Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Dropdown
                            label="Khối lớp"
                            value={formData.grade}
                            onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                            options={GRADE_OPTIONS}
                            error={errors.grade}
                        />
                    </div>
                    <div>
                        <Input
                            error={errors.pointsOrigin}
                            name="pointsOrigin"
                            label="Điểm"
                            type="number"
                            value={formData.pointsOrigin}
                            onChange={handleChange}
                            placeholder="VD: 1, 2, 3..."
                            min="0"
                            step="0.1"
                        />
                    </div>
                </div>

                {/* Subject and Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <SubjectSearchSelect
                            label="Môn học"
                            placeholder="Tìm kiếm môn học..."
                            value={formData.subjectId}
                            onSelect={(subject) => {
                                setSelectedSubject(subject);
                                setFormData(prev => ({
                                    ...prev,
                                    subjectId: subject?.subjectId || ''
                                }));
                            }}
                            error={errors.subjectId}
                        />
                    </div>
                    <div>
                        <Dropdown
                            label="Trạng thái"
                            value={formData.visibility}
                            onChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                            options={visibilityOptions}
                            error={errors.visibility}
                        />
                    </div>
                </div>

                {/* Chapters */}
                <div>
                    <ChapterSearchMultiSelect
                        label="Chương"
                        placeholder="Tìm kiếm và chọn chương..."
                        value={formData.chapters}
                        onChange={(chapters) => setFormData(prev => ({ ...prev, chapters }))}
                        filterSubjectId={formData.subjectId}
                        error={errors.chapters}
                    />
                </div>

                {/* Statements Editor */}
                {allowStatements && (
                    <div>
                        <StatementEditor
                            questionId={questionId}
                            statements={question.statements || []}
                        />
                    </div>
                )}
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingUpdate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingUpdate}
                    disabled={loadingUpdate}
                >
                    Cập nhật câu hỏi
                </Button>
            </div>
        </form>
    );
};
