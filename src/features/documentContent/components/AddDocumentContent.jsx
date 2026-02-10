// src/features/documentContent/components/AddDocumentContent.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Textarea } from '../../../shared/components'
import { FileText } from 'lucide-react'
import {
    createDocumentContentAsync,
    selectDocumentContentLoadingCreate,
} from '../store/documentContentSlice'
import { MediaPickerModal } from '../../media/components'

export const AddDocumentContent = ({ onClose, learningItemId, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingCreate = useSelector(selectDocumentContentLoadingCreate)
    const [errors, setErrors] = useState({})

    const [content, setContent] = useState('')
    const [mediaIds, setMediaIds] = useState([])
    const [openMediaPicker, setOpenMediaPicker] = useState(false)

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
            learningItemId: Number(learningItemId),
            content: content.trim(),
        }

        if (mediaIds && mediaIds.length > 0) {
            data.mediaIds = mediaIds
        }

        try {
            await dispatch(createDocumentContentAsync(data)).unwrap()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating document content:', error)
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
                        disabled={loadingCreate}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        loading={loadingCreate}
                        disabled={loadingCreate}
                    >
                        Tạo tài liệu
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
