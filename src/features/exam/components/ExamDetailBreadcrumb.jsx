import { PageHeader } from '../../../shared/components';

export const ExamDetailBreadcrumb = ({ examName }) => {
    return (
        <PageHeader
            breadcrumb={[
                { label: 'Bảng điều khiển', to: '/dashboard' },
                { label: 'Đề thi', to: '/exams' },
                { label: examName || 'Chi tiết' },
            ]}
            badge="Chi tiết đề thi"
            description="Quản lý thông tin chi tiết của đề thi trong hệ thống."
        />
    );
};
