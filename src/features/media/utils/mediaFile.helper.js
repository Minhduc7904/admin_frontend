export const getAcceptedFileTypes = (type) => {
    switch (type) {
        case 'IMAGE':
            return { accept: 'image/*', label: 'ảnh (JPG, PNG, GIF)', maxSize: 5 }
        case 'VIDEO':
            return { accept: 'video/*', label: 'video (MP4, MOV)', maxSize: 100 }
        case 'AUDIO':
            return { accept: 'audio/*', label: 'audio (MP3, WAV)', maxSize: 20 }
        case 'DOCUMENT':
            return {
                accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
                label: 'tài liệu',
                maxSize: 10,
            }
        default:
            return { accept: '*/*', label: 'tất cả định dạng', maxSize: 100 }
    }
}

export const validateFileType = (file, type) => {
    if (!type) return true

    const mime = file.type
    if (type === 'IMAGE') return mime.startsWith('image/')
    if (type === 'VIDEO') return mime.startsWith('video/')
    if (type === 'AUDIO') return mime.startsWith('audio/')
    if (type === 'DOCUMENT')
        return (
            mime.startsWith('application/') ||
            mime.startsWith('text/')
        )

    return true
}
