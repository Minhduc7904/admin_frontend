import { useSelector } from 'react-redux';
import { CourseList } from './CourseList';
import { selectProfile } from '../../profile/store/profileSlice';
/**
 * MyCourseList - Danh sách khóa học của giáo viên hiện tại
 * Sử dụng CourseList component với filter theo teacherId
 */
export const MyCourseList = () => {
    // Lấy adminId từ user hiện tại
    const profile = useSelector(selectProfile);
    const adminId = profile?.adminId;

    return (
        <CourseList
            teacherId={adminId}
            isMyCourses={true}
            title="Khóa học của tôi"
            subtitle="Quản lý các khóa học mà bạn đang giảng dạy."
        />
    );
};
