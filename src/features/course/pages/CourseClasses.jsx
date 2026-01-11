import { useParams, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentCourse, selectCourseLoadingGet } from '../store/courseSlice';
import { ClassList } from '../../courseClass/pages/ClassList';

/**
 * CourseClasses - Danh sách lớp học của một khóa học
 * Tái sử dụng ClassList component với courseId filter
 */
export const CourseClasses = () => {
    const { id } = useParams();
    const courseId = Number(id);

    const course = useSelector(selectCurrentCourse);
    const courseLoading = useSelector(selectCourseLoadingGet);
    const { isMyCourses = false } = useOutletContext() || {};

    const invalidId = isNaN(courseId) || courseId <= 0;

    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID khóa học không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
            </div>
        );
    }

    if (courseLoading) {
        return (
            <div className="bg-white border border-border rounded-sm p-6 text-center text-foreground-light">
                Đang tải thông tin khóa học...
            </div>
        );
    }

    if (!course) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                Không tìm thấy khóa học. Vui lòng kiểm tra lại.
            </div>
        );
    }

    return (
        <ClassList
            courseId={courseId}
            defaultCourseId={courseId}
            title={`Lớp học của khóa "${course.title}"`}
            subtitle={`Quản lý các lớp học thuộc khóa ${course.title}`}
            canSelectCourse={false}
            isMyClasses={isMyCourses}
        />
    );
};
