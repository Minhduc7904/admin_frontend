import { ConfirmModal } from '../../../shared/components/ui';

export const TagDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    tag,
    loading,
}) => {
    if (!tag) return null;

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa tag"
            message={
                <>
                    Bạn có chắc chắn muốn xóa tag <strong>{tag.name}</strong>
                    {tag.slug && (
                        <>
                            {' '}(
                            <code className="rounded bg-gray-100 px-1 text-sm">
                                {tag.slug}
                            </code>
                            )
                        </>
                    )}
                    ?
                    <span className="mt-2 block text-sm text-red-600">
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
