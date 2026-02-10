// src/features/videoContent/components/EditVideoContent.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Textarea } from '../../../shared/components'
import { FileVideo } from 'lucide-react'
import {
    updateVideoContentAsync,
    selectVideoContentLoadingUpdate,
} from '../store/videoContentSlice'
import { MediaPickerModal } from '../../media/components'

export const EditVideoContent = ({ onClose, videoContent, onSuccess }) => {
    const dispatch = useDispatch()
    const loadingUpdate = useSelector(selectVideoContentLoadingUpdate)
    const [errors, setErrors] = useState({})

    const [content, setContent] = useState(videoContent?.content || '')
    const [mediaId, setMediaId] = useState(null)
    const [openMediaPicker, setOpenMediaPicker] = useState(false)

    useEffect(() => {
        if (videoContent?.mediaFile) {
            setMediaId(videoContent.mediaFile.mediaId)
        }
    }, [videoContent])

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

        if (mediaId) {
            data.mediaId = mediaId
        }

        try {
            await dispatch(updateVideoContentAsync({
                id: videoContent.videoContentId,
                data
            })).unwrap()
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error updating video content:', error)
        }
    }

    const handleMediaSelect = (selectedMediaId) => {
        setMediaId(selectedMediaId)
        setOpenMediaPicker(false)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
                    <Textarea
                        error={errors.content}
                        label="Nội dung video"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Nhập URL video hoặc mô tả..."
                        rows={8}
                        required
                    />

                    {/* Media Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            File video
                        </label>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenMediaPicker(true)}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <FileVideo size={18} />
                            {mediaId ? 'Đã chọn 1 video' : 'Chọn file video'}
                        </Button>
                        {mediaId && (
                            <p className="text-xs text-success flex items-center gap-1">
                                ✓ Đã chọn file video
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
                selectedMediaId={mediaId}
                title="Chọn file video"
                multiple={false}
            />
        </>
    )
}
