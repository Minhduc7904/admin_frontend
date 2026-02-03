import { useState } from 'react'
import { Youtube, EyeOff } from 'lucide-react'
import { Input } from './Input'
import { YoutubePreview } from '../../../features/media/components/previews/YoutubePreview'

export const YoutubeInput = ({
    label = 'Link Youtube',
    name,
    value,
    onChange,
    placeholder = 'https://youtube.com/watch?v=...',
    error,
    helperText,
    required = false,
    disabled = false,
}) => {
    const [showPreview, setShowPreview] = useState(false)
    const hasValidUrl = value && value.trim().length > 0

    return (
        <div className="space-y-2">
            {/* Row: input + button */}
            <div className="flex items-end gap-2">
                {/* Input chiếm hết chiều ngang */}
                <div className="flex-1">
                    <Input
                        label={label}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        error={error}
                        helperText={helperText}
                        required={required}
                        disabled={disabled}
                    />
                </div>

                {/* Button Youtube */}
                {hasValidUrl && (
                    <button
                        type="button"
                        onClick={() => setShowPreview((v) => !v)}
                        disabled={disabled}
                        className={`
              h-10 w-10
              flex items-center justify-center
              rounded-md transition-colors
              ${disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'hover:bg-gray-100 active:bg-gray-200'}
              ${showPreview
                                ? 'text-red-600'
                                : 'text-gray-500 hover:text-red-600'}
            `}
                        title={showPreview ? 'Ẩn xem trước' : 'Xem trước video'}
                    >
                        {showPreview ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Youtube className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Preview */}
            {showPreview && hasValidUrl && (
                <div className="mt-3 animate-fadeIn">
                    <YoutubePreview youtubeUrl={value} />
                </div>
            )}
        </div>
    )
}
