import { Mail, User, AtSign, ShieldCheck, CalendarDays, Activity, Clock3, GraduationCap, Hash, CheckCircle, XCircle } from 'lucide-react';
import { SkeletonCard } from '../../../shared/components/loading';

const formatDateTime = (value) => {
    if (!value) return 'Chưa cập nhật';
    
    try {
        return new Date(value).toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (error) {
        return value;
    }
};

const InfoRow = ({ icon: Icon, label, value, badge }) => (
    <div className="flex items-center gap-3 py-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gray-50 text-foreground-light">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground-light">{label}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-medium text-foreground truncate">{value || 'Chưa cập nhật'}</p>
                {badge}
            </div>
        </div>
    </div>
);

const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
        active 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
    }`}>
        {active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {active ? 'Hoạt động' : 'Vô hiệu hóa'}
    </span>
);

const VerifyBadge = ({ verified }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
        verified 
            ? 'bg-blue-50 text-blue-700' 
            : 'bg-gray-50 text-gray-600'
    }`}>
        {verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {verified ? 'Đã xác thực' : 'Chưa xác thực'}
    </span>
);

export const AdminInfoTab = ({ admin, loading }) => {
    if (loading) {
        return <SkeletonCard count={2} className="rounded-sm" />;
    }

    if (!admin) {
        return (
            <div className="bg-white border border-border rounded-sm p-6 text-center text-foreground-light">
                Không tìm thấy thông tin quản trị viên
            </div>
        );
    }

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div className="bg-white border border-border rounded-sm">
                    <div className="px-4 py-3 border-b border-border">
                        <h3 className="text-sm font-semibold text-foreground">Thông tin cơ bản</h3>
                    </div>
                    <div className="p-4 space-y-1">
                        <InfoRow icon={User} label="Họ và tên" value={admin.fullName} />
                        <InfoRow icon={AtSign} label="Tên đăng nhập" value={admin.username} />
                        <InfoRow icon={Mail} label="Email" value={admin.email} />
                        <InfoRow icon={GraduationCap} label="Môn phụ trách" value={admin.subject || 'Chưa phân công'} />
                    </div>
                </div>

                {/* Trạng thái */}
                <div className="bg-white border border-border rounded-sm">
                    <div className="px-4 py-3 border-b border-border">
                        <h3 className="text-sm font-semibold text-foreground">Trạng thái</h3>
                    </div>
                    <div className="p-4 space-y-1">
                        <InfoRow 
                            icon={ShieldCheck} 
                            label="Trạng thái tài khoản" 
                            value="" 
                            badge={<StatusBadge active={admin.isActive} />}
                        />
                        <InfoRow 
                            icon={Mail} 
                            label="Xác thực email" 
                            value="" 
                            badge={<VerifyBadge verified={admin.isEmailVerified} />}
                        />
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                {/* Hoạt động */}
                <div className="bg-white border border-border rounded-sm">
                    <div className="px-4 py-3 border-b border-border">
                        <h3 className="text-sm font-semibold text-foreground">Hoạt động</h3>
                    </div>
                    <div className="p-4 space-y-1">
                        <InfoRow icon={CalendarDays} label="Tạo tài khoản" value={formatDateTime(admin.createdAt)} />
                        <InfoRow icon={Activity} label="Cập nhật gần nhất" value={formatDateTime(admin.updatedAt)} />
                        <InfoRow icon={Clock3} label="Đăng nhập gần nhất" value={formatDateTime(admin.lastLoginAt)} />
                    </div>
                </div>

                {/* Thông tin hệ thống */}
                <div className="bg-white border border-border rounded-sm">
                    <div className="px-4 py-3 border-b border-border">
                        <h3 className="text-sm font-semibold text-foreground">Thông tin hệ thống</h3>
                    </div>
                    <div className="p-4 space-y-1">
                        <InfoRow icon={Hash} label="ID quản trị viên" value={`#${admin.adminId}`} />
                        <InfoRow icon={Hash} label="ID người dùng" value={`#${admin.userId}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};
