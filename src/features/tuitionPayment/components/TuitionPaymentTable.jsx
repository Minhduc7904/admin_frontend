import { Eye, Edit, Trash2 } from 'lucide-react'
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
}) => {
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
                        <Checkbox
                            checked={payment.status === 'PAID'}
                            onChange={(checked) => onQuickToggle?.(payment)}
                            label=""
                        />
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
            render: (payment) => (
                <div className="flex items-center justify-end gap-2">
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
            ),
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
