import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Edit2, X, File, Video, Youtube } from 'lucide-react';
import { Button } from '../../../shared/components';
import { ENTITY_TYPES, TEMP_EXAM_FIELDS } from '../../../shared/constants';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { MediaUploadSection } from './MediaUploadSection';
import {
    getMediaUsagesByEntityAsync,
    attachMediaAsync,
    detachMediaAsync,
    selectMediaUsagesByEntity,
    selectMediaUsageLoadingByEntity,
    selectMediaUsageLoadingAttach,
    selectMediaUsageLoadingDetach,
} from '../../mediaUsage/store/mediaUsageSlice';
import { VISIBILITY_LABELS } from '../../../core/constants';
export const TempExamInfo = ({ tempExam, onEdit, onMediaClick, onYoutubeClick }) => {
    const dispatch = useDispatch();
    const [modalState, setModalState] = useState({
        isOpen: false,
        context: null, // 'TEMP_EXAM_FILE', 'TEMP_SOLUTION_FILE', 'TEMP_EXAM_IMAGE', 'TEMP_SOLUTION_VIDEO'
        type: null, // 'document', 'image', 'video'
    });

    const usages = useSelector(selectMediaUsagesByEntity);
    const loadingUsages = useSelector(selectMediaUsageLoadingByEntity);
    const loadingAttach = useSelector(selectMediaUsageLoadingAttach);
    const loadingDetach = useSelector(selectMediaUsageLoadingDetach);

    // Load media usages
    useEffect(() => {
        if (tempExam?.tempExamId) {
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.TEMP_EXAM,
                entityId: tempExam.tempExamId,
            }));
        }
    }, [tempExam?.tempExamId, dispatch]);

    // Group usages by fieldName - ensure usages is always an array
    const usagesArray = Array.isArray(usages) ? usages : [];
    const examFiles = usagesArray.filter(u => u.fieldName === TEMP_EXAM_FIELDS.EXAM_FILE);
    const solutionFiles = usagesArray.filter(u => u.fieldName === TEMP_EXAM_FIELDS.SOLUTION_FILE);
    const examImages = usagesArray.filter(u => u.fieldName === TEMP_EXAM_FIELDS.EXAM_IMAGE);
    const solutionVideos = usagesArray.filter(u => u.fieldName === TEMP_EXAM_FIELDS.SOLUTION_VIDEO);

    const handleOpenModal = (context, type) => {
        setModalState({
            isOpen: true,
            context,
            type,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            context: null,
            type: null,
        });
    };

    const handleSaveMedia = async (mediaId) => {
        if (!mediaId || !modalState.context) return;

        const result = await dispatch(attachMediaAsync({
            mediaId,
            entityType: ENTITY_TYPES.TEMP_EXAM,
            entityId: tempExam.tempExamId,
            fieldName: modalState.context,
        }));

        if (result.type.endsWith('/fulfilled')) {
            handleCloseModal();
            // Reload usages
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.TEMP_EXAM,
                entityId: tempExam.tempExamId,
            }));
        }
    };

    const handleDetachMedia = async (usageId) => {
        const result = await dispatch(detachMediaAsync(usageId));
        
        if (result.type.endsWith('/fulfilled')) {
            // Reload usages
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.TEMP_EXAM,
                entityId: tempExam.tempExamId,
            }));
        }
    };

    const renderFileItem = (usage) => (
        <div 
            key={usage.usageId} 
            className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-border hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => onMediaClick?.(usage.media)}
        >
            <File className="w-4 h-4 text-foreground-light" />
            <span className="flex-1 text-sm text-foreground truncate">
                {usage.media?.originalName || 'File'}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDetachMedia(usage.usageId);
                }}
                disabled={loadingDetach}
                className="p-1 hover:bg-gray-200 rounded text-foreground-light hover:text-danger"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );

    const renderImageItem = (usage) => (
        <div 
            key={usage.usageId} 
            className="relative group cursor-pointer"
            onClick={() => onMediaClick?.(usage.media)}
        >
            <img
                src={usage.media?.url}
                alt={usage.media?.name}
                className="w-full h-24 object-cover rounded border border-border hover:opacity-90 transition-opacity"
            />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDetachMedia(usage.usageId);
                }}
                disabled={loadingDetach}
                className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded shadow text-danger opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );

    const renderVideoItem = (usage) => (
        <div 
            key={usage.usageId} 
            className="relative group cursor-pointer"
            onClick={() => onMediaClick?.(usage.media)}
        >
            <video
                src={usage.media?.url}
                className="w-full h-32 object-cover rounded border border-border bg-black hover:opacity-90 transition-opacity"
                preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDetachMedia(usage.usageId);
                }}
                disabled={loadingDetach}
                className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white rounded shadow text-danger opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Thông tin đề thi
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                </Button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                    <label className="text-sm font-medium text-foreground-light">
                        Tiêu đề
                    </label>
                    <p className="text-foreground mt-1">{tempExam.title}</p>
                </div>

                {tempExam.description && (
                    <div>
                        <label className="text-sm font-medium text-foreground-light">
                            Mô tả
                        </label>
                        <p className="text-foreground mt-1">{tempExam.description}</p>
                    </div>
                )}

                {tempExam.grade && (
                    <div>
                        <label className="text-sm font-medium text-foreground-light">
                            Khối
                        </label>
                        <p className="text-foreground mt-1">Khối {tempExam.grade}</p>
                    </div>
                )}

                {tempExam.subjectName && (
                    <div>
                        <label className="text-sm font-medium text-foreground-light">
                            Môn học
                        </label>
                        <p className="text-foreground mt-1">{tempExam.subjectName}</p>
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium text-foreground-light">
                        Trạng thái hiển thị
                    </label>
                    <p className="text-foreground mt-1">
                        {VISIBILITY_LABELS[tempExam.visibility] || 'Không xác định'}
                    </p>
                </div>

                {/* File đề thi */}
                <MediaUploadSection
                    title="File đề thi"
                    fieldName={TEMP_EXAM_FIELDS.EXAM_FILE}
                    mediaType="DOCUMENT"
                    items={examFiles}
                    loading={loadingUsages}
                    disabled={loadingAttach}
                    emptyMessage="Chưa có file"
                    onUploadClick={handleOpenModal}
                    renderItem={renderFileItem}
                />

                {/* File lời giải */}
                <MediaUploadSection
                    title="File lời giải"
                    fieldName={TEMP_EXAM_FIELDS.SOLUTION_FILE}
                    mediaType="DOCUMENT"
                    items={solutionFiles}
                    loading={loadingUsages}
                    disabled={loadingAttach}
                    emptyMessage="Chưa có file"
                    onUploadClick={handleOpenModal}
                    renderItem={renderFileItem}
                />

                {/* Hình ảnh đề thi */}
                <MediaUploadSection
                    title="Hình ảnh đề thi"
                    fieldName={TEMP_EXAM_FIELDS.EXAM_IMAGE}
                    mediaType="IMAGE"
                    items={examImages}
                    loading={loadingUsages}
                    disabled={loadingAttach}
                    emptyMessage="Chưa có hình ảnh"
                    gridLayout={true}
                    onUploadClick={handleOpenModal}
                    renderItem={renderImageItem}
                />

                {/* Video chữa đề */}
                <MediaUploadSection
                    title="Video chữa đề"
                    fieldName={TEMP_EXAM_FIELDS.SOLUTION_VIDEO}
                    mediaType="VIDEO"
                    items={solutionVideos}
                    loading={loadingUsages}
                    disabled={loadingAttach}
                    emptyMessage="Chưa có video"
                    gridLayout={true}
                    onUploadClick={handleOpenModal}
                    renderItem={renderVideoItem}
                />
                {/* YouTube Solution URL */}
                {tempExam.solutionYoutubeUrl && (
                    <div>
                        <label className="text-sm font-medium text-foreground-light mb-2 block">
                            Link YouTube hướng dẫn giải
                        </label>
                        <div
                            onClick={() => onYoutubeClick?.(tempExam.solutionYoutubeUrl)}
                            className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer transition-colors group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                <Youtube className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">
                                    Video hướng dẫn giải bài
                                </p>
                                <p className="text-xs text-foreground-light truncate">
                                    {tempExam.solutionYoutubeUrl}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className="text-foreground-light">Ngày tạo</label>
                            <p className="text-foreground mt-1">
                                {new Date(tempExam.createdAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div>
                            <label className="text-foreground-light">Cập nhật</label>
                            <p className="text-foreground mt-1">
                                {new Date(tempExam.updatedAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onSave={handleSaveMedia}
                title={
                    modalState.context === TEMP_EXAM_FIELDS.EXAM_FILE ? 'Chọn file đề thi' :
                    modalState.context === TEMP_EXAM_FIELDS.SOLUTION_FILE ? 'Chọn file lời giải' :
                    modalState.context === TEMP_EXAM_FIELDS.EXAM_IMAGE ? 'Chọn hình ảnh đề thi' :
                    'Chọn video chữa đề'
                }
                type={modalState.type}
            />
        </div>
    );
};
