import { ConfirmModal } from '../../../shared/components/ui';

export const PermissionDeleteModal = ({ isOpen, onClose, onConfirm, permission, loading }) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa quyền"
            message={
                <>
                    Bạn có chắc chắn muốn xóa quyền <strong>{permission?.name}</strong> (
                    <code className="text-sm bg-gray-100 px-1 rounded">{permission?.code}</code>)?
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
