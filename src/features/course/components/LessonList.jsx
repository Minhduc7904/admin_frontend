// src/features/course/components/LessonList.jsx
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllLessonsAsync,
    selectLessons,
    selectLessonLoadingGet,
    selectLessonFilters,
    selectLessonPagination,
    setFilters,
    resetFilters,
} from '../../lesson/store/lessonSlice';
import { LessonItem } from './LessonItem';
import { Input } from '../../../shared/components/ui';
import { useInfiniteScroll } from '../../../shared/hooks';
import { Search, Loader2, LoaderCircle } from 'lucide-react';

export const LessonList = ({ 
    courseId, 
    selectedItem, 
    onSelectLesson, 
    onSelectLearningItem,
    onAddLearningItem,
    onEditLesson,
    onDeleteLesson,
    onEditLearningItem,
    onDetachLearningItem
}) => {
    const dispatch = useDispatch();
    const lessons = useSelector(selectLessons);
    const loading = useSelector(selectLessonLoadingGet);
    const filters = useSelector(selectLessonFilters);
    const pagination = useSelector(selectLessonPagination);

    const [currentPage, setCurrentPage] = useState(1);
    const [allLessons, setAllLessons] = useState([]);

    // Load lessons
    const loadLessons = useCallback((page = 1, reset = false) => {
        if (!courseId) return;

        if (reset) {
            setAllLessons([]);
            setCurrentPage(1);
        }

        dispatch(
            getAllLessonsAsync({
                ...filters,
                courseId: courseId,
                page,
                limit: 20, // Load 20 items per page
            })
        );
    }, [dispatch, courseId, filters]);

    // Update allLessons when new data comes in
    useEffect(() => {
        if (currentPage === 1) {
            setAllLessons(lessons);
        } else {
            setAllLessons(prev => [...prev, ...lessons]);
        }
    }, [lessons, currentPage]);

    // Fetch lessons when component mounts or filters change
    useEffect(() => {
        if (courseId) {
            loadLessons(1, true);
        }

        // Cleanup filters on unmount
        return () => {
            dispatch(resetFilters());
        };
    }, [dispatch, courseId, filters.search, filters.sortBy, filters.sortOrder]);

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    // Load more function for infinite scroll
    const loadMore = useCallback(() => {
        if (pagination.hasNext && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadLessons(nextPage, false);
        }
    }, [pagination.hasNext, loading, currentPage, loadLessons]);

    // Infinite scroll hook
    const lastElementRef = useInfiniteScroll(loadMore, pagination.hasNext, loading);

    if (loading && currentPage === 1) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-3 border-b border-border bg-white shrink-0">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm bài học..."
                        value={filters.search}
                        onChange={handleSearch}
                        className="pl-8 h-8 text-sm"
                    />
                </div>
            </div>

            {/* Lesson Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {allLessons.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                        <p className="text-sm">Chưa có bài học nào</p>
                        <p className="text-xs mt-1 text-muted-foreground/70">
                            Nhấn "Thêm" để tạo bài học mới
                        </p>
                    </div>
                ) : (
                    <>
                        {allLessons.map((lesson, index) => {
                            const isLastItem = index === allLessons.length - 1;
                            return (
                                <div
                                    key={lesson.lessonId}
                                    ref={isLastItem ? lastElementRef : null}
                                >
                                    <LessonItem
                                            lesson={lesson}
                                            isSelected={selectedItem?.type === 'lesson' && selectedItem?.data?.lessonId === lesson.lessonId}
                                            onSelect={() => onSelectLesson(lesson)}
                                            onAddLearningItem={onAddLearningItem}
                                            onEdit={onEditLesson}
                                            onDelete={onDeleteLesson}
                                            selectedItem={selectedItem}
                                            onSelectLearningItem={onSelectLearningItem}
                                            onEditLearningItem={onEditLearningItem}
                                            onDetachLearningItem={onDetachLearningItem}
                                        />
                                    </div>
                                );
                            })}

                        {/* Loading more indicator */}
                        {loading && currentPage > 1 && (
                            <div className="flex items-center justify-center py-3">
                                <LoaderCircle className="animate-spin text-primary mr-2" size={16} />
                                <span className="text-xs text-muted-foreground">Đang tải thêm...</span>
                            </div>
                        )}

                        {/* End of list */}
                        {!pagination.hasNext && allLessons.length > 0 && (
                            <div className="text-center py-3">
                                <span className="text-xs text-muted-foreground">
                                    {pagination.total} bài học
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
