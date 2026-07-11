import { useEffect, useMemo } from 'react';
import {
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getStudentByIdAsync,
    selectCurrentStudent,
    selectStudentLoadingGet,
} from '../store/studentSlice';
import { StudentDetailBreadcrumb } from '../components/StudentDetailBreadcrumb';
import { StudentProfileOverview } from '../components/StudentProfileOverview';
import { ROUTES } from '../../../core/constants';
import { Tabs } from '../../../shared/components/ui';

export const StudentProfileLayout = () => {
    const { id } = useParams();
    const studentId = Number(id);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const student = useAppSelector(selectCurrentStudent);
    const loading = useAppSelector(selectStudentLoadingGet);

    const invalidId = Number.isNaN(studentId) || studentId <= 0;

    useEffect(() => {
        if (!invalidId && studentId !== student?.studentId) {
            dispatch(getStudentByIdAsync(studentId));
        }
    }, [dispatch, studentId, invalidId, student?.studentId]);

    const tabs = useMemo(
        () => [
            {
                label: 'Thông tin',
                isActive: location.pathname === ROUTES.STUDENT_DETAIL(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_DETAIL(studentId)),
            },
            {
                label: 'Lớp học',
                isActive: location.pathname === ROUTES.STUDENT_CLASSES(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_CLASSES(studentId)),
            },
            {
                label: 'Khóa học',
                isActive: location.pathname === ROUTES.STUDENT_COURSES(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_COURSES(studentId)),
            },
            {
                label: 'Điểm danh',
                isActive: location.pathname === ROUTES.STUDENT_ATTENDANCE(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_ATTENDANCE(studentId)),
            },
            {
                label: 'Lịch sử điểm',
                isActive: location.pathname === ROUTES.STUDENT_POINT_LOGS(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_POINT_LOGS(studentId)),
            },
            {
                label: 'Vai trò',
                isActive: location.pathname === ROUTES.STUDENT_ROLES(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_ROLES(studentId)),
            },
            {
                label: 'Media',
                isActive: location.pathname === ROUTES.STUDENT_MEDIA(studentId),
                onActivate: () => navigate(ROUTES.STUDENT_MEDIA(studentId)),
            },
        ],
        [studentId, location.pathname, navigate]
    );

    if (invalidId) {
        return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }

    return (
        <div className="space-y-6">
            <StudentDetailBreadcrumb studentName={student?.fullName} />
            <StudentProfileOverview student={student} loading={loading} />
            <Tabs tabs={tabs} />
            <Outlet />
        </div>
    );
};
