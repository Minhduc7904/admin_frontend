import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger', // danger, warning, info, success
  isLoading = false,
}) => {
  const variantConfig = {
    danger: {
      icon: XCircle,
      iconClass: 'text-error',
      bgClass: 'bg-error-bg',
      buttonVariant: 'danger',
    },
    warning: {
      icon: AlertTriangle,
      iconClass: 'text-warning',
      bgClass: 'bg-warning-bg',
      buttonVariant: 'primary',
    },
    info: {
      icon: Info,
      iconClass: 'text-info',
      bgClass: 'bg-info-bg',
      buttonVariant: 'primary',
    },
    success: {
      icon: CheckCircle,
      iconClass: 'text-success',
      bgClass: 'bg-success-bg',
      buttonVariant: 'primary',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${config.bgClass} mb-4`}>
          <Icon size={24} className={config.iconClass} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-foreground-light mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
