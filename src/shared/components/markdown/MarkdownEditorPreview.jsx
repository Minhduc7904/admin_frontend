import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useDispatch } from 'react-redux'
import { Edit, Eye, Image as ImageIcon, Upload, Loader2, SpellCheck2 } from 'lucide-react'
import { MarkdownEditor } from './MarkdownEditor'
import { MarkdownRenderer } from './MarkdownRenderer'
import { useDebounce } from '../../hooks/useDebounce'
import { MediaPickerModal } from '../../../features/media/components/mediaPicker/MediaPickerModal'
import { getMyViewUrlAsync, uploadMediaAsync } from '../../../features/media/store/mediaSlice'
import { fixMarkdownSpellingAsync } from '../../../features/markdown/store/markdownSlice'

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
    const [isUploading, setIsUploading] = useState(false)
    const [isFixingSpelling, setIsFixingSpelling] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const dragCounterRef = useRef(0)

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
     * Helpers
     * ---------------------------------------------------------- */
    const getTextarea = () => document.querySelector('.w-md-editor-text-input')

    const insertMarkdown = useCallback(
        (imageMarkdown, insertAt) => {
            setValue(prev => {
                const base = prev || ''
                const next = insertAt !== null && insertAt !== undefined
                    ? base.slice(0, insertAt) + imageMarkdown + base.slice(insertAt)
                    : base + '\n' + imageMarkdown
                onChange?.(next)
                return next
            })
        },
        [onChange],
    )

    /* ----------------------------------------------------------
     * Upload a File and insert markdown at cursor / end
     * ---------------------------------------------------------- */
    const uploadImageFile = useCallback(
        async (file, insertAt) => {
            if (!file || !file.type.startsWith('image/')) return

            setIsUploading(true)
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('type', 'IMAGE')

                const uploadResult = await dispatch(uploadMediaAsync(formData)).unwrap()
                const mediaId = uploadResult.data.mediaId

                const viewResult = await dispatch(
                    getMyViewUrlAsync({ id: mediaId, expiry: 3600 }),
                ).unwrap()

                const viewUrl = viewResult.data.viewUrl
                const imageMarkdown = `![media:${mediaId}](${viewUrl})`
                insertMarkdown(imageMarkdown, insertAt)
            } catch {
                // errors handled by thunk toast
            } finally {
                setIsUploading(false)
            }
        },
        [dispatch, insertMarkdown],
    )

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

    const handleFixSpelling = useCallback(async () => {
        if (!value || !editable) return
        setIsFixingSpelling(true)
        try {
            const result = await dispatch(fixMarkdownSpellingAsync(value)).unwrap()
            const fixed = result.data.fixedContent
            setValue(fixed)
            onChange?.(fixed)
        } catch {
            // errors handled by thunk toast
        } finally {
            setIsFixingSpelling(false)
        }
    }, [dispatch, value, editable, onChange])

    const handleOpenMediaPicker = useCallback(() => {
        const textarea = getTextarea()
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
     * Paste (Ctrl+V) — only intercept image files
     * ---------------------------------------------------------- */
    const handlePaste = useCallback(
        (e) => {
            if (!editable) return
            const items = Array.from(e.clipboardData?.items ?? [])
            const imageItem = items.find(i => i.kind === 'file' && i.type.startsWith('image/'))
            if (!imageItem) return

            e.preventDefault()
            const file = imageItem.getAsFile()
            const textarea = getTextarea()
            const insertAt = textarea ? textarea.selectionStart : null
            uploadImageFile(file, insertAt)
        },
        [editable, uploadImageFile],
    )

    /* ----------------------------------------------------------
     * Drag & Drop
     * ---------------------------------------------------------- */
    const handleDragEnter = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounterRef.current += 1
        if (dragCounterRef.current === 1) setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounterRef.current -= 1
        if (dragCounterRef.current === 0) setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault()
            e.stopPropagation()
            dragCounterRef.current = 0
            setIsDragging(false)

            if (!editable) return
            const files = Array.from(e.dataTransfer?.files ?? [])
            const imageFile = files.find(f => f.type.startsWith('image/'))
            if (!imageFile) return
            uploadImageFile(imageFile, null)
        },
        [editable, uploadImageFile],
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
        <div
            className="flex flex-col relative"
            style={{ height }}
            onPaste={handlePaste}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Drag overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3
                                bg-blue-50/90 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none">
                    <Upload className="w-10 h-10 text-blue-500" />
                    <p className="text-sm font-semibold text-blue-600">Thả ảnh để tải lên</p>
                </div>
            )}

            {/* Upload overlay */}
            {isUploading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3
                                bg-white/80 rounded-lg pointer-events-none">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-sm font-medium text-blue-600">Đang tải ảnh lên…</p>
                </div>
            )}

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
                                <div className="ml-auto flex items-center gap-1">
                                    <button
                                        type='button'
                                        onClick={handleFixSpelling}
                                        disabled={isFixingSpelling || !value}
                                        className="p-1.5 hover:bg-gray-200 rounded text-violet-600 hover:text-violet-700
                                                   disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Sửa lỗi chính tả"
                                    >
                                        {isFixingSpelling
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <SpellCheck2 className="w-4 h-4" />}
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleOpenMediaPicker}
                                        className="p-1.5 hover:bg-gray-200 rounded text-blue-600 hover:text-blue-700"
                                        title="Chèn hình ảnh"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </h4>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <MarkdownEditor
                            value={value}
                            onChange={handleChange}
                            editable={editable}
                            height="100%"
                            placeholder="Nhập nội dung markdown…"
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
