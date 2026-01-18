import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components/ui';
import { ChapterList } from '../components/ChapterList';
import { ChapterFilters } from '../components/ChapterFilters';
import { ChapterForm } from '../components/ChapterForm';
import { ChapterDeleteModal } from '../components/ChapterDeleteModal';
import {
    getRootChaptersAsync,
    getChaptersBySubjectIdAsync,
    getChapterByIdAsync,
    createChapterAsync,
    updateChapterAsync,
    deleteChapterAsync,
    selectRootChapters,
    selectChaptersBySubject,
    selectCurrentChapter,
    selectChapterLoadingGet,
    selectChapterLoadingCreate,
    selectChapterLoadingUpdate,
    selectChapterLoadingDelete,
    clearCurrentChapter,
} from '../store/chapterSlice';
import {
    getAllSubjectsAsync,
    selectSubjects,
    selectSubjectLoadingGet
} from '../../subject/store/subjectSlice';

export const ChapterPage = () => {
    const dispatch = useDispatch();

    // Selectors
    const rootChapters = useSelector(selectRootChapters);
    const subjects = useSelector(selectSubjects);
    const currentChapter = useSelector(selectCurrentChapter);
    const loadingGet = useSelector(selectChapterLoadingGet);
    const loadingCreate = useSelector(selectChapterLoadingCreate);
    const loadingUpdate = useSelector(selectChapterLoadingUpdate);
    const loadingDelete = useSelector(selectChapterLoadingDelete);
    const loadingSubjects = useSelector(selectSubjectLoadingGet);

    // Local state
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [search, setSearch] = useState('');
    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        code: '',
        subjectId: '',
        parentChapterId: null,
        orderInParent: 0,
    });
    const [formErrors, setFormErrors] = useState({});
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [childrenMap, setChildrenMap] = useState({});

    // Load subjects and root chapters on mount
    useEffect(() => {
        if (subjects.length === 0) {
            dispatch(getAllSubjectsAsync({ limit: 100 }));
        }
        loadRootChapters();
    }, [subjects.length]);

    // Reload chapters when subject filter changes
    useEffect(() => {
        loadRootChapters();
    }, [selectedSubjectId]);

    const loadRootChapters = () => {
        const params = selectedSubjectId ? { subjectId: selectedSubjectId } : {};
        dispatch(getRootChaptersAsync(params));
    };

    const handleLoadChildren = async (chapterId) => {
        if (expandedNodes.has(chapterId)) {
            // Collapse node - also collapse all descendants
            const newExpanded = new Set(expandedNodes);

            // Remove the node itself
            newExpanded.delete(chapterId);

            // Recursively remove all descendants
            const removeDescendants = (parentId) => {
                const children = childrenMap[parentId] || [];
                children.forEach(child => {
                    newExpanded.delete(child.chapterId);
                    removeDescendants(child.chapterId);
                });
            };

            removeDescendants(chapterId);
            setExpandedNodes(newExpanded);
        } else {
            // Expand node - children will be loaded by ChapterList
            const newExpanded = new Set(expandedNodes);
            newExpanded.add(chapterId);
            setExpandedNodes(newExpanded);
        }
    };

    const handleCreate = (parentChapter = null) => {
        setFormData({
            name: '',
            slug: '',
            code: '',
            subjectId: parentChapter?.subjectId || selectedSubjectId || '',
            parentChapterId: parentChapter?.chapterId || null,
            orderInParent: 0,
        });
        setFormErrors({});
        setIsCreatePanelOpen(true);
    };

    const handleEdit = async (chapter) => {
        setSelectedChapter(chapter);
        // Load full chapter details if needed
        if (!chapter.subject) {
            await dispatch(getChapterByIdAsync(chapter.chapterId));
        }
        setFormData({
            name: chapter.name,
            slug: chapter.slug,
            code: chapter.code || '',
            subjectId: chapter.subjectId,
            parentChapterId: chapter.parentChapterId || null,
            orderInParent: chapter.orderInParent || 0,
        });
        setFormErrors({});
        setIsEditPanelOpen(true);
    };

    const handleDelete = (chapter) => {
        setSelectedChapter(chapter);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteChapterAsync(selectedChapter.chapterId)).unwrap();
            setIsDeleteModalOpen(false);

            // Clear parent's children cache if this was a child chapter
            if (selectedChapter.parentChapterId) {
                setChildrenMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[selectedChapter.parentChapterId];
                    return newMap;
                });
            }

            loadRootChapters();
        } catch (error) {
            console.error('Error deleting chapter:', error);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Tên chương không được để trống';
        }

        if (!formData.slug.trim()) {
            errors.slug = 'Slug không được để trống';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            errors.slug = 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang';
        }

        if (!formData.subjectId) {
            errors.subjectId = 'Vui lòng chọn môn học';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                subjectId: parseInt(formData.subjectId),
                parentChapterId: formData.parentChapterId ? parseInt(formData.parentChapterId) : null,
                orderInParent: parseInt(formData.orderInParent) || 0,
            };

            await dispatch(createChapterAsync(dataToSubmit)).unwrap();
            setIsCreatePanelOpen(false);

            // If creating a child chapter, clear parent's children cache to force reload
            if (dataToSubmit.parentChapterId) {
                setChildrenMap(prev => {
                    const newMap = { ...prev };
                    delete newMap[dataToSubmit.parentChapterId];
                    return newMap;
                });
            }

            loadRootChapters();
        } catch (error) {
            console.error('Error creating chapter:', error);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                subjectId: parseInt(formData.subjectId),
                parentChapterId: formData.parentChapterId ? parseInt(formData.parentChapterId) : null,
                orderInParent: parseInt(formData.orderInParent) || 0,
            };

            await dispatch(updateChapterAsync({
                id: selectedChapter.chapterId,
                data: dataToSubmit
            })).unwrap();
            setIsEditPanelOpen(false);

            // Clear parent's children cache if parentChapterId changed or exists
            if (dataToSubmit.parentChapterId || selectedChapter.parentChapterId) {
                setChildrenMap(prev => {
                    const newMap = { ...prev };
                    if (dataToSubmit.parentChapterId) delete newMap[dataToSubmit.parentChapterId];
                    if (selectedChapter.parentChapterId) delete newMap[selectedChapter.parentChapterId];
                    return newMap;
                });
            }

            loadRootChapters();
        } catch (error) {
            console.error('Error updating chapter:', error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCancelCreate = () => {
        setIsCreatePanelOpen(false);
        setFormData({
            name: '',
            slug: '',
            code: '',
            subjectId: '',
            parentChapterId: null,
            orderInParent: 0,
        });
        setFormErrors({});
    };

    const handleCancelEdit = () => {
        setIsEditPanelOpen(false);
        setSelectedChapter(null);
        dispatch(clearCurrentChapter());
        setFormData({
            name: '',
            slug: '',
            code: '',
            subjectId: '',
            parentChapterId: null,
            orderInParent: 0,
        });
        setFormErrors({});
    };

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý chương học</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý cấu trúc chương học theo môn học
                        </p>
                    </div>
                    <Button onClick={() => handleCreate()}>
                        <Plus size={16} />
                        Thêm chương mới
                    </Button>
                </div>

                {/* Filters */}
                <ChapterFilters
                    search={search}
                    onSearchChange={setSearch}
                    selectedSubjectId={selectedSubjectId}
                    onSubjectChange={setSelectedSubjectId}
                    subjects={subjects}
                    loadingSubjects={loadingSubjects}
                />
            </div>

            {/* Tree List */}
            <div className="bg-white border border-border rounded-sm p-4">
                <ChapterList
                    chapters={rootChapters}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                    onLoadChildren={handleLoadChildren}
                    expandedNodes={expandedNodes}
                    childrenMap={childrenMap}
                    setChildrenMap={setChildrenMap}
                    loading={loadingGet}
                    level={0}
                />
            </div>

            {/* Delete Modal */}
            <ChapterDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                chapter={selectedChapter}
                loading={loadingDelete}
            />

            {/* Create Panel */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                onClose={handleCancelCreate}
                title="Tạo chương mới"
            >
                <ChapterForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={handleCancelCreate}
                    loading={loadingCreate}
                    subjects={subjects}
                    mode="create"
                />
            </RightPanel>

            {/* Edit Panel */}
            <RightPanel
                isOpen={isEditPanelOpen}
                onClose={handleCancelEdit}
                title="Chỉnh sửa chương"
            >
                <ChapterForm
                    formData={formData}
                    errors={formErrors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                    loading={loadingUpdate}
                    subjects={subjects}
                    mode="edit"
                />
            </RightPanel>
        </>
    );
};
