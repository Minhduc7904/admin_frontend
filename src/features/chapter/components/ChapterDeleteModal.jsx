import { ConfirmModal } from '../../../shared/components/ui';

export const ChapterDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    chapter,
    loading,
}) => {
    if (!chapter) return null;

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa chương"
            message={
                <>
                    Bạn có chắc chắn muốn xóa chương{' '}
                    <strong>{chapter.name}</strong>
                    {chapter.slug && (
                        <>
                            {' '}(
                            <code className="text-sm bg-gray-100 px-1 rounded">
                                {chapter.slug}
                            </code>
                            )
                        </>
                    )}
                    ?
                    <br />

                    <span className="block mt-2 text-yellow-700 text-sm">
                        ⚠️ Tất cả các chương con (nếu có) sẽ bị xóa theo.
                    </span>

                    <span className="block mt-2 text-red-600 text-sm">
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
