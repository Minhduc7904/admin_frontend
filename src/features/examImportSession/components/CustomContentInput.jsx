import { useState } from 'react'
import { Edit } from 'lucide-react'
import { ViewModeToggle, MarkdownRenderer } from '../../../shared/components'

export const CustomContentInput = ({
    value,
    onChange,
    disabled = false,
}) => {
    const [viewMode, setViewMode] = useState('text')
    const [isEditing, setIsEditing] = useState(!value)

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">
                    Nội dung tùy chỉnh
                </h3>

                <div className="flex items-center gap-2">
                    {!isEditing && value && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(true)
                                setViewMode('text')
                            }}
                            disabled={disabled}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium
                                       text-zinc-700 hover:bg-zinc-100 rounded-lg transition
                                       disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Edit className="w-3 h-3" />
                            Chỉnh sửa
                        </button>
                    )}

                    {value && (
                        <ViewModeToggle
                            viewMode={viewMode}
                            onChange={setViewMode}
                        />
                    )}
                </div>
            </div>

            {/* Editor */}
            {isEditing ? (
                <div className="space-y-2">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder="Nhập nội dung markdown..."
                        className="w-full h-80 px-4 py-3 text-sm font-mono
                                   border border-border rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-zinc-300
                                   resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <div className="flex items-center justify-between">
                        <span className={`text-xs px-1 ${
                            (value?.length || 0) > 15000 
                                ? 'text-red-600 font-medium' 
                                : 'text-foreground-light'
                        }`}>
                            {value?.length || 0} / 15,000 ký tự
                        </span>
                        {value && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false)
                                    setViewMode('preview')
                                }}
                                className="px-4 py-2 text-sm font-medium
                                           text-white bg-zinc-800 hover:bg-zinc-700
                                           rounded-lg transition"
                            >
                                Xong
                            </button>
                        )}
                    </div>

                    {(value?.length || 0) > 15000 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-xs text-red-700">
                                ⚠️ Nội dung vượt quá giới hạn. Chỉ cho phép tách tối đa 15,000 ký tự.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                /* Preview */
                <>
                    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 max-h-80 overflow-y-auto">
                        {value ? (
                            viewMode === 'preview' ? (
                                <MarkdownRenderer content={value} className="text-sm" />
                            ) : (
                                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                                    {value}
                                </pre>
                            )
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-14 h-14 bg-zinc-100 rounded-full
                                                flex items-center justify-center mx-auto mb-3">
                                    <Edit className="w-6 h-6 text-zinc-500" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Chưa có nội dung tùy chỉnh
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Character count */}
                    {value && (
                        <div className="space-y-2">
                            <div className={`text-xs px-1 ${
                                value.length > 15000 
                                    ? 'text-red-600 font-medium' 
                                    : 'text-foreground-light'
                            }`}>
                                {value.length} / 15,000 ký tự
                            </div>
                            {value.length > 15000 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                    <p className="text-xs text-red-700">
                                        ⚠️ Nội dung vượt quá giới hạn. Chỉ cho phép tách tối đa 15,000 ký tự.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Info */}
            {isEditing && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
                    <p className="text-xs text-zinc-600 leading-relaxed">
                        Hỗ trợ <b>Markdown</b>.
                        Ví dụ: <code className="px-1 bg-zinc-100 rounded">**bold**</code>,
                        <code className="px-1 bg-zinc-100 rounded ml-1">![media:123](media:123)</code>
                    </p>
                </div>
            )}
        </div>
    )
}
