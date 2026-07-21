import { useState } from 'react'
import { Eye, Edit, MoreHorizontal, Pencil, PlusCircle, Trash2, Undo2 } from 'lucide-react'
import { Table, Checkbox } from '../../../shared/components/ui'
import { TuitionPaymentStatus } from '../constants/tuition-payment.constant'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../core/constants'
/* ===================== CONFIG ===================== */
const STATUS_CONFIG = {
    PAID: {
        label: 'Đã đóng',
        className: 'bg-green-100 text-green-700',
    },
    UNPAID: {
        label: 'Chưa đóng',
        className: 'bg-red-100 text-red-700',
    },
}

/* ===================== HELPERS ===================== */
const formatMoney = (value) => {
    if (value == null) return '-'
    return value.toLocaleString('vi-VN') + ' ₫'
}

/* ===================== TUITION PAYMENT TABLE ===================== */
export const TuitionPaymentTable = ({
    payments,
    loading,
    sort,
    onSortChange,
    onView,
    onEdit,
    onDelete,
    onQuickToggle,
    canConfirmManual,
    onEditManualReconciliation,
    onUnreconcileManualPayment,
    canCreatePaymentIntent,
    onCreatePaymentIntent,
    creatingPaymentIntentId,
}) => {
    const [openActionMenuId, setOpenActionMenuId] = useState(null)
    const columns = [
        {
            key: 'paymentId',
            label: 'ID',
            sortDirection: sort?.field === 'paymentId' ? sort.direction : null,
            onSort: (direction) => onSortChange?.('paymentId', direction),
            render: (payment) => (
                <span className="text-sm text-foreground-light">
                    #{payment.paymentId}
                </span>
            ),
        },
        {
            key: 'student',
            label: 'Học sinh',
            render: (payment) => (
                <div className="flex flex-col">
                    <Link to={ROUTES.STUDENT_DETAIL(payment.studentId)} className="hover:underline cursor-pointer">

                        <span className="text-sm font-semibold text-foreground">
                            {payment.student?.fullName || '—'}
                        </span>
                    </Link>
                    <span className="text-xs text-foreground-lighter">
                        #{payment.studentId}
                    </span>
                </div>
            ),
        },
        {
            key: 'studentPhone',
            label: 'SĐT học sinh',
            render: (payment) => (
                <span className="text-sm text-foreground-light">
                    {payment.student?.studentPhone || '—'}
                </span>
            ),
        },
        {
            key: 'parentPhone',
            label: 'SĐT phụ huynh',
            render: (payment) => (
                <span className="text-sm text-foreground-light">
                    {payment.student?.parentPhone || '—'}
                </span>
            ),
        },
        {
            key: 'grade',
            label: 'Khối',
            render: (payment) => (
                <span className="text-sm text-foreground-light">
                    {payment.student?.grade ? `Khối ${payment.student.grade}` : '—'}
                </span>
            ),
        },
        {
            key: 'school',
            label: 'Trường',
            render: (payment) => (
                <span className="text-sm text-foreground-light">
                    {payment.student?.schoolName || payment.student?.school || '—'}
                </span>
            ),
        },
        {
            key: 'amount',
            label: 'Số tiền',
            sortDirection: sort?.field === 'amount' ? sort.direction : null,
            onSort: (direction) => onSortChange?.('amount', direction),
            render: (payment) => (
                <span className="text-sm font-semibold text-foreground">
                    {formatMoney(payment.amount)}
                </span>
            ),
        },
        {
            key: 'period',
            label: 'Kỳ học phí',
            render: (payment) =>
                payment.month && payment.year ? (
                    <span className="text-sm text-foreground-light">
                        {payment.month}/{payment.year}
                    </span>
                ) : (
                    <span className="italic text-foreground-lighter">—</span>
                ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (payment) => {
                const cfg = STATUS_CONFIG[payment.status]
                return (
                    <div className="flex items-center gap-2">
                        {canConfirmManual && (
                            <Checkbox
                                checked={payment.status === 'PAID'}
                                onChange={() => {
                                    if (payment.status === 'UNPAID') onQuickToggle?.(payment)
                                }}
                                label=""
                                tooltipText={payment.status === 'UNPAID'
                                    ? 'Xác nhận đã đối soát thủ công'
                                    : 'Học phí đã đóng không thể đổi trạng thái tại đây'}
                            />
                        )}
                        <span
                            className={`
                                inline-flex items-center
                                px-2.5 py-0.5 rounded-full
                                text-xs font-medium
                                ${cfg?.className || 'bg-gray-100 text-gray-700'}
                            `}
                        >
                            {cfg?.label || 'Không xác định'}
                        </span>
                    </div>
                )
            },
        },
        {
            key: 'onlinePayment',
            label: 'Thanh toán online',
            render: (payment) => payment.paymentIntent ? (
                <div>
                    <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">Có thể thanh toán</span>
                    <p className="mt-1 text-xs text-foreground-light">Intent #{payment.paymentIntent.paymentIntentId}</p>
                </div>
            ) : <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Chưa có intent</span>,
        },
        {
            key: 'paidAt',
            label: 'Ngày thanh toán',
            sortDirection: sort?.field === 'paidAt' ? sort.direction : null,
            onSort: (direction) => onSortChange?.('paidAt', direction),
            render: (payment) =>
                payment.paidAt ? (
                    <span className="text-sm text-foreground-light">
                        {new Date(payment.paidAt).toLocaleDateString('vi-VN')}
                    </span>
                ) : (
                    <span className="italic text-foreground-lighter">—</span>
                ),
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            sortDirection: sort?.field === 'createdAt' ? sort.direction : null,
            onSort: (direction) => onSortChange?.('createdAt', direction),
            render: (payment) => (
                <span className="text-sm text-foreground-light">
                    {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            align: 'right',
            render: (payment) => {
                const canCreateIntent = canCreatePaymentIntent && payment.status === 'UNPAID' && !payment.paymentIntent
                const canManageReconciliation = canConfirmManual && payment.status === 'PAID'
                const hasMoreActions = canCreateIntent || canManageReconciliation

                return <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onView?.(payment)
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} className="text-info" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit?.(payment)
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit size={16} className="text-warning" />
                    </button>
                    {hasMoreActions && <div className="relative">
                        <button
                            onClick={(event) => {
                                event.stopPropagation()
                                setOpenActionMenuId((current) => current === payment.paymentId ? null : payment.paymentId)
                            }}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                            title="Thao tác thanh toán khác"
                        >
                            <MoreHorizontal size={18} className="text-foreground-light" />
                        </button>
                        {openActionMenuId === payment.paymentId && <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg border border-border bg-white p-1 shadow-lg">
                            {canCreateIntent && <button
                                type="button"
                                disabled={creatingPaymentIntentId === payment.paymentId}
                                onClick={(event) => { event.stopPropagation(); setOpenActionMenuId(null); onCreatePaymentIntent?.(payment) }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-gray-50 disabled:cursor-wait disabled:opacity-50"
                            ><PlusCircle size={16} className="text-blue-600" />{creatingPaymentIntentId === payment.paymentId ? 'Đang tạo intent...' : 'Tạo payment intent'}</button>}
                            {canManageReconciliation && <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); setOpenActionMenuId(null); onEditManualReconciliation?.(payment) }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-gray-50"
                            ><Pencil size={16} className="text-blue-600" />Sửa đối soát</button>}
                            {canManageReconciliation && <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); setOpenActionMenuId(null); onUnreconcileManualPayment?.(payment) }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-gray-50"
                            ><Undo2 size={16} className="text-amber-600" />Bỏ đối soát</button>}
                        </div>}
                    </div>}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.(payment)
                        }}
                        className="p-1 rounded hover:bg-gray-200 transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} className="text-danger" />
                    </button>
                </div>
            },
        },
    ]

    return (
        <Table
            columns={columns}
            data={payments}
            loading={loading}
            emptyMessage="Không có học phí nào"
            emptySubMessage="Chưa có bản ghi học phí nào"
            emptyIcon="credit-card"
            emptyActionLabel="Tải lại"
            onEmptyAction={() => window.location.reload()}
        />
    )
}
