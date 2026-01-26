// 1. Imports
import { useEffect, useMemo } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
    Navigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCourseClassByIdAsync,
    clearCurrentClass,
    selectCurrentCourseClass,
    selectCourseClassLoadingGet,
} from '../store/courseClassSlice';
import { CourseClassDetailBreadcrumb } from '../components/CourseClassDetailBreadcrumb';
import { CourseClassProfileOverview } from '../components/CourseClassProfileOverview';
import { ROUTES } from '../../../core/constants';
import { Tabs } from '../../../shared/components/ui';

// 2. Component
export const CourseClassDetailLayout = () => {
    const { id } = useParams();
    const classId = Number(id);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const courseClass = useSelector(selectCurrentCourseClass);
    const loading = useSelector(selectCourseClassLoadingGet);

    // Check where we're coming from
    const from = searchParams.get('from'); // 'my-classes', 'course-{courseId}', or null
    const isMyClasses = from === 'my-classes';

    const invalidId = Number.isNaN(classId) || classId <= 0;

    // 🔑 FETCH CLASS (ONCE per classId)
    useEffect(() => {
        if (!invalidId && classId !== courseClass?.classId) {
            dispatch(getCourseClassByIdAsync(classId));
        }
    }, [dispatch, classId, invalidId, courseClass?.classId]);

    // 3. Tabs config (route-driven)
    const tabs = useMemo(
        () => {
            const queryString = from ? `?from=${from}` : '';
            return [
                {
                    label: 'Thông tin',
                    isActive:
                        location.pathname === ROUTES.CLASS_DETAIL(classId),
                    onActivate: () =>
                        navigate(ROUTES.CLASS_DETAIL(classId) + queryString),
                },
                {
                    label: 'Học sinh',
                    isActive: location.pathname.startsWith(
                        ROUTES.CLASS_STUDENTS(classId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.CLASS_STUDENTS(classId) + queryString),
                },
                {
                    label: 'Buổi học',
                    isActive: location.pathname.startsWith(
                        ROUTES.CLASS_SESSIONS(classId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.CLASS_SESSIONS(classId) + queryString),
                },
                // {
                //     label: 'Lịch học',
                //     isActive: location.pathname.startsWith(
                //         ROUTES.CLASS_SCHEDULE(classId)
                //     ),
                //     onActivate: () =>
                //         navigate(ROUTES.CLASS_SCHEDULE(classId) + queryString),
                // },
                {
                    label: 'Điểm danh',
                    isActive: location.pathname.startsWith(
                        ROUTES.CLASS_ATTENDANCE(classId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.CLASS_ATTENDANCE(classId) + queryString),
                },
                {
                    label: 'Thông báo',
                    isActive: location.pathname.startsWith(
                        ROUTES.CLASS_NOTIFICATIONS(classId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.CLASS_NOTIFICATIONS(classId) + queryString),
                }
            ];
        },
        [classId, location.pathname, navigate, from]
    );

    // 4. Guard invalid route
    if (invalidId) {
        return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }

    // if (!loading && !courseClass) {
    //     return <Navigate to={ROUTES.NOT_FOUND} replace />;
    // }

    // 5. Render
    return (
        <div className="space-y-6">
            <CourseClassDetailBreadcrumb
                className={courseClass?.className}
                courseName={courseClass?.course?.title}
                from={from}
            />
            <CourseClassProfileOverview courseClass={courseClass} loading={loading} />
            <Tabs tabs={tabs} />

            {/* 🔑 Chỉ phần này thay đổi khi chuyển tab */}
            <Outlet context={{ isMyClasses, from }} />
        </div>
    );
};
