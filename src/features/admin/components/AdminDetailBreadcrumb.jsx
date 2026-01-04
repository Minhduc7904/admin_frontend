import { PageHeader } from '../../../shared/components'

export const AdminDetailBreadcrumb = ({ adminName }) => {
    return (
        <PageHeader
            breadcrumb={[
                { label: 'Bảng điều khiển', to: '/dashboard' },
                { label: 'Quản trị viên', to: '/admins' },
                { label: adminName || 'Chi tiết' },
            ]}
            badge="Hồ sơ quản trị viên"
            description="Theo dõi thông tin, trạng thái và quyền hạn của quản trị viên trong hệ thống."
        />
    )
}
