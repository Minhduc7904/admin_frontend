import { formatDate, formatMoney } from '../../../shared/utils'

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

export const TuitionPaymentDetailInfo = ({ payment }) => {
    const statusConfig = STATUS_CONFIG[payment.status] || {}

    return (
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Thông tin cơ bản */}
            <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Thông tin học phí
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-foreground-light">Mã học phí</span>
                        <p className="font-medium text-foreground">#{payment.paymentId}</p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">Số tiền</span>
                        <p className="font-semibold text-lg text-foreground">
                            {formatMoney(payment.amount)}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">Kỳ học phí</span>
                        <p className="font-medium text-foreground">
                            Tháng {payment.month}/{payment.year}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">Trạng thái</span>
                        <div className="mt-1">
                            <span
                                className={`
                                    inline-flex items-center
                                    px-2.5 py-0.5 rounded-full
                                    text-xs font-medium
                                    ${statusConfig.className || 'bg-gray-100 text-gray-700'}
                                `}
                            >
                                {statusConfig.label || 'Không xác định'}
                            </span>
                        </div>
                    </div>
                    {payment.paidAt && (
                        <div>
                            <span className="text-sm text-foreground-light">Ngày thanh toán</span>
                            <p className="font-medium text-foreground">
                                {formatDate(payment.paidAt)}
                            </p>
                        </div>
                    )}
                    <div>
                        <span className="text-sm text-foreground-light">Ngày tạo</span>
                        <p className="font-medium text-foreground">
                            {formatDate(payment.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Thông tin học sinh */}
            <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Thông tin học sinh
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-foreground-light">Họ tên</span>
                        <p className="font-medium text-foreground">
                            {payment.student?.fullName || '—'}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">Mã học sinh</span>
                        <p className="font-medium text-foreground">
                            #{payment.studentId}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">SĐT học sinh</span>
                        <p className="font-medium text-foreground">
                            {payment.student?.studentPhone || '—'}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">SĐT phụ huynh</span>
                        <p className="font-medium text-foreground">
                            {payment.student?.parentPhone || '—'}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-foreground-light">Trường</span>
                        <p className="font-medium text-foreground">
                            {payment.student?.school?.schoolName || '—'}
                        </p>
                    </div>
                    {payment.student?.grade && (
                        <div>
                            <span className="text-sm text-foreground-light">Khối</span>
                            <p className="font-medium text-foreground">
                                Khối {payment.student.grade}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Thông tin khóa học (nếu có) */}
            {payment.course && (
                <div className="bg-white border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Thông tin khóa học
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-foreground-light">Tên khóa học</span>
                            <p className="font-medium text-foreground">
                                {payment.course.courseName}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-foreground-light">Mã khóa học</span>
                            <p className="font-medium text-foreground">
                                #{payment.courseId}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ghi chú */}
            {payment.notes && (
                <div className="bg-white border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Ghi chú
                    </h3>
                    <p className="text-foreground whitespace-pre-wrap">
                        {payment.notes}
                    </p>
                </div>
            )}
        </div>
    )
}
