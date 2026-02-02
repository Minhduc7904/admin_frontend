import { useState, useEffect, useCallback, memo } from 'react'
import { useDispatch } from 'react-redux'
import { Edit, Eye, Image as ImageIcon } from 'lucide-react'
import { Modal, Button } from '../ui'
import { MarkdownEditor } from './MarkdownEditor'
import { MarkdownRenderer } from './MarkdownRenderer'
import { useDebounce } from '../../hooks/useDebounce'
import { MediaPickerModal } from '../../../features/media/components/mediaPicker/MediaPickerModal'
import { getMyViewUrlAsync } from '../../../features/media/store/mediaSlice'
import './markdown-editor-modal.css'

/* ------------------------------------------------------------
 * Preview Pane (memoized – cực quan trọng)
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
export const MarkdownEditorModal = ({
  isOpen,
  onClose,
  initialValue = '',
  onSave,
  isSaving = false,
}) => {
  /* ----------------------------------------------------------
   * State
   * ---------------------------------------------------------- */
  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(null)

  /* ----------------------------------------------------------
   * Sync value when modal opens
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue)
    }
  }, [isOpen, initialValue])

  /* ----------------------------------------------------------
   * Debounce preview (KHÔNG debounce editor)
   * ---------------------------------------------------------- */
  const debouncedValue = useDebounce(value, 1000)

  /* ----------------------------------------------------------
   * Detect typing (để tạm dừng preview)
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (!value) return
    setIsTyping(true)
    const t = setTimeout(() => setIsTyping(false), 600)
    return () => clearTimeout(t)
  }, [value])

  /* ----------------------------------------------------------
   * Stable handlers
   * ---------------------------------------------------------- */
  const handleEditorChange = useCallback((next) => {
    setValue(next)
  }, [])

  const handleSave = useCallback(async () => {
    await onSave?.(value)
  }, [onSave, value])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleOpenMediaPicker = useCallback(() => {
    // Get current cursor position from textarea
    const textarea = document.querySelector('.w-md-editor-text-input')
    if (textarea) {
      setCursorPosition(textarea.selectionStart)
    }
    setIsMediaPickerOpen(true)
  }, [])

  const handleMediaSelect = useCallback(async (mediaId) => {
    try {
      // Get view URL
      const result = await dispatch(getMyViewUrlAsync({ id: mediaId, expiry: 3600 })).unwrap()
      const viewUrl = result.data.viewUrl

      // Insert markdown image syntax
      const imageMarkdown = `![media:${mediaId}](${viewUrl})`

      // Insert at cursor position or append
      if (cursorPosition !== null) {
        const before = value.substring(0, cursorPosition)
        const after = value.substring(cursorPosition)
        setValue(before + imageMarkdown + after)
      } else {
        setValue(value + '\n' + imageMarkdown)
      }

      setIsMediaPickerOpen(false)
      setCursorPosition(null)
    } catch (error) {
      console.error('Error inserting media:', error)
    }
  }, [dispatch, value, cursorPosition])

  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Chỉnh sửa nội dung Markdown"
      size="max"
    >
      <div className="flex flex-col h-[80vh]">
        {/* ---------------- Split View ---------------- */}
        <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
          {/* ================= Editor ================= */}
          <div className="flex flex-col border rounded overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Markdown Editor
                <button
                  onClick={handleOpenMediaPicker}
                  className="ml-auto p-1.5 hover:bg-gray-200 rounded text-blue-600 hover:text-blue-700 transition-colors"
                  title="Chèn hình ảnh"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </h4>
            </div>

            <div className="flex-1 overflow-hidden">
              <MarkdownEditor
                value={value}
                onChange={handleEditorChange}
                editable
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

            {/* 🚀 Chỉ render preview khi user dừng gõ */}
            {!isTyping && <PreviewPane content={debouncedValue} />}
          </div>
        </div>

        {/* ---------------- Info ---------------- */}
        <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 mt-4">
          <p className="text-xs text-blue-800">
            <strong>Lưu ý:</strong> Markdown được lưu nguyên bản.
            Cú pháp hình ảnh <code>![alt](media:123)</code> sẽ được giữ nguyên.
          </p>
        </div>

        {/* ---------------- Actions ---------------- */}
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Hủy
          </Button>

          <Button
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSave={handleMediaSelect}
        title="Chọn hình ảnh"
        type="IMAGE"
      />
    </Modal>
  )
}
