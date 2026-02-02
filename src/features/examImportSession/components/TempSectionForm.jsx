import { useState } from 'react';
import { FolderOpen, X } from 'lucide-react';
import { Input, Button, Textarea } from '../../../shared/components';

export const TempSectionForm = ({ 
    onSubmit, 
    onCancel, 
    isSubmitting,
    initialData = null,
}) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        order: initialData?.order || undefined,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.title || formData.title.trim().length === 0) {
            newErrors.title = 'Tiêu đề section là bắt buộc';
        } else if (formData.title.length > 255) {
            newErrors.title = 'Tiêu đề không được vượt quá 255 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        const submitData = {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            order: formData.order || undefined,
        };

        onSubmit(submitData);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    return (
        <div className="bg-white rounded-lg border border-border h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-primary" />
                    {initialData ? 'Chỉnh sửa Section' : 'Tạo Section mới'}
                </h3>
                <button
                    onClick={onCancel}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    disabled={isSubmitting}
                >
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                    <div>
                        <Input
                            error={errors.title}
                            name="title"
                            label="Tiêu đề Section"
                            required={true}
                            value={formData.title}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tiêu đề section (VD: Phần I - Trắc nghiệm)"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div>
                        <Textarea
                            error={errors.description}
                            name="description"
                            label="Mô tả"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả cho section (không bắt buộc)"
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Lưu ý:</strong> Thứ tự của section sẽ được tự động tính toán dựa trên số lượng section hiện có.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-border flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    Hủy
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    {initialData ? 'Cập nhật' : 'Tạo Section'}
                </Button>
            </div>
        </div>
    );
};
