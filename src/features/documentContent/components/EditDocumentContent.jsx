// src/features/documentContent/components/EditDocumentContent.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Textarea } from '../../../shared/components'
import { FileText } from 'lucide-react'
import {
    updateDocumentContentAsync,
    selectDocumentContentLoadingUpdate,
} from '../store/documentContentSlice'
import { MediaPickerModal } from '../../media/components'

export const EditDocumentContent = ({ onClose, documentContent, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectDocumentContentLoadingUpdate)
    const [errors, setErrors] = useState({})

    const [content, setContent] = useState(documentContent?.content || '')
    const [mediaIds, setMediaIds] = useState([])
    const [openMediaPicker, setOpenMediaPicker] = useState(false)

    useEffect(() => {
        if (documentContent?.mediaFiles) {
            setMediaIds(documentContent.mediaFiles.map(m => m.mediaId))
        }
    }, [documentContent])

    const validateForm = (content) => {
        const errors = {}

        if (!content?.trim()) {
            errors.content = 'Nội dung không được để trống'
        } else if (content.trim().length < 10) {
            errors.content = 'Nội dung phải có ít nhất 10 ký tự'
        }

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm(content)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const data = {
            content: content.trim(),
        }

        if (mediaIds && mediaIds.length > 0) {
            data.mediaIds = mediaIds
        }

        try {
            await dispatch(updateDocumentContentAsync({
                id: documentContent.documentContentId,
                data
            })).unwrap()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating document content:', error)
        }
    }

    const handleMediaSelect = (selectedMediaIds) => {
        setMediaIds(selectedMediaIds)
        setOpenMediaPicker(false)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                    <Textarea
                        error={errors.content}
                        label="Nội dung tài liệu"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Nhập nội dung tài liệu..."
                        rows={8}
                        required
                    />

                    {/* Media Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            File tài liệu (Ảnh/PDF/Word...)
                        </label>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenMediaPicker(true)}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <FileText size={18} />
                            {mediaIds.length > 0 ? `Đã chọn ${mediaIds.length} file` : 'Chọn file tài liệu'}
                        </Button>
                        {mediaIds.length > 0 && (
                            <p className="text-xs text-success flex items-center gap-1">
                                ✓ Đã chọn {mediaIds.length} file
                            </p>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loadingUpdate}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        loading={loadingUpdate}
                        disabled={loadingUpdate}
                    >
                        Cập nhật
                    </Button>
                </div>
            </form>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={openMediaPicker}
                onClose={() => setOpenMediaPicker(false)}
                onSave={handleMediaSelect}
                selectedMediaId={mediaIds}
                title="Chọn file tài liệu"
                multiple={true}
            />
        </>
    )
}
