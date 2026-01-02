// 1. Imports
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllRolesAsync,
    selectRoles,
    selectRoleLoadingGet,
    assignRoleToUserAsync,
    getUserRolesAsync,
} from "../../../role/store/roleSlice";
import { Button, Dropdown, DateTimePicker } from "../../../../shared/components";

// 2. Component
export const AddRole = ({ userId, userRoleIds = [], onClose }) => {
    const dispatch = useDispatch();

    // Store
    const roles = useSelector(selectRoles);
    const loadingGet = useSelector(selectRoleLoadingGet);

    // Local state
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null); // ISO string | null
    const [submitting, setSubmitting] = useState(false);

    // Load roles
    useEffect(() => {
        if (roles.length === 0) dispatch(getAllRolesAsync({ limit: 100 }));
    }, [dispatch, roles.length]);

    // 🔑 Chỉ lấy role CHƯA được gán
    const availableRoles = useMemo(() => {
        return roles.filter(
            (role) => !userRoleIds.includes(role.roleId)
        );
    }, [roles, userRoleIds]);

    const dropdownOptions = useMemo(() => {
        return availableRoles.map((role) => ({
            label: role.roleName,
            value: role.roleId,
            description: role.description,
        }));
    }, [availableRoles]);

    // Handlers
    const handleAssign = async () => {
        if (!selectedRoleId) return;

        try {
            setSubmitting(true);

            await dispatch(
                assignRoleToUserAsync({
                    userId,
                    roleId: selectedRoleId,
                    expiresAt: expiresAt || undefined, // 👈 picker đã trả ISO
                })
            ).unwrap();

            await dispatch(getUserRolesAsync(userId)).unwrap();
            onClose?.();
        } catch (err) {
            console.error("Assign role failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    // 3. Render
    return (
        <div className="flex flex-col h-full">

            {/* Body */}
            <div className="flex-1 p-4 space-y-4">
                {loadingGet && (
                    <p className="text-sm text-foreground-light">
                        Đang tải danh sách vai trò...
                    </p>
                )}

                {!loadingGet && availableRoles.length === 0 && (
                    <div className="text-sm text-foreground-light bg-primary/30 p-3 rounded-sm border border-border">
                        Người dùng đã được gán tất cả vai trò hiện có.
                    </div>
                )}

                {!loadingGet && availableRoles.length > 0 && (
                    <>
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Vai trò
                            </label>
                            <Dropdown
                                options={dropdownOptions}
                                value={selectedRoleId}
                                onChange={setSelectedRoleId}
                                placeholder="Chọn vai trò"
                            />
                        </div>

                        {/* Expiration */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Ngày hết hạn{" "}
                                <span className="text-foreground-light">(tuỳ chọn)</span>
                            </label>
                            <DateTimePicker
                                mode="date"                // ✅ CHỈ NGÀY
                                value={expiresAt}
                                onChange={setExpiresAt}
                                placeholder="Không giới hạn thời gian"
                            />
                            <p className="text-xs text-foreground-light mt-1">
                                Để trống nếu vai trò không có thời hạn.
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={submitting}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleAssign}
                    disabled={!selectedRoleId || submitting}
                    loading={submitting}
                >
                    Gán vai trò
                </Button>
            </div>
        </div>
    );
};
