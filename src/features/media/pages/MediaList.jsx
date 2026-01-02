import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, LoaderCircle, Upload, FolderOpen } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components/ui';
import { MediaTable, MediaFilters, MediaDetail, MediaUploadModal } from '../components';
import { useSearch, useInfiniteScroll } from '../../../shared/hooks';
import { useParams } from 'react-router-dom';
import {
    getAllMediaAsync,
    getBucketsAsync,
    getMediaByIdAsync,
    uploadMediaAsync,
    softDeleteMediaAsync,
    hardDeleteMediaAsync,
    selectMedia,
    selectBuckets,
    selectMediaPagination,
    selectMediaLoadingGet,
    selectMediaLoadingBuckets,
    selectMediaLoadingUpload,
    selectMediaLoadingSoftDelete,
    setFilters,
    selectMediaFilters,
} from '../store/mediaSlice';
import {
    selectCurrentAdmin,
    selectAdminLoadingGet
} from '../../admin/store/adminSlice';

export const MediaList = () => {
    const dispatch = useDispatch();

    const { id } = useParams();
    const admin = useSelector(selectCurrentAdmin);
    const loadingAdminGet = useSelector(selectAdminLoadingGet);
    const invalidId = isNaN(id) || id <= 0;
    const [userId, setUserId] = useState(null);
    const [loadingAdminDone, setLoadingAdminDone] = useState(false);
    
    useEffect(() => {
        if (id && !invalidId && admin?.userId) {
            setUserId(Number(admin.userId));
            setLoadingAdminDone(true);
        } else if (invalidId || !id) {
            setUserId(null);
            setLoadingAdminDone(true);
        } else {
            setUserId(null);
        }
    }, [id, invalidId, admin?.userId]);

    const media = useSelector(selectMedia);
    const buckets = useSelector(selectBuckets);
    const pagination = useSelector(selectMediaPagination);
    const filters = useSelector(selectMediaFilters);
    const loadingGet = useSelector(selectMediaLoadingGet);
    const loadingBuckets = useSelector(selectMediaLoadingBuckets);
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
        if (!loadingAdminDone) return;
        dispatch(getBucketsAsync());
    }, [dispatch, loadingAdminDone]);

    // Load initial data
    useEffect(() => {
        if (!loadingAdminDone) return; 
        loadMedia(1, true);
    }, [debouncedSearch, selectedBucket, type, status, sortBy, sortOrder, userId, loadingAdminDone]);

    // Update allMedia when new data comes in
    useEffect(() => {
        if (currentPage === 1) {
            setAllMedia(media);
        } else {
            setAllMedia(prev => [...prev, ...media]);
        }
    }, [media, currentPage]);

    const loadMedia = useCallback((page = 1, reset = false) => {
        if (!loadingAdminDone) return;
        if (reset) {
            setAllMedia([]);
            setCurrentPage(1);
        }
        // console.log('Loading media with params:', {
        //     debouncedSearch, selectedBucket, type, status, sortBy, sortOrder, userId, loadingAdminDone
        // } );
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
    }, [debouncedSearch, selectedBucket, type, status, sortBy, sortOrder, userId, loadingAdminDone]);

    const loadMore = useCallback(() => {
        if (pagination.hasNext && !loadingGet && loadingAdminDone) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadMedia(nextPage, false);
        }
    }, [pagination.hasNext, loadingGet, currentPage, loadMedia, loadingAdminDone]);

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
        // Load full media details
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

    return (
        <div className="flex h-full gap-6">
            {/* Left Sidebar - Buckets */}
            <div className="w-64 flex-shrink-0">
                <div className="bg-white border border-border rounded-sm overflow-hidden sticky top-4">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <FolderOpen size={18} className="text-foreground-light" />
                            <h3 className="font-semibold text-foreground">Buckets</h3>
                        </div>
                    </div>
                    <nav className="p-2">
                        <button
                            onClick={() => handleBucketChange('')}
                            className={`w-full text-left px-4 py-3 rounded-sm transition-colors ${selectedBucket === ''
                                ? 'bg-gray-100 text-foreground font-medium'
                                : 'text-foreground-light hover:bg-gray-50 hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Tất cả buckets</span>
                            </div>
                        </button>
                        {(loadingBuckets || !loadingAdminDone) ? (
                            <div className="p-4 text-center text-sm text-foreground-light">
                                Đang tải...
                            </div>
                        ) : (
                            buckets.length > 0 && buckets.map((bucket) => (
                                <button
                                    key={bucket.name}
                                    onClick={() => handleBucketChange(bucket.name)}
                                    className={`w-full text-left px-4 py-3 rounded-sm transition-colors ${selectedBucket === bucket.name
                                        ? 'bg-gray-100 text-foreground font-medium'
                                        : 'text-foreground-light hover:bg-gray-50 hover:text-foreground'
                                        }`}
                                >
                                    <div className="text-sm">{bucket.label}</div>
                                    <div className="text-xs text-foreground-light mt-0.5">
                                        {bucket.description}
                                    </div>
                                </button>
                            ))
                        )}
                    </nav>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Quản lý Media</h1>
                            <p className="text-foreground-light text-sm mt-1">
                                Quản lý các file media trong hệ thống
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleRefresh} disabled={loadingGet} variant="outline">
                                <RefreshCw size={16} className={loadingGet ? 'animate-spin' : ''} />
                                Làm mới
                            </Button>
                            <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
                                <Upload size={16} />
                                Tải lên
                            </Button>
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

                {/* Stats */}
                <StatsGrid cols={4} className="mb-4">
                    <StatsCard
                        label="Tổng media"
                        value={pagination.total}
                        loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                    />
                    <StatsCard
                        label="Hình ảnh"
                        value={imageCount}
                        variant="info"
                        loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                    />
                    <StatsCard
                        label="Video"
                        value={videoCount}
                        variant="success"
                        loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                    />
                    <StatsCard
                        label="Tài liệu"
                        value={documentCount}
                        variant="warning"
                        loading={(loadingGet && currentPage === 1) || !loadingAdminDone}
                    />
                </StatsGrid>

                {/* Table */}
                <div className="bg-white border border-border rounded-sm">
                    <MediaTable
                        media={allMedia}
                        onViewDetail={handleViewDetail}
                        loading={loadingGet && currentPage === 1}
                        lastElementRef={lastElementRef}
                    />

                    {/* Loading more indicator */}
                    {(loadingGet && currentPage > 1) || !loadingAdminDone && (
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
            <MediaUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
                loading={loadingUpload}
            />
        </div>
    );
};
