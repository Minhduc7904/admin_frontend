// ===== OPTIONS =====
export const STATUS_OPTIONS = [
    { value: 'PAID', label: 'Đã đóng' },
    { value: 'UNPAID', label: 'Chưa đóng' },
]

export const TUITION_PAYMENT_STATUS_OPTIONS = [
    { value: 'PAID', label: 'Đã đóng' },
    { value: 'UNPAID', label: 'Chưa đóng' },
]

export const MONTH_OPTIONS = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
]

export const YEAR_OPTIONS = (() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        years.push({ value: i, label: `Năm ${i}` })
    }
    return years
})()

export const TuitionPaymentStatus = {
    PAID: 'PAID',
    UNPAID: 'UNPAID',
}