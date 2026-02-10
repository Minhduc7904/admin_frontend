import { updateLessonAsync, selectLessonLoadingUpdate } from "../store/lessonSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Button, Dropdown, Textarea, Checkbox } from "../../../shared/components";
import { AdminSearchSelect } from "../../admin/components/AdminSearchSelect";
import { ChapterMultiSearchSelect } from "../../chapter/components";

export const EditLesson = ({
    onClose,
    lesson,
    canSelectTeacher = true,
    loadLessons
}) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectLessonLoadingUpdate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        description: lesson?.description || '',
        teacherId: lesson?.teacherId || '',
        chapterIds: lesson?.chapters?.map(c => c.chapterId) || [],
        visibility: lesson?.visibility || 'DRAFT',
        allowTrial: lesson?.allowTrial || false,
    });

    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selectedChapters, setSelectedChapters] = useState(lesson?.chapters || []);

    useEffect(() => {
        if (lesson) {
            setFormData({
                title: lesson.title || '',
                description: lesson.description || '',
                teacherId: lesson.teacherId || '',
                chapterIds: lesson.chapters?.map(c => c.chapterId) || [],
                visibility: lesson.visibility || 'DRAFT',
                allowTrial: lesson.allowTrial || false,
            });
            setSelectedChapters(lesson.chapters || []);
        }
    }, [lesson]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCheckboxChange = (name, checked) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const validateUpdateLesson = (formData) => {
        const errors = {};

        if (!formData.title?.trim()) {
            errors.title = 'Tiêu đề không được để trống';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else if (formData.title.trim().length > 200) {
            errors.title = 'Tiêu đề không được quá 200 ký tự';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateUpdateLesson(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
            chapterIds: formData.chapterIds.length > 0 ? formData.chapterIds : undefined,
            visibility: formData.visibility,
            allowTrial: formData.allowTrial,
        };

        try {
            await dispatch(updateLessonAsync({ id: lesson.lessonId, data })).unwrap();
            if (loadLessons) {
                await loadLessons();
            }
            onClose();
        } catch (error) {
            console.error('Error updating lesson:', error);
        }
    };

    const visibilityOptions = [
        { value: 'DRAFT', label: 'Bản nháp' },
        { value: 'PUBLISHED', label: 'Đã xuất bản' },
        { value: 'PRIVATE', label: 'Riêng tư' },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Title */}
                <div>
                    <Input
                        error={errors.title}
                        name="title"
                        label="Tiêu đề bài học"
                        required={true}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="VD: Bài 1: Giới thiệu về hàm số"
                    />
                </div>

                {/* Description */}
                <div>
                    <Textarea
                        error={errors.description}
                        name="description"
                        label="Mô tả"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả chi tiết về bài học..."
                        rows={4}
                    />
                </div>

                {/* Visibility and Allow Trial */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="flex items-end pb-2">
                        <Checkbox
                            name="allowTrial"
                            label="Cho phép học thử"
                            checked={formData.allowTrial}
                            onChange={(checked) => handleCheckboxChange('allowTrial', checked)}
                        />
                    </div>
                </div>

                {/* Teacher Selection */}
                {canSelectTeacher && (
                    <div>
                        <AdminSearchSelect
                            label="Giáo viên phụ trách"
                            placeholder="Tìm kiếm giáo viên..."
                            value={formData.teacherId}
                            onSelect={(admin) => {
                                setSelectedAdmin(admin);
                                setFormData(prev => ({
                                    ...prev,
                                    teacherId: admin?.adminId || ''
                                }));
                            }}
                            error={errors.teacherId}
                            helperText="Để trống nếu sử dụng giáo viên mặc định của khóa học"
                        />
                    </div>
                )}

                {/* Chapter Selection */}
                <div>
                    <ChapterMultiSearchSelect
                        label="Chương liên quan"
                        placeholder="Tìm kiếm và chọn các chương..."
                        value={selectedChapters}
                        onChange={(chapters) => {
                            setSelectedChapters(chapters);
                            setFormData(prev => ({
                                ...prev,
                                chapterIds: chapters.map(c => c.chapterId)
                            }));
                        }}
                        error={errors.chapterIds}
                        helperText="Chọn các chương mà bài học này thuộc về"
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
