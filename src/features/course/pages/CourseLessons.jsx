// src/features/course/pages/CourseLessons.jsx
import { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentCourse, selectCourseLoadingGet } from '../store/courseSlice';
import { getAllLessonsAsync, selectLessonFilters, deleteLessonAsync, selectLessonLoadingDelete, selectLessons } from '../../lesson/store/lessonSlice';
import { getAllLessonLearningItemsAsync, deleteLessonLearningItemAsync, selectLessonLearningItemLoadingDelete, selectLessonLearningItems } from '../../lessonLearningitem/store/lessonLearningItemSlice';
import { LessonList } from '../components/LessonList';
import { LessonDetail } from '../components/LessonDetail';
import { LearningItemDetail } from '../components/LearningItemDetail';
import { AddLesson, EditLesson } from '../../lesson/components';
import { AddLearningItem, EditLearningItem } from '../../learningItem/components';
import { AddDocumentContent, EditDocumentContent } from '../../documentContent/components';
import { AddVideoContent, EditVideoContent } from '../../videoContent/components';
import { AddYoutubeContent, EditYoutubeContent } from '../../youtubeContent/components';
import { AddHomeworkContent, EditHomeworkContent } from '../../homeworkContent/components';
import { Button, RightPanel, PageLoading, ConfirmModal } from '../../../shared/components';
import { Plus, BookOpen, FileText } from 'lucide-react';
import { 
    deleteDocumentContentAsync, 
    selectDocumentContentLoadingDelete, 
    getAllDocumentContentsAsync 
} from '../../documentContent/store/documentContentSlice';
import { 
    deleteVideoContentAsync, 
    selectVideoContentLoadingDelete, 
    getAllVideoContentsAsync 
} from '../../videoContent/store/videoContentSlice';
import { 
    deleteYoutubeContentAsync, 
    selectYoutubeContentLoadingDelete, 
    getAllYoutubeContentsAsync 
} from '../../youtubeContent/store/youtubeContentSlice';
import { 
    deleteHomeworkContentAsync, 
    selectHomeworkContentLoadingDelete, 
    getAllHomeworkContentsAsync 
} from '../../homeworkContent/store/homeworkContentSlice';

export const CourseLessons = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const courseId = Number(id);
    const course = useSelector(selectCurrentCourse);
    const loading = useSelector(selectCourseLoadingGet);
    const lessonFilters = useSelector(selectLessonFilters);
    const loadingDeleteLesson = useSelector(selectLessonLoadingDelete);
    const loadingDetachLearningItem = useSelector(selectLessonLearningItemLoadingDelete);
    const lessons = useSelector(selectLessons);
    const loadingDeleteDocumentContent = useSelector(selectDocumentContentLoadingDelete);
    const loadingDeleteVideoContent = useSelector(selectVideoContentLoadingDelete);
    const loadingDeleteYoutubeContent = useSelector(selectYoutubeContentLoadingDelete);
    const loadingDeleteHomeworkContent = useSelector(selectHomeworkContentLoadingDelete);

    // Selection state
    const [selectedItem, setSelectedItem] = useState(null); // { type: 'lesson' | 'learningItem', data: {...} }
    const [lessonMap, setLessonMap] = useState({}); // Map of lessonId -> lesson data for reference

    // Modal state
    const [openAddLesson, setOpenAddLesson] = useState(false);
    const [openAddLearningItem, setOpenAddLearningItem] = useState(false);
    const [selectedLessonForLearningItem, setSelectedLessonForLearningItem] = useState(null);

    // Edit modal state
    const [openEditLesson, setOpenEditLesson] = useState(false);
    const [openEditLearningItem, setOpenEditLearningItem] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [editingLearningItem, setEditingLearningItem] = useState(null);

    // Add content modal state
    const [openAddContent, setOpenAddContent] = useState(false);
    const [contentType, setContentType] = useState(null); // 'DOCUMENT' | 'VIDEO' | 'YOUTUBE' | 'HOMEWORK'
    const [selectedLearningItemForContent, setSelectedLearningItemForContent] = useState(null);

    // Edit content modal state
    const [openEditContent, setOpenEditContent] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [editingContentType, setEditingContentType] = useState(null);

    // Delete/Detach confirm modal state
    const [confirmDeleteLesson, setConfirmDeleteLesson] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState(null);
    const [confirmDetachLearningItem, setConfirmDetachLearningItem] = useState(false);
    const [learningItemToDetach, setLearningItemToDetach] = useState(null);
    const [confirmDeleteContent, setConfirmDeleteContent] = useState(false);
    const [contentToDelete, setContentToDelete] = useState(null);
    const [deleteContentType, setDeleteContentType] = useState(null);

    const handleSelectLesson = (lesson) => {
        setSelectedItem({ type: 'lesson', data: lesson });
        setLessonMap(prev => ({ ...prev, [lesson.lessonId]: lesson }));
    };

    const handleSelectLearningItem = (learningItem, lesson) => {
        setSelectedItem({ type: 'learningItem', data: learningItem, lessonId: lesson.lessonId });
        setLessonMap(prev => ({ ...prev, [lesson.lessonId]: lesson }));
    };

    const handleAddLesson = () => {
        setOpenAddLesson(true);
    };

    const handleCloseAddLesson = () => {
        setOpenAddLesson(false);
    };

    const handleAddLearningItem = (lesson) => {
        setSelectedLessonForLearningItem(lesson);
        setOpenAddLearningItem(true);
    };

    const handleCloseAddLearningItem = () => {
        setOpenAddLearningItem(false);
        setSelectedLessonForLearningItem(null);
    };

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson);
        setOpenEditLesson(true);
    };

    const handleCloseEditLesson = () => {
        setOpenEditLesson(false);
        setEditingLesson(null);
    };

    const handleEditLearningItem = (learningItem) => {
        setEditingLearningItem(learningItem.learningItem ? learningItem.learningItem : learningItem);
        setOpenEditLearningItem(true);
    };

    const handleCloseEditLearningItem = () => {
        setOpenEditLearningItem(false);
        setEditingLearningItem(null);
    };

    const loadLessons = useCallback(() => {
        if (courseId) {
            dispatch(
                getAllLessonsAsync({
                    ...lessonFilters,
                    courseId: courseId,
                    page: 1,
                    limit: 20,
                })
            );
        }
    }, [dispatch, courseId, lessonFilters]);

    const loadLearningItems = useCallback(() => {
        if (selectedLessonForLearningItem?.lessonId) {
            dispatch(
                getAllLessonLearningItemsAsync({
                    lessonId: selectedLessonForLearningItem.lessonId,
                    page: 1,
                    limit: 100,
                })
            );
        }
    }, [dispatch, selectedLessonForLearningItem]);

    // Get current lesson from Redux store (reactive to updates)
    const currentLesson = useMemo(() => {
        if (selectedItem?.type === 'lesson') {
            return lessons.find(l => l.lessonId === selectedItem.data.lessonId) || selectedItem.data;
        }
        if (selectedItem?.type === 'learningItem') {
            return lessons.find(l => l.lessonId === selectedItem.lessonId) || lessonMap[selectedItem.lessonId];
        }
        return null;
    }, [lessons, selectedItem, lessonMap]);

    // Get current learning item from Redux store (reactive to updates)
    const currentLearningItemsInLesson = useSelector(selectLessonLearningItems(selectedItem?.lessonId || 0));
    const currentLearningItem = useMemo(() => {
        if (selectedItem?.type !== 'learningItem') return null;
        
        const itemFromStore = currentLearningItemsInLesson.find(
            item => item.learningItemId === selectedItem.data.learningItemId
        );
        
        return itemFromStore || selectedItem.data;
    }, [selectedItem, currentLearningItemsInLesson]);

    // Handle content operations - defined after currentLearningItem
    const handleAddContent = (type) => {
        setContentType(type);
        setSelectedLearningItemForContent(currentLearningItem?.learningItem);
        setOpenAddContent(true);
    };

    const handleCloseAddContent = () => {
        setOpenAddContent(false);
        setContentType(null);
        setSelectedLearningItemForContent(null);
    };

    const handleContentSuccess = () => {
        // Reload content list based on type
        const learningItemId = selectedLearningItemForContent?.learningItemId;
        if (!learningItemId) return;

        switch (contentType) {
            case 'DOCUMENT':
                dispatch(getAllDocumentContentsAsync({ learningItemId }));
                break;
            case 'VIDEO':
                dispatch(getAllVideoContentsAsync({ learningItemId }));
                break;
            case 'YOUTUBE':
                dispatch(getAllYoutubeContentsAsync({ learningItemId }));
                break;
            case 'HOMEWORK':
                dispatch(getAllHomeworkContentsAsync({ learningItemId }));
                break;
            default:
                break;
        }
    };

    // Delete lesson handler
    const handleDeleteLesson = (lesson) => {
        setLessonToDelete(lesson);
        setConfirmDeleteLesson(true);
    };

    const handleConfirmDeleteLesson = async () => {
        if (!lessonToDelete) return;

        try {
            await dispatch(deleteLessonAsync(lessonToDelete.lessonId)).unwrap();
            
            // Clear selection if deleted lesson was selected
            if (selectedItem?.type === 'lesson' && selectedItem.data.lessonId === lessonToDelete.lessonId) {
                setSelectedItem(null);
            }
            if (selectedItem?.type === 'learningItem' && selectedItem.lessonId === lessonToDelete.lessonId) {
                setSelectedItem(null);
            }
            
            // Close modal
            setConfirmDeleteLesson(false);
            setLessonToDelete(null);
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    };

    const handleCancelDeleteLesson = () => {
        setConfirmDeleteLesson(false);
        setLessonToDelete(null);
    };

    // Detach learning item handler
    const handleDetachLearningItem = (learningItem, lessonId) => {
        setLearningItemToDetach({ learningItem, lessonId });
        setConfirmDetachLearningItem(true);
    };

    const handleConfirmDetachLearningItem = async () => {
        if (!learningItemToDetach) return;

        try {
            await dispatch(deleteLessonLearningItemAsync({
                lessonId: learningItemToDetach.lessonId,
                learningItemId: learningItemToDetach.learningItem.learningItem.learningItemId
            })).unwrap();

            // Clear selection if detached item was selected
            if (selectedItem?.type === 'learningItem' && 
                selectedItem.data.learningItem.learningItemId === learningItemToDetach.learningItem.learningItem.learningItemId) {
                setSelectedItem({ type: 'lesson', data: lessonMap[learningItemToDetach.lessonId] });
            }

            // Close modal
            setConfirmDetachLearningItem(false);
            setLearningItemToDetach(null);
        } catch (error) {
            console.error('Error detaching learning item:', error);
        }
    };

    const handleCancelDetachLearningItem = () => {
        setConfirmDetachLearningItem(false);
        setLearningItemToDetach(null);
    };

    // Edit content handlers
    const handleEditContent = (type, content) => {
        setEditingContentType(type);
        setEditingContent(content);
        setOpenEditContent(true);
    };

    const handleCloseEditContent = () => {
        setOpenEditContent(false);
        setEditingContent(null);
        setEditingContentType(null);
    };

    const handleEditContentSuccess = () => {
        // Reload content list based on type
        const learningItemId = currentLearningItem?.learningItem?.learningItemId;
        if (!learningItemId) return;

        switch (editingContentType) {
            case 'DOCUMENT':
                dispatch(getAllDocumentContentsAsync({ learningItemId }));
                break;
            case 'VIDEO':
                dispatch(getAllVideoContentsAsync({ learningItemId }));
                break;
            case 'YOUTUBE':
                dispatch(getAllYoutubeContentsAsync({ learningItemId }));
                break;
            case 'HOMEWORK':
                dispatch(getAllHomeworkContentsAsync({ learningItemId }));
                break;
            default:
                break;
        }
    };

    // Delete content handlers
    const handleDeleteContent = (type, content) => {
        setDeleteContentType(type);
        setContentToDelete(content);
        setConfirmDeleteContent(true);
    };

    const handleConfirmDeleteContent = async () => {
        if (!contentToDelete || !deleteContentType) return;

        try {
            let deletePromise;
            let contentId;

            switch (deleteContentType) {
                case 'DOCUMENT':
                    contentId = contentToDelete.documentContentId;
                    deletePromise = dispatch(deleteDocumentContentAsync(contentId));
                    break;
                case 'VIDEO':
                    contentId = contentToDelete.videoContentId;
                    deletePromise = dispatch(deleteVideoContentAsync(contentId));
                    break;
                case 'YOUTUBE':
                    contentId = contentToDelete.youtubeContentId;
                    deletePromise = dispatch(deleteYoutubeContentAsync(contentId));
                    break;
                case 'HOMEWORK':
                    contentId = contentToDelete.homeworkContentId;
                    deletePromise = dispatch(deleteHomeworkContentAsync(contentId));
                    break;
                default:
                    return;
            }

            await deletePromise.unwrap();

            // Close modal
            setConfirmDeleteContent(false);
            setContentToDelete(null);
            setDeleteContentType(null);
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };

    const handleCancelDeleteContent = () => {
        setConfirmDeleteContent(false);
        setContentToDelete(null);
        setDeleteContentType(null);
    };
    
    if (loading) {
        return <PageLoading message="Đang tải danh sách bài học..." />;
    }

    return (
        <>
            <div className="flex h-[calc(100vh-10rem)] bg-white border border-border rounded-lg shadow-sm overflow-hidden">
                {/* Left Sidebar - Lesson List */}
                <div className="w-80 min-w-[20rem] flex flex-col border-r border-border bg-gray-50/50">
                    {/* Sidebar Header */}
                    <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <h2 className="text-sm font-semibold text-foreground">Bài học</h2>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleAddLesson}
                            className="h-7 px-2 text-xs"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Thêm
                        </Button>
                    </div>

                    {/* Sidebar Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        <LessonList
                            courseId={courseId}
                            selectedItem={selectedItem}
                            onSelectLesson={handleSelectLesson}
                            onSelectLearningItem={handleSelectLearningItem}
                            onAddLearningItem={handleAddLearningItem}
                            onEditLesson={handleEditLesson}
                            onDeleteLesson={handleDeleteLesson}
                            onEditLearningItem={handleEditLearningItem}
                            onDetachLearningItem={handleDetachLearningItem}
                        />
                    </div>
                </div>

                {/* Right Content - Detail View */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {selectedItem?.type === 'lesson' ? (
                        <LessonDetail
                            lesson={currentLesson}
                            onAddLearningItem={handleAddLearningItem}
                            onEdit={() => handleEditLesson(currentLesson)}
                            onDelete={() => handleDeleteLesson(currentLesson)}
                        />
                    ) : selectedItem?.type === 'learningItem' ? (
                        <LearningItemDetail
                            courseId={courseId}
                            lessonId={selectedItem?.lessonId ?? currentLesson?.lessonId}
                            learningItem={currentLearningItem}
                            lessonTitle={currentLesson?.title}
                            onEdit={() => handleEditLearningItem(currentLearningItem)}
                            onDelete={() => handleDetachLearningItem(currentLearningItem, selectedItem.lessonId)}
                            onAddContent={handleAddContent}
                            onEditContent={handleEditContent}
                            onDeleteContent={handleDeleteContent}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-sm px-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground mb-1">
                                    Chưa chọn bài học
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Chọn một bài học hoặc tài liệu bên trái để xem chi tiết
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Lesson Panel */}
            <RightPanel
                isOpen={openAddLesson}
                onClose={handleCloseAddLesson}
                title="Thêm bài học mới"
                subtitle="Tạo bài học mới cho khóa học này"
            >
                <AddLesson
                    onClose={handleCloseAddLesson}
                    courseId={courseId}
                    defaultTeacherId={course?.teacherId}
                    canSelectTeacher={true}
                    loadLessons={loadLessons}
                />
            </RightPanel>

            {/* Add Learning Item Panel */}
            <RightPanel
                isOpen={openAddLearningItem}
                onClose={handleCloseAddLearningItem}
                title="Thêm tài liệu học tập"
                subtitle={selectedLessonForLearningItem?.title ? `Cho bài học: ${selectedLessonForLearningItem.title}` : undefined}
            >
                <AddLearningItem
                    onClose={handleCloseAddLearningItem}
                    lessonId={selectedLessonForLearningItem?.lessonId}
                    lessonTitle={selectedLessonForLearningItem?.title}
                    loadLearningItems={loadLearningItems}
                />
            </RightPanel>

            {/* Edit Lesson Panel */}
            <RightPanel
                isOpen={openEditLesson}
                onClose={handleCloseEditLesson}
                title="Chỉnh sửa bài học"
                subtitle={editingLesson?.title}
            >
                <EditLesson
                    onClose={handleCloseEditLesson}
                    lesson={editingLesson}
                    canSelectTeacher={true}
                />
            </RightPanel>

            {/* Add Content Panels */}
            <RightPanel
                isOpen={openAddContent && contentType === 'DOCUMENT'}
                onClose={handleCloseAddContent}
                title="Thêm tài liệu mới"
                subtitle={selectedLearningItemForContent?.title}
            >
                <AddDocumentContent
                    onClose={handleCloseAddContent}
                    learningItemId={selectedLearningItemForContent?.learningItemId}
                    onSuccess={handleContentSuccess}
                />
            </RightPanel>

            <RightPanel
                isOpen={openAddContent && contentType === 'VIDEO'}
                onClose={handleCloseAddContent}
                title="Thêm video mới"
                subtitle={selectedLearningItemForContent?.title}
            >
                <AddVideoContent
                    onClose={handleCloseAddContent}
                    learningItemId={selectedLearningItemForContent?.learningItemId}
                    onSuccess={handleContentSuccess}
                />
            </RightPanel>

            <RightPanel
                isOpen={openAddContent && contentType === 'YOUTUBE'}
                onClose={handleCloseAddContent}
                title="Thêm video YouTube"
                subtitle={selectedLearningItemForContent?.title}
            >
                <AddYoutubeContent
                    onClose={handleCloseAddContent}
                    learningItemId={selectedLearningItemForContent?.learningItemId}
                    onSuccess={handleContentSuccess}
                />
            </RightPanel>

            <RightPanel
                isOpen={openAddContent && contentType === 'HOMEWORK'}
                onClose={handleCloseAddContent}
                title="Thêm bài tập mới"
                subtitle={selectedLearningItemForContent?.title}
            >
                <AddHomeworkContent
                    onClose={handleCloseAddContent}
                    learningItemId={selectedLearningItemForContent?.learningItemId}
                    onSuccess={handleContentSuccess}
                />
            </RightPanel>

            {/* Edit Learning Item Panel */}
            <RightPanel
                isOpen={openEditLearningItem}
                onClose={handleCloseEditLearningItem}
                title="Chỉnh sửa tài liệu học tập"
                subtitle={editingLearningItem?.title}
            >
                <EditLearningItem
                    onClose={handleCloseEditLearningItem}
                    learningItem={editingLearningItem}
                    lessonTitle={currentLesson?.title}
                />
            </RightPanel>

            {/* Edit Content Panels */}
            <RightPanel
                isOpen={openEditContent && editingContentType === 'DOCUMENT'}
                onClose={handleCloseEditContent}
                title="Chỉnh sửa tài liệu"
                subtitle={`#${editingContent?.documentContentId}`}
            >
                <EditDocumentContent
                    onClose={handleCloseEditContent}
                    documentContent={editingContent}
                    onSuccess={handleEditContentSuccess}
                />
            </RightPanel>

            <RightPanel
                isOpen={openEditContent && editingContentType === 'VIDEO'}
                onClose={handleCloseEditContent}
                title="Chỉnh sửa video"
                subtitle={`#${editingContent?.videoContentId}`}
            >
                <EditVideoContent
                    onClose={handleCloseEditContent}
                    videoContent={editingContent}
                    onSuccess={handleEditContentSuccess}
                />
            </RightPanel>

            <RightPanel
                isOpen={openEditContent && editingContentType === 'YOUTUBE'}
                onClose={handleCloseEditContent}
                title="Chỉnh sửa video YouTube"
                subtitle={`#${editingContent?.youtubeContentId}`}
            >
                <EditYoutubeContent
                    onClose={handleCloseEditContent}
                    youtubeContent={editingContent}
                    onSuccess={handleEditContentSuccess}
                />
            </RightPanel>

            <RightPanel
                isOpen={openEditContent && editingContentType === 'HOMEWORK'}
                onClose={handleCloseEditContent}
                title="Chỉnh sửa bài tập"
                subtitle={`#${editingContent?.homeworkContentId}`}
            >
                <EditHomeworkContent
                    onClose={handleCloseEditContent}
                    homeworkContent={editingContent}
                    onSuccess={handleEditContentSuccess}
                />
            </RightPanel>

            {/* Delete Lesson Confirm Modal */}
            <ConfirmModal
                isOpen={confirmDeleteLesson}
                onClose={handleCancelDeleteLesson}
                onConfirm={handleConfirmDeleteLesson}
                title="Xóa bài học?"
                message={
                    <div className="space-y-2">
                        <p>
                            Bạn có chắc chắn muốn xóa bài học <strong>"{lessonToDelete?.title}"</strong>?
                        </p>
                        <p className="text-warning">
                            Tất cả tài liệu học tập trong bài học này sẽ bị gỡ khỏi bài học.
                        </p>
                    </div>
                }
                confirmText="Xóa bài học"
                cancelText="Hủy"
                variant="danger"
                isLoading={loadingDeleteLesson}
            />

            {/* Detach Learning Item Confirm Modal */}
            <ConfirmModal
                isOpen={confirmDetachLearningItem}
                onClose={handleCancelDetachLearningItem}
                onConfirm={handleConfirmDetachLearningItem}
                title="Gỡ tài liệu khỏi bài học?"
                message={
                    <div className="space-y-2">
                        <p>
                            Bạn có chắc chắn muốn gỡ tài liệu <strong>"{learningItemToDetach?.learningItem?.learningItem?.title}"</strong> khỏi bài học?
                        </p>
                        <p className="text-muted-foreground text-xs">
                            Tài liệu sẽ không bị xóa và có thể thêm lại sau.
                        </p>
                    </div>
                }
                confirmText="Gỡ tài liệu"
                cancelText="Hủy"
                variant="warning"
                isLoading={loadingDetachLearningItem}
            />

            {/* Delete Content Confirm Modal */}
            <ConfirmModal
                isOpen={confirmDeleteContent}
                onClose={handleCancelDeleteContent}
                onConfirm={handleConfirmDeleteContent}
                title={`Xóa ${deleteContentType === 'DOCUMENT' ? 'tài liệu' : deleteContentType === 'VIDEO' ? 'video' : deleteContentType === 'YOUTUBE' ? 'video YouTube' : 'bài tập'}?`}
                message={
                    <div className="space-y-2">
                        <p>
                            Bạn có chắc chắn muốn xóa nội dung này?
                        </p>
                        <p className="text-warning">
                            Hành động này không thể hoàn tác.
                        </p>
                    </div>
                }
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={
                    deleteContentType === 'DOCUMENT' ? loadingDeleteDocumentContent :
                    deleteContentType === 'VIDEO' ? loadingDeleteVideoContent :
                    deleteContentType === 'YOUTUBE' ? loadingDeleteYoutubeContent :
                    loadingDeleteHomeworkContent
                }
            />
        </>
    );
};
