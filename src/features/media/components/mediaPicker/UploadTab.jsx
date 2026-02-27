import { useState, useRef } from 'react'
import { Upload, Check, Video, Music, FileText, File, X } from 'lucide-react'
import { Spinner } from '../../../../shared/components/loading'
import { Button } from '../../../../shared/components'
import { formatFileSize } from '../../utils/media.utils'

const getMediaIcon = (mimeType) => {
    if (!mimeType) return <File size={32} className="text-gray-400" />
    if (mimeType.startsWith('video/'))  return <Video   size={32} className="text-purple-500" />
    if (mimeType.startsWith('audio/'))  return <Music   size={32} className="text-green-500" />
    if (mimeType.includes('pdf') || mimeType.includes('doc') || mimeType.includes('sheet'))
        return <FileText size={32} className="text-orange-500" />
    return <File size={32} className="text-gray-400" />
}

// Card: pending file (before upload)
const PendingFileCard = ({ file, preview, onRemove }) => (
    <div className="relative aspect-square rounded-lg border-2 border-border overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            {preview
                ? <img src={preview} alt={file.name} className="w-full h-full object-cover rounded" />
                : getMediaIcon(file.type)
            }
        </div>
        {onRemove && (
            <button
                onClick={onRemove}
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center"
            >
                <X size={12} className="text-white" />
            </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 truncate">
            {file.name}
        </div>
    </div>
)

// Card: uploaded file (after upload)
const UploadedMediaCard = ({ media, previewUrl }) => (
    <div className="relative aspect-square rounded-lg border-2 border-success bg-success/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            {previewUrl
                ? <img src={previewUrl} alt={media.originalName || media.fileName} className="w-full h-full object-cover rounded" />
                : getMediaIcon(media.mimeType)
            }
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg">
            <Check size={14} className="text-white" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 rounded-b truncate">
            {media.originalName || media.fileName}
        </div>
    </div>
)

export const UploadTab = ({ state, handlers, meta, multiple = false }) => {
    const fileInputRef = useRef(null)

    const {
        pendingFiles,
        pendingPreviews,
        isDragging,
        isUploading,
        uploadProgress,
        uploadedCount,
        totalFiles,
        uploadSuccess,
        uploadedMediaData,
        uploadedMediaList,
    } = state

    const { dragEnter, dragOver, dragLeave, drop, fileChange, upload, reset } = handlers
    const { accept, label, maxSize } = meta

    const handleInputChange = (e) => {
        fileChange(e)
        // reset input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removePending = (idx) => {
        // rebuild without this index — trigger via fake event is not ideal;
        // instead we call reset to clear all (simplest UX)
        reset()
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-4">

                {/* ✅ Success */}
                {uploadSuccess && uploadedMediaData ? (
                    <>
                        <div className="flex items-center gap-3 px-4 py-3 bg-success/10 border border-success/30 rounded-lg">
                            <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center shrink-0">
                                <Check size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-success">Tải lên thành công!</p>
                                <p className="text-xs text-foreground-light">
                                    {multiple && totalFiles > 1
                                        ? `Đã tải lên ${uploadedMediaList.length} file`
                                        : (uploadedMediaData.originalName || uploadedMediaData.fileName)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {multiple && uploadedMediaList.length > 0
                                ? uploadedMediaList.map((media, idx) => (
                                    <UploadedMediaCard key={media.mediaId ?? idx} media={media} previewUrl={media._localPreview} />
                                ))
                                : <UploadedMediaCard media={uploadedMediaData} previewUrl={uploadedMediaData._localPreview} />
                            }
                        </div>

                        <Button variant="outline" className="w-full" onClick={reset}>
                            <Upload size={16} />
                            Tải lên file khác
                        </Button>
                    </>

                ) : isUploading ? (
                /* ⏳ Uploading */
                    <div className="border-2 border-dashed border-border rounded-lg p-10 text-center space-y-4">
                        <Spinner size="xl" className="mx-auto text-info" />
                        <p className="text-base font-medium">
                            {multiple && totalFiles > 1
                                ? `Đang tải lên... ${uploadedCount}/${totalFiles}`
                                : `Đang tải lên... ${uploadProgress}%`}
                        </p>
                        {pendingFiles[0] && (
                            <p className="text-sm text-foreground-light truncate">{pendingFiles[0].name}</p>
                        )}
                        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                            <div
                                className="h-full bg-info transition-all duration-200"
                                style={{ width: `${multiple && totalFiles > 1 ? Math.round((uploadedCount / totalFiles) * 100) : uploadProgress}%` }}
                            />
                        </div>
                    </div>

                ) : pendingFiles.length > 0 ? (
                /* 📄 Files selected, ready to upload */
                    <>
                        {/* File preview grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {pendingFiles.map((file, idx) => (
                                <PendingFileCard
                                    key={idx}
                                    file={file}
                                    preview={pendingPreviews[idx]}
                                    onRemove={pendingFiles.length > 1 ? () => removePending(idx) : undefined}
                                />
                            ))}
                        </div>

                        {/* File info (single) */}
                        {!multiple || pendingFiles.length === 1 ? (
                            <div className="text-sm text-foreground-light">
                                {pendingFiles[0].name} &bull; {formatFileSize(pendingFiles[0].size)}
                            </div>
                        ) : (
                            <div className="text-sm text-foreground-light">
                                {pendingFiles.length} file đã chọn
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={reset}>
                                Chọn lại
                            </Button>
                            <Button className="flex-1" onClick={upload}>
                                <Upload size={16} />
                                Tải lên{pendingFiles.length > 1 ? ` (${pendingFiles.length} file)` : ''}
                            </Button>
                        </div>
                    </>

                ) : (
                /* 📂 Drop zone */
                    <div
                        onDragEnter={dragEnter}
                        onDragOver={dragOver}
                        onDragLeave={dragLeave}
                        onDrop={drop}
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all
                            ${isDragging ? 'border-info bg-info/5' : 'border-border hover:border-info/50 hover:bg-gray-50'}`}
                    >
                        <Upload className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                        <p className="text-base font-medium mb-1">Kéo thả file vào đây</p>
                        <p className="text-sm text-foreground-light mb-4">hoặc</p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            className="hidden"
                            onChange={handleInputChange}
                        />
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload size={16} />
                            Chọn file{multiple ? ' (nhiều file)' : ''}
                        </Button>

                        <p className="text-xs text-foreground-light mt-4">
                            Định dạng: {label}. Tối đa {maxSize}MB{multiple ? ' mỗi file' : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
