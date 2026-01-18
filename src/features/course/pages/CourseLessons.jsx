// src/features/course/pages/CourseLessons.jsx
import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCurrentCourse, selectCourseLoadingGet } from '../store/courseSlice';
import { getAllLessonsAsync, selectLessonFilters } from '../../lesson/store/lessonSlice';
import { getAllLessonLearningItemsAsync } from '../../lessonLearningitem/store/lessonLearningItemSlice';
import { LessonList } from '../components/LessonList';
import { AddLesson } from '../../lesson/components';
import { AddLearningItem } from '../../learningItem/components';
import { Button, RightPanel } from '../../../shared/components';
import { Plus } from 'lucide-react';

export const CourseLessons = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const courseId = Number(id);
    const course = useSelector(selectCurrentCourse);
    const loading = useSelector(selectCourseLoadingGet);
    const lessonFilters = useSelector(selectLessonFilters);
    
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [openAddLesson, setOpenAddLesson] = useState(false);
    const [openAddLearningItem, setOpenAddLearningItem] = useState(false);
    const [selectedLessonForLearningItem, setSelectedLessonForLearningItem] = useState(null);

    const handleSelectLesson = (lessonId) => {
        setSelectedLessonId(lessonId);
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

    if (loading) {
        return (
            <div className="bg-white border border-border rounded-sm p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white border border-border rounded-sm">
                {/* Header */}
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Danh sách bài học
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Quản lý bài học và tài liệu học tập
                            </p>
                        </div>
                        <Button
                            onClick={handleAddLesson}
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm bài học
                        </Button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-12 min-h-[600px]">
                    {/* Left Column - Lesson List */}
                    <div className="col-span-5 border-r border-border">
                        <LessonList
                            courseId={courseId}
                            selectedLessonId={selectedLessonId}
                            onSelectLesson={handleSelectLesson}
                            onAddLearningItem={handleAddLearningItem}
                        />
                    </div>

                    {/* Right Column - Learning Item Details */}
                    <div className="col-span-7 p-6">
                        {selectedLessonId ? (
                            <div className="text-center text-muted-foreground py-12">
                                <p className="text-lg">Chi tiết bài học</p>
                                <p className="text-sm mt-2">Coming soon...</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-muted-foreground">
                                    <p className="text-lg">Chọn một bài học để xem chi tiết</p>
                                    <p className="text-sm mt-2">
                                        Click vào bài học bên trái để xem thông tin và tài liệu
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Lesson Panel */}
            <RightPanel
                isOpen={openAddLesson}
                onClose={handleCloseAddLesson}
                title="Thêm bài học mới"
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
            >
                <AddLearningItem
                    onClose={handleCloseAddLearningItem}
                    lessonId={selectedLessonForLearningItem?.lessonId}
                    lessonTitle={selectedLessonForLearningItem?.title}
                    loadLearningItems={loadLearningItems}
                />
            </RightPanel>
        </>
    );
};
