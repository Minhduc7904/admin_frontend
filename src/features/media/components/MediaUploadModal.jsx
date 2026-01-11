import { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, Video, Music, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

const MEDIA_TYPES = {
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    AUDIO: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
    DOCUMENT: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
};

const getMediaType = (mimeType) => {
    if (MEDIA_TYPES.IMAGE.includes(mimeType)) return 'IMAGE';
    if (MEDIA_TYPES.VIDEO.includes(mimeType)) return 'VIDEO';
    if (MEDIA_TYPES.AUDIO.includes(mimeType)) return 'AUDIO';
    if (MEDIA_TYPES.DOCUMENT.includes(mimeType)) return 'DOCUMENT';
    return 'OTHER';
};

const getFileIcon = (type) => {
    switch (type) {
        case 'IMAGE':
            return <ImageIcon className="text-blue-500" size={48} />;
        case 'VIDEO':
            return <Video className="text-purple-500" size={48} />;
        case 'AUDIO':
            return <Music className="text-green-500" size={48} />;
        case 'DOCUMENT':
            return <FileText className="text-orange-500" size={48} />;
        default:
            return <File className="text-gray-500" size={48} />;
    }
};

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const MediaUploadModal = ({ isOpen, onClose, onUpload, loading }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState('');
    const [alt, setAlt] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = (file) => {
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            setError('Kích thước file không được vượt quá 100MB');
            return false;
        }
        setError(null);
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (!validateFile(file)) {
            return;
        }

        setFile(file);

        // Generate preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Vui lòng chọn file để tải lên');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (description) formData.append('description', description);
        if (alt && file.type.startsWith('image/')) formData.append('alt', alt);

        await onUpload(formData);
        handleClose();
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        setDescription('');
        setAlt('');
        setError(null);
        setDragActive(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    if (!isOpen) return null;

    const fileType = file ? getMediaType(file.type) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-sm flex items-center justify-center">
                            <Upload className="text-primary" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Tải lên Media</h2>
                            <p className="text-sm text-foreground-light mt-0.5">
                                Tải lên hình ảnh, video, audio hoặc tài liệu
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-foreground-light hover:text-foreground transition-colors"
                        disabled={loading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* File Drop Zone */}
                    {!file && (
                        <div
                            className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${dragActive
                                ? 'border-primary bg-primary-light'
                                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleChange}
                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            />
                            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-lg font-medium text-foreground mb-2">
                                Kéo thả file vào đây hoặc
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Chọn file
                            </Button>
                            <p className="text-sm text-foreground-light mt-4">
                                Hỗ trợ: Ảnh, Video, Audio, PDF, Word, Excel, PowerPoint
                            </p>
                            <p className="text-xs text-foreground-light mt-1">
                                Kích thước tối đa: 100MB
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm mb-4">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* File Preview */}
                    {file && (
                        <div className="space-y-4">
                            <div className="border border-border rounded-sm p-4">
                                <div className="flex items-start gap-4">
                                    {/* Preview or Icon */}
                                    <div className="flex-shrink-0">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-24 h-24 object-cover rounded-sm border border-border"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-sm border border-border">
                                                {getFileIcon(fileType)}
                                            </div>
                                        )}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-sm text-foreground-light mt-1">
                                                    {formatFileSize(file.size)} • {file.type}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${fileType === 'IMAGE'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : fileType === 'VIDEO'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : fileType === 'AUDIO'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : fileType === 'DOCUMENT'
                                                                        ? 'bg-orange-100 text-orange-700'
                                                                        : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {fileType}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="text-foreground-light hover:text-danger transition-colors"
                                                disabled={loading}
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        rows={3}
                                        placeholder="Nhập mô tả cho file media..."
                                        disabled={loading}
                                    />
                                </div>

                                {fileType === 'IMAGE' && (
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Alt Text (Văn bản thay thế)
                                        </label>
                                        <input
                                            type="text"
                                            value={alt}
                                            onChange={(e) => setAlt(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Nhập văn bản mô tả ảnh cho SEO..."
                                            disabled={loading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" disabled={!file || loading}>
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    Đang tải lên...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    Tải lên
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
