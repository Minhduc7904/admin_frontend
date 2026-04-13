import { useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, DateTimePicker, EmptyState, InlineLoading } from '../../../../shared/components';

export const AddRole = ({
    userId,
    userRoleIds = [],
    roles = [],
    loadingRoles,
    onAssign,
    onCancel,
    loading,
}) => {
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [expiresAt, setExpiresAt] = useState(null);

    // Chỉ lấy role CHƯA được gán
    const availableRoles = useMemo(() => {
        return roles.filter((r) => Number(r.roleId) !== 1 && !userRoleIds.includes(r.roleId));
    }, [roles, userRoleIds]);

    const roleOptions = useMemo(() => {
        return availableRoles.map(role => ({
            value: role.roleId,
            label: role.roleName,
            description: role.description,
        }));
    }, [availableRoles]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRoleId) return;

        onAssign({
            roleId: selectedRoleId,
            expiresAt: expiresAt || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 px-6 py-4 space-y-6">

                {/* Loading */}
                {loadingRoles && (
                    <InlineLoading message="Đang tải danh sách vai trò..." />
                )}

                {/* Empty */}
                {!loadingRoles && availableRoles.length === 0 && (
                    <EmptyState
                        icon="shield_check"
                        title="Không còn vai trò để gán"
                        description="Người dùng này đã được gán tất cả các vai trò hiện có."
                        size="sm"
                    />
                )}

                {/* Form */}
                {!loadingRoles && availableRoles.length > 0 && (
                    <>
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Vai trò <span className="text-red-500">*</span>
                            </label>
                            <Dropdown
                                value={selectedRoleId}
                                onChange={setSelectedRoleId}
                                options={roleOptions}
                                placeholder="Chọn vai trò..."
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Chọn vai trò bạn muốn gán cho người dùng
                            </p>
                        </div>

                        {/* Expiration */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ngày hết hạn <span className="text-foreground-light">(tuỳ chọn)</span>
                            </label>
                            <DateTimePicker
                                mode="date"
                                value={expiresAt}
                                onChange={setExpiresAt}
                                placeholder="Không giới hạn thời gian"
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Để trống nếu vai trò không có thời hạn sử dụng
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Actions – GIỐNG PermissionForm */}
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
                    disabled={loading || !selectedRoleId || availableRoles.length === 0}
                >
                    Gán vai trò
                </Button>
            </div>
        </form>
    );
};
