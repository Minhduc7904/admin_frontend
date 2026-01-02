import { Input, Checkbox } from '../../../shared/components/ui';

export const RoleFormFields = ({ formData, errors, onChange }) => {
    const handleCheckboxChange = () => {
        onChange({
            target: {
                name: 'isAssignable',
                type: 'checkbox',
                checked: !formData.isAssignable
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Role Name */}
            <Input
                label="Tên vai trò"
                name="roleName"
                value={formData.roleName}
                onChange={onChange}
                error={errors.roleName}
                required
                placeholder="Nhập tên vai trò"
            />

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Mô tả
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows={3}
                    placeholder="Nhập mô tả vai trò"
                    className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary"
                />
            </div>

            {/* Is Assignable */}
            <div className="flex items-center gap-2">
                <Checkbox
                    name="isAssignable"
                    checked={formData.isAssignable}
                    onChange={onChange}
                />
                <label
                    className="text-sm text-foreground cursor-pointer"
                    onClick={handleCheckboxChange}
                >
                    Có thể gán cho người dùng
                </label>
            </div>
        </div>
    );
};
