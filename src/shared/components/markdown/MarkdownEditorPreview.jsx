import { useState, useEffect, useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import { Edit, Eye, Image as ImageIcon } from 'lucide-react'
import { MarkdownEditor } from './MarkdownEditor'
import { MarkdownRenderer } from './MarkdownRenderer'
import { useDebounce } from '../../hooks/useDebounce'
import { MediaPickerModal } from '../../../features/media/components/mediaPicker/MediaPickerModal'
import { getMyViewUrlAsync } from '../../../features/media/store/mediaSlice'

/* ------------------------------------------------------------
 * Preview Pane (memoized)
 * ------------------------------------------------------------ */
const PreviewPane = memo(({ content }) => {
    return (
        <div className="flex-1 overflow-auto bg-white p-4">
            <MarkdownRenderer content={content} className="text-sm" />
        </div>
    )
})

/* ------------------------------------------------------------
 * Main Component
 * ------------------------------------------------------------ */
export const MarkdownEditorPreview = ({
    value: controlledValue,
    onChange,
    height = '70vh',
    editable = true,
    maxLength,
}) => {
    const dispatch = useDispatch()
    const [value, setValue] = useState(controlledValue ?? '')
    const [isTyping, setIsTyping] = useState(false)
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
    const [cursorPosition, setCursorPosition] = useState(null)

    /* ----------------------------------------------------------
     * Sync controlled value
     * ---------------------------------------------------------- */
    useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue)
        }
    }, [controlledValue])

    /* ----------------------------------------------------------
     * Debounce preview
     * ---------------------------------------------------------- */
    const debouncedValue = useDebounce(value, 800)

    /* ----------------------------------------------------------
     * Detect typing
     * ---------------------------------------------------------- */
    useEffect(() => {
        if (!value) return
        setIsTyping(true)
        const t = setTimeout(() => setIsTyping(false), 500)
        return () => clearTimeout(t)
    }, [value])

    /* ----------------------------------------------------------
     * Handlers
     * ---------------------------------------------------------- */
    const handleChange = useCallback(
        (next) => {
            setValue(next)
            onChange?.(next)
        },
        [onChange],
    )

    const handleOpenMediaPicker = useCallback(() => {
        const textarea = document.querySelector('.w-md-editor-text-input')
        if (textarea) {
            setCursorPosition(textarea.selectionStart)
        }
        setIsMediaPickerOpen(true)
    }, [])

    const handleMediaSelect = useCallback(
        async (mediaId) => {
            const result = await dispatch(
                getMyViewUrlAsync({ id: mediaId, expiry: 3600 }),
            ).unwrap()

            const viewUrl = result.data.viewUrl
            const imageMarkdown = `![media:${mediaId}](${viewUrl})`

            const newValue = value && cursorPosition !== null
                ? value.slice(0, cursorPosition) + imageMarkdown + value.slice(cursorPosition)
                : (value || '') + '\n' + imageMarkdown

            setValue(newValue)
            onChange?.(newValue)

            setIsMediaPickerOpen(false)
            setCursorPosition(null)
        },
        [dispatch, cursorPosition, value, onChange],
    )

    /* ----------------------------------------------------------
     * Calculate character count (excluding media markdown)
     * ---------------------------------------------------------- */
    const getCharCountWithoutMedia = useCallback((text) => {
        if (!text) return 0
        // Remove media markdown: ![media:123](url)
        const textWithoutMedia = text.replace(/!\[media:\d+\]\([^)]+\)/g, '')
        return textWithoutMedia.length
    }, [])

    /* ----------------------------------------------------------
     * Render
     * ---------------------------------------------------------- */
    const charCount = getCharCountWithoutMedia(value)
    const isNearLimit = maxLength && charCount > maxLength * 0.9
    const isOverLimit = maxLength && charCount > maxLength

    return (
        <div className="flex flex-col" style={{ height }}>
            <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
                {/* ================= Editor ================= */}
                <div className="flex flex-col border rounded overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <div className="flex items-start flex-col">
                                <div className='flex flex-row items-center gap-2'>
                                    <Edit className="w-4 h-4" />
                                    Markdown Editor
                                </div>
                                {maxLength && (
                                    <span
                                        className={`text-xs font-normal ${isOverLimit
                                            ? 'text-red-600 font-semibold'
                                            : isNearLimit
                                                ? 'text-orange-600'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        {charCount} / {maxLength}
                                    </span>
                                )}
                            </div>
                            {editable && (
                                <button
                                    type='button'
                                    onClick={handleOpenMediaPicker}
                                    className="ml-auto p-1.5 hover:bg-gray-200 rounded text-blue-600 hover:text-blue-700"
                                    title="Chèn hình ảnh"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                            )}
                        </h4>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <MarkdownEditor
                            value={value}
                            onChange={handleChange}
                            editable={editable}
                            height="100%"
                            placeholder="Nhập nội dung markdown..."
                        />
                    </div>
                </div>

                {/* ================= Preview ================= */}
                <div className="flex flex-col border rounded overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                        </h4>
                    </div>

                    {!isTyping && <PreviewPane content={debouncedValue} />}
                </div>
            </div>

            {/* Media Picker */}
            <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSave={handleMediaSelect}
                title="Chọn hình ảnh"
                type="IMAGE"
            />
        </div>
    )
}
