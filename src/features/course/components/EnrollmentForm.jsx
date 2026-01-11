import { Button, Dropdown } from '../../../shared/components/ui';
import { StudentSearchSelect } from '../../student/components/StudentSearchSelect';

/* ===================== STATUS OPTIONS ===================== */
const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Đang học' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Hủy' },
];

export const EnrollmentForm = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    loading,
    mode = 'create',
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* ===== BODY ===== */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== STUDENT (ONLY CREATE) ===== */}
                {mode === 'create' && (
                    <div>
                        <StudentSearchSelect
                            required
                            value={formData.studentId}
                            onSelect={(student) =>
                                onChange({
                                    target: {
                                        name: 'studentId',
                                        value: student?.studentId || '',
                                    },
                                })
                            }
                        />
                        <p className="text-xs text-foreground-light mt-1">
                            Tìm kiếm học viên theo tên hoặc email
                        </p>
                    </div>
                )}

                {/* ===== STATUS ===== */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Trạng thái ghi danh
                    </label>
                    <Dropdown
                        name="status"
                        value={formData.status}
                        onChange={(value) =>
                            onChange({
                                target: { name: 'status', value },
                            })
                        }
                        options={STATUS_OPTIONS}
                        placeholder="Chọn trạng thái..."
                    />
                    <p className="text-xs text-foreground-light mt-1">
                        Trạng thái học tập hiện tại của học viên
                    </p>
                </div>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="border-t border-border px-6 py-4 flex gap-3 justify-end bg-gray-50">
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
                    {mode === 'create'
                        ? 'Thêm học viên'
                        : 'Cập nhật trạng thái'}
                </Button>
            </div>
        </form>
    );
};
