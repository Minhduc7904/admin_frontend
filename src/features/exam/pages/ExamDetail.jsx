import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FileText, Edit2, X, File, Video, Youtube, Eye, Edit, Trophy, Calendar } from 'lucide-react';
import { Button, RightPanel, InlineLoading } from '../../../shared/components';
import { ENTITY_TYPES, EXAM_FIELDS } from '../../../shared/constants';
import { MediaPickerModal } from '../../media/components/mediaPicker/MediaPickerModal';
import { MediaPreviewModal } from '../../media/components/MediaPreviewModal';
import { MediaUploadSection } from '../../examImportSession/components/MediaUploadSection';
import { EditExam } from '../components';
import { EditCompetition, CompetitionLeaderboard, CompetitionDetail } from '../../competition/components';
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
    getExamByIdAsync,
    selectCurrentExam,
    selectExamLoadingGet,
} from '../store/examSlice';
import {
    getAdminViewUrlAsync,
    selectMediaLoadingViewUrl,
} from '../../media/store/mediaSlice';
import { VISIBILITY_LABELS } from '../../../core/constants';
import { MarkdownRenderer } from '../../../shared/components';
export const ExamDetail = () => {
    const { id } = useParams();
    const examId = Number(id);
    const dispatch = useDispatch();
    
    const [modalState, setModalState] = useState({
        isOpen: false,
        context: null, // 'EXAM_FILE', 'EXAM_SOLUTION_FILE', 'EXAM_IMAGE', 'EXAM_SOLUTION_VIDEO'
        type: null, // 'document', 'image', 'video'
    });

    const [previewModal, setPreviewModal] = useState({
        isOpen: false,
        media: null,
        youtubeUrl: null,
    });

    const [openEditExam, setOpenEditExam] = useState(false);

    // Competition panel states
    const [openDetailPanel, setOpenDetailPanel] = useState(false);
    const [selectedCompetitionForDetail, setSelectedCompetitionForDetail] = useState(null);
    const [openEditCompetition, setOpenEditCompetition] = useState(false);
    const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
    const [openLeaderboard, setOpenLeaderboard] = useState(false);
    const [selectedCompetitionForLeaderboard, setSelectedCompetitionForLeaderboard] = useState(null);

    const exam = useSelector(selectCurrentExam);
    const loadingExam = useSelector(selectExamLoadingGet);
    const usages = useSelector(selectMediaUsagesByEntity);
    const loadingUsages = useSelector(selectMediaUsageLoadingByEntity);
    const loadingAttach = useSelector(selectMediaUsageLoadingAttach);
    const loadingDetach = useSelector(selectMediaUsageLoadingDetach);
    const loadingViewUrl = useSelector(selectMediaLoadingViewUrl);

    // Load exam data
    useEffect(() => {
        if (examId) {
            dispatch(getExamByIdAsync(examId));
        }
    }, [examId, dispatch]);

    // Load media usages
    useEffect(() => {
        if (examId) {
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.EXAM,
                entityId: examId,
            }));
        }
    }, [examId, dispatch]);

    // Group usages by fieldName - ensure usages is always an array
    const usagesArray = Array.isArray(usages) ? usages : [];
    const examFiles = usagesArray.filter(u => u.fieldName === EXAM_FIELDS.EXAM_FILE);
    const solutionFiles = usagesArray.filter(u => u.fieldName === EXAM_FIELDS.SOLUTION_FILE);
    const examImages = usagesArray.filter(u => u.fieldName === EXAM_FIELDS.EXAM_IMAGE);
    const solutionVideos = usagesArray.filter(u => u.fieldName === EXAM_FIELDS.SOLUTION_VIDEO);

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
            entityType: ENTITY_TYPES.EXAM,
            entityId: examId,
            fieldName: modalState.context,
        }));

        if (result.type.endsWith('/fulfilled')) {
            handleCloseModal();
            // Reload usages
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.EXAM,
                entityId: examId,
            }));
        }
    };

    const handleDetachMedia = async (usageId) => {
        const result = await dispatch(detachMediaAsync(usageId));
        
        if (result.type.endsWith('/fulfilled')) {
            // Reload usages
            dispatch(getMediaUsagesByEntityAsync({
                entityType: ENTITY_TYPES.EXAM,
                entityId: examId,
            }));
        }
    };

    const handleEdit = () => {
        setOpenEditExam(true);
    };

    const handleCloseEditExam = () => {
        setOpenEditExam(false);
    };

    const handleEditSuccess = () => {
        // Reload exam data
        if (examId) {
            dispatch(getExamByIdAsync(examId));
        }
    };

    // Competition handlers
    const handleViewCompetition = (competition) => {
        setSelectedCompetitionForDetail(competition);
        setOpenDetailPanel(true);
    };

    const handleEditCompetition = (competition) => {
        setSelectedCompetitionId(competition.competitionId);
        setOpenEditCompetition(true);
    };

    const handleViewLeaderboard = (competition) => {
        setSelectedCompetitionForLeaderboard(competition);
        setOpenLeaderboard(true);
    };

    const handleEditFromDetail = () => {
        if (!selectedCompetitionForDetail) return;
        setOpenDetailPanel(false);
        setSelectedCompetitionId(selectedCompetitionForDetail.competitionId);
        setOpenEditCompetition(true);
    };

    const closeCompetitionDetail = () => {
        setOpenDetailPanel(false);
        setSelectedCompetitionForDetail(null);
    };

    const closeEditCompetition = () => {
        setOpenEditCompetition(false);
        setSelectedCompetitionId(null);
    };

    const closeLeaderboard = () => {
        setOpenLeaderboard(false);
        setSelectedCompetitionForLeaderboard(null);
    };

    const handleMediaClick = async (media) => {
        if (!media?.mediaId) return;

        try {
            const result = await dispatch(getAdminViewUrlAsync({ 
                id: media.mediaId, 
                expiry: 3600 
            }));

            if (result.type.endsWith('/fulfilled')) {
                const viewUrl = result.payload?.data?.viewUrl;
                setPreviewModal({
                    isOpen: true,
                    media: { ...media, url: viewUrl },
                    youtubeUrl: null,
                });
            }
        } catch (error) {
            console.error('Failed to get view URL:', error);
        }
    };

    const handleYoutubeClick = (url) => {
        setPreviewModal({
            isOpen: true,
            media: null,
            youtubeUrl: url,
        });
    };

    const handleClosePreview = () => {
        setPreviewModal({
            isOpen: false,
            media: null,
            youtubeUrl: null,
        });
    };

    const renderFileItem = (usage) => (
        <div 
            key={usage.usageId} 
            className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-border hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => handleMediaClick(usage.media)}
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
            onClick={() => handleMediaClick(usage.media)}
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
            onClick={() => handleMediaClick(usage.media)}
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

    if (loadingExam && !exam) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <InlineLoading message="Đang tải thông tin đề thi..." />
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600">Không tìm thấy thông tin đề thi.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Compact Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {exam.title}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                exam.visibility === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {VISIBILITY_LABELS[exam.visibility]}
                            </span>
                            {exam.grade && (
                                <span className="text-xs text-foreground-light">Khối {exam.grade}</span>
                            )}
                            <span className="text-xs text-foreground-light">{exam.questionCount || 0} câu hỏi</span>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                </Button>
            </div>

            <div className="p-6">
                {/* Main Info Grid - 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {exam.processedDescription && (
                            <div>
                                <label className="text-xs font-semibold text-foreground-light uppercase tracking-wide">
                                    Mô tả
                                </label>
                                <div className="mt-2 text-sm">
                                    <MarkdownRenderer content={exam.processedDescription} />
                                </div>
                            </div>
                        )}

                        {/* Info Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            {exam.subjectName && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-border">
                                    <label className="text-xs font-medium text-foreground-light">Môn học</label>
                                    <p className="text-sm font-semibold text-foreground mt-1">{exam.subjectName}</p>
                                </div>
                            )}
                            
                            {exam.createdByAdmin && (
                                <div className="p-3 bg-gray-50 rounded-lg border border-border">
                                    <label className="text-xs font-medium text-foreground-light">Người tạo</label>
                                    <p className="text-sm font-semibold text-foreground mt-1">{exam.createdByAdmin.fullName}</p>
                                    {exam.createdByAdmin.email && (
                                        <p className="text-xs text-foreground-light truncate">{exam.createdByAdmin.email}</p>
                                    )}
                                </div>
                            )}
                            
                            <div className="p-3 bg-gray-50 rounded-lg border border-border">
                                <label className="text-xs font-medium text-foreground-light">Ngày tạo</label>
                                <p className="text-sm font-semibold text-foreground mt-1">
                                    {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString('vi-VN') : '-'}
                                </p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg border border-border">
                                <label className="text-xs font-medium text-foreground-light">Cập nhật</label>
                                <p className="text-sm font-semibold text-foreground mt-1">
                                    {exam.updatedAt ? new Date(exam.updatedAt).toLocaleDateString('vi-VN') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Media Files */}
                    <div className="space-y-4">
                        {/* File đề thi & lời giải - Compact */}
                        <div className="space-y-3">
                            <MediaUploadSection
                                title="File đề thi"
                                fieldName={EXAM_FIELDS.EXAM_FILE}
                                mediaType="DOCUMENT"
                                items={examFiles}
                                loading={loadingUsages}
                                disabled={loadingAttach}
                                emptyMessage="Chưa có file"
                                onUploadClick={handleOpenModal}
                                renderItem={renderFileItem}
                            />

                            <MediaUploadSection
                                title="File lời giải"
                                fieldName={EXAM_FIELDS.SOLUTION_FILE}
                                mediaType="DOCUMENT"
                                items={solutionFiles}
                                loading={loadingUsages}
                                disabled={loadingAttach}
                                emptyMessage="Chưa có file"
                                onUploadClick={handleOpenModal}
                                renderItem={renderFileItem}
                            />
                        </div>

                        {/* YouTube Solution */}
                        {exam.solutionYoutubeUrl && (
                            <div
                                onClick={() => handleYoutubeClick(exam.solutionYoutubeUrl)}
                                className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer transition-colors group"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                    <Youtube className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-foreground">Video hướng dẫn giải</p>
                                    <p className="text-xs text-foreground-light truncate">{exam.solutionYoutubeUrl}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Gallery - Full Width */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-border">
                    {/* Hình ảnh đề thi */}
                    <MediaUploadSection
                        title="Hình ảnh đề thi"
                        fieldName={EXAM_FIELDS.EXAM_IMAGE}
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
                        fieldName={EXAM_FIELDS.SOLUTION_VIDEO}
                        mediaType="VIDEO"
                        items={solutionVideos}
                        loading={loadingUsages}
                        disabled={loadingAttach}
                        emptyMessage="Chưa có video"
                        gridLayout={true}
                        onUploadClick={handleOpenModal}
                        renderItem={renderVideoItem}
                    />
                </div>

                {/* Competitions Section */}
                {Array.isArray(exam.competitions) && exam.competitions.length > 0 && (
                    <div className="pt-4 border-t border-border">
                        <h3 className="text-xs font-semibold text-foreground-lighter uppercase tracking-widest mb-3">
                            Cuộc thi liên kết ({exam.competitions.length})
                        </h3>
                        <div className="rounded-lg border border-border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-border">
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-foreground-lighter uppercase tracking-wide">ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-foreground-lighter uppercase tracking-wide">Tiêu đề</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-foreground-lighter uppercase tracking-wide">Thời gian diễn ra</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-foreground-lighter uppercase tracking-wide">Trạng thái</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-foreground-lighter uppercase tracking-wide">Hiển thị</th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-foreground-lighter uppercase tracking-wide">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exam.competitions.map((comp) => {
                                        const now = new Date();
                                        const start = comp.startDate ? new Date(comp.startDate) : null;
                                        const end = comp.endDate ? new Date(comp.endDate) : null;
                                        let statusBadge;
                                        if (!start || !end) {
                                            statusBadge = <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Chưa đặt lịch</span>;
                                        } else if (now < start) {
                                            statusBadge = <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Sắp diễn ra</span>;
                                        } else if (now <= end) {
                                            statusBadge = <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Đang diễn ra</span>;
                                        } else {
                                            statusBadge = <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Đã kết thúc</span>;
                                        }
                                        const visibilityMap = {
                                            DRAFT:     { label: 'Bản nháp',    cls: 'bg-gray-100 text-gray-700' },
                                            PUBLISHED: { label: 'Đã xuất bản', cls: 'bg-green-100 text-green-700' },
                                            PRIVATE:   { label: 'Riêng tư',    cls: 'bg-yellow-100 text-yellow-700' },
                                        };
                                        const vis = visibilityMap[comp.visibility] || visibilityMap.DRAFT;
                                        const fmt = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
                                        return (
                                            <tr
                                                key={comp.competitionId}
                                                className="border-b border-border last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() => handleViewCompetition(comp)}
                                            >
                                                <td className="px-3 py-2.5">
                                                    <span className="text-xs text-foreground-light">#{comp.competitionId}</span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex flex-col max-w-xs">
                                                        <span className="text-sm font-medium text-foreground truncate">{comp.title}</span>
                                                        {comp.subtitle && <span className="text-xs text-foreground-lighter truncate">{comp.subtitle}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex flex-col text-xs text-foreground-light">
                                                        <div className="flex items-center gap-1"><Calendar size={11} /><span>{fmt(comp.startDate)}</span></div>
                                                        <div className="flex items-center gap-1"><Calendar size={11} /><span>{fmt(comp.endDate)}</span></div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">{statusBadge}</td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${vis.cls}`}>{vis.label}</span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            title="Xem chi tiết"
                                                            onClick={() => handleViewCompetition(comp)}
                                                            className="p-1.5 rounded hover:bg-gray-100 text-foreground-light hover:text-foreground transition-colors"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            title="Bảng xếp hạng"
                                                            onClick={() => handleViewLeaderboard(comp)}
                                                            className="p-1.5 rounded hover:bg-gray-100 text-foreground-light hover:text-yellow-600 transition-colors"
                                                        >
                                                            <Trophy size={14} />
                                                        </button>
                                                        <button
                                                            title="Chỉnh sửa"
                                                            onClick={() => handleEditCompetition(comp)}
                                                            className="p-1.5 rounded hover:bg-gray-100 text-foreground-light hover:text-foreground transition-colors"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onSave={handleSaveMedia}
                title={
                    modalState.context === EXAM_FIELDS.EXAM_FILE ? 'Chọn file đề thi' :
                    modalState.context === EXAM_FIELDS.SOLUTION_FILE ? 'Chọn file lời giải' :
                    modalState.context === EXAM_FIELDS.EXAM_IMAGE ? 'Chọn hình ảnh đề thi' :
                    'Chọn video chữa đề'
                }
                type={modalState.type}
            />

            {/* Media Preview Modal */}
            <MediaPreviewModal
                isOpen={previewModal.isOpen}
                onClose={handleClosePreview}
                media={previewModal.media}
                youtubeUrl={previewModal.youtubeUrl}
                loading={loadingViewUrl}
            />

            {/* Edit Exam Right Panel */}
            <RightPanel
                isOpen={openEditExam}
                onClose={handleCloseEditExam}
                title="Chỉnh sửa đề thi"
            >
                <EditExam
                    exam={exam}
                    onClose={handleCloseEditExam}
                    onSuccess={handleEditSuccess}
                />
            </RightPanel>

            {/* Competition Detail Panel */}
            <RightPanel
                isOpen={openDetailPanel}
                onClose={closeCompetitionDetail}
                title="Chi tiết cuộc thi"
                width="w-[600px]"
            >
                {selectedCompetitionForDetail && (
                    <CompetitionDetail
                        competitionId={selectedCompetitionForDetail.competitionId}
                        onEdit={handleEditFromDetail}
                    />
                )}
            </RightPanel>

            {/* Edit Competition Right Panel */}
            <RightPanel
                isOpen={openEditCompetition}
                onClose={closeEditCompetition}
                title="Chỉnh sửa cuộc thi"
            >
                {selectedCompetitionId && (
                    <EditCompetition
                        competitionId={selectedCompetitionId}
                        onClose={closeEditCompetition}
                        onSuccess={() => dispatch(getExamByIdAsync(examId))}
                    />
                )}
            </RightPanel>

            {/* Competition Leaderboard Panel */}
            <RightPanel
                isOpen={openLeaderboard}
                onClose={closeLeaderboard}
                title="Lượt nộp bài"
                width="w-[1050px]"
            >
                {selectedCompetitionForLeaderboard && (
                    <CompetitionLeaderboard
                        competition={selectedCompetitionForLeaderboard}
                    />
                )}
            </RightPanel>
        </div>
    );
};
