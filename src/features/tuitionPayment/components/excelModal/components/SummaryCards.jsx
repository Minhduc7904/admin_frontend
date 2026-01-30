import { CheckCircle, RefreshCcw, MinusCircle, AlertTriangle } from 'lucide-react'

export const SummaryCards = ({ summary, activeTab, onTabChange }) => {
    const items = [
        { id: 'new', label: 'Tạo mới', value: summary.newPayments, icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-500' },
        { id: 'existing', label: 'Cập nhật', value: summary.existingPayments, icon: RefreshCcw, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500' },
        { id: 'unchanged', label: 'Không đổi', value: summary.unchangedPayments, icon: MinusCircle, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-500' },
        { id: 'invalid', label: 'Lỗi', value: summary.invalidRows, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-500' },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(i => {
                const isActive = activeTab === i.id
                const isDisabled = i.value === 0
                
                return (
                    <button
                        key={i.label}
                        onClick={() => !isDisabled && onTabChange(i.id)}
                        disabled={isDisabled}
                        className={`
                            border-2 rounded-lg p-4 text-left transition-all
                            ${isActive 
                                ? `${i.bgColor} ${i.borderColor} shadow-md` 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }
                            ${isDisabled 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'cursor-pointer hover:shadow-sm'
                            }
                        `}
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <i.icon size={16} />
                            {i.label}
                        </div>
                        <div className={`text-2xl font-semibold ${i.color}`}>
                            {i.value}
                        </div>
                        {isActive && (
                            <div className="mt-2 text-xs font-medium text-gray-600">
                                Đang xem
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
