import { Button, Input, Select, Switch, Textarea } from '../../../shared/components/ui';
import { TAG_TYPES } from '../constants/tag.constants';

export const TagForm = ({
    formData,
    errors,
    onChange,
    onSwitchChange,
    onSubmit,
    onCancel,
    loading,
    mode = 'create',
}) => {
    return (
        <form onSubmit={onSubmit} className="flex h-full flex-col">
            <div className="flex-1 space-y-6 px-6 py-4">
                <Input
                    label="Tên tag"
                    required
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="VD: Toán 12"
                    error={errors.name}
                />

                <Select
                    label="Loại tag"
                    required
                    name="type"
                    value={formData.type}
                    onChange={onChange}
                    options={TAG_TYPES}
                    placeholder="Chọn loại tag"
                    error={errors.type}
                />

                <Textarea
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Mô tả ngắn về tag này..."
                    error={errors.description}
                    rows={4}
                    maxLength={500}
                />

                <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        Trạng thái
                    </label>
                    <div className="flex items-center gap-3 rounded-sm border border-border px-3 py-2">
                        <Switch
                            checked={formData.isActive}
                            onChange={onSwitchChange}
                            disabled={loading}
                        />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {formData.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                            </p>
                            <p className="text-xs text-foreground-light">
                                Tag tạm ẩn sẽ không được ưu tiên hiển thị ở các luồng chọn tag.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
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
                    {mode === 'create' ? 'Tạo tag' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
