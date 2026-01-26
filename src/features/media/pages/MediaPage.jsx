import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, LoaderCircle, Upload } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components';
import { MediaTable, MediaFilters, MediaDetail, MediaUploadModal, BucketSidebar } from '../components';
import { useSearch, useInfiniteScroll } from '../../../shared/hooks';
import {
    getAllMediaAsync,
    getBucketsAsync,
    getMediaByIdAsync,
    uploadMediaAsync,
    hardDeleteMediaAsync,
    selectMedia,
    selectMediaPagination,
    selectMediaLoadingGet,
    selectMediaLoadingUpload,
    selectMediaLoadingSoftDelete,
    setFilters,
    selectMediaFilters,
} from '../store/mediaSlice';

/**
 * MediaPage - Shared component for managing media
 * Can be used for global media list or filtered by userId
 * 
 * @param {number} userId - Optional user ID to filter media by uploader
 * @param {string} userType - Type of user ('admin' or 'student') for display text
 * @param {boolean} loading - Loading state from parent
 * @param {boolean} requireUserId - If true, wait for userId before loading data
 */
export const MediaPage = ({ userId = null, userType = null, loading: parentLoading = false, requireUserId = false }) => {
    const dispatch = useDispatch();

    const media = useSelector(selectMedia);
    const pagination = useSelector(selectMediaPagination);
    const filters = useSelector(selectMediaFilters);
    const loadingGet = useSelector(selectMediaLoadingGet);
    const loadingUpload = useSelector(selectMediaLoadingUpload);
    const loadingDelete = useSelector(selectMediaLoadingSoftDelete);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [selectedBucket, setSelectedBucket] = useState('');
    const [type, setType] = useState(filters.type);
    const [status, setStatus] = useState(filters.status);
    const [sortBy, setSortBy] = useState(filters.sortBy);
    const [sortOrder, setSortOrder] = useState(filters.sortOrder);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [allMedia, setAllMedia] = useState([]);

    // Load buckets
    useEffect(() => {
        if (parentLoading) return;
        dispatch(getBucketsAsync());
    }, [dispatch, parentLoading]);

    // Load initial data
    useEffect(() => {
        if (parentLoading) return;
        // If requireUserId is true, wait until userId is available
        if (requireUserId && !userId) return;
        loadMedia(1, true);
    }, [debouncedSearch, selectedBucket, type, status, sortBy, sortOrder, userId, parentLoading, requireUserId]);

    // Update allMedia when new data comes in
    useEffect(() => {
        if (currentPage === 1) {
            setAllMedia(media);
        } else {
            setAllMedia(prev => [...prev, ...media]);
        }
    }, [media, currentPage]);

    const loadMedia = useCallback((page = 1, reset = false) => {
        if (parentLoading) return;
        if (reset) {
            setAllMedia([]);
            setCurrentPage(1);
        }

        const params = {
            page,
            limit: 20,
            search: debouncedSearch || undefined,
            bucketName: selectedBucket || undefined,
            type: type || undefined,
            status: status || undefined,
            sortBy,
            sortOrder,
            uploadedBy: userId || undefined,
        };

        dispatch(getAllMediaAsync(params));
    }, [debouncedSearch, selectedBucket, type, status, sortBy, sortOrder, userId, parentLoading, dispatch]);

    const loadMore = useCallback(() => {
        if (pagination.hasNext && !loadingGet && !parentLoading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadMedia(nextPage, false);
        }
    }, [pagination.hasNext, loadingGet, currentPage, loadMedia, parentLoading]);

    // Infinite scroll
    const lastElementRef = useInfiniteScroll(loadMore, pagination.hasNext, loadingGet);

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        dispatch(setFilters({ search: value }));
    };

    const handleBucketChange = (bucketName) => {
        setSelectedBucket(bucketName);
        dispatch(setFilters({ bucketName }));
    };

    const handleTypeChange = (value) => {
        setType(value);
        dispatch(setFilters({ type: value }));
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        dispatch(setFilters({ status: value }));
    };

    const handleSortByChange = (value) => {
        setSortBy(value);
        dispatch(setFilters({ sortBy: value }));
    };

    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        dispatch(setFilters({ sortOrder: value }));
    };

    const handleViewDetail = async (mediaItem) => {
        setSelectedMedia(mediaItem.mediaId);
        setIsDetailPanelOpen(true);
        await dispatch(getMediaByIdAsync(mediaItem.mediaId));
    };

    const handleCloseDetail = () => {
        setIsDetailPanelOpen(false);
        setSelectedMedia(null);
    };

    const handleDelete = async (mediaId) => {
        try {
            await dispatch(hardDeleteMediaAsync(mediaId)).unwrap();
            handleCloseDetail();
            loadMedia(1, true);
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    };

    const handleRefresh = () => {
        loadMedia(1, true);
    };

    const handleUpload = async (formData) => {
        try {
            await dispatch(uploadMediaAsync(formData)).unwrap();
            setIsUploadModalOpen(false);
            loadMedia(1, true);
        } catch (error) {
            console.error('Error uploading media:', error);
        }
    };

    const imageCount = allMedia.length > 0 ? allMedia.filter(m => m.type === 'IMAGE').length : 0;
    const videoCount = allMedia.length > 0 ? allMedia.filter(m => m.type === 'VIDEO').length : 0;
    const documentCount = allMedia.length > 0 ? allMedia.filter(m => m.type === 'DOCUMENT').length : 0;

    const userTypeText = userType === 'student' ? 'học sinh' : userType === 'admin' ? 'quản trị viên' : null;
    const pageTitle = userId && userTypeText ? `Media của ${userTypeText}` : 'Quản lý Media';
    const pageDescription = userId && userTypeText
        ? `Danh sách media được tải lên bởi ${userTypeText}`
        : 'Quản lý các file media trong hệ thống';

    // Don't show upload button when viewing user-specific media
    const showUploadButton = !userId;

    return (
        <div className="flex h-full gap-6">
            {/* Left Sidebar - Buckets */}
            <BucketSidebar
                selectedBucket={selectedBucket}
                onBucketChange={handleBucketChange}
                loadingAdminDone={!parentLoading}
            />

            {/* Right Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
                            <p className="text-foreground-light text-sm mt-1">
                                {pageDescription}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleRefresh}
                                disabled={loadingGet}
                                variant={userId ? "primary" : "outline"}
                            >
                                <RefreshCw size={16} className={loadingGet ? 'animate-spin' : ''} />
                                Làm mới
                            </Button>
                            {showUploadButton && (
                                <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
                                    <Upload size={16} />
                                    Tải lên
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <MediaFilters
                        search={search}
                        onSearchChange={handleSearchChangeWrapper}
                        type={type}
                        onTypeChange={handleTypeChange}
                        status={status}
                        onStatusChange={handleStatusChange}
                        sortBy={sortBy}
                        onSortByChange={handleSortByChange}
                        sortOrder={sortOrder}
                        onSortOrderChange={handleSortOrderChange}
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-border rounded-sm">
                    <MediaTable
                        media={allMedia}
                        onViewDetail={handleViewDetail}
                        loading={loadingGet && currentPage === 1}
                        lastElementRef={lastElementRef}
                    />

                    {/* Loading more indicator */}
                    {((loadingGet && currentPage > 1) || parentLoading) && (
                        <div className="flex items-center justify-center py-4 border-t border-border">
                            <LoaderCircle className="animate-spin text-info mr-2" size={20} />
                            <span className="text-sm text-foreground-light">Đang tải thêm...</span>
                        </div>
                    )}

                    {/* End of list */}
                    {!pagination.hasNext && allMedia.length > 0 && (
                        <div className="text-center py-4 border-t border-border">
                            <span className="text-sm text-foreground-light">
                                Đã hiển thị tất cả {pagination.total} media
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <RightPanel
                isOpen={isDetailPanelOpen}
                onClose={handleCloseDetail}
                title="Xem chi tiết Media"
                width="lg"
            >
                <MediaDetail
                    mediaId={selectedMedia}
                    onClose={handleCloseDetail}
                    onDelete={handleDelete}
                    loadingDelete={loadingDelete}
                />
            </RightPanel>

            {/* Upload Modal */}
            {showUploadButton && (
                <MediaUploadModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleUpload}
                    loading={loadingUpload}
                />
            )}
        </div>
    );
};
