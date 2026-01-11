import { ConfirmModal } from '../../../shared/components/ui';

export const EnrollmentDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    enrollment,
    loading,
}) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa ghi danh"
            message={
                <>
                    Bạn có chắc chắn muốn xóa ghi danh của học viên{' '}
                    <strong>{enrollment?.student?.name || `#${enrollment?.studentId}`}</strong>
                    ?
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
