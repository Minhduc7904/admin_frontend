import { ChevronDown, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonCard } from '../../../../shared/components/loading';


const Header = ({ aggregatedPermissions }) => {
    return (
        <header className="flex items-start justify-between gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-info">Tổng hợp quyền</p>
                <h2 className="text-2xl font-semibold text-foreground mt-1">Quyền đang sở hữu</h2>
                <p className="text-sm text-foreground-light mt-1">
                    Các quyền bên dưới được tổng hợp từ toàn bộ role đang áp dụng.
                </p>
            </div>
            <span className="text-sm font-semibold text-info">
                {aggregatedPermissions.length} quyền
            </span>
        </header>
    )
}

const Content = ({ loadingRoles, groupedPermissions, expandedGroups, toggleGroup }) => {
    if (loadingRoles) {
        return <SkeletonCard count={1} />;
    }

    if (groupedPermissions.length === 0) {
        return (
            <div className="border border-dashed border-border rounded-sm p-8 text-center text-foreground-light">
                <KeyRound className="w-10 h-10 mx-auto mb-3 text-border" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có quyền nào</h3>
                <p className="text-sm">
                    Khi quản trị viên được gán role, toàn bộ quyền sẽ được tổng hợp và hiển thị tại đây.
                </p>
            </div>
        );
    }

    return (
        <div className="border border-border rounded-sm">
            {groupedPermissions.map(({ groupName, permissions }, index) => {
                const isOpen = expandedGroups[groupName];

                return (
                    <div
                        key={groupName}
                        className={`border-border ${index !== groupedPermissions.length - 1 ? 'border-b' : ''}`}
                    >
                        <button
                            type="button"
                            onClick={() => toggleGroup(groupName)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground"
                            aria-expanded={isOpen}
                        >
                            <div className="flex items-center gap-3">
                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown className="w-4 h-4 text-foreground-light" />
                                </motion.div>
                                <div className="flex flex-col text-left">
                                    <span>{groupName}</span>
                                    <span className="text-xs font-normal text-foreground-light">
                                        {permissions.length} quyền
                                    </span>
                                </div>
                            </div>
                        </button>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-3 px-3 pb-3">
                                        {permissions.map((permission) => {
                                            const rolePreview = permission.roles.slice(0, 3);
                                            const extraCount = permission.roles.length - rolePreview.length;

                                            return (
                                                <div
                                                    key={permission.permissionId}
                                                    className="flex flex-col gap-1 rounded-sm border border-border/60 p-2"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {permission.name}
                                                            </p>
                                                            <p className="text-xs text-foreground-light">
                                                                {permission.code}
                                                            </p>
                                                        </div>
                                                        <span className="text-[11px] px-2 py-0.5 rounded-sm bg-primary/15 text-foreground">
                                                            {permission.group || 'Không nhóm'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        {/* {rolePreview.map((roleName) => (
                                                                        <span
                                                                            key={`${permission.permissionId}-${roleName}`}
                                                                            className="px-2 py-0.5 text-[11px] rounded-sm bg-primary/10 text-foreground"
                                                                        >
                                                                            {roleName}
                                                                        </span>
                                                                    ))} */}
                                                        {extraCount > 0 && (
                                                            <span className="px-2 py-0.5 text-[11px] rounded-sm bg-primary/10 text-foreground-light">
                                                                +{extraCount} role khác
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

export const LeftContent = ({
    loadingRoles,
    groupedPermissions,
    expandedGroups,
    toggleGroup
}) => {
    return (
        <div className="bg-white border border-border rounded-sm p-5 space-y-5">
            <Header aggregatedPermissions={groupedPermissions} />
            <Content loadingRoles={loadingRoles} groupedPermissions={groupedPermissions} expandedGroups={expandedGroups} toggleGroup={toggleGroup} />
        </div>
    )
}
