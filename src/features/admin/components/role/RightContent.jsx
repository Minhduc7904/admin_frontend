import { Button } from '../../../../shared/components/ui';
import { Plus, Shield } from 'lucide-react';
import { SkeletonCard } from '../../../../shared/components/loading';
import { RoleCard } from './RoleCard';

const Header = ({ handleAddRole }) => {
    return (
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-info">Vai trò được gán</p>
                <h2 className="text-2xl font-semibold text-foreground mt-1">Quản lý role</h2>
                <p className="text-sm text-foreground-light mt-1 max-w-2xl">
                    Theo dõi danh sách role đang áp dụng và chủ động thêm hoặc gỡ bỏ role phù hợp cho quản trị viên.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="primary"
                    onClick={handleAddRole}
                >
                    <Plus className="w-4 h-4" />
                    Thêm role
                </Button>
            </div>
        </header>
    )
}

const Content = ({ userRoles, loadingRoles, handleRemoveRole }) => {
    if (loadingRoles) {
        return <SkeletonCard count={2} />;
    }

    if (userRoles.length === 0) {
        return (
            <div className="border border-dashed border-border rounded-sm p-8 text-center text-foreground-light">
                <Shield className="w-10 h-10 mx-auto mb-3 text-border" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Chưa có vai trò nào</h3>
                <p className="text-sm">
                    Quản trị viên hiện chưa được gán role. Sử dụng nút "Thêm role" để bắt đầu phân quyền.
                </p>
            </div>
        );
    }
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
    )
}

export const RightContent = ({
    userRoles,
    loadingRoles,
    handleAddRole,
    handleRemoveRole
}) => {
    return (
        <div className="bg-white border border-border rounded-sm p-5 space-y-5">
            <Header handleAddRole={handleAddRole} />

            <Content
                userRoles={userRoles}
                loadingRoles={loadingRoles}
                handleRemoveRole={handleRemoveRole}
            />
        </div >
    )
}