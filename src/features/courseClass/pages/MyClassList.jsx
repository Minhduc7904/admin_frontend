import { useSelector } from 'react-redux';
import { ClassList } from './ClassList';
import { selectProfile } from '../../profile/store/profileSlice';

/**
 * MyClassList - Danh sách lớp học thuộc khóa học của giáo viên hiện tại
 * Sử dụng ClassList component với filter theo teacherId (course.teacherId)
 */
export const MyClassList = () => {
    // Lấy adminId từ user hiện tại
    const profile = useSelector(selectProfile);
    const adminId = profile?.adminId;

    return (
        <ClassList
            teacherId={adminId}
            isMyClasses={true}
            title="Lớp học của tôi"
            subtitle="Quản lý các lớp học thuộc khóa học mà bạn phụ trách."
        />
    );
};
