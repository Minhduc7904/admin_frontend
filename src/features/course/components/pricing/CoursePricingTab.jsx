import {
    DollarSign,
    CreditCard,
    ShieldAlert,
    Clock,
    Calendar,
    Edit,
    Tag,
} from 'lucide-react'
import { SkeletonCard } from '../../../../shared/components/loading'
import { Button } from '../../../../shared/components'

const formatDateTime = (value) => {
    if (!value) return 'Chưa cập nhật'

    try {
        return new Date(value).toLocaleString('vi-VN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    } catch {
        return String(value)
    }
}

const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí'
    if (!price && price !== 0) return 'Chưa cập nhật'

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price)
}

const InfoRow = ({ icon: Icon, label, value, badge }) => (
    <div className="flex items-center gap-3 py-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gray-50 text-foreground-light">
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground-light">{label}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-medium text-foreground truncate">
                    {value}
                </p>
                {badge}
            </div>
        </div>
    </div>
)

const BooleanBadge = ({ value, trueLabel, falseLabel }) => (
    <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${value
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-700'
            }`}
    >
        {value ? trueLabel : falseLabel}
    </span>
)

export const CoursePricingTab = ({ course, loading, onEdit }) => {
    if (loading) {
        return <SkeletonCard count={2} className="rounded-sm" />
    }

    if (!course) {
        return (
            <div className="bg-white border border-border rounded-sm p-6 text-center text-foreground-light">
                Không tìm thấy thông tin học phí
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Edit */}
            <div className="flex justify-end">
                <Button
                    onClick={onEdit}
                    variant="primary"
                >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa học phí
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                {/* LEFT */}
                <div className="space-y-6">
                    {/* Giá & khuyến mãi */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Giá & khuyến mãi
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow
                                icon={DollarSign}
                                label="Giá bán"
                                value={formatPrice(course.priceVND)}
                            />

                            <InfoRow
                                icon={DollarSign}
                                label="Giá gốc"
                                value={
                                    course.compareAtVND
                                        ? formatPrice(course.compareAtVND)
                                        : 'Không có'
                                }
                                badge={
                                    course.hasDiscount && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                                            -{course.discountPercentage}%
                                        </span>
                                    )
                                }
                            />

                            <InfoRow
                                icon={Tag}
                                label="Loại khóa học"
                                value={course.isFree ? 'Miễn phí' : 'Có thu phí'}
                            />
                        </div>
                    </div>

                    {/* Thanh toán */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Thanh toán
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow
                                icon={CreditCard}
                                label="Hình thức thanh toán"
                                value={
                                    course.paymentType === 'MONTHLY'
                                        ? 'Theo tháng'
                                        : 'Một lần'
                                }
                            />

                            <InfoRow
                                icon={CreditCard}
                                label="Tự động gia hạn"
                                value=""
                                badge={
                                    <BooleanBadge
                                        value={course.autoRenew}
                                        trueLabel="Bật"
                                        falseLabel="Tắt"
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                    {/* Chính sách học phí */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Chính sách học phí
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow
                                icon={ShieldAlert}
                                label="Chặn học khi chưa đóng phí"
                                value=""
                                badge={
                                    <BooleanBadge
                                        value={course.blockUnpaid}
                                        trueLabel="Có"
                                        falseLabel="Không"
                                    />
                                }
                            />

                            <InfoRow
                                icon={Clock}
                                label="Số ngày ân hạn"
                                value={
                                    course.gracePeriodDays != null
                                        ? `${course.gracePeriodDays} ngày`
                                        : 'Không áp dụng'
                                }
                            />
                        </div>
                    </div>

                    {/* Hoạt động */}
                    <div className="bg-white border border-border rounded-sm">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="text-sm font-semibold text-foreground">
                                Hoạt động
                            </h3>
                        </div>
                        <div className="p-4 space-y-1">
                            <InfoRow
                                icon={Calendar}
                                label="Ngày tạo"
                                value={formatDateTime(course.createdAt)}
                            />
                            <InfoRow
                                icon={Clock}
                                label="Cập nhật gần nhất"
                                value={formatDateTime(course.updatedAt)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
