import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, Clock, UserCheck, Lock, KeyRound, Plus, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { SkeletonCard, Button } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import {
    getUserRolesAsync,
    clearUserRoles,
    selectUserRoles,
    selectRoleLoadingGet,
    selectRoleLoadingDelete,
    removeRoleFromUserAsync
} from '../../role/store/roleSlice';
import {
    selectAdminLoadingGet
} from '../store/adminSlice';

import {
    LeftContent,
    RightContent,
    AddRole
} from '../components/role';
import { RightPanel, ConfirmModal } from '../../../shared/components';
import { selectCurrentAdmin } from '../store/adminSlice';

export const AdminRole = () => {
    const { id } = useParams();
    const adminId = Number(id);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const admin = useAppSelector(selectCurrentAdmin);
    const userRoles = useAppSelector(selectUserRoles);
    const loadingRoles = useAppSelector(selectRoleLoadingGet);
    const loadingDelete = useAppSelector(selectRoleLoadingDelete);
    const adminLoading = useAppSelector(selectAdminLoadingGet);

    const [openAddRolePanel, setOpenAddRolePanel] = useState(false);
    const [openConfirmRemoveModal, setOpenConfirmRemoveModal] = useState(false);
    const [roleToRemove, setRoleToRemove] = useState(null);
    const invalidId = isNaN(adminId) || adminId <= 0;

    useEffect(() => {
        if (admin?.userId) {
            dispatch(getUserRolesAsync(admin?.userId));
        }

        return () => {
            dispatch(clearUserRoles());
        };
    }, [admin?.userId, dispatch]);

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

    const handleAddRole = () => {
        navigate(ROUTES.ROLES);
    };

    const handleRemoveRole = (roleId) => {
        setRoleToRemove(roleId);
        setOpenConfirmRemoveModal(true);
    };

    const submitRemoveRole = async () => {
        if (!roleToRemove || !admin?.userId) return;
        try {
            await dispatch(removeRoleFromUserAsync({
                userId: admin?.userId,
                roleId: roleToRemove
            })).unwrap();

            // Refresh roles
            await dispatch(getUserRolesAsync(admin?.userId)).unwrap();

        } catch (error) {
            console.error('Error removing role from user:', error);
        }
    };


    const handleOpenAddRolePanel = () => {
        console.log('Open add role panel triggered for user', admin?.userId);
        if (!admin?.userId) return;
        setOpenAddRolePanel(true);
    }

    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID quản trị viên không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
            </div>
        );
    }

    return (
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <RightContent
                userRoles={userRoles}
                loadingRoles={loadingRoles || adminLoading}
                handleAddRole={handleOpenAddRolePanel}
                handleRemoveRole={handleRemoveRole}
            />
            <LeftContent
                loadingRoles={loadingRoles || adminLoading}
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
                    userId={admin?.userId}
                    onClose={() => setOpenAddRolePanel(false)}
                    userRoleIds={userRoles.map(userRole => userRole.roleId)}
                />
            </RightPanel>

            <ConfirmModal
                isOpen={openConfirmRemoveModal}
                onClose={() => setOpenConfirmRemoveModal(false)}
                title="Xác nhận gỡ vai trò"
                message="Bạn có chắc chắn muốn gỡ vai trò này khỏi quản trị viên không? Hành động này không thể hoàn tác."
                onConfirm={async () => {
                    await submitRemoveRole();
                    setOpenConfirmRemoveModal(false);
                }}
                confirmText="Gỡ vai trò"
                cancelText="Hủy"
                isLoading={loadingDelete}
                variant='danger'
            />

        </section >
    );
};
