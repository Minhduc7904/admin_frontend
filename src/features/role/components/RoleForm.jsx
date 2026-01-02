import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Checkbox, Modal } from '../../../shared/components/ui';
import {
    getAllPermissionsAsync,
    selectPermissions,
    selectPermissionLoadingGet
} from '../../permission/store/permissionSlice';

export const RoleForm = ({ isOpen, onClose, onSubmit, role, loading }) => {
    const dispatch = useDispatch();
    const permissions = useSelector(selectPermissions);
    const loadingPermissions = useSelector(selectPermissionLoadingGet);

    const [formData, setFormData] = useState({
        roleName: '',
        description: '',
        isAssignable: true,
        permissionIds: [],
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            // Load permissions khi mở modal
            dispatch(getAllPermissionsAsync({ limit: 100 }));
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (role) {
            setFormData({
                roleName: role.roleName || '',
                description: role.description || '',
                isAssignable: role.isAssignable ?? true,
                permissionIds: role.permissions?.map(p => p.permissionId) || [],
            });
        } else {
            setFormData({
                roleName: '',
                description: '',
                isAssignable: true,
                permissionIds: [],
            });
        }
        setErrors({});
    }, [role, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePermissionToggle = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter(id => id !== permissionId)
                : [...prev.permissionIds, permissionId]
        }));
    };

    const handleSelectAllPermissions = (group) => {
        const groupPermissions = permissions
            .filter(p => p.group === group)
            .map(p => p.permissionId);

        const allSelected = groupPermissions.every(id =>
            formData.permissionIds.includes(id)
        );

        if (allSelected) {
            // Unselect all in group
            setFormData(prev => ({
                ...prev,
                permissionIds: prev.permissionIds.filter(id => !groupPermissions.includes(id))
            }));
        } else {
            // Select all in group
            setFormData(prev => ({
                ...prev,
                permissionIds: [...new Set([...prev.permissionIds, ...groupPermissions])]
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.roleName.trim()) {
            newErrors.roleName = 'Tên vai trò không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    // Group permissions by group
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const group = permission.group || 'other';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
    }, {});

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={role ? 'Sửa vai trò' : 'Thêm vai trò mới'} size="2xl">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Role Name */}
                    <Input
                        label="Tên vai trò"
                        name="roleName"
                        value={formData.roleName}
                        onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                        />
                        <label className="text-sm text-foreground cursor-pointer" onClick={() => handleChange({
                            target: { name: 'isAssignable', type: 'checkbox', checked: !formData.isAssignable }
                        })}>
                            Có thể gán cho người dùng
                        </label>
                    </div>

                    {/* Permissions */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Quyền ({formData.permissionIds.length} đã chọn)
                        </label>

                        {loadingPermissions ? (
                            <div className="text-center py-4 text-foreground-light">Đang tải quyền...</div>
                        ) : (
                            <div className="border border-border rounded-sm max-h-64 overflow-y-auto p-4 space-y-4">
                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                    <div key={group} className="space-y-2">
                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                            <h4 className="font-semibold text-sm text-foreground capitalize">
                                                {group}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectAllPermissions(group)}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                {perms.every(p => formData.permissionIds.includes(p.permissionId))
                                                    ? 'Bỏ chọn tất cả'
                                                    : 'Chọn tất cả'}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {perms.map(permission => (
                                                <div key={permission.permissionId} className="flex items-start gap-2">
                                                    <Checkbox
                                                        checked={formData.permissionIds.includes(permission.permissionId)}
                                                        onChange={() => handlePermissionToggle(permission.permissionId)}
                                                    />
                                                    <div className="flex-1 cursor-pointer" onClick={() => handlePermissionToggle(permission.permissionId)}>
                                                        <div className="text-sm text-foreground">{permission.name}</div>
                                                        <div className="text-xs text-foreground-light">{permission.code}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" loading={loading} disabled={loading}>
                        {role ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
