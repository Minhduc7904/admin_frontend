import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { InlineLoading } from '../../../shared/components';
import { Button } from '../../../shared/components/ui';
import { TeacherProfileDetailContent } from '../components';
import {
    clearCurrentTeacherProfile,
    getTeacherProfileByIdAsync,
    selectCurrentTeacherProfile,
    selectTeacherProfileLoadingGet,
} from '../store/teacherProfileSlice';

export const TeacherProfileDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const teacherProfile = useSelector(selectCurrentTeacherProfile);
    const loading = useSelector(selectTeacherProfileLoadingGet);

    useEffect(() => {
        dispatch(getTeacherProfileByIdAsync(id));
        return () => dispatch(clearCurrentTeacherProfile());
    }, [dispatch, id]);

    if (loading && !teacherProfile) {
        return <InlineLoading message="Đang tải hồ sơ giáo viên..." />;
    }

    if (!teacherProfile) {
        return <div className="text-sm text-foreground-light">Không tìm thấy hồ sơ giáo viên.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(ROUTES.TEACHER_PROFILES)}>
                    <ArrowLeft size={16} />
                    Quay lại
                </Button>
                <Button
                    type="button"
                    onClick={() => navigate(ROUTES.TEACHER_PROFILE_EDIT(teacherProfile.teacherProfileId))}
                >
                    <Edit2 size={16} />
                    Sửa
                </Button>
            </div>

            <TeacherProfileDetailContent teacherProfile={teacherProfile} />
        </div>
    );
};
