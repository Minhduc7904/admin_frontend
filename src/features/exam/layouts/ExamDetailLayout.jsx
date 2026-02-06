// 1. Imports
import { useEffect, useMemo } from 'react';
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
    Navigate,
} from 'react-router-dom';
import { ExamDetailBreadcrumb } from '../components/ExamDetailBreadcrumb';
import { ROUTES } from '../../../core/constants';
import { Tabs } from '../../../shared/components/ui';

// 2. Component
export const ExamDetailLayout = () => {
    const { id } = useParams();
    const examId = Number(id);
    const navigate = useNavigate();
    const location = useLocation();

    // TODO: Add Redux integration to fetch exam data
    // const dispatch = useAppDispatch();
    // const exam = useAppSelector(selectCurrentExam);
    // const loading = useAppSelector(selectExamLoadingGet);

    const invalidId = Number.isNaN(examId) || examId <= 0;

    // 🔑 FETCH EXAM (ONCE per examId)
    // useEffect(() => {
    //     if (!invalidId && examId !== exam?.examId) {
    //         dispatch(getExamByIdAsync(examId));
    //     }
    // }, [dispatch, examId, invalidId, exam?.examId]);

    // 3. Tabs config (route-driven)
    const tabs = useMemo(
        () => [
            {
                label: 'Thông tin',
                isActive:
                    location.pathname === ROUTES.EXAM_DETAIL(examId),
                onActivate: () =>
                    navigate(ROUTES.EXAM_DETAIL(examId)),
            },
            {
                label: 'Danh sách câu hỏi',
                isActive: location.pathname.startsWith(
                    ROUTES.EXAM_QUESTIONS(examId)
                ),
                onActivate: () =>
                    navigate(ROUTES.EXAM_QUESTIONS(examId)),
            },
            {
                label: 'Xem trước',
                isActive: location.pathname.startsWith(
                    ROUTES.EXAM_PREVIEW(examId)
                ),
                onActivate: () =>
                    navigate(ROUTES.EXAM_PREVIEW(examId)),
            },
        ],
        [examId, location.pathname, navigate]
    );

    // 4. Guard invalid route
    if (invalidId) {
        return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }

    // 5. Render
    return (
        <div className="space-y-6 flex-1">
            <ExamDetailBreadcrumb examName="Đề thi mẫu" />
            <Tabs tabs={tabs} />

            {/* 🔑 Chỉ phần này thay đổi khi chuyển tab */}
            <Outlet />
        </div>
    );
};
