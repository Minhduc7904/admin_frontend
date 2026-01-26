import { useState } from 'react';
import { Button, Input, Textarea, Dropdown } from '../../../shared/components/ui';

/**
 * NotificationForm - Form để nhập thông tin thông báo
 */
export const NotificationForm = ({ 
    onSubmit, 
    loading = false,
    selectedStudents = [],
    showRecipientTypeSelector = false,
    recipientType = 'STUDENT',
    onRecipientTypeChange,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'SYSTEM',
        level: 'INFO',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDropdownChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // Clear error when user changes
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Tiêu đề không được quá 200 ký tự';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Nội dung không được để trống';
        } else if (formData.message.length > 1000) {
            newErrors.message = 'Nội dung không được quá 1000 ký tự';
        }

        // Validation recipients
        if (recipientType === 'ALL') {
            // No validation needed for ALL
        } else if (selectedStudents.length === 0) {
            const recipientLabel = recipientType === 'ADMIN' ? 'quản trị viên' : 'học sinh';
            newErrors.students = `Vui lòng chọn ít nhất 1 ${recipientLabel}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        onSubmit(formData);
    };

    const handleReset = () => {
        setFormData({
            title: '',
            message: '',
            type: 'SYSTEM',
            level: 'INFO',
        });
        setErrors({});
    };

    // Notification type options (matching backend enum)
    const typeOptions = [
        { value: 'SYSTEM', label: 'Hệ thống' },
        { value: 'COURSE', label: 'Khóa học' },
        { value: 'LESSON', label: 'Buổi học' },
        { value: 'ATTENDANCE', label: 'Điểm danh' },
        { value: 'MESSAGE', label: 'Tin nhắn' },
        { value: 'OTHER', label: 'Khác' },
    ];

    // Notification level options (matching backend enum)
    const levelOptions = [
        { value: 'INFO', label: 'Thông tin' },
        { value: 'SUCCESS', label: 'Thành công' },
        { value: 'WARNING', label: 'Cảnh báo' },
        { value: 'ERROR', label: 'Lỗi' },
    ];

    // Recipient type options
    const recipientTypeOptions = [
        { value: 'ALL', label: 'Tất cả người dùng' },
        { value: 'ADMIN', label: 'Quản trị viên' },
        { value: 'STUDENT', label: 'Học sinh' },
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 space-y-6">
                <div className="bg-white border border-border rounded-sm p-4">
                    <h3 className="text-lg font-semibold mb-4">Thông tin thông báo</h3>

                    {/* Recipient Type Selector (if enabled) */}
                    {showRecipientTypeSelector && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Gửi đến
                            </label>
                            <Dropdown
                                name="recipientType"
                                value={recipientType}
                                onChange={(value) => onRecipientTypeChange?.(value)}
                                options={recipientTypeOptions}
                                placeholder="Chọn đối tượng nhận..."
                                disabled={loading}
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Chọn đối tượng muốn gửi thông báo
                            </p>
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-4">
                        <Input
                            label="Tiêu đề"
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề thông báo..."
                            error={errors.title}
                            disabled={loading}
                            maxLength={200}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Tiêu đề ngắn gọn, dễ hiểu (tối đa 200 ký tự)
                        </p>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Nội dung <span className="text-error">*</span>
                        </label>
                        <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Nhập nội dung thông báo..."
                            rows={6}
                            error={errors.message}
                            disabled={loading}
                            maxLength={1000}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Nội dung chi tiết thông báo (tối đa 1000 ký tự)
                        </p>
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Loại thông báo
                        </label>
                        <Dropdown
                            name="type"
                            value={formData.type}
                            onChange={(value) => handleDropdownChange('type', value)}
                            options={typeOptions}
                            placeholder="Chọn loại thông báo..."
                            disabled={loading}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Phân loại thông báo theo mục đích
                        </p>
                    </div>

                    {/* Level */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Mức độ
                        </label>
                        <Dropdown
                            name="level"
                            value={formData.level}
                            onChange={(value) => handleDropdownChange('level', value)}
                            options={levelOptions}
                            placeholder="Chọn mức độ..."
                            disabled={loading}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Mức độ quan trọng của thông báo
                        </p>
                    </div>

                    {/* Students error */}
                    {errors.students && (
                        <div className="text-error text-sm mb-4 p-3 bg-error/10 border border-error/30 rounded-sm">
                            {errors.students}
                        </div>
                    )}

                    {/* Selected count */}
                    {recipientType !== 'ALL' && (
                        <div className="p-3 bg-info/10 border border-info/30 rounded-sm">
                            <p className="text-sm text-info-dark">
                                Đã chọn: <strong>{selectedStudents.length}</strong>{' '}
                                {recipientType === 'ADMIN' ? 'quản trị viên' : 'học sinh'}
                            </p>
                        </div>
                    )}

                    {recipientType === 'ALL' && (
                        <div className="p-3 bg-warning/10 border border-warning/30 rounded-sm">
                            <p className="text-sm text-warning-dark">
                                <strong>Lưu ý:</strong> Thông báo sẽ được gửi đến tất cả người dùng trong hệ thống
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                >
                    Đặt lại
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={recipientType !== 'ALL' && selectedStudents.length === 0}
                >
                    Gửi thông báo
                </Button>
            </div>
        </form>
    );
};
