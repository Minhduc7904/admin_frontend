import { ShieldCheck, UserCheck, AtSign, Mail, BookOpen } from 'lucide-react';
import { SkeletonAvatar, SkeletonText } from '../../../shared/components/loading';
import { UserAvatar } from '../../../shared/components/avatar';

const StatusBadge = ({ active }) => (
    <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-error-bg text-error-text'
            }`}
    >
        <UserCheck className="w-3 h-3" />
        {active ? 'Đang hoạt động' : 'Đã vô hiệu'}
    </span>
);

const DataPill = ({ icon: Icon, label, value }) => (
    <div className="bg-white/10 rounded-md p-3 border border-white/10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-1">{label}</p>
        <div className="flex items-center gap-2 text-white text-sm font-medium">
            <Icon className="w-4 h-4 text-white/70" />
            <span>{value || 'Chưa cập nhật'}</span>
        </div>
    </div>
);

const RoleBadge = ({ role }) => (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/10">
        {role.roleName}
    </span>
);

export const AdminProfileOverview = ({ admin, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-sm border border-border/50">
                <div className="flex gap-4 items-center">
                    <SkeletonAvatar size="xl" shape="circle" />
                    <SkeletonText lines={3} className="flex-1" />
                </div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="bg-white border border-dashed border-border rounded-xl p-8 text-center text-foreground-light">
                <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-foreground-light" />
                <p>Chưa có dữ liệu quản trị viên. Hãy kiểm tra lại liên kết hoặc thử tải lại trang.</p>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg border border-white/10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <UserAvatar
                            userId={admin.userId}
                            name={admin.fullName}
                            size="xl"
                            className="border-2 border-white/30 shadow-lg"
                        />
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/10 text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                            #{admin.adminId}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">Quản trị viên</p>
                        <h1 className="text-2xl font-semibold leading-tight">{admin.fullName}</h1>
                        <p className="text-white/70 text-sm">ID người dùng: {admin.userId}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge active={admin.isActive} />
                            {admin.isEmailVerified && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/10">
                                    <ShieldCheck className="w-3 h-3" />
                                    Email đã xác thực
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DataPill icon={AtSign} label="Username" value={admin.username} />
                    <DataPill icon={Mail} label="Email" value={admin.email} />
                    <DataPill icon={BookOpen} label="Môn phụ trách" value={admin.subject || 'Chưa phân công'} />
                    <DataPill icon={ShieldCheck} label="Vai trò" value={`${admin.roles?.length || 0} role`} />
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-3">Vai trò đảm nhiệm</p>
                <div className="flex flex-wrap gap-2">
                    {admin.roles && admin.roles.length > 0 ? (
                        admin.roles.map((role) => <RoleBadge key={role.roleId} role={role} />)
                    ) : (
                        <span className="text-sm text-white/70">Chưa được gán vai trò nào</span>
                    )}
                </div>
            </div>
        </section>
    );
};
