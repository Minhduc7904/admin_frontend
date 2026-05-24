import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { Spinner } from '../../../shared/components/loading';
import { TeacherProfileCreatePreview, TeacherProfileForm } from '../components';
import { useTeacherProfileForm } from '../hooks/useTeacherProfileForm';

export const CreateTeacherProfilePage = () => {
    const navigate = useNavigate();
    const form = useTeacherProfileForm();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Tạo hồ sơ giáo viên</h1>
                <p className="mt-1 text-sm text-foreground-light">
                    Tạo trang SEO profile giáo viên. Slug sẽ được backend tự sinh từ tên hiển thị.
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
                        onCancel={() => navigate(ROUTES.TEACHER_PROFILES)}
                    />
                </div>

                <TeacherProfileCreatePreview formData={form.formData} />
            </div>

            {form.loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-sm">
                    <div className="rounded-sm bg-white px-6 py-5 text-center shadow-lg">
                        <Spinner size="lg" className="mx-auto mb-3 text-blue-700" />
                        <p className="text-sm font-medium text-foreground">Đang tạo hồ sơ giáo viên...</p>
                    </div>
                </div>
            )}
        </div>
    );
};
