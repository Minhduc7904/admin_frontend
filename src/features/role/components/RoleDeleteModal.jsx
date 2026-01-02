import { ConfirmModal } from '../../../shared/components/ui';

export const RoleDeleteModal = ({ isOpen, onClose, onConfirm, role, loading }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa vai trò"
            message={
                <>
                    Bạn có chắc chắn muốn xóa vai trò <strong>{role?.roleName}</strong>?
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
