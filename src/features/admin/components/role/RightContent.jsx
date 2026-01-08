import { Button } from '../../../../shared/components/ui';
import { Plus } from 'lucide-react';
import { SkeletonCard } from '../../../../shared/components/loading';
import { RoleCard } from './RoleCard';
import { EmptyState } from '../../../../shared/components/ui';

const Header = ({ handleAddRole }) => {
    return (
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-info">
                    Vai trò được gán
                </p>
                <h2 className="text-2xl font-semibold text-foreground mt-1">
                    Quản lý role
                </h2>
                <p className="text-sm text-foreground-light mt-1 max-w-2xl">
                    Theo dõi danh sách role đang áp dụng và chủ động thêm hoặc gỡ bỏ role phù hợp cho quản trị viên.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary" onClick={handleAddRole}>
                    <Plus className="w-4 h-4" />
                    Thêm role
                </Button>
            </div>
        </header>
    );
};

const Content = ({ userRoles, loadingRoles, handleRemoveRole }) => {
    // ✅ Loading
    if (loadingRoles) {
        return <SkeletonCard count={2} />;
    }

    // ✅ Empty state (dùng EmptyState chuẩn hệ)
    if (!loadingRoles && userRoles.length === 0) {
        return (
            <EmptyState
                icon="shield_check"
                title="Chưa có vai trò nào"
                description='Quản trị viên hiện chưa được gán role. Sử dụng nút "Thêm role" để bắt đầu phân quyền.'
                size="sm"
            />
        );
    }

    // ✅ Data
    return (
        <div className="space-y-4">
            {userRoles.map((userRole) => (
                <RoleCard
                    key={`${userRole.roleId}-${userRole.assignedAt}`}
                    userRole={userRole}
                    onRemove={handleRemoveRole}
                />
            ))}
        </div>
    );
};

export const RightContent = ({
    userRoles,
    loadingRoles,
    handleAddRole,
    handleRemoveRole,
}) => {
    return (
        <div className="bg-white border border-border rounded-sm p-5 space-y-5">
            <Header handleAddRole={handleAddRole} />

            <Content
                userRoles={userRoles}
                loadingRoles={loadingRoles}
                handleRemoveRole={handleRemoveRole}
            />
        </div>
    );
};
