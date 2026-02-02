import { FileText, Edit3 } from 'lucide-react'

export const SplitMethodSelector = ({
    selectedMethod,
    onChange,
    disabled = false,
}) => {
    const methods = [
        {
            id: 'session',
            icon: FileText,
            title: 'Từ nội dung Session',
            description: 'Dùng nội dung trích xuất từ PDF',
        },
        {
            id: 'custom',
            icon: Edit3,
            title: 'Nội dung tùy chỉnh',
            description: 'Nhập hoặc chỉnh sửa nội dung',
        },
    ]

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
                Chọn phương pháp tách
            </h3>

            {/* 1 hàng */}
            <div className="grid grid-cols-2 gap-3">
                {methods.map((method) => {
                    const Icon = method.icon
                    const isSelected = selectedMethod === method.id

                    return (
                        <button
                            key={method.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(method.id)}
                            className={`
                                flex items-center gap-3 p-3 rounded-lg border text-left transition
                                ${isSelected
                                    ? 'border-zinc-400 bg-zinc-100'
                                    : 'border-border hover:bg-zinc-50'
                                }
                                ${disabled && 'opacity-50 cursor-not-allowed'}
                            `}
                        >
                            <div
                                className={`
                                    p-2 rounded-md
                                    ${isSelected
                                        ? 'bg-zinc-800 text-white'
                                        : 'bg-zinc-100 text-zinc-600'
                                    }
                                `}
                            >
                                <Icon size={18} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {method.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {method.description}
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
