import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../core/store/hooks';
import { selectCurrentStudent, selectStudentLoadingGet } from '../store/studentSlice';
import { UserRolePage } from '../../role/pages';

export const StudentRole = () => {
    const { id } = useParams();
    const studentId = Number(id);

    const student = useAppSelector(selectCurrentStudent);
    const studentLoading = useAppSelector(selectStudentLoadingGet);

    const invalidId = isNaN(studentId) || studentId <= 0;

    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID học sinh không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
            </div>
        );
    }

    return (
        <UserRolePage
            userId={student?.userId}
            userType="student"
            loading={studentLoading}
        />
    );
};
