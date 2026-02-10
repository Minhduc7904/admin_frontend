import { updateLearningItemAsync, selectLearningItemLoadingUpdate } from "../store/learningItemSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Input, Button, Textarea } from "../../../shared/components";

export const EditLearningItem = ({
    onClose,
    learningItem,
    lessonTitle = '',
    loadLearningItems
}) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectLearningItemLoadingUpdate);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        type: learningItem?.type || '',
        title: learningItem?.title || '',
        description: learningItem?.description || '',
    });

    useEffect(() => {
        if (learningItem) {
            setFormData({
                type: learningItem.type || '',
                title: learningItem.title || '',
                description: learningItem.description || '',
            });
        }
    }, [learningItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateUpdateLearningItem = (formData) => {
        const errors = {};

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

        const errors = validateUpdateLearningItem(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
        };

        try {
            await dispatch(updateLearningItemAsync({ id: learningItem.learningItemId, data })).unwrap();
            if (loadLearningItems) {
                await loadLearningItems();
            }
            onClose();
        } catch (error) {
            console.error('Error updating learning item:', error);
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
                            Bài học: {lessonTitle}
                        </p>
                    </div>
                )}

                {/* Type - Read Only */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Loại tài liệu
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm text-foreground">
                        {typeOptions.find(opt => opt.value === formData.type)?.label || 'N/A'}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                        Loại tài liệu không thể thay đổi sau khi tạo
                    </p>
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
