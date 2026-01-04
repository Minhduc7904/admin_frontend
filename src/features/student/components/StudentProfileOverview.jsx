import { GraduationCap, UserCheck, AtSign, Mail, School, Phone } from 'lucide-react';
import { SkeletonAvatar, SkeletonText } from '../../../shared/components/loading';
import { UserAvatar } from '../../../shared/components/avatar';

const StatusBadge = ({ active }) => (
    <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
            active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-error-bg text-error-text'
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

export const StudentProfileOverview = ({ student, loading }) => {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-sm border border-border/50">
                <div className="flex gap-4 items-center">
                    <SkeletonAvatar size="xl" shape="circle" />
                    <SkeletonText lines={3} className="flex-1" />
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="bg-white border border-dashed border-border rounded-xl p-8 text-center text-foreground-light">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 text-foreground-light" />
                <p>Chưa có dữ liệu học sinh. Hãy kiểm tra lại liên kết hoặc thử tải lại trang.</p>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-lg border border-white/10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <UserAvatar
                            userId={student.userId}
                            name={student.fullName}
                            size="xl"
                            className="border-2 border-white/30 shadow-lg"
                        />
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-white/10 text-[10px] uppercase tracking-widest rounded-full border border-white/20">
                            #{student.studentId}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-1">Học sinh</p>
                        <h1 className="text-2xl font-semibold leading-tight">{student.fullName}</h1>
                        <p className="text-white/70 text-sm">ID người dùng: {student.userId}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge active={student.isActive} />
                            {student.isEmailVerified && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/10">
                                    <UserCheck className="w-3 h-3" />
                                    Email đã xác thực
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                                <GraduationCap className="w-3 h-3" />
                                Khối {student.grade}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DataPill icon={AtSign} label="Username" value={student.username} />
                    <DataPill icon={Mail} label="Email" value={student.email} />
                    <DataPill icon={School} label="Trường" value={student.school || 'Chưa cập nhật'} />
                    <DataPill icon={Phone} label="SĐT học sinh" value={student.studentPhone || 'Chưa cập nhật'} />
                </div>
            </div>

            {student.parentPhone && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-3">Liên hệ phụ huynh</p>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-white/70" />
                        <span className="text-sm text-white">{student.parentPhone}</span>
                    </div>
                </div>
            )}
        </section>
    );
};
