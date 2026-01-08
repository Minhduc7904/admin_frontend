import { ConfirmModal } from '../../../shared/components/ui';

export const SubjectDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    subject,
    loading,
}) => {
    if (!subject) return null;

    const hasChapters = subject.chaptersCount > 0;

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa môn học"
            message={
                <>
                    Bạn có chắc chắn muốn xóa môn học{' '}
                    <strong>{subject.name}</strong>
                    {subject.code && (
                        <>
                            {' '}(
                            <code className="text-sm bg-gray-100 px-1 rounded">
                                {subject.code}
                            </code>
                            )
                        </>
                    )}
                    ?
                    <br />

                    {hasChapters && (
                        <>
                            <span className="block mt-2 text-yellow-700 text-sm">
                                ⚠️ Môn học này hiện có{' '}
                                <strong>{subject.chaptersCount} chương</strong>.
                                Việc xóa sẽ ảnh hưởng đến dữ liệu liên quan.
                            </span>
                        </>
                    )}

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
