import { updateSectionAsync, selectSectionLoadingUpdate } from "../store/sectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button } from "../../../shared/components";
import { MarkdownEditorPreview } from "../../../shared/components/markdown/MarkdownEditorPreview";

export const EditSection = ({ onClose, section, onSectionUpdated }) => {
    const dispatch = useDispatch();
    const loadingUpdate = useSelector(selectSectionLoadingUpdate);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        title: section?.title || '',
        description: section?.processedDescription || section?.description || '',
    });

    useEffect(() => {
        if (section) {
            setFormData({
                title: section.title || '',
                description: section.processedDescription || section.description || '',
            });
        }
    }, [section]);

    const validateUpdateSection = (formData) => {
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

        const errors = validateUpdateSection(formData);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
        };

        try {
            const result = await dispatch(updateSectionAsync({ 
                id: section.sectionId, 
                data 
            })).unwrap();
            onSectionUpdated?.(result.data);
            onClose();
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề phần <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VD: Phần I - Trắc nghiệm"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
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
