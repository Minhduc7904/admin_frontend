import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, KeyRound, Lock, Shield, Trash2, UserCheck } from 'lucide-react';
import { Button } from '../../../../shared/components/ui';

const formatDateTime = (value, fallback = 'Không xác định') => {
    if (!value) {
        return fallback;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return fallback;
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const RoleStatusBadge = ({ isActive, expiresAt }) => {
    const expired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;

    let text = 'Đang hiệu lực';
    let classes = 'bg-success-bg text-success-text';

    if (!isActive) {
        text = 'Đã vô hiệu';
        classes = 'bg-error-bg text-error';
    } else if (expired) {
        text = 'Đã hết hạn';
        classes = 'bg-warning-bg text-warning-text';
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-sm ${classes}`}>
            {text}
        </span>
    );
};


const InfoStat = ({ icon: Icon, label, value, accentClass = 'bg-primary text-foreground' }) => (
    <div className="flex items-center gap-2 border border-border rounded-sm p-3 bg-primary/5">
        <div className={`p-1.5 rounded-sm ${accentClass}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-[11px] uppercase tracking-wide text-foreground-light">{label}</p>
            <p className="text-sm font-semibold text-foreground">{value}</p>
        </div>
    </div>
);


export const RoleCard = ({ userRole, onRemove }) => {
    const permissions = userRole?.permissions || [];
    const roleInfo = userRole?.role;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border border-border rounded-sm p-4 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span className="p-2.5 rounded-sm bg-info/10 text-info">
                        <Shield className="w-4 h-4" />
                    </span>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            {roleInfo?.roleName || 'Vai trò không xác định'}
                        </h3>
                        <p className="text-xs text-foreground-light mt-0.5">
                            {roleInfo?.description || 'Vai trò chưa có mô tả chi tiết.'}
                        </p>
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <RoleStatusBadge isActive={userRole?.isActive} expiresAt={userRole?.expiresAt} />
                    <p className="text-xs text-foreground-light">Role ID: #{userRole?.roleId}</p>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-error hover:bg-error/50 bg-error/25 "
                        onClick={() => onRemove(userRole?.roleId)}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Gỡ role
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InfoStat
                    icon={Clock}
                    label="Được gán"
                    value={formatDateTime(userRole?.assignedAt)}
                    accentClass="bg-info/10 text-info"
                />
                <InfoStat
                    icon={Lock}
                    label="Hết hạn"
                    value={userRole?.expiresAt ? formatDateTime(userRole.expiresAt) : 'Không giới hạn'}
                    accentClass="bg-warning-bg text-warning-text"
                />
                <InfoStat
                    icon={UserCheck}
                    label="Gán bởi"
                    value={userRole?.assignedBy ? `Admin #${userRole.assignedBy}` : 'Hệ thống'}
                    accentClass="bg-primary text-foreground"
                />
            </div>

            <div className="border border-dashed border-border rounded-sm">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground"
                    aria-expanded={isOpen}
                >
                    <span className="inline-flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5 text-foreground-light" />
                        <span>Quyền của role ({permissions.length})</span>
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </button>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="px-3 pb-3">
                                {permissions.length ? (
                                    <ul className="space-y-1">
                                        {permissions.map((permission) => (
                                            <li
                                                key={permission.permissionId}
                                                className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0"
                                            >
                                                <span className="font-semibold text-foreground">
                                                    {permission.name}
                                                </span>
                                                <span className="text-foreground-light">{permission.code}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-foreground-light italic">
                                        Vai trò hiện chưa được gán quyền cụ thể.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};