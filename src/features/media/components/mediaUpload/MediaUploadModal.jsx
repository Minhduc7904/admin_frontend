import {
    Upload,
    X,
    AlertCircle,
    File,
    Image as ImageIcon,
    Video,
    Music,
    FileText,
} from 'lucide-react'
import { Button } from '../../../../shared/components/ui'
import { Input, Textarea } from '../../../../shared/components/ui'
import { formatFileSize } from '../../utils/media.utils'
import { useMediaUploadModal } from '../../hooks/useMediaUploadModal'

/**
 * Render icon theo loại file
 */
const FileIcon = ({ type }) => {
    switch (type) {
        case 'IMAGE':
            return <ImageIcon className="text-blue-500" size={48} />
        case 'VIDEO':
            return <Video className="text-purple-500" size={48} />
        case 'AUDIO':
            return <Music className="text-green-500" size={48} />
        case 'DOCUMENT':
            return <FileText className="text-orange-500" size={48} />
        default:
            return <File className="text-gray-500" size={48} />
    }
}

export const MediaUploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    const { state, refs, handlers } = useMediaUploadModal({ onUpload, onClose })

    if (!isOpen) return null

    const {
        file,
        preview,
        description,
        alt,
        dragActive,
        error,
        fileType,
    } = state

    const { fileInputRef } = refs
    const {
        setDescription,
        setAlt,
        setDragActive,
        handleFile,
        handleSubmit,
        handleClose,
    } = handlers

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl mx-4">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">
                        Tải lên Media
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-foreground-light hover:text-foreground"
                    >
                        <X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">

                    {/* Drop zone */}
                    {!file && (
                        <div
                            className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${dragActive
                                    ? 'border-info bg-info/5'
                                    : 'border-border hover:border-info'
                                }`}
                            onDragEnter={() => setDragActive(true)}
                            onDragLeave={() => setDragActive(false)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                setDragActive(false)
                                e.dataTransfer.files?.[0] &&
                                    handleFile(e.dataTransfer.files[0])
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={(e) =>
                                    e.target.files?.[0] && handleFile(e.target.files[0])
                                }
                            />

                            <Upload className="mx-auto mb-4 text-foreground-lighter" size={48} />

                            <p className="text-sm text-foreground-light mb-4">
                                Kéo thả file vào đây hoặc
                            </p>

                            <Button onClick={() => fileInputRef.current?.click()}>
                                Chọn file
                            </Button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* File preview */}
                    {file && (
                        <div className="flex gap-4 items-start border border-border rounded-sm p-4">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-sm border"
                                />
                            ) : (
                                <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-sm border">
                                    <FileIcon type={fileType} />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                    {file.name}
                                </p>
                                <p className="text-sm text-foreground-light mt-1">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <Textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nhập mô tả cho file media..."
                        disabled={loading}
                        maxLength={500}
                    />

                    {/* Alt text (chỉ cho IMAGE) */}
                    {fileType === 'IMAGE' && (
                        <Input
                            label="Alt text (văn bản thay thế)"
                            name="alt"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Nhập mô tả ảnh cho SEO..."
                            disabled={loading}
                            helperText="Giúp cải thiện SEO và hỗ trợ người dùng khi ảnh không tải được"
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-border">
                    <Button variant="outline" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!file || loading}>
                        {loading ? 'Đang tải lên...' : 'Tải lên'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
