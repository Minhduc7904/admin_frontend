import { ConfirmModal } from '../../../../shared/components/ui';

export const SeoSlotDeleteModal = ({ deleteTarget, loading, onClose, onConfirm }) => {
  return (
    <ConfirmModal
      isOpen={!!deleteTarget}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa SEO slot"
      message={
        <>
          Bạn có chắc chắn muốn xóa slot <strong>{deleteTarget?.name}</strong>?
          <br />
          <span className="block mt-2 text-red-600">
            Các item trong slot có thể bị xóa theo cấu hình backend.
          </span>
        </>
      }
      confirmText="Xóa"
      cancelText="Hủy"
      variant="danger"
      isLoading={loading}
    />
  );
};
