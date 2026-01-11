import { PageHeader } from '../../../shared/components'
import { ROUTES } from '../../../core/constants'

export const CourseDetailBreadcrumb = ({ courseTitle, isMyCourses = false }) => {
    return (
        <PageHeader
            breadcrumb={[
                { label: 'Bảng điều khiển', to: '/dashboard' },
                { 
                    label: isMyCourses ? 'Khóa học của tôi' : 'Khóa học', 
                    to: isMyCourses ? ROUTES.MY_COURSES : ROUTES.COURSES 
                },
                { label: courseTitle || 'Chi tiết' },
            ]}
            badge="Chi tiết khóa học"
            description="Theo dõi thông tin, lớp học, học sinh và bài học của khóa học."
        />
    )
}
