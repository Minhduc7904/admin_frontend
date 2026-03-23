import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, Trash2, User, Calendar, Eye, FileImage, BellRing, MessageCircle } from 'lucide-react';
import { Table } from '../../../shared/components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../core/constants';
import { AttendanceStatusDropdown } from './AttendanceStatusDropdown';
/* ===================== STATUS BADGE MAP ===================== */
const STATUS_BADGE = {
    PRESENT: 'bg-green-100 text-green-700',
    ABSENT: 'bg-red-100 text-red-700',
    LATE: 'bg-yellow-100 text-yellow-700',
    MAKEUP: 'bg-blue-100 text-blue-700',
};

const STATUS_LABEL = {
    PRESENT: 'Có mặt',
    ABSENT: 'Vắng',
    LATE: 'Muộn',
    MAKEUP: 'Học bù',
};

/* ===================== TUITION STATUS BADGE ===================== */
const TUITION_BADGE = {
    PAID: 'bg-green-100 text-green-700',
    UNPAID: 'bg-red-100 text-red-700',
};
const TUITION_LABEL = {
    PAID: 'Đã đóng',
    UNPAID: 'Chưa đóng',
};

/* ===================== HOMEWORK SUBMIT STATUS ===================== */
const HOMEWORK_BADGE = {
    submitted: 'bg-green-100 text-green-700',
    notAssigned: 'bg-gray-100 text-gray-600',
    notSubmitted: 'bg-red-100 text-red-700',
};

export const AttendanceTable = ({
    attendances,
    onEdit,
    onDelete,
    onView,
    onExport,
    onToggleParentNotified,
    onSendToParent,
    onStatusChange,
    loading,
    tuitionMonth,
    tuitionYear,
    showHomework = false,
    homeworkTitle,
    statusLoading = false,
    statusUpdatingAttendanceId = null,
    sendToParentLoading = false,
    sendToParentAttendanceId = null,
    onDeleteOtherAttendanceInWeek,
    deleteOtherInWeekLoading = false,
    deleteOtherInWeekAttendanceId = null,
}) => {
    const showTuitionCol = !!tuitionMonth && !!tuitionYear;
    const showHomeworkCol = showHomework;
    const [hoveredOtherAttendance, setHoveredOtherAttendance] = useState(null);
    const hoverCloseTimerRef = useRef(null);

    const clearHoverCloseTimer = () => {
        if (hoverCloseTimerRef.current) {
            clearTimeout(hoverCloseTimerRef.current);
            hoverCloseTimerRef.current = null;
        }
    };

    const scheduleHideHoveredAttendance = () => {
        clearHoverCloseTimer();
        hoverCloseTimerRef.current = setTimeout(() => {
            setHoveredOtherAttendance(null);
        }, 120);
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTimeOnly = (date) => {
        if (!date) return '';

        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const renderParentZaloBadge = (hasParentZaloId) => {
        const linked = !!hasParentZaloId;

        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    linked ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}
                title={linked ? 'Đã liên kết Zalo phụ huynh' : 'Chưa liên kết Zalo phụ huynh'}
            >
                <MessageCircle size={11} />
                {linked ? 'Đã liên kết Zalo PH' : 'Chưa liên kết Zalo PH'}
            </span>
        );
    };

    const renderOtherAttendancesInWeek = (attendance) => {
        const otherAttendances = attendance.otherAttendancesInWeek || [];

        if (!otherAttendances.length) {
            return <span className="text-xs text-foreground-light">-</span>;
        }

        return (
            <div className="flex flex-col gap-1 max-w-[280px]">
                {otherAttendances.map((other) => {
                    const statusClass = STATUS_BADGE[other.status] || 'bg-gray-100 text-gray-700';
                    const statusLabel = other.statusLabel || STATUS_LABEL[other.status] || other.status;
                    const sessionLabel = other.classSession?.name || `Buổi #${other.sessionId}`;
                    const className = other.classSession?.courseClass?.className;
                    const sessionStart = formatTimeOnly(other.classSession?.startTime);
                    const sessionEnd = formatTimeOnly(other.classSession?.endTime);
                    const isDeletingOtherInWeek =
                        deleteOtherInWeekLoading && deleteOtherInWeekAttendanceId === other.attendanceId;

                    return (
                        <div
                            key={other.attendanceId}
                            className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1"
                            title={`${sessionLabel} - ${statusLabel}`}
                            onMouseEnter={(e) => {
                                clearHoverCloseTimer();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredOtherAttendance({
                                    id: other.attendanceId,
                                    attendance: other,
                                    sessionLabel,
                                    className,
                                    sessionStart,
                                    sessionEnd,
                                    statusLabel,
                                    statusClass,
                                    rect,
                                });
                            }}
                            onMouseLeave={scheduleHideHoveredAttendance}
                        >
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1 min-w-0">
                                    <span className="text-xs text-foreground break-words whitespace-nowrap">{sessionLabel}</span>
                                    {className && (
                                        <span className="text-[11px] text-foreground-light truncate">({className})</span>
                                    )}
                                </div>
                                {(sessionStart || sessionEnd) && (
                                    <span className="text-[11px] text-foreground-light whitespace-nowrap">
                                        {sessionStart || '--:--'} - {sessionEnd || '--:--'}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${statusClass}`}>
                                    {statusLabel}
                                </span>
                                {onDeleteOtherAttendanceInWeek && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteOtherAttendanceInWeek(other);
                                        }}
                                        disabled={isDeletingOtherInWeek}
                                        className="p-1 rounded hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        title={isDeletingOtherInWeek ? 'Đang xóa...' : 'Xóa điểm danh này'}
                                    >
                                        <Trash2 size={12} className="text-red-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
            render: (attendance) => (
                <span className="text-sm text-foreground-light">
                    #{attendance.attendanceId}
                </span>
            ),
        },
        {
            key: 'student',
            label: 'Học sinh',
            render: (attendance) => (
                <div className="flex items-center gap-2">
                    <User size={14} className="text-foreground-light" />
                    <div>
                        <Link to={ROUTES.STUDENT_DETAIL(attendance.studentId)} className="hover:underline cursor-pointer">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground">
                                    {attendance.student.fullName || 'N/A'}
                                </span>
                                {renderParentZaloBadge(attendance.student?.hasParentZaloId)}
                            </div>
                        </Link>
                        {attendance.student.studentId && (
                            <>
                                <p className="text-xs text-foreground-light">
                                    #{attendance.student.studentId} / {attendance.student.school || ''} / Lớp {attendance.student.grade || ''}
                                </p>
                                <p className="text-xs text-foreground-light">
                                    {attendance.student.studentPhone} / {attendance.student.parentPhone || ''}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: 'session',
            label: 'Buổi học',
            render: (attendance) => (
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-foreground-light" />
                    <span className="text-sm text-foreground">
                        {attendance.classSession.name || `Buổi #${attendance.sessionId}`}
                    </span>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (attendance) => {
                const isStatusUpdating =
                    statusLoading && statusUpdatingAttendanceId === attendance.attendanceId;

                return (
                    <div className="w-32">
                        <AttendanceStatusDropdown
                            value={attendance.status}
                            disabled={isStatusUpdating}
                            loading={isStatusUpdating}
                            onChange={(newStatus) => {
                                if (onStatusChange) {
                                    onStatusChange(attendance, newStatus);
                                }
                            }}
                        />
                    </div>
                );
            },
        },
        {
            key: 'otherAttendancesInWeek',
            label: 'Điểm danh khác trong tuần',
            render: (attendance) => renderOtherAttendancesInWeek(attendance),
        },
        {
            key: 'markedAt',
            label: 'Thời gian điểm danh',
            render: (attendance) => (
                <span className="text-sm text-foreground-light whitespace-nowrap">
                    {formatDateTime(attendance.markedAt)}
                </span>
            ),
        },
        {
            key: 'notes',
            label: 'Ghi chú',
            render: (attendance) => (
                <span
                    className="text-sm text-foreground-light max-w-[200px] truncate block"
                    title={attendance.notes}
                >
                    {attendance.notes || '-'}
                </span>
            ),
        },
        {
            key: 'parentNotified',
            label: (
                <span className="flex items-center justify-center w-full">
                    <BellRing size={13} />
                </span>
            ),
            align: 'center',
            render: (attendance) => (
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={!!attendance.parentNotified}
                        onChange={() => { }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleParentNotified && onToggleParentNotified(attendance);
                        }}
                        className="w-4 h-4 accent-green-600 cursor-pointer"
                        title={attendance.parentNotified ? 'Đã gửi phiếu cho phụ huynh' : 'Chưa gửi phiếu cho phụ huynh'}
                    />
                </div>
            ),
        },
        {
            key: 'makeupNote',
            label: 'Ghi chú học bù',
            render: (attendance) => (
                <span
                    className="text-sm text-foreground-light max-w-[200px] truncate block"
                    title={attendance.classSession.makeupNote}
                >
                    {attendance.classSession.makeupNote || '-'}
                </span>
            ),
        },
        ...(showHomeworkCol
            ? [
                {
                    key: 'homework',
                    label: homeworkTitle ? `BT: ${homeworkTitle}` : 'Bài tập về nhà',
                    render: (attendance) => {
                        const homeworkId = attendance.classSession?.homeworkId;
                        const hs = attendance.homeworkSubmit;

                        if (!homeworkId) {
                            return (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${HOMEWORK_BADGE.notAssigned}`}>
                                    Không giao bài
                                </span>
                            );
                        }

                        if (!hs) {
                            return (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${HOMEWORK_BADGE.notSubmitted}`}>
                                    Chưa nộp
                                </span>
                            );
                        }
                        return (
                            <div className="flex flex-col gap-0.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${HOMEWORK_BADGE.submitted}`}>
                                    Đã nộp
                                </span>
                                {hs.points != null && (
                                    <span className="text-xs text-foreground-light">
                                        {hs.points} điểm
                                    </span>
                                )}
                            </div>
                        );
                    },
                },
            ]
            : []),
        ...(showTuitionCol
            ? [
                {
                    key: 'tuition',
                    label: `Học phí T${tuitionMonth}/${tuitionYear}`,
                    render: (attendance) => {
                        const tp = attendance.tuitionPayment;
                        if (!tp) {
                            return (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                    Không có học phí T{tuitionMonth}/{tuitionYear}
                                </span>
                            );
                        }
                        return (
                            <div className="flex flex-col gap-0.5">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TUITION_BADGE[tp.status] ?? 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {tp.statusLabel ?? tp.status}
                                </span>
                            </div>
                        );
                    },
                },
            ]
            : []),
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (attendance) => {
                const canSendParentZalo = !!attendance.student?.hasParentZaloId && !!onSendToParent;
                const isSendingToParent =
                    sendToParentLoading && sendToParentAttendanceId === attendance.attendanceId;

                return (
                    <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(attendance);
                            }}
                            className="p-1 rounded hover:bg-blue-100 transition-colors"
                            title="Xem chi tiết"
                        >
                            <Eye size={16} className="text-blue-600" />
                        </button>
                        {/* Export */}
                        {onExport && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onExport(attendance);
                                }}
                                className="p-1 rounded hover:bg-purple-100 transition-colors"
                                title="Xuất phiếu"
                            >
                                <FileImage size={16} className="text-purple-600" />
                            </button>
                        )}
                        {/* Send parent Zalo */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSendToParent(attendance);
                            }}
                            disabled={isSendingToParent || !canSendParentZalo}
                            className="p-1 rounded hover:bg-emerald-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            title={canSendParentZalo ? (isSendingToParent ? 'Đang gửi...' : 'Gửi phiếu qua Zalo cho phụ huynh') : 'Học sinh chưa liên kết Zalo của phụ huynh'}
                        >
                            <MessageCircle size={16} className="text-emerald-600" />
                        </button>
                        {/* Edit */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(attendance);
                            }}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                            title="Cập nhật điểm danh"
                        >
                            <Edit2 size={16} className="text-warning" />
                        </button>
                        {/* Delete */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(attendance);
                            }}
                            className="p-1 rounded hover:bg-red-100 transition-colors"
                            title="Xóa điểm danh"
                        >
                            <Trash2
                                size={16}
                                className="text-red-600"
                            />
                        </button>
                    </div>
                );
            },
        },
    ];

    const hoverPreviewStyle = (() => {
        if (!hoveredOtherAttendance) return null;

        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const maxWidth = Math.min(viewportWidth - 24, 920);
        const minWidth = Math.min(maxWidth, Math.max(420, hoveredOtherAttendance.rect.width + 80));
        const popupLeft = Math.min(
            Math.max(12, hoveredOtherAttendance.rect.left - 6),
            Math.max(12, viewportWidth - minWidth - 12)
        );

        return {
            top: Math.max(12, hoveredOtherAttendance.rect.top - 4),
            left: popupLeft,
            width: 'max-content',
            minWidth,
            maxWidth,
            transform: 'scale(1.04)',
            transformOrigin: 'left center',
        };
    })();

    return (
        <>
            <Table
                columns={columns}
                data={attendances}
                loading={loading}
                emptyMessage="Chưa có điểm danh nào"
                onRowClick={onView}
            />

            {hoveredOtherAttendance && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed z-[9999] pointer-events-auto"
                    style={hoverPreviewStyle}
                    onMouseEnter={clearHoverCloseTimer}
                    onMouseLeave={scheduleHideHoveredAttendance}
                >
                    <div className="flex items-center justify-between gap-2 rounded-md bg-white shadow-xl ring-1 ring-gray-200 px-3 py-2">
                        <div className="flex flex-col min-w-0 ">
                            <div className="flex items-center gap-1 min-w-0 w-full whitespace-nowrap">
                                <span className="text-sm text-foreground whitespace-nowrap">{hoveredOtherAttendance.sessionLabel}</span>
                                {hoveredOtherAttendance.className && (
                                    <span className="text-xs text-foreground-light whitespace-nowrap">({hoveredOtherAttendance.className})</span>
                                )}
                            </div>
                            {(hoveredOtherAttendance.sessionStart || hoveredOtherAttendance.sessionEnd) && (
                                <span className="text-xs text-foreground-light whitespace-nowrap">
                                    {hoveredOtherAttendance.sessionStart || '--:--'} - {hoveredOtherAttendance.sessionEnd || '--:--'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${hoveredOtherAttendance.statusClass}`}>
                                {hoveredOtherAttendance.statusLabel}
                            </span>
                            {onDeleteOtherAttendanceInWeek && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteOtherAttendanceInWeek(hoveredOtherAttendance.attendance);
                                        setHoveredOtherAttendance(null);
                                    }}
                                    disabled={deleteOtherInWeekLoading && deleteOtherInWeekAttendanceId === hoveredOtherAttendance.id}
                                    className="p-1 rounded hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    title={deleteOtherInWeekLoading && deleteOtherInWeekAttendanceId === hoveredOtherAttendance.id ? 'Đang xóa...' : 'Xóa điểm danh này'}
                                >
                                    <Trash2 size={12} className="text-red-600" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
