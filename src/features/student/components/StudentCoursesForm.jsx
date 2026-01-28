import { Button, Dropdown } from '../../../shared/components/ui';
import { CourseSearchSelect } from '../../course/components';
import { COURSE_ENROLLMENT_STATUS_OPTIONS } from '../../courseEnrollment/constants/course-enrollment.constant';
/* ===================== STATUS OPTIONS ===================== */


export const StudentCoursesForm = ({
    formData,
    errors,
    onChange,
    onSelect,
    onSubmit,
    onCancel,
    loading,
    mode = 'create',
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== COURSE (ONLY CREATE) ===== */}
                {mode === 'create' && (
                    <div>
                        <CourseSearchSelect
                            label="Khóa học"
                            placeholder="Tìm kiếm khóa học..."
                            required={true}
                            value={formData.courseId}
                            onSelect={onSelect}
                            error={errors.courseId}
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Tìm kiếm khóa học theo tên
                        </p>
                    </div>
                )}

                {/* ===== STATUS ===== */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Trạng thái học tập
                    </label>
                    <Dropdown
                        name="status"
                        value={formData.status}
                        onChange={(value) =>
                            onChange({
                                target: { name: 'status', value },
                            })
                        }
                        options={COURSE_ENROLLMENT_STATUS_OPTIONS}
                        placeholder="Chọn trạng thái..."
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Trạng thái học tập hiện tại của học sinh
                    </p>
                </div>
            </div>
            <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                    {mode === 'create' ? 'Thêm khóa học' : 'Cập nhật trạng thái'}
                </Button>
            </div>
        </form>
    );
};
