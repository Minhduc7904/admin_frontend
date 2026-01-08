import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../../../shared/components/ui';

export const FolderDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    folder,
    loading,
}) => {
    if (!folder) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận xóa thư mục">
            <div className="space-y-4">
                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-error-bg border border-error rounded-sm">
                    <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-error mb-1">
                            Cảnh báo: Hành động này không thể hoàn tác!
                        </p>
                        <p className="text-sm text-error-text">
                            Xóa thư mục sẽ xóa tất cả thư mục con và media bên trong.
                        </p>
                    </div>
                </div>

                {/* Folder Info */}
                <div className="p-4 bg-gray-50 rounded-sm">
                    <p className="text-sm text-foreground-light mb-1">Thư mục sẽ bị xóa:</p>
                    <p className="text-base font-semibold text-foreground">{folder.name}</p>
                    {folder.description && (
                        <p className="text-sm text-foreground-light mt-1">{folder.description}</p>
                    )}
                    {folder.mediaCount > 0 && (
                        <p className="text-sm text-error mt-2">
                            Có {folder.mediaCount} media trong thư mục này
                        </p>
                    )}
                </div>

                {/* Confirmation Question */}
                <p className="text-sm text-foreground">
                    Bạn có chắc chắn muốn xóa thư mục này không?
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? 'Đang xóa...' : 'Xóa thư mục'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
