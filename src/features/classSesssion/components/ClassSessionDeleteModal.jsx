import { ConfirmModal } from '../../../shared/components/ui';

export const ClassSessionDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    session,
    loading,
}) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa buổi học"
            message={
                <>
                    Bạn có chắc chắn muốn xóa buổi học ngày{' '}
                    <strong>{session && formatDate(session.sessionDate)}</strong>
                    {' '}({session && formatTime(session.startTime)} - {session && formatTime(session.endTime)})?
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
