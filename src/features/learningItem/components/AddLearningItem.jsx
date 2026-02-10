import { createLearningItemAsync, selectLearningItemLoadingCreate } from "../store/learningItemSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Input, Button, Dropdown, Textarea } from "../../../shared/components";

export const AddLearningItem = ({
    onClose,
    lessonId,
    lessonTitle = '',
    loadLearningItems
}) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectLearningItemLoadingCreate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        type: '',
        title: '',
        description: '',
        lessonId: lessonId || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateCreateLearningItem = (formData) => {
        const errors = {};

        if (!formData.type) {
            errors.type = 'Loại tài liệu không được để trống';
        }

        if (!formData.title?.trim()) {
            errors.title = 'Tiêu đề không được để trống';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else if (formData.title.trim().length > 200) {
            errors.title = 'Tiêu đề không được quá 200 ký tự';
        }

        if (formData.description && formData.description.trim().length > 1000) {
            errors.description = 'Mô tả không được quá 1000 ký tự';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateCreateLearningItem(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            type: formData.type,
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            lessonId: formData.lessonId ? parseInt(formData.lessonId) : undefined,
        };

        try {
            await dispatch(createLearningItemAsync(data)).unwrap();
            if (loadLearningItems) {
                await loadLearningItems();
            }
            onClose();
        } catch (error) {
            console.error('Error creating learning item:', error);
        }
    };

    const typeOptions = [
        { value: '', label: 'Chọn loại tài liệu' },
        { value: 'DOCUMENT', label: 'Tài liệu' },
        { value: 'VIDEO', label: 'Video' },
        { value: 'YOUTUBE', label: 'Youtube' },
        { value: 'HOMEWORK', label: 'Bài tập' },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Lesson Info */}
                {lessonTitle && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs text-blue-600 font-medium">
                            Thêm vào bài học: {lessonTitle}
                        </p>
                    </div>
                )}

                {/* Type */}
                <div>
                    <Dropdown
                        label="Loại tài liệu"
                        required={true}
                        value={formData.type}
                        onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                        options={typeOptions}
                        error={errors.type}
                    />
                </div>

                {/* Title */}
                <div>
                    <Input
                        error={errors.title}
                        name="title"
                        label="Tiêu đề tài liệu"
                        required={true}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="VD: Bài giảng về hàm số"
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
                        placeholder="Mô tả chi tiết về tài liệu học tập..."
                        rows={4}
                    />
                </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loadingCreate}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={loadingCreate}
                >
                    Thêm tài liệu
                </Button>
            </div>
        </form>
    );
};
