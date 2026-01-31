import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, FileText, X, File, Eye } from 'lucide-react';
import { Button } from '../../../shared/components';
import { ENTITY_TYPES, EXAM_IMPORT_SESSION_FIELDS } from '../../../shared/constants';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { ExtractedTextPreview } from './ExtractedTextPreview';
import {
    getMediaUsagesByEntityAsync,
    attachMediaAsync,
    detachMediaAsync,
    selectMediaUsagesByEntity,
    selectMediaUsageLoadingByEntity,
    selectMediaUsageLoadingAttach,
    selectMediaUsageLoadingDetach,
} from '../../mediaUsage/store/mediaUsageSlice';
import {
    getMyRawContentAsync,
    extractTextAsync,
    selectMediaLoadingMyRawContent,
    selectMediaRawContent,
    selectMediaLoadingExtractText,
} from '../../media/store/mediaSlice';
import {
    updateSessionRawContentAsync,
    selectExamImportSessionLoadingUpdateRawContent,
    getSessionRawContentAsync,
} from '../store/examImportSessionSlice';
import { MEDIA_TYPE } from '../../media/constants/media-type.constant';

export const UploadPdfSection = ({ sessionId }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMediaId, setSelectedMediaId] = useState(null);

    const usages = useSelector(selectMediaUsagesByEntity);
    const loadingUsages = useSelector(selectMediaUsageLoadingByEntity);
    const loadingAttach = useSelector(selectMediaUsageLoadingAttach);
    const loadingDetach = useSelector(selectMediaUsageLoadingDetach);
    const loadingRawContent = useSelector(selectMediaLoadingMyRawContent);
    const loadingExtract = useSelector(selectMediaLoadingExtractText);
    const rawContentData = useSelector(selectMediaRawContent);    const loadingMerge = useSelector(selectExamImportSessionLoadingUpdateRawContent);
    // Load media usages
    useEffect(() => {
        if (sessionId) {
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.EXAM_IMPORT_SESSION,
                entityId: sessionId,
            }));
        }
    }, [sessionId, dispatch]);

    // Filter PDF files
    const usagesArray = Array.isArray(usages) ? usages : [];
    const pdfFiles = usagesArray.filter(u => u.fieldName === EXAM_IMPORT_SESSION_FIELDS.UPLOAD_PDF);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveMedia = async (mediaId) => {
        if (!mediaId) return;

        const result = await dispatch(attachMediaAsync({
            mediaId,
            entityType: ENTITY_TYPES.EXAM_IMPORT_SESSION,
            entityId: sessionId,
            fieldName: EXAM_IMPORT_SESSION_FIELDS.UPLOAD_PDF,
        }));

        if (result.type.endsWith('/fulfilled')) {
            handleCloseModal();
            // Reload usages
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.EXAM_IMPORT_SESSION,
                entityId: sessionId,
            }));
        }
    };

    const handleDetachMedia = async (usageId) => {
        const result = await dispatch(detachMediaAsync(usageId));
        
        if (result.type.endsWith('/fulfilled')) {
            // Reload usages
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.EXAM_IMPORT_SESSION,
                entityId: sessionId,
            }));
        }
    };

    const handleGetRawContent = async (mediaId) => {
        setSelectedMediaId(mediaId);
        await dispatch(getMyRawContentAsync({ 
            id: mediaId, 
            expiry: 3600 
        })).unwrap();
    };

    const handleExtractWithRawContent = async (mediaId) => {
        setSelectedMediaId(mediaId);
        // Step 1: Extract text from PDF using AI
        await dispatch(extractTextAsync({ 
            id: mediaId, 
            includeImageBase64: true 
        })).unwrap();
        
        // Step 2: Get raw content with presigned URLs
        await dispatch(getMyRawContentAsync({ 
            id: mediaId, 
            expiry: 3600 
        })).unwrap();
    };

    const handleMergeToSession = async (sessionId, rawContent) => {
        await dispatch(updateSessionRawContentAsync({
            sessionId,
            rawContent,
        })).unwrap();
        
        // Reload session raw content after merge
        await dispatch(getSessionRawContentAsync({ 
            sessionId, 
            expiry: 3600 
        })).unwrap();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Upload PDF & Trích xuất
                </h2>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
                {/* Upload Section */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground-light">
                            File PDF đề thi
                        </label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenModal}
                            disabled={loadingAttach || loadingUsages}
                        >
                            <Upload className="w-4 h-4" />
                            {loadingAttach ? 'Đang tải...' : 'Tải lên'}
                        </Button>
                    </div>

                    {loadingUsages ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : pdfFiles.length > 0 ? (
                        <div className="space-y-2">
                            {pdfFiles.map((usage) => {
                                const isSelected = selectedMediaId === usage.media?.mediaId;
                                return (
                                    <div
                                        key={usage.usageId}
                                        className={`flex items-center gap-2 p-3 rounded border transition-colors ${
                                            isSelected 
                                                ? 'bg-blue-50 border-blue-500 border-2' 
                                                : 'bg-gray-50 border-border hover:bg-gray-100'
                                        }`}
                                    >
                                        <File className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-red-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-foreground'}`}>
                                                {usage.media?.originalName || 'File PDF'}
                                            </p>
                                            <p className="text-xs text-foreground-light">
                                                {usage.media?.fileSize ? 
                                                    `${(usage.media.fileSize / 1024 / 1024).toFixed(2)} MB` : 
                                                    'Kích thước không xác định'
                                                }
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleGetRawContent(usage.media?.mediaId)}
                                            disabled={loadingRawContent && selectedMediaId === usage.media?.mediaId}
                                            className="p-1 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-700 disabled:opacity-50"
                                            title="Xem nội dung đã trích xuất"
                                        >
                                            {loadingRawContent && selectedMediaId === usage.media?.mediaId ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDetachMedia(usage.usageId)}
                                            disabled={loadingDetach}
                                            className="p-1 hover:bg-gray-200 rounded text-foreground-light hover:text-danger"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg">
                            <Upload className="w-12 h-12 text-foreground-light mb-2" />
                            <p className="text-sm text-foreground-light">
                                Chưa có file PDF nào
                            </p>
                        </div>
                    )}
                </div>

                {/* Extracted Text Display - Only show when a file is selected */}
                {selectedMediaId && (
                    <ExtractedTextPreview 
                        rawContent={rawContentData?.rawContent}
                        processedContent={rawContentData?.processedContent}
                        metadata={rawContentData?.metadata}
                        mediaId={selectedMediaId}
                        sessionId={sessionId}
                        onExtract={handleExtractWithRawContent}
                        onMerge={handleMergeToSession}
                        isExtracting={loadingExtract || loadingRawContent}
                        isLoadingContent={loadingRawContent}
                        isMerging={loadingMerge}
                    />
                )}

                {/* Info Section */}
                <div className="border-t border-border pt-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">
                            Hướng dẫn
                        </h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Upload file PDF chứa đề thi cần trích xuất</li>
                            <li>• Hệ thống sẽ tự động phân tích và trích xuất nội dung</li>
                            <li>• Xem trước markdown ở bên phải trước khi xác nhận</li>
                            <li>• Chỉ hỗ trợ file PDF với kích thước tối đa 50MB</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveMedia}
                title="Chọn file PDF"
                type={MEDIA_TYPE.DOCUMENT}
            />
        </div>
    );
};
