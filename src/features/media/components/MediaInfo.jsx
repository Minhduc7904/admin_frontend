import { Calendar, User, HardDrive, FileType, Database, Key, RefreshCw, Image as ImageIcon, Link2 } from 'lucide-react';

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const MediaInfo = ({ media }) => {
    if (!media) return null;

    return (
        <div className="space-y-4">
            {/* Media ID */}
            <div>
                <label className="block text-sm font-medium text-foreground-light mb-1">
                    <Key size={14} className="inline mr-1" />
                    Media ID
                </label>
                <p className="text-sm text-foreground font-mono">{media.mediaId}</p>
            </div>

            {/* Original Name */}
            <div>
                <label className="block text-sm font-medium text-foreground-light mb-1">
                    Tên file gốc
                </label>
                <p className="text-sm text-foreground break-all">{media.originalName}</p>
            </div>

            {/* File Name */}
            <div>
                <label className="block text-sm font-medium text-foreground-light mb-1">
                    Tên file hệ thống
                </label>
                <p className="text-sm text-foreground font-mono text-xs break-all">{media.fileName}</p>
            </div>

            {media.description && (
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        Mô tả
                    </label>
                    <p className="text-sm text-foreground">{media.description}</p>
                </div>
            )}

            {media.alt && (
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        Alt Text
                    </label>
                    <p className="text-sm text-foreground">{media.alt}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <HardDrive size={14} className="inline mr-1" />
                        Kích thước
                    </label>
                    <p className="text-sm text-foreground">{formatFileSize(media.fileSize)}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <ImageIcon size={14} className="inline mr-1" />
                        Loại
                    </label>
                    <p className="text-sm text-foreground">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            media.type === 'IMAGE' ? 'bg-blue-100 text-blue-700' :
                            media.type === 'VIDEO' ? 'bg-purple-100 text-purple-700' :
                            media.type === 'AUDIO' ? 'bg-green-100 text-green-700' :
                            media.type === 'DOCUMENT' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {media.type}
                        </span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <FileType size={14} className="inline mr-1" />
                        MIME Type
                    </label>
                    <p className="text-sm text-foreground font-mono text-xs">{media.mimeType}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <RefreshCw size={14} className="inline mr-1" />
                        Trạng thái
                    </label>
                    <p className="text-sm text-foreground">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            media.status === 'READY' ? 'bg-green-100 text-green-700' :
                            media.status === 'UPLOADING' ? 'bg-blue-100 text-blue-700' :
                            media.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {media.status}
                        </span>
                    </p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground-light mb-1">
                    <Database size={14} className="inline mr-1" />
                    Bucket
                </label>
                <p className="text-sm text-foreground font-mono text-xs">{media.bucketName}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground-light mb-1">
                    Object Key
                </label>
                <p className="text-sm text-foreground font-mono text-xs break-all bg-gray-50 p-2 rounded border border-border">
                    {media.objectKey}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <Calendar size={14} className="inline mr-1" />
                        Ngày tải lên
                    </label>
                    <p className="text-sm text-foreground">{formatDate(media.createdAt)}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <Calendar size={14} className="inline mr-1" />
                        Cập nhật lần cuối
                    </label>
                    <p className="text-sm text-foreground">{formatDate(media.updatedAt)}</p>
                </div>
            </div>

            {media.uploader && (
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <User size={14} className="inline mr-1" />
                        Người tải lên (ID: {media.uploadedBy})
                    </label>
                    <p className="text-sm text-foreground">
                        {media.uploader.firstName} {media.uploader.lastName} (@{media.uploader.username})
                    </p>
                </div>
            )}

            {!media.uploader && media.uploadedBy && (
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-1">
                        <User size={14} className="inline mr-1" />
                        ID người tải lên
                    </label>
                    <p className="text-sm text-foreground font-mono">{media.uploadedBy}</p>
                </div>
            )}

            {/* Media Usages */}
            {media.usages && media.usages.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-foreground-light mb-2">
                        <Link2 size={14} className="inline mr-1" />
                        Sử dụng tại ({media.usages.length})
                    </label>
                    <div className="space-y-2">
                        {media.usages.map((usage) => (
                            <div
                                key={usage.usageId}
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-sm border border-border"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                            {usage.entityType}
                                        </span>
                                        {usage.fieldName && (
                                            <span className="text-xs text-foreground-light">
                                                • {usage.fieldName}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground">
                                        ID: <span className="font-mono">{usage.entityId}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                                                usage.visibility === 'PUBLIC'
                                                    ? 'bg-green-100 text-green-700'
                                                    : usage.visibility === 'PRIVATE'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}
                                        >
                                            {usage.visibility}
                                        </span>
                                        <span className="text-xs text-foreground-light">
                                            {formatDate(usage.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {media.usages && media.usages.length === 0 && (
                <div className="text-center py-4 text-sm text-foreground-light bg-gray-50 rounded-sm border border-border">
                    <Link2 size={16} className="inline mr-1" />
                    Media chưa được sử dụng ở đâu
                </div>
            )}
        </div>
    );
};
