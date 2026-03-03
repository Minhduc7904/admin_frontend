import { PageHeader } from '../../../shared/components';

export const ExamDetailBreadcrumb = ({ examName, backLabel, backTo }) => {
    return (
        <PageHeader
            breadcrumb={[
                { label: 'Bảng điều khiển', to: '/dashboard' },
                { label: backLabel || 'Đề thi', to: backTo || '/exams' },
                { label: examName || 'Chi tiết' },
            ]}
            badge="Chi tiết đề thi"
            description="Quản lý thông tin chi tiết của đề thi trong hệ thống."
        />
    );
};
