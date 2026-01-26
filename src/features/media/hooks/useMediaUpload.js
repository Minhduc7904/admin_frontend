import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getPresignedUploadUrlAsync,
    postUploadCompleteAsync,
    selectMediaLoadingGetPresignedUrl,
    selectMediaLoadingCompleteUpload,
} from '../store/mediaSlice'

export const useMediaUpload = ({ type, folderId, onUploaded }) => {
    const dispatch = useDispatch()

    const loadingPresignedUrl = useSelector(selectMediaLoadingGetPresignedUrl)
    const loadingCompleteUpload = useSelector(selectMediaLoadingCompleteUpload)
    const loadingUpload = loadingPresignedUrl || loadingCompleteUpload

    const [uploadFile, setUploadFile] = useState(null)
    const [uploadPreview, setUploadPreview] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [uploadedMediaData, setUploadedMediaData] = useState(null)

    const acceptedTypes = useMemo(() => {
        switch (type) {
            case 'IMAGE': return { accept: 'image/*', maxSize: 5, label: 'ảnh' }
            case 'VIDEO': return { accept: 'video/*', maxSize: 100, label: 'video' }
            case 'AUDIO': return { accept: 'audio/*', maxSize: 20, label: 'audio' }
            case 'DOCUMENT':
                return { accept: '.pdf,.doc,.docx,.xls,.xlsx', maxSize: 10, label: 'tài liệu' }
            default:
                return { accept: '*/*', maxSize: 100, label: 'tất cả' }
        }
    }, [type])

    const processFile = async (file) => {
        if (file.size > acceptedTypes.maxSize * 1024 * 1024) {
            alert(`File vượt quá ${acceptedTypes.maxSize}MB`)
            return
        }

        setUploadFile(file)
        setUploadSuccess(false)
        setUploadedMediaData(null)

        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => setUploadPreview(reader.result)
            reader.readAsDataURL(file)
        } else {
            setUploadPreview(null)
        }

        const presigned = await dispatch(
            getPresignedUploadUrlAsync({
                originalFilename: file.name,
                mimeType: file.type,
                fileSize: file.size,
                type,
                folderId,
            })
        ).unwrap()

        await fetch(presigned.data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
        })

        const completed = await dispatch(
            postUploadCompleteAsync({
                mediaId: presigned.data.mediaId,
                uploadedSize: file.size,
            })
        ).unwrap()

        setUploadSuccess(true)
        setUploadedMediaData(completed.data)
        onUploaded?.(completed.data)
    }

    return {
        state: {
            uploadFile,
            uploadPreview,
            uploadSuccess,
            uploadedMediaData,
            isDragging,
            loadingUpload,
        },
        handlers: {
            fileChange: e => e.target.files[0] && processFile(e.target.files[0]),
            dragEnter: e => (e.preventDefault(), setIsDragging(true)),
            dragLeave: e => (e.preventDefault(), setIsDragging(false)),
            dragOver: e => e.preventDefault(),
            drop: e => {
                e.preventDefault()
                setIsDragging(false)
                e.dataTransfer.files[0] && processFile(e.dataTransfer.files[0])
            },
            reset: () => {
                setUploadFile(null)
                setUploadPreview(null)
                setUploadSuccess(false)
                setUploadedMediaData(null)
            },
        },
        acceptedTypes,
    }
}
