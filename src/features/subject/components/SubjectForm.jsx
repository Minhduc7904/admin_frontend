import { Input, Button, Textarea } from '../../../shared/components/ui';

export const SubjectForm = ({
    formData,
    errors,
    onChange,
    onSubmit,
    onCancel,
    loading,
    mode = 'create',
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 px-6 py-4 space-y-6">

                {/* Code */}
                <div>
                    <Input
                        label="Mã môn học"
                        required
                        name="code"
                        value={formData.code}
                        onChange={onChange}
                        placeholder="VD: MATH, PHYSICS"
                        error={errors.code}
                        disabled={mode === 'edit'}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        {mode === 'edit'
                            ? 'Mã môn học không thể thay đổi sau khi tạo'
                            : 'Chỉ gồm chữ hoa (A-Z), số (0-9) và gạch dưới (_)'
                        }
                    </p>
                </div>

                {/* Name */}
                <div>
                    <Input
                        label="Tên môn học"
                        required
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="VD: Toán học, Vật lý..."
                        error={errors.name}
                    />
                </div>

            </div>

            {/* Actions */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
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
                    {mode === 'create' ? 'Tạo môn học' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
