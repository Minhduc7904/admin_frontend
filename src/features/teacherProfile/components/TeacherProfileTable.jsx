import { Eye, Trash2 } from 'lucide-react';
import { ActionMenu, Badge, Table } from '../../../shared/components/ui';
import { formatDateTime } from '../../../shared/utils/dateTime';
import { TEACHER_PROFILE_VISIBILITY_LABELS } from '../constants/teacherProfile.constants';

const getVisibilityVariant = (visibility) => {
    if (visibility === 'PUBLISHED') return 'success';
    if (visibility === 'PRIVATE') return 'warning';
    return 'secondary';
};

export const TeacherProfileTable = ({ teacherProfiles, loading, onView, onDelete }) => {
    const columns = [
        {
            key: 'teacherProfileId',
            label: 'ID',
            render: (profile) => (
                <span className="text-sm text-foreground-light">#{profile.teacherProfileId}</span>
            ),
        },
        {
            key: 'displayName',
            label: 'Giáo viên',
            render: (profile) => (
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{profile.displayName}</div>
                    <div className="truncate font-mono text-xs text-foreground-light">{profile.slug}</div>
                    {profile.headline && (
                        <div className="mt-1 max-w-md truncate text-xs text-foreground-light">{profile.headline}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'expertise',
            label: 'Chuyên môn',
            render: (profile) => (
                <span className="line-clamp-2 text-sm text-foreground-light">
                    {profile.expertise || profile.teachingSubjects || '-'}
                </span>
            ),
        },
        {
            key: 'visibility',
            label: 'Trạng thái',
            render: (profile) => (
                <Badge variant={getVisibilityVariant(profile.visibility)} size="small">
                    {TEACHER_PROFILE_VISIBILITY_LABELS[profile.visibility] || profile.visibility}
                </Badge>
            ),
        },
        {
            key: 'isFeatured',
            label: 'Nổi bật',
            render: (profile) => (
                <Badge variant={profile.isFeatured ? 'primary' : 'secondary'} size="small">
                    {profile.isFeatured ? 'Có' : 'Không'}
                </Badge>
            ),
        },
        {
            key: 'stats',
            label: 'Xem / SEO',
            render: (profile) => (
                <span className="text-sm text-foreground-light">
                    {profile.viewCount || 0} / {profile.seoScore ?? '-'}
                </span>
            ),
        },
        {
            key: 'sortOrder',
            label: 'Thứ tự',
            render: (profile) => (
                <span className="text-sm text-foreground-light">{profile.sortOrder ?? '-'}</span>
            ),
        },
        {
            key: 'updatedAt',
            label: 'Cập nhật',
            render: (profile) => (
                <span className="text-sm text-foreground-light">{formatDateTime(profile.updatedAt)}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            className: 'relative',
            render: (profile) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                        items={[
                            {
                                label: 'Xem chi tiết',
                                icon: <Eye size={16} />,
                                onClick: () => onView(profile),
                            },
                            {
                                label: 'Xóa',
                                icon: <Trash2 size={16} />,
                                variant: 'danger',
                                onClick: () => onDelete(profile),
                            },
                        ]}
                    />
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={teacherProfiles}
            loading={loading}
            onRowClick={onView}
            emptyMessage="Chưa có hồ sơ giáo viên nào"
            emptySubMessage="Tạo hồ sơ đầu tiên để quản lý trang SEO profile giáo viên."
        />
    );
};
