import { updateExamAsync, selectExamLoadingUpdate } from "../store/examSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Button, Dropdown, YoutubeInput } from "../../../shared/components";
import { SubjectSearchSelect } from "../../subject/components/SubjectSearchSelect";
import { GRADE_OPTIONS } from "../../../core/constants/grade-constants";
import { MarkdownEditorPreview } from "../../../shared/components/markdown/MarkdownEditorPreview";
import { TYPE_OF_EXAM_OPTIONS, VISIBILITY_OPTIONS } from "../../../core/constants";

export const EditExam = ({ exam, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectExamLoadingUpdate);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        title: exam?.title || '',
        typeOfExam: exam?.typeOfExam || '',
        grade: exam?.grade || '',
        subjectId: exam?.subjectId || '',
        description: exam?.processedDescription || '',
        visibility: exam?.visibility || 'DRAFT',
        solutionYoutubeUrl: exam?.solutionYoutubeUrl || '',
    });

    // Update form when exam changes
    useEffect(() => {
        if (exam) {
            setFormData({
                title: exam.title || '',
                typeOfExam: exam.typeOfExam || '',
                grade: exam.grade || '',
                subjectId: exam.subjectId || '',
                description: exam.processedDescription || '',
                visibility: exam.visibility || 'DRAFT',
                solutionYoutubeUrl: exam.solutionYoutubeUrl || '',
            });
        }
    }, [exam]);

    const visibilityOptions = VISIBILITY_OPTIONS;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateUpdateExam = (formData) => {
        const errors = {};

        if (!formData.title?.trim()) {
            errors.title = 'Tiêu đề không được để trống';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else if (formData.title.trim().length > 500) {
            errors.title = 'Tiêu đề không được quá 500 ký tự';
        }

        if (!formData.grade) {
            errors.grade = 'Vui lòng chọn khối';
        } else if (parseInt(formData.grade) < 1 || parseInt(formData.grade) > 12) {
            errors.grade = 'Khối phải từ 1 đến 12';
        }

        if (!formData.visibility) {
            errors.visibility = 'Vui lòng chọn trạng thái';
        }

        if (!formData.typeOfExam) {
            errors.typeOfExam = 'Vui lòng chọn loại đề thi';
        }

        if (formData.description && formData.description.trim().length > 2000) {
            errors.description = 'Mô tả không được quá 2000 ký tự';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateUpdateExam(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            title: formData.title.trim(),
            typeOfExam: formData.typeOfExam,
            grade: parseInt(formData.grade),
            visibility: formData.visibility,
            description: formData.description?.trim() || undefined,
            subjectId: formData.subjectId ? parseInt(formData.subjectId) : undefined,
            solutionYoutubeUrl: formData.solutionYoutubeUrl?.trim() || undefined,
        };

        try {
            await dispatch(updateExamAsync({ 
                id: exam.examId, 
                data 
            })).unwrap();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error updating exam:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Title */}
                <div>
                    <Input
                        error={errors.title}
                        name="title"
                        label="Tiêu đề đề thi"
                        required={true}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="VD: Đề thi học kỳ I - Toán 10"
                    />
                </div>

                {/* Grade and Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Dropdown
                            label="Khối lớp"
                            required={true}
                            value={formData.grade}
                            onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                            options={GRADE_OPTIONS}
                            error={errors.grade}
                        />
                    </div>
                    <div>
                        <Dropdown
                            label="Loại đề thi"
                            required={true}
                            value={formData.typeOfExam}
                            onChange={(value) => setFormData(prev => ({ ...prev, typeOfExam: value }))}
                            options={TYPE_OF_EXAM_OPTIONS}
                            error={errors.typeOfExam}
                        />
                    </div>
                    <div>
                        <Dropdown
                            label="Trạng thái"
                            required={true}
                            value={formData.visibility}
                            onChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                            options={visibilityOptions}
                            error={errors.visibility}
                        />
                    </div>
                </div>

                {/* Subject Selection */}
                <div>
                    <SubjectSearchSelect
                        label="Môn học"
                        placeholder="Tìm kiếm môn học..."
                        value={formData.subjectId}
                        onSelect={(subject) => {
                            setFormData(prev => ({
                                ...prev,
                                subjectId: subject?.subjectId || ''
                            }));
                        }}
                        error={errors.subjectId}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả
                    </label>
                    <MarkdownEditorPreview
                        value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        height="300px"
                        editable={true}
                        maxLength={2000}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                {/* Solution YouTube URL */}
                <div>
                    <YoutubeInput
                        name="solutionYoutubeUrl"
                        label="Link video giải (YouTube)"
                        value={formData.solutionYoutubeUrl}
                        onChange={handleChange}
                        error={errors.solutionYoutubeUrl}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>
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
                    Cập nhật
                </Button>
            </div>
        </form>
    );
};
