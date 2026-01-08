import { Input, Textarea, Button } from '../../../shared/components/ui';

export const FolderForm = ({
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
            {/* Body */}
            <div className="flex-1 px-6 py-4 space-y-6">
                {/* Name */}
                <div>
                    <Input
                        label="Tên thư mục"
                        required
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="VD: Hình ảnh sản phẩm"
                        error={errors.name}
                        disabled={loading}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Tên hiển thị của thư mục trong cây quản lý
                    </p>
                </div>

                {/* Slug */}
                <div>
                    <Input
                        label="Slug"
                        required
                        name="slug"
                        value={formData.slug}
                        onChange={onChange}
                        placeholder="hinh-anh-san-pham"
                        error={errors.slug}
                        disabled={loading || mode === 'edit'}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Slug dùng cho định danh và URL (chữ thường, số, dấu gạch ngang)
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Mô tả
                    </label>
                    <Textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={onChange}
                        placeholder="Mô tả ngắn gọn về nội dung của thư mục..."
                        rows={4}
                        maxLength={500}
                        disabled={loading}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Giúp người quản lý hiểu rõ mục đích sử dụng thư mục
                    </p>
                </div>

                {/* Parent Info (Read-only) */}
                {formData.parentName && (
                    <div className="bg-info/5 border border-info/20 rounded-sm p-3">
                        <p className="text-xs text-info mb-1 font-semibold uppercase tracking-wide">
                            Thư mục cha
                        </p>
                        <p className="text-sm font-medium text-foreground">
                            {formData.parentName}
                        </p>
                        <p className="text-xs text-foreground-light mt-1">
                            Thư mục mới sẽ được tạo bên trong thư mục này
                        </p>
                    </div>
                )}
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
                    {mode === 'create' ? 'Tạo thư mục' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
