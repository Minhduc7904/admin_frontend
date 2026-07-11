import { ConfirmModal } from "../../../shared/components/ui";

export const StudentPointLogDeleteModal = ({
    isOpen,
    log,
    loading,
    onClose,
    onConfirm,
}) => {
    const signedPoints = log?.signedPoints ?? (log?.type === "PENALTY" ? -log?.points : log?.points);

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Xóa log điểm?"
            message={
                <div className="space-y-2">
                    <p>
                        Bạn có chắc muốn xóa log điểm #{log?.pointLogId} không?
                    </p>
                    <p className="font-medium text-foreground">
                        Điểm của học sinh sẽ được backend tự động phục hồi theo log này ({signedPoints > 0 ? "+" : ""}{signedPoints || 0} điểm).
                    </p>
                </div>
            }
            confirmText="Xóa log"
            cancelText="Hủy"
            variant="danger"
            isLoading={loading}
        />
    );
};
