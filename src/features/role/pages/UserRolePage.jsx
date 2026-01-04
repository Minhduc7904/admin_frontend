import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { ROUTES } from '../../../core/constants';
import {
    getUserRolesAsync,
    clearUserRoles,
    selectUserRoles,
    selectRoleLoadingGet,
    selectRoleLoadingDelete,
    removeRoleFromUserAsync
} from '../store/roleSlice';
import {
    LeftContent,
    RightContent,
    AddRole
} from '../../admin/components/role';
import { RightPanel, ConfirmModal } from '../../../shared/components/index';

/**
 * UserRolePage - Shared component for managing user roles
 * Can be used for both Admin and Student role management
 * 
 * @param {number} userId - The user ID to manage roles for
 * @param {string} userType - Type of user ('admin' or 'student') for display text
 * @param {boolean} loading - Loading state from parent
 */
export const UserRolePage = ({ userId, userType = 'admin', loading: parentLoading }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const userRoles = useAppSelector(selectUserRoles);
    const loadingRoles = useAppSelector(selectRoleLoadingGet);
    const loadingDelete = useAppSelector(selectRoleLoadingDelete);

    const [openAddRolePanel, setOpenAddRolePanel] = useState(false);
    const [openConfirmRemoveModal, setOpenConfirmRemoveModal] = useState(false);
    const [roleToRemove, setRoleToRemove] = useState(null);

    useEffect(() => {
        if (userId) {
            dispatch(getUserRolesAsync(userId));
        }

        return () => {
            dispatch(clearUserRoles());
        };
    }, [userId, dispatch]);

    const aggregatedPermissions = useMemo(() => {
        if (!userRoles?.length) {
            return [];
        }

        const permissionMap = new Map();

        userRoles.forEach((role) => {
            role?.permissions?.forEach((permission) => {
                if (!permissionMap.has(permission.permissionId)) {
                    permissionMap.set(permission.permissionId, {
                        ...permission,
                        roles: new Set(),
                    });
                }
                const entry = permissionMap.get(permission.permissionId);
                entry.roles.add(role?.role?.roleName || `Role #${role.roleId}`);
            });
        });

        return Array.from(permissionMap.values()).map((permission) => ({
            ...permission,
            roles: Array.from(permission.roles),
        }));
    }, [userRoles]);

    const groupedPermissions = useMemo(() => {
        if (!aggregatedPermissions.length) {
            return [];
        }

        const groupMap = new Map();

        aggregatedPermissions.forEach((permission) => {
            const groupName = permission.group || 'Không nhóm';
            if (!groupMap.has(groupName)) {
                groupMap.set(groupName, []);
            }
            groupMap.get(groupName).push(permission);
        });

        return Array.from(groupMap.entries()).map(([groupName, permissions]) => ({
            groupName,
            permissions,
        }));
    }, [aggregatedPermissions]);

    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        if (!groupedPermissions.length) {
            setExpandedGroups({});
            return;
        }

        const defaults = {};
        groupedPermissions.forEach(({ groupName }) => {
            defaults[groupName] = false;
        });
        setExpandedGroups(defaults);
    }, [groupedPermissions]);

    const toggleGroup = (groupName) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    const handleRemoveRole = (roleId) => {
        setRoleToRemove(roleId);
        setOpenConfirmRemoveModal(true);
    };

    const submitRemoveRole = async () => {
        if (!roleToRemove || !userId) return;
        try {
            await dispatch(removeRoleFromUserAsync({
                userId: userId,
                roleId: roleToRemove
            })).unwrap();

            // Refresh roles
            await dispatch(getUserRolesAsync(userId)).unwrap();

        } catch (error) {
            console.error('Error removing role from user:', error);
        }
    };

    const handleOpenAddRolePanel = () => {
        if (!userId) return;
        setOpenAddRolePanel(true);
    };

    const userTypeText = userType === 'student' ? 'học sinh' : 'quản trị viên';

    if (!userId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID {userTypeText} không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
            </div>
        );
    }

    return (
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <RightContent
                userRoles={userRoles}
                loadingRoles={loadingRoles || parentLoading}
                handleAddRole={handleOpenAddRolePanel}
                handleRemoveRole={handleRemoveRole}
            />
            <LeftContent
                loadingRoles={loadingRoles || parentLoading}
                groupedPermissions={groupedPermissions}
                expandedGroups={expandedGroups}
                toggleGroup={toggleGroup}
            />
            <RightPanel
                isOpen={openAddRolePanel}
                onClose={() => setOpenAddRolePanel(false)}
                title="Gán vai trò mới"
            >
                <AddRole
                    userId={userId}
                    onClose={() => setOpenAddRolePanel(false)}
                    userRoleIds={userRoles.map(userRole => userRole.roleId)}
                />
            </RightPanel>

            <ConfirmModal
                isOpen={openConfirmRemoveModal}
                onClose={() => setOpenConfirmRemoveModal(false)}
                title="Xác nhận gỡ vai trò"
                message={`Bạn có chắc chắn muốn gỡ vai trò này khỏi ${userTypeText} không? Hành động này không thể hoàn tác.`}
                onConfirm={async () => {
                    await submitRemoveRole();
                    setOpenConfirmRemoveModal(false);
                }}
                confirmText="Gỡ vai trò"
                cancelText="Hủy"
                isLoading={loadingDelete}
                variant='danger'
            />
        </section>
    );
};
