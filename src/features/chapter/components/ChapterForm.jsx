import { Button, Input, Select } from '../../../shared/components';

export const ChapterForm = ({
    formData,
    errors,
    onChange,
    onSubmit,
    onCancel,
    loading,
    subjects,
    mode = 'create',
}) => {
    const subjectOptions = subjects.map(subject => ({
        value: subject.subjectId,
        label: subject.name
    }));

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

                {/* Subject */}
                <Select
                    label="Môn học"
                    required
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={onChange}
                    options={subjectOptions}
                    placeholder="Chọn môn học..."
                    error={errors.subjectId}
                    disabled={loading || mode === 'edit'}
                    helperText={
                        mode === 'edit'
                            ? 'Không thể thay đổi môn học khi chỉnh sửa chương'
                            : ''
                    }
                />

                {/* Chapter Name */}
                <Input
                    label="Tên chương"
                    required
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="Nhập tên chương"
                    error={errors.name}
                    disabled={loading}
                />

                {/* Slug */}
                <div>
                    <Input
                        label="Slug"
                        required
                        name="slug"
                        value={formData.slug}
                        onChange={onChange}
                        placeholder="vi-du-slug-chuong"
                        error={errors.slug}
                        disabled={loading}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Chỉ sử dụng chữ thường, số và dấu gạch ngang
                    </p>
                </div>

                {/* Code */}
                <Input
                    label="Mã chương"
                    name="code"
                    value={formData.code}
                    onChange={onChange}
                    placeholder="C01"
                    error={errors.code}
                    disabled={loading}
                />

                {/* Order */}
                <div>
                    <Input
                        label="Thứ tự"
                        type="number"
                        name="orderInParent"
                        value={formData.orderInParent}
                        onChange={onChange}
                        placeholder="0"
                        error={errors.orderInParent}
                        disabled={loading}
                        min="0"
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Thứ tự hiển thị trong cùng cấp
                    </p>
                </div>

                {/* Parent info */}
                {formData.parentChapterId && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-sm text-blue-800">
                            <strong>Chương cha:</strong> ID {formData.parentChapterId}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Đây là chương con. Muốn đổi chương cha → phải tạo lại.
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    {mode === 'create' ? 'Tạo chương' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
