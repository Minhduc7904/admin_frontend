import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentCourseClass, selectCourseClassLoadingGet } from '../store/courseClassSlice';
import { Clock } from 'lucide-react';

/**
 * ClassSessions - Danh sách buổi học của một lớp
 */
export const ClassSessions = () => {
    const { id } = useParams();
    const classId = Number(id);

    const courseClass = useSelector(selectCurrentCourseClass);
    const loading = useSelector(selectCourseClassLoadingGet);

    const invalidId = isNaN(classId) || classId <= 0;

    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID lớp học không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white border border-border rounded-sm p-6 text-center text-foreground-light">
                Đang tải thông tin lớp học...
            </div>
        );
    }

    if (!courseClass) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                Không tìm thấy lớp học. Vui lòng kiểm tra lại.
            </div>
        );
    }

    return (
        <div className="bg-white border border-border rounded-sm p-8 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-foreground-light" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
                Buổi học của lớp "{courseClass.className}"
            </h3>
            <p className="text-foreground-light mb-4">
                Tính năng đang được phát triển. Bạn sẽ có thể quản lý các buổi học của lớp tại đây.
            </p>
        </div>
    );
};
