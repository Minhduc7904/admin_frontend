import { Button } from '../../../shared/components/ui';
import { StudentSearchSelect } from '../../student/components/StudentSearchSelect';

export const ClassStudentForm = ({
    formData,
    onChange,
    onSubmit,
    onCancel,
    loading,
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            {/* ===== BODY ===== */}
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                {/* ===== STUDENT ===== */}
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
                        Tìm kiếm học sinh theo tên hoặc email để thêm vào lớp
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
                    Thêm học sinh
                </Button>
            </div>
        </form>
    );
};
