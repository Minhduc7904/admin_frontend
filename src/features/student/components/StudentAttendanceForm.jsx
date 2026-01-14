import { Button, Dropdown, Textarea } from '../../../shared/components/ui';
import { ClassSearchSelect } from '../../courseClass/components';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../core/constants/options';
/* ===================== STATUS OPTIONS ===================== */

export const StudentAttendanceForm = ({
    formData,
    errors = {},
    onChange,
    onSubmit,
    onCancel,
    loading,
    mode = 'create',
    onClassChange,
    selectedClass,
}) => {
    const handleSessionSelect = (session) => {
        onChange({ target: { name: 'sessionId', value: session?.sessionId || null } });
    };

    const handleStatusChange = (value) => {
        onChange({ target: { name: 'status', value } });
    };

    const handleClassSelect = (courseClass) => {
        onClassChange(courseClass);
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* ===== BODY ===== */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== CLASS ===== */}
                <div>
                    <ClassSearchSelect
                        label="Lớp học"
                        required
                        placeholder="Chọn lớp học..."
                        onSelect={handleClassSelect}
                        value={selectedClass}
                        error={errors.classId}
                        disabled={mode === 'edit'}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Chọn lớp học trước khi chọn buổi học
                    </p>
                </div>

                {/* ===== SESSION ===== */}
                <div>
                    <ClassSessionSearchSelect
                        label="Buổi học"
                        required
                        placeholder="Chọn buổi học..."
                        onSelect={handleSessionSelect}
                        value={formData.sessionId}
                        error={errors.sessionId}
                        classId={selectedClass?.classId}
                        disabled={mode === 'edit' || !selectedClass}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        {!selectedClass
                            ? 'Vui lòng chọn lớp học trước'
                            : 'Chọn buổi học cần điểm danh'
                        }
                    </p>
                </div>

                {/* ===== STATUS ===== */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={formData.status}
                        onChange={handleStatusChange}
                        options={ATTENDANCE_STATUS_OPTIONS}
                        placeholder="Chọn trạng thái"
                        error={errors.status}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Trạng thái điểm danh của học sinh
                    </p>
                </div>

                {/* ===== NOTES ===== */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Ghi chú
                    </label>
                    <Textarea
                        name="notes"
                        value={formData.notes || ''}
                        onChange={onChange}
                        placeholder="Ghi chú về điểm danh (lý do vắng, muộn...)..."
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Ghi chú thêm về tình trạng (nếu có)
                    </p>
                </div>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    {mode === 'create' ? 'Điểm danh' : 'Cập nhật'}
                </Button>
            </div>
        </form>
    );
};
