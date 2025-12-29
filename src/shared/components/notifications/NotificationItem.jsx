import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { removeNotification } from '../../../features/notification/store/notificationSlice';

export const NotificationItem = ({ notification, index }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const duration = notification.duration || 4000;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50 + index * 100);

    if (notification.autoHide) {
      const removeTimer = setTimeout(() => {
        handleRemove();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [notification.autoHide, duration, index]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={16} className="text-success" />;
      case 'error':
        return <XCircle size={16} className="text-error" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-warning" />;
      case 'info':
      default:
        return <Info size={16} className="text-info" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-success-bg border-success-bg';
      case 'error':
        return 'bg-error-bg border-error-bg';
      case 'warning':
        return 'bg-warning-bg border-warning-bg';
      case 'info':
      default:
        return 'bg-info-bg border-info-bg';
    }
  };

  const getTextColorClass = () => {
    switch (notification.type) {
      case 'success':
        return 'text-success-text';
      case 'error':
        return 'text-error-text';
      case 'warning':
        return 'text-warning-text';
      case 'info':
      default:
        return 'text-info-text';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out mb-2 ${
        isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{
        transitionDelay: isRemoving ? '0ms' : `${index * 50}ms`,
      }}
    >
      <div
        className={`w-80 bg-primary shadow-lg rounded-sm border pointer-events-auto ${getColorClasses()}`}
      >
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              {notification.title && (
                <p className={`text-sm font-semibold ${getTextColorClass()}`}>
                  {notification.title}
                </p>
              )}
              <p className={`text-sm ${notification.title ? 'mt-1' : ''} ${getTextColorClass()}`}>
                {notification.message.length > 100
                  ? notification.message.slice(0, 100) + '...'
                  : notification.message}
              </p>
            </div>

            {/* Close button with progress circle */}
            <div className="flex-shrink-0 relative">
              <button
                className="relative inline-flex items-center justify-center h-6 w-6 text-foreground-lighter hover:text-foreground transition-colors"
                onClick={handleRemove}
              >
                <X size={14} className="relative z-10" />

                {/* Progress circle */}
                {notification.autoHide && (
                  <svg className="absolute inset-0 h-6 w-6 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="text-foreground-light"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      r="16"
                      cx="18"
                      cy="18"
                      strokeDasharray={100}
                      strokeDashoffset={0}
                      style={{
                        animation: `countdown ${duration}ms linear forwards`,
                      }}
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes countdown {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
        }
      `}</style>
    </div>
  );
};
