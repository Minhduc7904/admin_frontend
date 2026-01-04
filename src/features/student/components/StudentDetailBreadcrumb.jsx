import { PageHeader } from '../../../shared/components';

export const StudentDetailBreadcrumb = ({ studentName }) => {
    return (
        <PageHeader
            breadcrumb={[
                { label: 'Bảng điều khiển', to: '/dashboard' },
                { label: 'Học sinh', to: '/students' },
                { label: studentName || 'Chi tiết' },
            ]}
            badge="Hồ sơ học sinh"
            description="Theo dõi thông tin, trạng thái và hoạt động của học sinh trong hệ thống."
        />
    );
};
