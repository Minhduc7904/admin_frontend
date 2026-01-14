import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    X,
    Upload,
    Grid3x3,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    Loader2,
    Image as ImageIcon,
    Video,
    Music,
    FileText,
    File,
    Check
} from 'lucide-react';
import { Button } from './Button';
import { Tabs } from './Tabs';
import { Spinner, InlineLoading } from '../loading/Loading';
import {
    uploadMediaAsync,
    getAllMediaAsync,
    getBatchMediaViewUrlAsync,
    selectMedia,
    selectMediaLoadingGet,
    selectMediaLoadingUpload,
    selectMediaBatchViewUrls,
} from '../../../features/media/store/mediaSlice';
import { mediaFolderApi, mediaApi } from '../../../core/api';

/* =====================
   Media Grid Item
===================== */
const MediaGridItem = ({ media, isSelected, onClick, viewUrl }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For images, loading state is controlled by viewUrl availability
        if (media.type === 'IMAGE') {
            setLoading(!viewUrl);
        } else {
            setLoading(false);
        }
    }, [media.type, viewUrl]);

    const getIcon = () => {
        switch (media.type) {
            case 'VIDEO':
                return <Video size={40} className="text-purple-500" />;
            case 'AUDIO':
                return <Music size={40} className="text-green-500" />;
            case 'DOCUMENT':
                return <FileText size={40} className="text-orange-500" />;
            default:
                return <File size={40} className="text-gray-400" />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`
                relative aspect-square rounded-lg border-2 cursor-pointer
                transition-all hover:shadow-md
                ${isSelected
                    ? 'border-info bg-info/5'
                    : 'border-border hover:border-info/50'
                }
            `}
        >
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {loading ? (
                    <Spinner size="lg" />
                ) : media.type === 'IMAGE' && viewUrl ? (
                    <img
                        src={viewUrl}
                        alt={media.fileName || media.originalName}
                        className="w-full h-full object-cover rounded"
                    />
                ) : (
                    getIcon()
                )}
            </div>

            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-info rounded-full flex items-center justify-center shadow-lg">
                    <Check size={16} className="text-white" />
                </div>
            )}

            {/* File Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b truncate">
                {media.fileName || media.originalName}
            </div>
        </div>
    );
};

/* =====================
   Simple Folder Tree
===================== */
const SimpleFolderTree = ({
    folders,
    selectedFolderId,
    onFolderSelect,
    expandedNodes,
    childrenMap,
    setChildrenMap,
    level = 0,
    mediaType = undefined
}) => {
    const [loadingChildren, setLoadingChildren] = useState({});
    const indent = level * 16;

    const handleToggle = async (folder, e) => {
        e.stopPropagation();
        const folderId = folder.folderId;

        if (expandedNodes.has(folderId)) {
            // Collapse
            const newExpanded = new Set(expandedNodes);
            newExpanded.delete(folderId);
            onFolderSelect(folderId, true, newExpanded);
            return;
        }

        // Expand - load children if not loaded
        if (!childrenMap[folderId]) {
            setLoadingChildren(prev => ({ ...prev, [folderId]: true }));
            try {
                const params = mediaType ? { type: mediaType } : {};
                const res = await mediaFolderApi.getChildren(folderId, params);
                const children = res?.data?.data?.data || res?.data?.data || [];
                setChildrenMap(prev => ({ ...prev, [folderId]: children }));
            } catch {
                setChildrenMap(prev => ({ ...prev, [folderId]: [] }));
            } finally {
                setLoadingChildren(prev => ({ ...prev, [folderId]: false }));
            }
        }

        const newExpanded = new Set(expandedNodes);
        newExpanded.add(folderId);
        onFolderSelect(folderId, true, newExpanded);
    };

    if (!folders || folders.length === 0) {
        return level === 0 ? (
            <div className="text-center py-4 text-sm text-foreground-light">
                <Folder className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                Chưa có thư mục
            </div>
        ) : null;
    }

    return (
        <div className="space-y-0.5">
            {folders.map(folder => {
                const isExpanded = expandedNodes.has(folder.folderId);
                const isSelected = selectedFolderId === folder.folderId;
                const isLoading = loadingChildren[folder.folderId];
                const Icon = isExpanded ? FolderOpen : Folder;
                const children = childrenMap[folder.folderId] || [];

                return (
                    <div key={folder.folderId}>
                        {/* Folder Row */}
                        <div
                            className={`
                                flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer
                                transition-colors text-sm
                                ${isSelected
                                    ? 'bg-info/10 text-info font-medium'
                                    : 'hover:bg-gray-50 text-foreground'
                                }
                            `}
                            style={{ paddingLeft: indent + 8 }}
                            onClick={() => onFolderSelect(folder.folderId)}
                        >
                            {/* Toggle Button */}
                            <button
                                onClick={(e) => handleToggle(folder, e)}
                                className="p-0.5 hover:bg-gray-200 rounded"
                            >
                                {isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>

                            {/* Icon */}
                            <Icon size={16} className={isSelected ? 'text-info' : 'text-gray-500'} />

                            {/* Name */}
                            <span className="flex-1 truncate">{folder.name}</span>

                            {/* Media Count */}
                            {folder.mediaCount !== undefined && (
                                <span className="text-xs text-foreground-light">
                                    {folder.mediaCount}
                                </span>
                            )}
                        </div>

                        {/* Children */}
                        {isExpanded && children.length > 0 && (
                            <SimpleFolderTree
                                folders={children}
                                selectedFolderId={selectedFolderId}
                                onFolderSelect={onFolderSelect}
                                expandedNodes={expandedNodes}
                                childrenMap={childrenMap}
                                setChildrenMap={setChildrenMap}
                                level={level + 1}
                                mediaType={mediaType}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

/* =====================
   Main Modal Component
===================== */
export const MediaPickerModal = ({
    isOpen,
    onClose,
    onSave,
    selectedMediaId = null,
    title = "Chọn Media",
    type = undefined, // Optional: 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT' - if not provided, shows all types
}) => {
    const dispatch = useDispatch();
    const media = useSelector(selectMedia);
    const loadingMedia = useSelector(selectMediaLoadingGet);
    const loadingUpload = useSelector(selectMediaLoadingUpload);
    const batchViewUrls = useSelector(selectMediaBatchViewUrls);

    // Tabs
    const [activeTab, setActiveTab] = useState('library'); // 'library' or 'upload'

    // Folder tree state
    const [rootFolders, setRootFolders] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [childrenMap, setChildrenMap] = useState({});
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    // Media selection
    const [internalSelectedMediaId, setInternalSelectedMediaId] = useState(selectedMediaId);

    // Upload state
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadedMediaData, setUploadedMediaData] = useState(null);

    // Load root folders when modal opens
    useEffect(() => {
        if (isOpen) {
            loadRootFolders();
            // Reset states
            setActiveTab('library');
            setSelectedFolderId(null);
            setInternalSelectedMediaId(selectedMediaId);
            setUploadFile(null);
            setUploadPreview(null);
            setUploadSuccess(false);
            setUploadedMediaData(null);
        }
    }, [isOpen, selectedMediaId]);

    // Load media when folder changes
    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            loadMediaInFolder();
        }
    }, [selectedFolderId, isOpen, activeTab]);

    // Load batch view URLs for images when media list changes
    useEffect(() => {
        if (isOpen && activeTab === 'library' && media && media.length > 0) {
            // Only get URLs for IMAGE type media
            const imageMediaIds = media
                .filter(m => m.type === 'IMAGE')
                .map(m => m.mediaId);

            if (imageMediaIds.length > 0) {
                dispatch(getBatchMediaViewUrlAsync({ mediaIds: imageMediaIds, expiry: 3600 }));
            }
        }
    }, [media, isOpen, activeTab, dispatch]);

    const loadRootFolders = async () => {
        setLoadingFolders(true);
        try {
            const params = type ? { type } : {};
            const res = await mediaFolderApi.getRoots(params);
            setRootFolders(res?.data?.data?.data || res?.data?.data || []);
        } catch (error) {
            console.error('Failed to load folders:', error);
            setRootFolders([]);
        } finally {
            setLoadingFolders(false);
        }
    };

    const loadMediaInFolder = useCallback(() => {
        const params = {
            page: 1,
            limit: 100,
            folderId: selectedFolderId || undefined,
            type: type || undefined, // Filter by type if provided
            status: 'READY', // Only show ready media
            sortBy: 'createdAt',
            sortOrder: 'desc',
        };
        dispatch(getAllMediaAsync(params));
    }, [selectedFolderId, type, dispatch]);

    const handleFolderSelect = (folderId, isToggleAction = false, newExpandedNodes = null) => {
        if (isToggleAction && newExpandedNodes) {
            // It's a toggle action (expand/collapse)
            setExpandedNodes(newExpandedNodes);
        } else {
            // It's a selection action (select folder to view media)
            setSelectedFolderId(folderId);
        }
    };

    // Create a map of mediaId -> viewUrl for easy lookup
    const viewUrlsMap = useMemo(() => {
        const map = {};
        if (batchViewUrls?.results) {
            batchViewUrls.results.forEach(result => {
                if (result.viewUrl && !result.error) {
                    map[result.mediaId] = result.viewUrl;
                }
            });
        }
        return map;
    }, [batchViewUrls]);

    // Get accepted file types based on media type
    const getAcceptedFileTypes = () => {
        switch (type) {
            case 'IMAGE':
                return { accept: 'image/*', label: 'ảnh (JPG, PNG, GIF)', maxSize: 5 };
            case 'VIDEO':
                return { accept: 'video/*', label: 'video (MP4, AVI, MOV)', maxSize: 100 };
            case 'AUDIO':
                return { accept: 'audio/*', label: 'audio (MP3, WAV, OGG)', maxSize: 20 };
            case 'DOCUMENT':
                return { accept: '.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx', label: 'tài liệu (PDF, DOC, TXT, PPT, XLS)', maxSize: 10 };
            default:
                return { accept: '*/*', label: 'tất cả định dạng', maxSize: 100 };
        }
    };

    // Validate file type
    const validateFileType = (file) => {
        if (!type) return true; // No type restriction

        const fileType = file.type;
        switch (type) {
            case 'IMAGE':
                return fileType.startsWith('image/');
            case 'VIDEO':
                return fileType.startsWith('video/');
            case 'AUDIO':
                return fileType.startsWith('audio/');
            case 'DOCUMENT':
                return fileType.startsWith('application/') || fileType.startsWith('text/') ||
                    fileType === 'application/pdf' || fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation');
            default:
                return true;
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const processFile = async (file) => {
        const acceptedTypes = getAcceptedFileTypes();

        // Validate file type
        if (!validateFileType(file)) {
            alert(`Vui lòng chọn file ${acceptedTypes.label}`);
            return;
        }

        // Validate file size
        const maxSizeBytes = acceptedTypes.maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            alert(`Kích thước file không được vượt quá ${acceptedTypes.maxSize}MB`);
            return;
        }

        setUploadFile(file);
        setUploadSuccess(false);
        setUploadedMediaData(null);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setUploadPreview(null);
        }

        // Auto upload
        await handleUploadFile(file);
    };

    const handleUploadFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', `Uploaded from media picker`);

            const result = await dispatch(uploadMediaAsync(formData)).unwrap();
            const uploadedMedia = result.data;

            // Select the uploaded media
            setInternalSelectedMediaId(uploadedMedia.mediaId);

            // Set upload success state
            setUploadSuccess(true);
            setUploadedMediaData(uploadedMedia);

            // Reload media in library (but don't switch tab)
            loadMediaInFolder();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Tải file lên thất bại. Vui lòng thử lại.');
        }
    };

    // Drag and drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    };

    const handleSave = () => {
        if (internalSelectedMediaId) {
            onSave?.(internalSelectedMediaId);
        }
    };

    const handleClose = () => {
        setUploadFile(null);
        setUploadPreview(null);
        onClose?.();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[85vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="px-4">
                        <Tabs
                            tabs={[
                                {
                                    label: 'Thư viện',
                                    isActive: activeTab === 'library',
                                    onActivate: () => setActiveTab('library'),
                                    className: 'bg-white',
                                },
                                {
                                    label: 'Tải lên',
                                    isActive: activeTab === 'upload',
                                    onActivate: () => setActiveTab('upload'),
                                    className: 'bg-white',
                                },
                            ]}
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex">
                        {activeTab === 'library' ? (
                            <>
                                {/* Left Sidebar - Folder Tree */}
                                <div className="w-64 border-r border-border overflow-y-auto p-3">
                                    <div className="mb-3">
                                        <button
                                            onClick={() => setSelectedFolderId(null)}
                                            className={`
                                                w-full flex items-center gap-2 px-3 py-2 rounded text-sm
                                                transition-colors
                                                ${selectedFolderId === null
                                                    ? 'bg-info/10 text-info font-medium'
                                                    : 'hover:bg-gray-50 text-foreground'
                                                }
                                            `}
                                        >
                                            <Folder size={16} />
                                            <span>Tất cả Media</span>
                                        </button>
                                    </div>

                                    {loadingFolders ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Spinner size="md" />
                                        </div>
                                    ) : (
                                        <SimpleFolderTree
                                            folders={rootFolders}
                                            selectedFolderId={selectedFolderId}
                                            onFolderSelect={handleFolderSelect}
                                            expandedNodes={expandedNodes}
                                            childrenMap={childrenMap}
                                            setChildrenMap={setChildrenMap}
                                            mediaType={type}
                                        />
                                    )}
                                </div>

                                {/* Right Content - Media Grid */}
                                <div className="flex-1 overflow-y-auto p-4">
                                    {loadingMedia ? (
                                        <div className="flex items-center justify-center py-12">
                                            <InlineLoading message="Đang tải media..." />
                                        </div>
                                    ) : media.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-foreground-light">
                                            <ImageIcon className="w-16 h-16 mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">Không có media nào</p>
                                            <p className="text-sm mt-1">
                                                {selectedFolderId
                                                    ? 'Thư mục này chưa có media'
                                                    : 'Chọn thư mục hoặc tải lên media mới'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-4">
                                            {media.map(item => (
                                                <MediaGridItem
                                                    key={item.mediaId}
                                                    media={item}
                                                    isSelected={internalSelectedMediaId === item.mediaId}
                                                    onClick={() => setInternalSelectedMediaId(item.mediaId)}
                                                    viewUrl={viewUrlsMap[item.mediaId]}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Upload Tab */
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-2xl mx-auto">
                                    {/* Upload Success State */}
                                    {uploadSuccess && uploadedMediaData ? (
                                        <div className="space-y-6">
                                            <div className="border-2 border-success rounded-lg p-6 bg-success/5">
                                                <div className="flex items-center justify-center mb-4">
                                                    <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                                                        <Check size={24} className="text-white" />
                                                    </div>
                                                </div>
                                                <p className="text-lg font-medium text-foreground text-center mb-2">
                                                    Tải lên thành công!
                                                </p>
                                                <p className="text-sm text-foreground-light text-center">
                                                    {uploadedMediaData.fileName || uploadedMediaData.originalName}
                                                </p>
                                            </div>

                                            {/* Preview uploaded image */}
                                            {uploadPreview && (
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">
                                                        Media đã tải lên
                                                    </label>
                                                    <div className="border border-border rounded-lg p-4 bg-white">
                                                        <img
                                                            src={uploadPreview}
                                                            alt="Uploaded"
                                                            className="max-w-full max-h-96 mx-auto rounded"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload another button */}
                                            <Button
                                                onClick={() => {
                                                    setUploadSuccess(false);
                                                    setUploadedMediaData(null);
                                                    setUploadFile(null);
                                                    setUploadPreview(null);
                                                }}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Upload size={18} />
                                                Tải lên file khác
                                            </Button>
                                        </div>
                                    ) : !loadingUpload ? (
                                        <div
                                            onDragEnter={handleDragEnter}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`
                                                border-2 border-dashed rounded-lg p-12 text-center transition-all
                                                ${isDragging
                                                    ? 'border-info bg-info/5'
                                                    : 'border-border hover:border-info/50 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-info' : 'text-gray-300'
                                                }`} />
                                            <p className="text-lg font-medium text-foreground mb-2">
                                                {isDragging ? 'Thả file tại đây' : 'Kéo thả file vào đây'}
                                            </p>
                                            <p className="text-sm text-foreground-light mb-4">
                                                hoặc
                                            </p>

                                            {/* File Input */}
                                            <label className="inline-block">
                                                <input
                                                    type="file"
                                                    accept={getAcceptedFileTypes().accept}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <span className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-info text-white rounded hover:bg-info-dark transition-colors">
                                                    <Upload size={18} />
                                                    Chọn file từ máy tính
                                                </span>
                                            </label>

                                            <p className="text-xs text-foreground-light mt-4">
                                                Định dạng: {getAcceptedFileTypes().label}. Tối đa {getAcceptedFileTypes().maxSize}MB
                                            </p>
                                        </div>
                                    ) : (
                                        /* Uploading State */
                                        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                                            <Spinner size="xl" className="mx-auto mb-4 text-info" />
                                            <p className="text-lg font-medium text-foreground mb-2">
                                                Đang tải lên...
                                            </p>
                                            {uploadFile && (
                                                <p className="text-sm text-foreground-light">
                                                    {uploadFile.name}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Preview while uploading */}
                                    {uploadPreview && loadingUpload && !uploadSuccess && (
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Xem trước
                                            </label>
                                            <div className="border border-border rounded-lg p-4">
                                                <img
                                                    src={uploadPreview}
                                                    alt="Preview"
                                                    className="max-w-full max-h-96 mx-auto rounded opacity-50"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-4 border-t border-border bg-gray-50">
                        <div className="text-sm text-foreground-light">
                            {internalSelectedMediaId ? (
                                <span className="flex items-center gap-2">
                                    <Check size={16} className="text-success" />
                                    Đã chọn 1 media
                                </span>
                            ) : (
                                <span>Chưa chọn media nào</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!internalSelectedMediaId}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
