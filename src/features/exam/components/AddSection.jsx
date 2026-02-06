import { createSectionAsync, selectSectionLoadingCreate } from "../store/sectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Input, Button } from "../../../shared/components";
import { MarkdownEditorPreview } from "../../../shared/components/markdown/MarkdownEditorPreview";

export const AddSection = ({ onClose, examId, onSectionCreated }) => {
    const dispatch = useDispatch();
    const loadingCreate = useSelector(selectSectionLoadingCreate);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateCreateSection = (formData) => {
        const errors = {};

        if (!formData.title?.trim()) {
            errors.title = 'Tiêu đề không được để trống';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
        } else if (formData.title.trim().length > 200) {
            errors.title = 'Tiêu đề không được quá 200 ký tự';
        }

        if (formData.description && formData.description.trim().length > 2000) {
            errors.description = 'Mô tả không được quá 2000 ký tự';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateCreateSection(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            examId: parseInt(examId),
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
        };

        try {
            const result = await dispatch(createSectionAsync(data)).unwrap();
            onSectionCreated?.(result.data);
            onClose();
        } catch (error) {
            console.error('Error creating section:', error);
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
                        label="Tiêu đề phần"
                        required={true}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="VD: Phần I - Trắc nghiệm"
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
                    Tạo phần
                </Button>
            </div>
        </form>
    );
};
