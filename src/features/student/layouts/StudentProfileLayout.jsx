import { useEffect, useMemo, useState } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getStudentByIdAsync,
    clearCurrentStudent,
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

    const invalidId = Number.isNaN(studentId);

    // Fetch student data
    useEffect(() => {
        if (!invalidId && studentId !== student?.studentId) {
            dispatch(getStudentByIdAsync(studentId));
        }
    }, [dispatch, studentId, invalidId, student?.studentId]);

    // Tabs config
    const tabs = useMemo(
        () => [
            {
                label: 'Thông tin',
                isActive:
                    location.pathname === ROUTES.STUDENT_DETAIL(studentId),
                onActivate: () =>
                    navigate(ROUTES.STUDENT_DETAIL(studentId)),
            },
            {
                label: 'Vai trò',
                isActive:
                    location.pathname === ROUTES.STUDENT_ROLES(studentId),
                onActivate: () =>
                    navigate(ROUTES.STUDENT_ROLES(studentId)),
            },
            {
                label: 'Media',
                isActive:
                    location.pathname === ROUTES.STUDENT_MEDIA(studentId),
                onActivate: () =>
                    navigate(ROUTES.STUDENT_MEDIA(studentId)),
            },
        ],
        [studentId, location.pathname, navigate]
    );

    // Guard invalid route
    if (invalidId) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID học sinh không hợp lệ.
            </div>
        );
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
