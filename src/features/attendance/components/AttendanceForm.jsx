import { Button, Input, Dropdown, Textarea } from '../../../shared/components/ui';
import { ClassSessionSearchSelect } from '../../classSesssion/components/ClassSessionSearchSelect';
import { StudentSearchSelect } from '../../student/components/StudentSearchSelect';
import { ATTENDANCE_STATUS_OPTIONS } from '../../../core/constants/options';


export const AttendanceForm = ({
    formData,
    errors = {},
    onChange,
    onSubmit,
    onCancel,
    loading,
    mode = 'create',
    classId,
}) => {
    const handleSessionSelect = (session) => {
        onChange({ target: { name: 'sessionId', value: session?.sessionId || null } });
    };

    const handleStudentSelect = (student) => {
        onChange({ target: { name: 'studentId', value: student?.studentId || null } });
    };

    const handleStatusChange = (value) => {
        onChange({ target: { name: 'status', value } });
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* ===== BODY ===== */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== SESSION ===== */}
                <div>
                    <ClassSessionSearchSelect
                        label="Buổi học"
                        required
                        placeholder="Chọn buổi học..."
                        onSelect={handleSessionSelect}
                        value={formData.sessionId}
                        error={errors.sessionId}
                        classId={classId}
                        disabled={mode === 'edit'}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Chọn buổi học cần điểm danh
                    </p>
                </div>

                {/* ===== STUDENT ===== */}
                <div>
                    <StudentSearchSelect
                        label="Học sinh"
                        required
                        placeholder="Chọn học sinh..."
                        onSelect={handleStudentSelect}
                        value={formData.studentId}
                        error={errors.studentId}
                        disabled={mode === 'edit'}
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Chọn học sinh cần điểm danh
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
