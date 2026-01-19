import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, RefreshCw, Upload, LoaderCircle, Folder } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel, Modal } from '../../../shared/components/ui';
import { FolderTree, FolderForm, FolderDeleteModal } from '../components';
import { MediaFilters, MediaDetail, MediaUploadModal } from '../../media/components';
import { MediaTable } from '../components/MediaTable';
import { useSearch, useInfiniteScroll } from '../../../shared/hooks';
import {
    getRootMediaFoldersAsync,
    createMediaFolderAsync,
    updateMediaFolderAsync,
    deleteMediaFolderAsync,
    selectRootMediaFolders,
    selectMediaFolderLoadingRoots,
    selectMediaFolderLoadingCreate,
    selectMediaFolderLoadingUpdate,
    selectMediaFolderLoadingDelete,
} from '../store/mediaFolderSlice';
import {
    getAllMediaAsync,
    getMediaByIdAsync,
    uploadMediaAsync,
    updateMediaAsync,
    hardDeleteMediaAsync,
    selectMedia,
    selectMediaPagination,
    selectMediaLoadingGet,
    selectMediaLoadingUpload,
    selectMediaLoadingUpdate,
    selectMediaLoadingSoftDelete,
    setFilters as setMediaFilters,
    selectMediaFilters,
} from '../../media/store/mediaSlice';

export const MediaFolderPage = () => {
    const dispatch = useDispatch();

    // Folder state
    const rootFolders = useSelector(selectRootMediaFolders);
    const loadingFolders = useSelector(selectMediaFolderLoadingRoots);
    const loadingCreateFolder = useSelector(selectMediaFolderLoadingCreate);
    const loadingUpdateFolder = useSelector(selectMediaFolderLoadingUpdate);
    const loadingDeleteFolder = useSelector(selectMediaFolderLoadingDelete);

    // Media state
    const media = useSelector(selectMedia);
    const pagination = useSelector(selectMediaPagination);
    const filters = useSelector(selectMediaFilters);
    const loadingGet = useSelector(selectMediaLoadingGet);
    const loadingUpload = useSelector(selectMediaLoadingUpload);
    const loadingUpdateMedia = useSelector(selectMediaLoadingUpdate);
    const loadingDelete = useSelector(selectMediaLoadingSoftDelete);

    // Local state - Folders
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [childrenMap, setChildrenMap] = useState({});
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isFolderCreatePanelOpen, setIsFolderCreatePanelOpen] = useState(false);
    const [isFolderEditPanelOpen, setIsFolderEditPanelOpen] = useState(false);
    const [isFolderDeleteModalOpen, setIsFolderDeleteModalOpen] = useState(false);
    const [folderFormData, setFolderFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: null,
        parentName: '',
    });
    const [folderFormErrors, setFolderFormErrors] = useState({});

    // Local state - Media
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [type, setType] = useState(filters.type);
    const [status, setStatus] = useState(filters.status);
    const [sortBy, setSortBy] = useState(filters.sortBy);
    const [sortOrder, setSortOrder] = useState(filters.sortOrder);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMediaDetailPanelOpen, setIsMediaDetailPanelOpen] = useState(false);
    const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [allMedia, setAllMedia] = useState([]);
    const [isMoveMediaModalOpen, setIsMoveMediaModalOpen] = useState(false);
    const [moveMediaData, setMoveMediaData] = useState(null);

    // Load root folders
    useEffect(() => {
        dispatch(getRootMediaFoldersAsync());
    }, [dispatch]);

    // Load media when folder or filters change
    useEffect(() => {
        loadMedia(1, true);
    }, [debouncedSearch, selectedFolderId, type, status, sortBy, sortOrder]);

    // Update allMedia when new data comes in
    useEffect(() => {
        if (currentPage === 1) {
            setAllMedia(media);
        } else {
            setAllMedia(prev => [...prev, ...media]);
        }
    }, [media, currentPage]);

    const loadMedia = useCallback((page = 1, reset = false) => {
        if (reset) {
            setAllMedia([]);
            setCurrentPage(1);
        }

        const params = {
            page,
            limit: 20,
            search: debouncedSearch || undefined,
            folderId: selectedFolderId || undefined,
            type: type || undefined,
            status: status || undefined,
            sortBy,
            sortOrder,
        };

        dispatch(getAllMediaAsync(params));
    }, [debouncedSearch, selectedFolderId, type, status, sortBy, sortOrder, dispatch]);

    const loadMore = useCallback(() => {
        if (pagination.hasNext && !loadingGet) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadMedia(nextPage, false);
        }
    }, [pagination.hasNext, loadingGet, currentPage, loadMedia]);

    // Infinite scroll
    const lastElementRef = useInfiniteScroll(loadMore, pagination.hasNext, loadingGet);

    // Folder handlers
    const handleFolderSelect = (folderId, isToggle) => {
        if (isToggle) {
            // Toggle expand/collapse
            const newExpanded = new Set(expandedNodes);
            if (expandedNodes.has(folderId)) {
                newExpanded.delete(folderId);
                // Remove all descendants
                const removeDescendants = (parentId) => {
                    const children = childrenMap[parentId] || [];
                    children.forEach(child => {
                        newExpanded.delete(child.folderId);
                        removeDescendants(child.folderId);
                    });
                };
                if (folderId) removeDescendants(folderId);
            } else {
                newExpanded.add(folderId);
            }
            setExpandedNodes(newExpanded);
        } else {
            // Select folder to show media
            setSelectedFolderId(folderId);
        }
    };

    const handleFolderCreate = (parentFolder = null) => {
        setFolderFormData({
            name: '',
            slug: '',
            description: '',
            parentId: parentFolder?.folderId || null,
            parentName: parentFolder?.name || '',
        });
        setFolderFormErrors({});
        setIsFolderCreatePanelOpen(true);
    };

    const handleFolderEdit = (folder) => {
        setSelectedFolder(folder);
        setFolderFormData({
            slug: folder.slug,
            name: folder.name,
            description: folder.description || '',
            parentId: folder.parentId || null,
            parentName: '',
        });
        setFolderFormErrors({});
        setIsFolderEditPanelOpen(true);
    };

    const handleFolderDelete = (folder) => {
        setSelectedFolder(folder);
        setIsFolderDeleteModalOpen(true);
    };

    const validateFolderForm = () => {
        const errors = {};
        if (!folderFormData.name.trim()) {
            errors.name = 'Tên thư mục không được để trống';
            if (!folderFormData.slug.trim()) {
                errors.slug = 'Slug không được để trống';
            } else if (!/^[a-z0-9-]+$/.test(folderFormData.slug)) {
                errors.slug = 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang';
            }
        }
        setFolderFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFolderFormChange = (e) => {
        const { name, value } = e.target;
        setFolderFormData(prev => ({ ...prev, [name]: value }));
        if (folderFormErrors[name]) {
            setFolderFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmitCreateFolder = async (e) => {
        e.preventDefault();
        if (!validateFolderForm()) return;

        try {
            const dataToSubmit = {
                name: folderFormData.name,
                slug: folderFormData.slug,
                description: folderFormData.description || undefined,
                parentId: folderFormData.parentId || undefined,
            };

            const created = await dispatch(
                createMediaFolderAsync(dataToSubmit)
            ).unwrap();

            setIsFolderCreatePanelOpen(false);

            if (dataToSubmit.parentId) {
                // 1️⃣ Add created folder to parent's children
                setChildrenMap(prev => {
                    const newMap = { ...prev };
                    const parentChildren = newMap[dataToSubmit.parentId] || [];
                    newMap[dataToSubmit.parentId] = [...parentChildren, created.data];
                    return newMap;
                });

                // 2️⃣ Auto expand parent
                setExpandedNodes(prev => new Set(prev).add(dataToSubmit.parentId));
            } else {
                // Root folder
                dispatch(getRootMediaFoldersAsync());
            }

        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleSubmitEditFolder = async (e) => {
        e.preventDefault();
        if (!validateFolderForm()) return;

        try {
            const dataToSubmit = {
                slug: folderFormData.slug,
                name: folderFormData.name,
                description: folderFormData.description || null,
            };

            await dispatch(updateMediaFolderAsync({
                id: selectedFolder.folderId,
                data: dataToSubmit
            })).unwrap();
            setIsFolderEditPanelOpen(false);

            // Clear parent's children cache
            if (selectedFolder.parentId) {
                setChildrenMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[selectedFolder.parentId];
                    return newMap;
                });
            } else {
                dispatch(getRootMediaFoldersAsync());
            }
        } catch (error) {
            console.error('Error updating folder:', error);
        }
    };

    const handleConfirmDeleteFolder = async () => {
        try {
            await dispatch(deleteMediaFolderAsync(selectedFolder.folderId)).unwrap();
            setIsFolderDeleteModalOpen(false);

            // Clear parent's children cache
            if (selectedFolder.parentId) {
                setChildrenMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[selectedFolder.parentId];
                    return newMap;
                });
            } else {
                dispatch(getRootMediaFoldersAsync());
            }

            // If deleted folder was selected, clear selection
            if (selectedFolderId === selectedFolder.folderId) {
                setSelectedFolderId(null);
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    // Media handlers
    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        dispatch(setMediaFilters({ search: value }));
    };

    const handleTypeChange = (value) => {
        setType(value);
        dispatch(setMediaFilters({ type: value }));
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        dispatch(setMediaFilters({ status: value }));
    };

    const handleSortByChange = (value) => {
        setSortBy(value);
        dispatch(setMediaFilters({ sortBy: value }));
    };

    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        dispatch(setMediaFilters({ sortOrder: value }));
    };

    const handleViewDetail = async (mediaItem) => {
        setSelectedMedia(mediaItem.mediaId);
        setIsMediaDetailPanelOpen(true);
        await dispatch(getMediaByIdAsync(mediaItem.mediaId));
    };

    const handleCloseDetail = () => {
        setIsMediaDetailPanelOpen(false);
        setSelectedMedia(null);
    };

    const handleDelete = async (mediaId) => {
        try {
            await dispatch(hardDeleteMediaAsync(mediaId)).unwrap();
            handleCloseDetail();
            loadMedia(1, true);

            // Update mediaCount of the folder
            if (selectedFolderId) {
                // Update in rootFolders
                const rootFolderIndex = rootFolders.findIndex(f => f.folderId === selectedFolderId);
                if (rootFolderIndex !== -1) {
                    dispatch(getRootMediaFoldersAsync());
                } else {
                    // Update in childrenMap
                    setChildrenMap(prev => {
                        const newMap = { ...prev };
                        for (const [parentId, children] of Object.entries(newMap)) {
                            const folderIndex = children.findIndex(f => f.folderId === selectedFolderId);
                            if (folderIndex !== -1) {
                                const updatedChildren = [...children];
                                updatedChildren[folderIndex] = {
                                    ...updatedChildren[folderIndex],
                                    mediaCount: Math.max(0, (updatedChildren[folderIndex].mediaCount || 0) - 1)
                                };
                                newMap[parentId] = updatedChildren;
                                break;
                            }
                        }
                        return newMap;
                    });
                }
            }
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    };

    const handleRefresh = () => {
        loadMedia(1, true);
        dispatch(getRootMediaFoldersAsync());
    };

    const handleUpload = async (formData) => {
        try {
            // Add folderId to formData if a folder is selected
            if (selectedFolderId) {
                formData.append('folderId', selectedFolderId);
            }

            await dispatch(uploadMediaAsync(formData)).unwrap();
            setIsMediaUploadModalOpen(false);
            loadMedia(1, true);

            // Update mediaCount of the folder
            if (selectedFolderId) {
                // Update in rootFolders
                const rootFolderIndex = rootFolders.findIndex(f => f.folderId === selectedFolderId);
                if (rootFolderIndex !== -1) {
                    dispatch(getRootMediaFoldersAsync());
                } else {
                    // Update in childrenMap
                    setChildrenMap(prev => {
                        const newMap = { ...prev };
                        for (const [parentId, children] of Object.entries(newMap)) {
                            const folderIndex = children.findIndex(f => f.folderId === selectedFolderId);
                            if (folderIndex !== -1) {
                                const updatedChildren = [...children];
                                updatedChildren[folderIndex] = {
                                    ...updatedChildren[folderIndex],
                                    mediaCount: (updatedChildren[folderIndex].mediaCount || 0) + 1
                                };
                                newMap[parentId] = updatedChildren;
                                break;
                            }
                        }
                        return newMap;
                    });
                }
            }
        } catch (error) {
            console.error('Error uploading media:', error);
        }
    };

    const handleDropMediaToFolder = (dropData) => {
        // Prevent dropping to same folder
        if (dropData.currentFolderId === dropData.targetFolderId) {
            return;
        }

        setMoveMediaData(dropData);
        setIsMoveMediaModalOpen(true);
    };

    const handleConfirmMoveMedia = async () => {
        if (!moveMediaData) return;

        try {
            await dispatch(updateMediaAsync({
                id: moveMediaData.mediaId,
                data: { folderId: moveMediaData.targetFolderId }
            })).unwrap();

            setIsMoveMediaModalOpen(false);
            setMoveMediaData(null);
            loadMedia(1, true);

            // Update mediaCount: decrease from old folder, increase in new folder
            const updateFolderCount = (folderId, delta) => {
                if (!folderId) return;

                const rootIndex = rootFolders.findIndex(f => f.folderId === folderId);
                if (rootIndex !== -1) {
                    dispatch(getRootMediaFoldersAsync());
                } else {
                    setChildrenMap(prev => {
                        const newMap = { ...prev };
                        for (const [parentId, children] of Object.entries(newMap)) {
                            const folderIndex = children.findIndex(f => f.folderId === folderId);
                            if (folderIndex !== -1) {
                                const updatedChildren = [...children];
                                updatedChildren[folderIndex] = {
                                    ...updatedChildren[folderIndex],
                                    mediaCount: Math.max(0, (updatedChildren[folderIndex].mediaCount || 0) + delta)
                                };
                                newMap[parentId] = updatedChildren;
                                break;
                            }
                        }
                        return newMap;
                    });
                }
            };

            // Decrease old folder count
            if (moveMediaData.currentFolderId) {
                updateFolderCount(moveMediaData.currentFolderId, -1);
            }

            // Increase new folder count
            updateFolderCount(moveMediaData.targetFolderId, 1);

        } catch (error) {
            console.error('Error moving media:', error);
        }
    };
    // Find selected folder info
    const selectedFolderInfo = selectedFolderId
        ? (() => {
            // First check in root folders
            const rootFolder = rootFolders.find(f => f.folderId === selectedFolderId);
            if (rootFolder) return rootFolder;

            // Then check in all children maps
            for (const children of Object.values(childrenMap)) {
                const childFolder = children.find(f => f.folderId === selectedFolderId);
                if (childFolder) return childFolder;
            }

            return null;
        })()
        : null;

    // Build folder breadcrumb path
    const getFolderPath = (folderId) => {
        if (!folderId) return 'Tất cả Media';

        const path = [];
        let currentFolder = selectedFolderInfo;

        // Build path from current folder to root
        while (currentFolder) {
            path.unshift(currentFolder.name);

            if (!currentFolder.parentId) break;

            // Find parent folder
            const parentInRoot = rootFolders.find(f => f.folderId === currentFolder.parentId);
            if (parentInRoot) {
                currentFolder = parentInRoot;
            } else {
                // Search in childrenMap
                let found = false;
                for (const children of Object.values(childrenMap)) {
                    const parentInChildren = children.find(f => f.folderId === currentFolder.parentId);
                    if (parentInChildren) {
                        currentFolder = parentInChildren;
                        found = true;
                        break;
                    }
                }
                if (!found) break;
            }
        }

        return path.length > 0 ? path.join(' / ') : 'Tất cả Media';
    };

    const folderPath = getFolderPath(selectedFolderId);

    return (
        <div className="flex h-full gap-6">
            {/* Left Sidebar - Folder Tree */}
            <div className="w-80 flex-shrink-0">
                <div className="bg-white border border-border rounded-sm h-full flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-foreground">Thư mục</h2>
                            <Button
                                size="sm"
                                onClick={() => handleFolderCreate()}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                        <p className="text-xs text-foreground-light">
                            Click vào thư mục để xem media
                        </p>
                    </div>

                    {/* Folder Tree */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {/* All Media Button */}
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

                        <FolderTree
                            folders={rootFolders.map(f => ({ ...f, onDropMedia: handleDropMediaToFolder }))}
                            selectedFolderId={selectedFolderId}
                            onFolderSelect={handleFolderSelect}
                            onFolderCreate={handleFolderCreate}
                            onFolderEdit={handleFolderEdit}
                            onFolderDelete={handleFolderDelete}
                            expandedNodes={expandedNodes}
                            childrenMap={Object.fromEntries(
                                Object.entries(childrenMap).map(([key, folders]) => [
                                    key,
                                    folders.map(f => ({ ...f, onDropMedia: handleDropMediaToFolder }))
                                ])
                            )}
                            setChildrenMap={setChildrenMap}
                            loading={loadingFolders}
                            level={0}
                        />
                    </div>
                </div>
            </div>

            {/* Right Content - Media */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {folderPath}
                            </h1>
                            <p className="text-foreground-light text-sm mt-1">
                                {selectedFolderInfo
                                    ? selectedFolderInfo.description || 'Media trong thư mục này'
                                    : 'Quản lý các file media theo thư mục'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleRefresh}
                                disabled={loadingGet}
                                variant="outline"
                            >
                                <RefreshCw size={16} className={loadingGet ? 'animate-spin' : ''} />
                                Làm mới
                            </Button>
                            <Button onClick={() => setIsMediaUploadModalOpen(true)}>
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

                {/* Table */}
                <div className="bg-white border border-border rounded-sm">
                    <MediaTable
                        media={allMedia}
                        onViewDetail={handleViewDetail}
                        loading={loadingGet && currentPage === 1}
                        lastElementRef={lastElementRef}
                    />

                    {/* Loading more indicator */}
                    {loadingGet && currentPage > 1 && (
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

            {/* Folder Create Panel */}
            <RightPanel
                isOpen={isFolderCreatePanelOpen}
                onClose={() => setIsFolderCreatePanelOpen(false)}
                title="Tạo thư mục mới"
            >
                <FolderForm
                    formData={folderFormData}
                    errors={folderFormErrors}
                    onChange={handleFolderFormChange}
                    onSubmit={handleSubmitCreateFolder}
                    onCancel={() => setIsFolderCreatePanelOpen(false)}
                    loading={loadingCreateFolder}
                    mode="create"
                />
            </RightPanel>

            {/* Folder Edit Panel */}
            <RightPanel
                isOpen={isFolderEditPanelOpen}
                onClose={() => setIsFolderEditPanelOpen(false)}
                title="Chỉnh sửa thư mục"
            >
                <FolderForm
                    formData={folderFormData}
                    errors={folderFormErrors}
                    onChange={handleFolderFormChange}
                    onSubmit={handleSubmitEditFolder}
                    onCancel={() => setIsFolderEditPanelOpen(false)}
                    loading={loadingUpdateFolder}
                    mode="edit"
                />
            </RightPanel>

            {/* Folder Delete Modal */}
            <FolderDeleteModal
                isOpen={isFolderDeleteModalOpen}
                onClose={() => setIsFolderDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteFolder}
                folder={selectedFolder}
                loading={loadingDeleteFolder}
            />

            {/* Media Detail Panel */}
            <RightPanel
                isOpen={isMediaDetailPanelOpen}
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

            {/* Media Upload Modal */}
            <MediaUploadModal
                isOpen={isMediaUploadModalOpen}
                onClose={() => setIsMediaUploadModalOpen(false)}
                onUpload={handleUpload}
                loading={loadingUpload}
            />

            {/* Move Media Confirmation Modal */}
            <Modal
                isOpen={isMoveMediaModalOpen}
                onClose={() => {
                    setIsMoveMediaModalOpen(false);
                    setMoveMediaData(null);
                }}
                title="Xác nhận di chuyển media"
            >
                <div className="p-6">
                    <p className="text-foreground mb-4">
                        Bạn có chắc chắn muốn di chuyển media <strong>{moveMediaData?.mediaName}</strong> sang thư mục <strong>{moveMediaData?.targetFolderName}</strong>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsMoveMediaModalOpen(false);
                                setMoveMediaData(null);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirmMoveMedia}
                            loading={loadingUpdateMedia}
                            disabled={loadingUpdateMedia}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>

    );
};
