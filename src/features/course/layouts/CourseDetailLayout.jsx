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
    getCourseByIdAsync,
    clearCurrentCourse,
    selectCurrentCourse,
    selectCourseLoadingGet,
} from '../store/courseSlice';
import { CourseDetailBreadcrumb } from '../components/CourseDetailBreadcrumb';
import { CourseProfileOverview } from '../components/CourseProfileOverview';
import { ROUTES } from '../../../core/constants';
import { Tabs } from '../../../shared/components/ui';

// 2. Component
export const CourseDetailLayout = () => {
    const { id } = useParams();
    const courseId = Number(id);
    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const course = useSelector(selectCurrentCourse);
    const loading = useSelector(selectCourseLoadingGet);

    // Check if coming from "My Courses"
    const isMyCourses = searchParams.get('from') === 'my-courses';

    const invalidId = Number.isNaN(courseId) || courseId <= 0;

    // 🔑 FETCH COURSE (ONCE per courseId)
    useEffect(() => {
        if (!invalidId && courseId !== course?.courseId) {
            dispatch(getCourseByIdAsync(courseId));
        }
    }, [dispatch, courseId, invalidId, course?.courseId]);

    // 3. Tabs config (route-driven)
    const tabs = useMemo(
        () => {
            const queryString = isMyCourses ? '?from=my-courses' : '';
            return [
                {
                    label: 'Thông tin',
                    isActive:
                        location.pathname === ROUTES.COURSE_DETAIL(courseId),
                    onActivate: () =>
                        navigate(ROUTES.COURSE_DETAIL(courseId) + queryString),
                },
                {
                    label: 'Lớp học',
                    isActive: location.pathname.startsWith(
                        ROUTES.COURSE_CLASSES(courseId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.COURSE_CLASSES(courseId) + queryString),
                },
                {
                    label: 'Học sinh',
                    isActive: location.pathname.startsWith(
                        ROUTES.COURSE_STUDENTS(courseId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.COURSE_STUDENTS(courseId) + queryString),
                },
                {
                    label: 'Điểm danh',
                    isActive: location.pathname.startsWith(
                        ROUTES.COURSE_ATTENDANCE(courseId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.COURSE_ATTENDANCE(courseId) + queryString),
                },
                {
                    label: 'Bài học',
                    isActive: location.pathname.startsWith(
                        ROUTES.COURSE_LESSONS(courseId)
                    ),
                    onActivate: () =>
                        navigate(ROUTES.COURSE_LESSONS(courseId) + queryString),
                }
            ];
        },
        [courseId, location.pathname, navigate, isMyCourses]
    );

    // 4. Guard invalid route
    if (invalidId) {
        return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }

    // if (!loading && !course) {
    //     return <Navigate to={ROUTES.NOT_FOUND} replace />;
    // }

    // 5. Render
    return (
        <div className="space-y-6">
            <CourseDetailBreadcrumb
                courseTitle={course?.title}
                isMyCourses={isMyCourses}
            />
            <CourseProfileOverview course={course} loading={loading} />
            <Tabs tabs={tabs} />

            {/* 🔑 Chỉ phần này thay đổi khi chuyển tab */}
            <Outlet context={{ isMyCourses }} />
        </div>
    );
};
