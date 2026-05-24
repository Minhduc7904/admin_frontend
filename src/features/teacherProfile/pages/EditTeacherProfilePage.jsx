import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { InlineLoading } from '../../../shared/components';
import { Spinner } from '../../../shared/components/loading';
import { TeacherProfileCreatePreview, TeacherProfileForm } from '../components';
import { useTeacherProfileForm } from '../hooks/useTeacherProfileForm';
import {
    clearCurrentTeacherProfile,
    getTeacherProfileByIdAsync,
    selectCurrentTeacherProfile,
    selectTeacherProfileLoadingGet,
} from '../store/teacherProfileSlice';

export const EditTeacherProfilePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const teacherProfile = useSelector(selectCurrentTeacherProfile);
    const loadingGet = useSelector(selectTeacherProfileLoadingGet);

    useEffect(() => {
        dispatch(getTeacherProfileByIdAsync(id));
        return () => dispatch(clearCurrentTeacherProfile());
    }, [dispatch, id]);

    if (loadingGet && !teacherProfile) {
        return <InlineLoading message="Đang tải hồ sơ giáo viên..." />;
    }

    if (!teacherProfile) {
        return <div className="text-sm text-foreground-light">Không tìm thấy hồ sơ giáo viên.</div>;
    }

    return <EditTeacherProfileContent teacherProfile={teacherProfile} />;
};

const EditTeacherProfileContent = ({ teacherProfile }) => {
    const navigate = useNavigate();
    const form = useTeacherProfileForm({ mode: 'edit', teacherProfile });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Sửa hồ sơ giáo viên</h1>
                <p className="mt-1 text-sm text-foreground-light">
                    Cập nhật nội dung profile, thông tin liên hệ và cấu hình SEO.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(520px,0.9fr)_minmax(420px,0.7fr)]">
                <div className="rounded-sm border border-border bg-white p-6">
                    <TeacherProfileForm
                        formData={form.formData}
                        errors={form.errors}
                        loading={form.loading}
                        onChange={form.handleChange}
                        onSwitchChange={form.handleSwitchChange}
                        onModeSwitchChange={form.handleModeSwitchChange}
                        onSubmit={form.submit}
                        onCancel={() => navigate(ROUTES.TEACHER_PROFILE_DETAIL(teacherProfile.teacherProfileId))}
                        submitLabel="Cập nhật hồ sơ"
                    />
                </div>

                <TeacherProfileCreatePreview formData={form.formData} />
            </div>

            {form.loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-sm">
                    <div className="rounded-sm bg-white px-6 py-5 text-center shadow-lg">
                        <Spinner size="lg" className="mx-auto mb-3 text-blue-700" />
                        <p className="text-sm font-medium text-foreground">Đang cập nhật hồ sơ giáo viên...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
