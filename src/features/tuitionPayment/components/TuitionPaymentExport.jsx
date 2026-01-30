import { useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { Button } from '../../../shared/components/ui'
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

export const TuitionPaymentExport = ({ payment }) => {
    const [isPrinting, setIsPrinting] = useState(false)

    const handlePrint = () => {
        setIsPrinting(true)
        window.print()
        setTimeout(() => setIsPrinting(false), 500)
    }

    const statusConfig = STATUS_CONFIG[payment.status] || {}

    return (
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Actions */}
            <div className="flex gap-3 print:hidden">
                <Button onClick={handlePrint} disabled={isPrinting}>
                    <Printer size={16} />
                    In phiếu
                </Button>
                <Button variant="outline">
                    <Download size={16} />
                    Tải PDF
                </Button>
            </div>

            {/* Receipt Preview */}
            <div className="bg-white border border-border rounded-lg p-8 print:border-0">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center border-b border-border pb-6">
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            PHIẾU THU HỌC PHÍ
                        </h1>
                        <p className="text-foreground-light">
                            Số: {payment.paymentId}
                        </p>
                        <p className="text-sm text-foreground-light">
                            Ngày: {formatDate(payment.createdAt)}
                        </p>
                    </div>

                    {/* Student Info */}
                    <div className="space-y-3">
                        <h2 className="font-semibold text-lg text-foreground">
                            Thông tin học sinh
                        </h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-foreground-light">Họ và tên:</span>
                                <span className="ml-2 font-medium text-foreground">
                                    {payment.student?.fullName || '—'}
                                </span>
                            </div>
                            <div>
                                <span className="text-foreground-light">Mã học sinh:</span>
                                <span className="ml-2 font-medium text-foreground">
                                    {payment.studentId}
                                </span>
                            </div>
                            <div>
                                <span className="text-foreground-light">SĐT học sinh:</span>
                                <span className="ml-2 font-medium text-foreground">
                                    {payment.student?.studentPhone || '—'}
                                </span>
                            </div>
                            <div>
                                <span className="text-foreground-light">SĐT phụ huynh:</span>
                                <span className="ml-2 font-medium text-foreground">
                                    {payment.student?.parentPhone || '—'}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-foreground-light">Trường:</span>
                                <span className="ml-2 font-medium text-foreground">
                                    {payment.student?.school?.schoolName || '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-3 border-t border-border pt-6">
                        <h2 className="font-semibold text-lg text-foreground">
                            Chi tiết học phí
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-foreground-light">Kỳ học phí:</span>
                                <span className="font-medium text-foreground">
                                    Tháng {payment.month}/{payment.year}
                                </span>
                            </div>
                            {payment.course && (
                                <div className="flex justify-between">
                                    <span className="text-foreground-light">Khóa học:</span>
                                    <span className="font-medium text-foreground">
                                        {payment.course.courseName}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-foreground-light">Trạng thái:</span>
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
                            {payment.paidAt && (
                                <div className="flex justify-between">
                                    <span className="text-foreground-light">Ngày thanh toán:</span>
                                    <span className="font-medium text-foreground">
                                        {formatDate(payment.paidAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-gray-50 rounded-lg p-4 border-t border-border">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-foreground">
                                Tổng cộng:
                            </span>
                            <span className="text-2xl font-bold text-gray-900">
                                {formatMoney(payment.amount)}
                            </span>
                        </div>
                    </div>

                    {/* Notes */}
                    {payment.notes && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-foreground">Ghi chú:</h3>
                            <p className="text-sm text-foreground-light whitespace-pre-wrap">
                                {payment.notes}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="grid grid-cols-2 gap-8 pt-12 mt-12 border-t border-border">
                        <div className="text-center">
                            <p className="text-sm text-foreground-light mb-12">
                                Người nộp tiền
                            </p>
                            <p className="text-sm text-foreground">
                                (Ký, ghi rõ họ tên)
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-foreground-light mb-12">
                                Người thu tiền
                            </p>
                            <p className="text-sm text-foreground">
                                (Ký, ghi rõ họ tên)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
