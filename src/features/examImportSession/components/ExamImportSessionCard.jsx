import {
    Calendar,
    FileText,
    User,
    Clock,
    CheckCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

const STATUS_CONFIG = {
    PENDING: {
        label: 'Đang chờ',
        color: 'text-yellow-700 bg-yellow-100',
        icon: Clock,
    },
    PROCESSING: {
        label: 'Đang xử lý',
        color: 'text-blue-700 bg-blue-100',
        icon: FileText,
    },
    COMPLETED: {
        label: 'Hoàn tất',
        color: 'text-green-700 bg-green-100',
        icon: CheckCircle,
    },
}

export const ExamImportSessionCard = ({ session, onClick }) => {
    const statusConfig = STATUS_CONFIG[session.status] || STATUS_CONFIG.PENDING
    const StatusIcon = statusConfig.icon

    return (
        <div
            onClick={() => onClick?.(session)}
            className="
                group relative aspect-square
                bg-white border-2 border-gray-200 rounded-xl
                hover:border-primary hover:shadow-lg
                transition cursor-pointer
            "
        >
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                {/* ===== HEADER ===== */}
                <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="
                                font-semibold text-foreground
                                group-hover:text-primary-700
                                transition-colors
                            ">
                                Import Session
                            </h3>

                            <p className="text-sm text-foreground-light">
                                {session.sessionId}
                            </p>
                        </div>

                        <StatusIcon
                            size={20}
                            className="
                                text-foreground-light
                                group-hover:text-primary-600
                                transition-colors
                            "
                        />
                    </div>

                    {/* ===== META ===== */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-foreground-light">
                            <User size={14} />
                            <span>User #{session.createdBy}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-foreground-light">
                            <Calendar size={14} />
                            <span>
                                {formatDistanceToNow(
                                    new Date(session.createdAt),
                                    { addSuffix: true, locale: vi }
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-foreground-light truncate">
                        ID: {session.sessionId}
                    </span>

                    <span
                        className={`
                            px-2 py-1 text-xs rounded font-medium
                            ${statusConfig.color}
                        `}
                    >
                        {statusConfig.label}
                    </span>
                </div>
            </div>
        </div>
    )
}
