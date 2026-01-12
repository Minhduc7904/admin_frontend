import { ConfirmModal } from '../../../shared/components/ui';

export const ClassStudentDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    classStudent,
    loading,
}) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa học sinh"
            message={
                <>
                    Bạn có chắc chắn muốn xóa học sinh{' '}
                    <strong>{classStudent?.student?.fullName || `#${classStudent?.studentId}`}</strong>
                    {' '}khỏi lớp này?
                    <br />
                    <span className="text-red-600 text-sm">
                        Hành động này không thể hoàn tác.
                    </span>
                </>
            }
            confirmText="Xóa"
            cancelText="Hủy"
            variant="danger"
            loading={loading}
        />
    );
};
