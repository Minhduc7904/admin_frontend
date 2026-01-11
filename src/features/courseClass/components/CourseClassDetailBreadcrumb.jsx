import { PageHeader } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';

/**
 * CourseClassDetailBreadcrumb - Breadcrumb for class detail
 * Handles different paths:
 * - MyClassList -> Class Detail (from=my-classes)
 * - ClassList -> Class Detail (no from param)
 * - CourseDetail -> CourseClasses -> Class Detail (from=course-{courseId})
 */
export const CourseClassDetailBreadcrumb = ({ 
    className, 
    courseName,
    from = null 
}) => {
    let breadcrumb = [
        { label: 'Bảng điều khiển', to: '/dashboard' },
    ];

    // Determine breadcrumb based on "from" parameter
    if (from === 'my-classes') {
        // From MyClassList
        breadcrumb.push(
            { label: 'Lớp học của tôi', to: ROUTES.MY_CLASSES },
            { label: className || 'Chi tiết' }
        );
    } else if (from && from.startsWith('course-')) {
        // From CourseClasses
        const courseId = from.replace('course-', '');
        breadcrumb.push(
            { label: 'Khóa học', to: ROUTES.COURSES },
            { label: courseName || 'Chi tiết khóa', to: ROUTES.COURSE_DETAIL(courseId) },
            { label: 'Lớp học', to: ROUTES.COURSE_CLASSES(courseId) },
            { label: className || 'Chi tiết' }
        );
    } else {
        // From ClassList (default)
        breadcrumb.push(
            { label: 'Lớp học', to: ROUTES.CLASSES },
            { label: className || 'Chi tiết' }
        );
    }

    return (
        <PageHeader
            breadcrumb={breadcrumb}
            badge="Chi tiết lớp học"
            description="Theo dõi thông tin, học sinh, buổi học, lịch học và điểm danh của lớp học."
        />
    );
};
