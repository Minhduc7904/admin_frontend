import { useState } from 'react';
import { Input, Button, Dropdown, Checkbox, Textarea } from '../../../shared/components/ui';

export const PermissionForm = ({
    formData,
    errors,
    onChange,
    onSubmit,
    onCancel,
    loading,
    groups,
    mode = 'create'
}) => {
    const [groupMode, setGroupMode] = useState('select'); // 'select' or 'input'

    const handleGroupModeChange = (mode) => {
        setGroupMode(mode);
        // Clear group value when switching modes
        onChange({ target: { name: 'group', value: '' } });
    };

    const groupOptions = groups.map(g => ({ value: g, label: g }));

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6">
                {/* Code */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Mã quyền <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="code"
                        value={formData.code}
                        onChange={onChange}
                        placeholder="VD: USER_CREATE"
                        error={errors.code}
                        disabled={mode === 'edit'}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Mã định danh duy nhất cho quyền (chữ hoa, gạch dưới)
                    </p>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tên quyền <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="VD: Tạo người dùng"
                        error={errors.name}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Mô tả
                    </label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Mô tả chi tiết về quyền này..."
                        rows={4}
                    />
                </div>

                {/* Group Mode Toggle */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Nhóm quyền
                    </label>
                    <div className="flex gap-2 mb-3">
                        <button
                            type="button"
                            onClick={() => handleGroupModeChange('select')}
                            className={`flex-1 px-3 py-2 text-sm rounded-sm transition-colors ${groupMode === 'select'
                                ? 'bg-info text-white cursor-not-allowed'
                                : 'bg-gray-100 text-foreground hover:bg-gray-200'
                                }`}
                        >
                            Chọn có sẵn
                        </button>
                        <button
                            type="button"
                            onClick={() => handleGroupModeChange('input')}
                            className={`flex-1 px-3 py-2 text-sm rounded-sm transition-colors ${groupMode === 'input'
                                ? 'bg-info text-white cursor-not-allowed'
                                : 'bg-gray-100 text-foreground hover:bg-gray-200'
                                }`}
                        >
                            Nhập mới
                        </button>
                    </div>

                    {groupMode === 'select' ? (
                        <Dropdown
                            name="group"
                            value={formData.group}
                            onChange={(value) => onChange({ target: { name: 'group', value } })}
                            options={groupOptions}
                            placeholder="Chọn nhóm..."
                        />
                    ) : (
                        <Input
                            name="group"
                            value={formData.group}
                            onChange={onChange}
                            placeholder="VD: USER_MANAGEMENT"
                        />
                    )}
                    <p className="text-xs text-foreground-light mt-1">
                        Nhóm để tổ chức và phân loại quyền
                    </p>
                </div>

                {/* Is System */}
                <div>
                    <Checkbox
                        name="isSystem"
                        checked={formData.isSystem || false}
                        onChange={(checked) => onChange({ target: { name: 'isSystem', value: checked } })}
                        label="Quyền hệ thống"
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Quyền hệ thống không thể xóa và được bảo vệ
                    </p>
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
                    {mode === 'create' ? 'Tạo quyền' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
