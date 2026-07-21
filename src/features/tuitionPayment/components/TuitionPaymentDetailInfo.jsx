import { formatDate, formatDateTime, formatMoney } from '../../../shared/utils'
import { Button } from '../../../shared/components/ui'
import { Pencil, PlusCircle, Undo2 } from 'lucide-react'

const PAYMENT_STATUS = {
    PAID: { label: 'Đã đóng', className: 'bg-green-100 text-green-700' },
    UNPAID: { label: 'Chưa đóng', className: 'bg-red-100 text-red-700' },
}

const INTENT_STATUS = {
    PENDING: { label: 'Đang chờ thanh toán', className: 'bg-amber-100 text-amber-700' },
    PAID: { label: 'Đã thanh toán', className: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Đã hủy', className: 'bg-gray-100 text-gray-700' },
    EXPIRED: { label: 'Đã hết hạn', className: 'bg-red-100 text-red-700' },
}

const ATTEMPT_STATUS = {
    PENDING: { label: 'Đang chờ thanh toán', className: 'bg-amber-100 text-amber-700' },
    SUCCEEDED: { label: 'Thanh toán thành công', className: 'bg-green-100 text-green-700' },
    FAILED: { label: 'Thanh toán thất bại', className: 'bg-red-100 text-red-700' },
    CANCELLED: { label: 'Đã hủy', className: 'bg-gray-100 text-gray-700' },
    EXPIRED: { label: 'Đã hết hạn', className: 'bg-red-100 text-red-700' },
}

const PROCESSING_STATUS = {
    RECEIVED: { label: 'Đã nhận', className: 'bg-blue-100 text-blue-700' },
    MATCHED: { label: 'Đã khớp', className: 'bg-green-100 text-green-700' },
    UNMATCHED: { label: 'Chưa khớp', className: 'bg-amber-100 text-amber-700' },
    AMOUNT_MISMATCH: { label: 'Sai số tiền', className: 'bg-red-100 text-red-700' },
    IGNORED: { label: 'Đã bỏ qua', className: 'bg-gray-100 text-gray-700' },
    ERROR: { label: 'Lỗi xử lý', className: 'bg-red-100 text-red-700' },
}

const RECONCILIATION_STATUS = {
    UNRECONCILED: { label: 'Chưa đối soát', className: 'bg-amber-100 text-amber-700' },
    AUTOMATIC: { label: 'Đã tự động đối soát', className: 'bg-green-100 text-green-700' },
    ADMIN: { label: 'Quản trị viên đã đối soát', className: 'bg-indigo-100 text-indigo-700' },
}

const CONFIRMATION_MODE = {
    AUTOMATIC: 'Tự động đối soát',
    MANUAL_FALLBACK: 'Xác nhận thủ công',
}

const BANK_SELECTION_SOURCE = {
    GRADE_MAPPING: 'Cấu hình tài khoản theo khối',
    MANUAL_DEFAULT: 'Tài khoản thủ công mặc định',
}

const Badge = ({ value, options }) => {
    const config = options[value]

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config?.className || 'bg-gray-100 text-gray-700'}`}>
            {config?.label || 'Không xác định'}
        </span>
    )
}

const Field = ({ label, children, className = '' }) => (
    <div className={className}>
        <span className="text-sm text-foreground-light">{label}</span>
        <div className="mt-1 font-medium text-foreground">{children || '—'}</div>
    </div>
)

const BankTransferTransactions = ({ transactions = [] }) => {
    if (!transactions.length) {
        return <p className="rounded-md border border-dashed border-border p-3 text-sm text-foreground-light">Chưa có giao dịch ngân hàng nào gắn với lần thanh toán này.</p>
    }

    return (
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <div key={transaction.bankTransferTransactionId} className="rounded-md border border-border bg-white p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-foreground">Giao dịch #{transaction.bankTransferTransactionId}</p>
                            <p className="mt-1 text-xs text-foreground-light">{transaction.provider || 'Ngân hàng'} · Mã giao dịch: {transaction.providerTransactionId || '—'}</p>
                        </div>
                        <p className="font-semibold text-foreground">{formatMoney(transaction.amount)}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge value={transaction.processingStatus} options={PROCESSING_STATUS} />
                        <Badge value={transaction.reconciliationStatus} options={RECONCILIATION_STATUS} />
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <Field label="Thời điểm giao dịch">{formatDateTime(transaction.transactionAt)}</Field>
                        <Field label="Tài khoản nhận">{transaction.receivingAccountNumber || `Tài khoản #${transaction.receivingBankAccountId || '—'}`}</Field>
                        {transaction.content && <Field label="Nội dung chuyển khoản" className="sm:col-span-2">{transaction.content}</Field>}
                        {transaction.reference && <Field label="Mã tham chiếu" className="sm:col-span-2">{transaction.reference}</Field>}
                    </div>
                </div>
            ))}
        </div>
    )
}

const PaymentAttempts = ({ paymentIntent }) => {
    const attempts = paymentIntent.paymentAttempts || []

    return (
        <section className="bg-white border border-border rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Luồng thanh toán trực tuyến</h3>
                    <p className="mt-1 text-sm text-foreground-light">Theo dõi từng lần tạo giao dịch và trạng thái đối soát của giao dịch ngân hàng.</p>
                </div>
                <Badge value={paymentIntent.status} options={INTENT_STATUS} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-y border-border py-4">
                <Field label="Mã phiếu thanh toán">#{paymentIntent.paymentIntentId}</Field>
                <Field label="Số tiền">{formatMoney(paymentIntent.amount)}</Field>
                <Field label="Hết hạn phiếu">{paymentIntent.expiresAt ? formatDateTime(paymentIntent.expiresAt) : 'Không giới hạn'}</Field>
                <Field label="Số lần tạo giao dịch">{attempts.length}</Field>
            </div>

            <div className="mt-4 space-y-4">
                <h4 className="font-semibold text-foreground">Các lần thanh toán</h4>
                {!attempts.length && <p className="rounded-md border border-dashed border-border p-4 text-sm text-foreground-light">Phiếu thanh toán đã có nhưng chưa tạo lần thanh toán nào.</p>}
                {attempts.map((attempt, index) => (
                    <article key={attempt.paymentAttemptId} className="rounded-lg border border-border bg-gray-50 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="font-semibold text-foreground">Lần thanh toán {index + 1} · {attempt.attemptCode}</p>
                                <p className="mt-1 text-sm text-foreground-light">Mã attempt #{attempt.paymentAttemptId} · {formatMoney(attempt.amount)}</p>
                            </div>
                            <Badge value={attempt.status} options={ATTEMPT_STATUS} />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <Field label="Cách xác nhận">{CONFIRMATION_MODE[attempt.confirmationMode] || 'Không xác định'}</Field>
                            <Field label="Nguồn chọn tài khoản">{BANK_SELECTION_SOURCE[attempt.bankSelectionSource] || 'Không xác định'}</Field>
                            <Field label="Tài khoản nhận">#{attempt.receivingBankAccountId}</Field>
                            <Field label="Hết hạn giao dịch">{formatDateTime(attempt.expiresAt)}</Field>
                            <Field label="Tạo lúc">{formatDateTime(attempt.createdAt)}</Field>
                            {attempt.qrCodeUrl && <Field label="QR thanh toán"><a href={attempt.qrCodeUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Mở mã QR</a></Field>}
                        </div>

                        <div className="mt-4 border-t border-border pt-4">
                            <h5 className="mb-3 font-semibold text-foreground">Giao dịch ngân hàng và đối soát</h5>
                            <BankTransferTransactions transactions={attempt.bankTransferTransactions} />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export const TuitionPaymentDetailInfo = ({
    payment,
    loading,
    canManageManualReconciliation,
    onEditManualReconciliation,
    onUnreconcileManualPayment,
    reconciliationLoading,
    canCreatePaymentIntent,
    onCreatePaymentIntent,
    creatingPaymentIntent,
}) => {
    const hasPaymentIntent = Object.prototype.hasOwnProperty.call(payment, 'paymentIntent')
    const manuallyReconciledTransactions = payment.paymentIntent?.paymentAttempts?.flatMap(
        (attempt) => (attempt.bankTransferTransactions || []).filter(
            (transaction) => transaction.reconciliationStatus === 'ADMIN',
        ),
    ) || []
    const canEditManualReconciliation = payment.status === 'PAID'
    const canUnreconcileManualPayment = payment.status === 'PAID' && Boolean(payment.paymentIntent)
    const canCreateIntent = canCreatePaymentIntent && payment.status === 'UNPAID' && !payment.paymentIntent

    if (loading) {
        return <div className="p-6 text-center text-sm text-foreground-light">Đang tải chi tiết học phí và dữ liệu đối soát…</div>
    }

    return (
        <div className="p-6 space-y-6 overflow-y-auto">
            <section className="bg-white border border-border rounded-lg p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">Thông tin học phí</h3>
                    {(canCreateIntent || (canManageManualReconciliation && canEditManualReconciliation)) && (
                        <div className="flex flex-wrap gap-2">
                            {canCreateIntent && <Button variant="outline" size="sm" onClick={() => onCreatePaymentIntent(payment)} loading={creatingPaymentIntent}>
                                <PlusCircle className="h-4 w-4" /> Tạo payment intent
                            </Button>}
                            <Button variant="outline" size="sm" onClick={() => onEditManualReconciliation(payment, manuallyReconciledTransactions)} disabled={reconciliationLoading}>
                                <Pencil className="h-4 w-4" /> Sửa đối soát
                            </Button>
                            {canUnreconcileManualPayment && <Button variant="outline" size="sm" onClick={() => onUnreconcileManualPayment(payment)} disabled={reconciliationLoading}>
                                <Undo2 className="h-4 w-4" /> Bỏ đối soát
                            </Button>}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Mã học phí">#{payment.paymentId}</Field>
                    <Field label="Số tiền"><span className="text-lg">{formatMoney(payment.amount)}</span></Field>
                    <Field label="Kỳ học phí">Tháng {payment.month}/{payment.year}</Field>
                    <Field label="Trạng thái"><Badge value={payment.status} options={PAYMENT_STATUS} /></Field>
                    {payment.paidAt && <Field label="Ngày thanh toán">{formatDateTime(payment.paidAt)}</Field>}
                    <Field label="Ngày tạo">{formatDate(payment.createdAt)}</Field>
                </div>
            </section>

            <section className="bg-white border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Thông tin học sinh</h3>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Họ tên">{payment.student?.fullName}</Field>
                    <Field label="Mã học sinh">#{payment.studentId}</Field>
                    <Field label="SĐT học sinh">{payment.student?.studentPhone}</Field>
                    <Field label="SĐT phụ huynh">{payment.student?.parentPhone}</Field>
                    <Field label="Trường">{payment.student?.school?.schoolName}</Field>
                    {payment.student?.grade && <Field label="Khối">Khối {payment.student.grade}</Field>}
                </div>
            </section>

            {payment.course && (
                <section className="bg-white border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Thông tin khóa học</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Tên khóa học">{payment.course.courseName}</Field>
                        <Field label="Mã khóa học">#{payment.courseId}</Field>
                    </div>
                </section>
            )}

            {hasPaymentIntent && (payment.paymentIntent ? (
                <PaymentAttempts paymentIntent={payment.paymentIntent} />
            ) : (
                <section className="rounded-lg border border-dashed border-border bg-gray-50 p-4">
                    <h3 className="font-semibold text-foreground">Chưa có phiếu thanh toán trực tuyến</h3>
                    <p className="mt-1 text-sm text-foreground-light">Đây có thể là học phí cũ, được tạo trước khi áp dụng PaymentIntent.</p>
                </section>
            ))}

            {payment.notes && (
                <section className="bg-white border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Ghi chú</h3>
                    <p className="text-foreground whitespace-pre-wrap">{payment.notes}</p>
                </section>
            )}
        </div>
    )
}
