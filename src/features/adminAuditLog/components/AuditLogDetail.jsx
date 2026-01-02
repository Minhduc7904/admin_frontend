import { RotateCcw, X, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const AuditLogDetail = ({ log, onClose, onRollback, loadingRollback }) => {
    if (!log) return null;

    const getStatusBadge = (status) => {
        const statusConfig = {
            SUCCESS: { bg: 'bg-success-bg', text: 'text-success-text', label: 'Thành công' },
            FAIL: { bg: 'bg-error-bg', text: 'text-error-text', label: 'Thất bại' },
            ROLLBACK: { bg: 'bg-warning-bg', text: 'text-warning-text', label: 'Đã rollback' },
        };

        const config = statusConfig[status] || statusConfig.SUCCESS;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const canRollback = log.status === 'SUCCESS' && log.beforeData;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Chi tiết Audit Log #{log.logId}
                    </h2>
                    <p className="text-sm text-foreground-light mt-1">
                        {formatDate(log.createdAt)}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Admin User Info */}
                {log.admin && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <label className="block text-sm font-medium text-foreground-light mb-3">
                            Người thực hiện
                        </label>
                        <div className="flex items-center gap-4">
                            {log.admin.avatarUrl ? (
                                <img
                                    src={log.admin.avatarUrl}
                                    alt={log.admin.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-info text-white flex items-center justify-center font-semibold">
                                    {(log.admin.firstName?.[0] || log.admin.username?.[0] || '?').toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="font-semibold text-foreground">
                                    {log.admin.firstName && log.admin.lastName 
                                        ? `${log.admin.firstName} ${log.admin.lastName}` 
                                        : log.admin.username || 'N/A'}
                                </div>
                                <div className="text-sm text-foreground-light">
                                    @{log.admin.username || 'unknown'}
                                </div>
                                {log.admin.email && (
                                    <div className="text-xs text-foreground-light mt-1">
                                        {log.admin.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-2">
                        Trạng thái
                    </label>
                    {getStatusBadge(log.status)}
                </div>

                {/* Action Key */}
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-2">
                        Action Key
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                        <code className="text-sm text-foreground font-mono">{log.actionKey}</code>
                    </div>
                </div>

                {/* Resource Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground-light mb-2">
                            Resource Type
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-foreground">
                            {log.resourceType}
                        </div>
                    </div>
                    {log.resourceId && (
                        <div>
                            <label className="block text-sm font-medium text-foreground-light mb-2">
                                Resource ID
                            </label>
                            <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-foreground">
                                {log.resourceId}
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {log.errorMessage && (
                    <div>
                        <label className="block text-sm font-medium text-foreground-light mb-2 flex items-center gap-2">
                            <AlertCircle size={16} className="text-error" />
                            Error Message
                        </label>
                        <div className="px-4 py-3 bg-error-bg rounded-lg">
                            <p className="text-sm text-error-text">{log.errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Before Data */}
                {log.beforeData && (
                    <div>
                        <label className="block text-sm font-medium text-foreground-light mb-2">
                            Before Data
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg overflow-x-auto">
                            <pre className="text-xs text-foreground font-mono">
                                {JSON.stringify(log.beforeData, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* After Data */}
                {log.afterData && (
                    <div>
                        <label className="block text-sm font-medium text-foreground-light mb-2">
                            After Data
                        </label>
                        <div className="px-4 py-3 bg-gray-50 rounded-lg overflow-x-auto">
                            <pre className="text-xs text-foreground font-mono">
                                {JSON.stringify(log.afterData, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Rollback Info */}
                {!canRollback && log.status === 'ROLLBACK' && (
                    <div className="p-4 bg-warning-bg rounded-lg">
                        <p className="text-sm text-warning-text">
                            Log này đã được rollback
                        </p>
                    </div>
                )}

                {!canRollback && log.status === 'FAIL' && (
                    <div className="p-4 bg-error-bg rounded-lg">
                        <p className="text-sm text-error-text">
                            Log thất bại không thể rollback
                        </p>
                    </div>
                )}

                {!canRollback && log.status === 'SUCCESS' && !log.beforeData && (
                    <div className="p-4 bg-info-bg rounded-lg">
                        <p className="text-sm text-info-text">
                            Log này không có dữ liệu trước đó để rollback
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {canRollback && (
                <div className="p-6 border-t border-border">
                    <Button
                        onClick={() => onRollback(log.logId)}
                        disabled={loadingRollback}
                        variant="warning"
                        className="w-full"
                    >
                        <RotateCcw size={16} />
                        {loadingRollback ? 'Đang rollback...' : 'Rollback dữ liệu'}
                    </Button>
                </div>
            )}
        </div>
    );
};
