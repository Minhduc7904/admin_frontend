import { Mail, User, AtSign, ShieldCheck, CalendarDays, Activity, Clock3, GraduationCap, Hash } from 'lucide-react';
import { SkeletonCard } from '../../../shared/components/loading';

const formatDateTime = (value) => {
    if (!value) {
        return 'Chưa cập nhật';
    }

    try {
        return new Date(value).toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (error) {
        return value;
    }
};

const InfoSection = ({ title, description, children }) => (
    <section className="bg-white border border-border rounded-sm p-6 shadow-sm">
        <header className="mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-light">{title}</p>
            {description && <p className="text-sm text-foreground-light mt-1">{description}</p>}
        </header>
        {children}
    </section>
);

const InfoField = ({ icon: Icon, label, value, highlight = false }) => (
    <div className={`flex items-start gap-3 p-4 rounded-sm border ${highlight ? 'bg-primary border-border' : 'border-border'}`}>
        <div className="p-2 rounded-sm bg-primary text-foreground">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground-light">{label}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{value || 'Chưa cập nhật'}</p>
        </div>
    </div>
);

const Timeline = ({ items }) => (
    <ol className="relative border-l border-border-light space-y-6 pl-6">
        {items.map((item) => (
            <li key={item.label} className="relative">
                <span className="absolute -left-8 top-1.5 w-5 h-5 rounded-full bg-primary border border-border flex items-center justify-center text-foreground">
                    <item.icon className="w-3 h-3" />
                </span>
                <p className="text-xs uppercase tracking-[0.3em] text-foreground-light">{item.label}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{item.value}</p>
                {item.description && (
                    <p className="text-xs text-foreground-light mt-0.5">{item.description}</p>
                )}
            </li>
        ))}
    </ol>
);

export const AdminInfoTab = ({ admin, loading }) => {
    if (loading) {
        return <SkeletonCard count={2} className="rounded-sm" />;
    }

    if (!admin) {
        return (
            <div className="bg-white border border-dashed border-border rounded-sm p-6 text-center text-foreground-light">
                Chưa thể tải thông tin quản trị viên.
            </div>
        );
    }

    const timelineItems = [
        {
            label: 'Tạo tài khoản',
            value: formatDateTime(admin.createdAt),
            icon: CalendarDays,
        },
        {
            label: 'Cập nhật gần nhất',
            value: formatDateTime(admin.updatedAt),
            icon: Activity,
        },
        {
            label: 'Đăng nhập gần nhất',
            value: formatDateTime(admin.lastLoginAt),
            icon: Clock3,
            description: admin.isEmailVerified ? 'Email đã xác thực' : 'Email chưa xác thực',
        },
    ];

    return (
        <div className="space-y-6">
            <InfoSection
                title="Thông tin chung"
                description="Ảnh chụp nhanh về thông tin cơ bản của quản trị viên."
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <InfoField icon={User} label="Họ và tên" value={admin.fullName} highlight />
                    <InfoField icon={AtSign} label="Username" value={admin.username} />
                    <InfoField icon={Mail} label="Email" value={admin.email} />
                    <InfoField icon={GraduationCap} label="Môn phụ trách" value={admin.subject || 'Chưa phân công'} />
                </div>
            </InfoSection>

            <div className="grid gap-6 lg:grid-cols-2">
                <InfoSection title="Hoạt động tài khoản" description="Theo dõi vòng đời hoạt động.">
                    <Timeline items={timelineItems} />
                </InfoSection>

                <InfoSection title="Trạng thái bảo mật">
                    <div className="grid gap-4">
                        <InfoField
                            icon={ShieldCheck}
                            label="Trạng thái"
                            value={admin.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                            highlight
                        />
                        <InfoField
                            icon={ShieldCheck}
                            label="Xác thực email"
                            value={admin.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                        />
                        <InfoField icon={Hash} label="ID quản trị" value={`#${admin.adminId}`} />
                        <InfoField icon={Hash} label="ID người dùng" value={`#${admin.userId}`} />
                    </div>
                </InfoSection>
            </div>
        </div>
    );
};
