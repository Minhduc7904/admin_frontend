import { Button } from '../../../shared/components/ui';
import { ClassSearchSelect } from '../../courseClass/components';

export const StudentClassesForm = ({
    formData,
    errors,
    onSelect,
    onSubmit,
    onCancel,
    loading,
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col h-full">
            <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                <ClassSearchSelect
                    label="Lớp học"
                    placeholder="Tìm kiếm lớp học..."
                    required={true}
                    value={formData.classId}
                    onSelect={onSelect}
                    error={errors.classId}
                />
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
                    Thêm vào lớp
                </Button>
            </div>
        </form>
    );
};
