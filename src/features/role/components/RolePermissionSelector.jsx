import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Switch } from '../../../shared/components/ui';
import { SkeletonCard, Spinner } from '../../../shared/components/loading';

export const RolePermissionSelector = ({
    permissions,
    selectedPermissionIds,
    onPermissionToggle,
    loading,
    roleId,
    mode = 'create',
    loadingToggle,
    loadingPermissionIds,
}) => {
    const [expandedGroups, setExpandedGroups] = useState({});

    // Group permissions by group
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const group = permission.group || 'other';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
    }, {});

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <SkeletonCard count={3} className="h-48" />
            </div>
        );
    }

    if (permissions.length === 0) {
        return (
            <div className="text-center py-8 text-foreground-light">
                Không có quyền nào
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {Object.entries(groupedPermissions).map(([group, perms]) => {
                const isExpanded = expandedGroups[group];
                const selectedCount = perms.filter(p =>
                    selectedPermissionIds.includes(p.permissionId)
                ).length;

                return (
                    <div key={group} className="bg-white border border-border rounded-sm overflow-hidden">
                        {/* Header - Clickable */}
                        <button
                            type="button"
                            onClick={() => toggleGroup(group)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={20} className="text-foreground-light" />
                                </motion.div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-foreground capitalize">
                                        {group}
                                    </h4>
                                    <p className="text-xs text-foreground-light">
                                        {selectedCount}/{perms.length} quyền được chọn
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Content - Animated */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-border p-4 space-y-2">
                                        {perms.map(permission => (
                                            <div
                                                key={permission.permissionId}
                                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-sm transition-colors border border-gray-100"
                                            >
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {permission.name}
                                                    </div>
                                                    <div className="text-xs text-foreground-light">
                                                        {permission.code}
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={selectedPermissionIds.includes(permission.permissionId)}
                                                    onChange={() => onPermissionToggle(permission.permissionId)}
                                                    disabled={loadingToggle && mode === 'edit' && loadingPermissionIds.includes(permission.permissionId)}
                                                    loading={loadingToggle && mode === 'edit' && loadingPermissionIds.includes(permission.permissionId)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};
