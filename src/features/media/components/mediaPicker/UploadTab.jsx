import { Upload, Check } from 'lucide-react'
import { Spinner } from '../../../../shared/components/loading'
import { Button } from '../../../../shared/components'

export const UploadTab = ({ state, handlers, meta }) => {
    const {
        uploadSuccess,
        uploadedMediaData,
        loadingUpload,
        isDragging,
        uploadFile,
        uploadPreview,
    } = state

    const {
        dragEnter,
        dragOver,
        dragLeave,
        drop,
        fileChange,
        reset,
    } = handlers

    const { accept, label, maxSize } = meta

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">

                {/* ✅ Upload success */}
                {uploadSuccess && uploadedMediaData ? (
                    <div className="space-y-6">
                        <div className="border-2 border-success rounded-lg p-6 bg-success/5 text-center">
                            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={24} className="text-white" />
                            </div>

                            <p className="text-lg font-medium mb-1">
                                Tải lên thành công!
                            </p>

                            <p className="text-sm text-foreground-light">
                                {uploadedMediaData.fileName ||
                                    uploadedMediaData.originalName}
                            </p>
                        </div>

                        {/* Preview ảnh */}
                        {uploadPreview && (
                            <div className="border border-border rounded-lg p-4">
                                <img
                                    src={uploadPreview}
                                    alt="Preview"
                                    className="max-w-full max-h-96 mx-auto rounded"
                                />
                            </div>
                        )}
                        

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={reset}
                        >
                            <Upload size={18} />
                            Tải lên file khác
                        </Button>
                    </div>
                ) : !loadingUpload ? (
                    /* Upload form */
                    <div
                        onDragEnter={dragEnter}
                        onDragOver={dragOver}
                        onDragLeave={dragLeave}
                        onDrop={drop}
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all
              ${isDragging
                                ? 'border-info bg-info/5'
                                : 'border-border hover:border-info/50 hover:bg-gray-50'
                            }
            `}
                    >
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />

                        <p className="text-lg font-medium mb-2">
                            Kéo thả file vào đây
                        </p>

                        <p className="text-sm text-foreground-light mb-4">
                            hoặc
                        </p>

                        <label className="inline-block">
                            <input
                                type="file"
                                accept={accept}
                                onChange={fileChange}
                                className="hidden"
                            />
                            <span className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-info text-white rounded">
                                <Upload size={18} />
                                Chọn file từ máy tính
                            </span>
                        </label>

                        <p className="text-xs text-foreground-light mt-4">
                            Định dạng: {label}. Tối đa {maxSize}MB
                        </p>
                    </div>
                ) : (
                    /* Uploading */
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                        <Spinner size="xl" className="mx-auto mb-4 text-info" />
                        <p className="text-lg font-medium mb-2">
                            Đang tải lên...
                        </p>
                        {uploadFile && (
                            <p className="text-sm text-foreground-light">
                                {uploadFile.name}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
