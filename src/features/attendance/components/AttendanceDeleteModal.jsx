import { ConfirmModal } from '../../../shared/components/ui';

export const AttendanceDeleteModal = ({ isOpen, attendance, loading, onClose, onConfirm }) => {
    if (!attendance) return null;

    const statusLabel = {
        PRESENT: 'Có mặt',
        ABSENT: 'Vắng',
        LATE: 'Muộn',
        MAKEUP: 'Học bù',
    }[attendance.status] || attendance.status;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xác nhận xóa điểm danh"
            message={
                <>
                    Bạn có chắc chắn muốn xóa điểm danh của học sinh{' '}
                    <strong>{attendance.studentName || 'N/A'}</strong>
                    {attendance.sessionName && (
                        <>
                            {' '}tại buổi học <strong>{attendance.sessionName}</strong>
                            {attendance.sessionDate && (
                                <> ngày <strong>{formatDate(attendance.sessionDate)}</strong></>
                            )}
                        </>
                    )}
                    {' '}(Trạng thái: <strong>{statusLabel}</strong>)?
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
