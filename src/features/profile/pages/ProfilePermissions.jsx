import { useSelector, useDispatch } from 'react-redux';
import { Shield, Check, X, Users } from 'lucide-react';
import { selectProfile } from '../store/profileSlice';
import { getProfileAsync } from '../store/profileSlice';
import { useEffect, useState } from 'react';

export const ProfilePermissions = () => {
    const dispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const [allPermissions, setAllPermissions] = useState([]);

    useEffect(() => {
        dispatch(getProfileAsync());
    }, [dispatch]);

    useEffect(() => {
        if (profile?.roles && profile.roles.length > 0) {
            // Lấy tất cả permissions từ tất cả roles
            const permissions = profile.roles.flatMap(role => 
                role.permissions?.map(perm => ({
                    ...perm,
                    roleName: role.roleName, // Thêm thông tin role
                    roleId: role.roleId
                })) || []
            );
            
            // Remove duplicates based on permissionId
            const uniquePermissions = Array.from(
                new Map(permissions.map(p => [p.permissionId, p])).values()
            );
            
            setAllPermissions(uniquePermissions);
        } else {
            setAllPermissions([]);
        }
    }, [profile]);

    // Group permissions by group
    const groupedPermissions = allPermissions.reduce((acc, permission) => {
        const group = permission.group || 'Khác';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
    }, {});

    return (
        <div className="p-6">
            <div className="border-b border-border pb-4 mb-6">
                <h2 className="text-xl font-semibold text-foreground">Quyền hạn</h2>
                <p className="text-sm text-foreground-light mt-1">
                    Danh sách các quyền của bạn trong hệ thống
                </p>
            </div>

            {/* Roles Info */}
            {profile?.roles && profile.roles.length > 0 && (
                <div className="mb-6 space-y-3">
                    {profile.roles.map((role) => (
                        <div key={role.roleId} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield size={20} className="text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-lg font-semibold text-blue-700">
                                            {role.roleName}
                                        </p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            {role.permissions?.length || 0} quyền
                                        </span>
                                    </div>
                                    {role.description && (
                                        <p className="text-sm text-foreground-light mt-1">
                                            {role.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Permissions List */}
            {allPermissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <X size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-foreground-light">
                        Chưa có quyền nào được gán cho các vai trò của bạn
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                        <div key={group} className="border border-border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground capitalize">{group}</h3>
                                        <p className="text-xs text-foreground-light mt-0.5">
                                            {perms.length} quyền
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-border">
                                {perms.map((permission) => (
                                    <div
                                        key={permission.permissionId}
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Check size={14} className="text-green-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-foreground text-sm">
                                                            {permission.name}
                                                        </p>
                                                        <p className="text-xs text-foreground-lighter mt-0.5 font-mono">
                                                            {permission.code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Permission Count Summary */}
            {allPermissions.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-foreground-light" />
                            <span className="text-sm font-medium text-foreground">Tổng số quyền</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                            {allPermissions.length}
                        </span>
                    </div>
                    <p className="text-xs text-foreground-light mt-2">
                        Từ {profile?.roles?.length || 0} vai trò
                    </p>
                </div>
            )}
        </div>
    );
};
