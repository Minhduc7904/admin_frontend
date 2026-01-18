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

export const LessonList = ({ courseId, selectedLessonId, onSelectLesson, onAddLearningItem }) => {
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
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm bài học..."
                        value={filters.search}
                        onChange={handleSearch}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Lesson Items */}
            <div className="flex-1 overflow-y-auto">
                {allLessons.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                        <p className="text-sm">Chưa có bài học nào</p>
                        <p className="text-xs mt-1">
                            Nhấn "Thêm bài học" để tạo bài học mới
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-border">
                            {allLessons.map((lesson, index) => {
                                const isLastItem = index === allLessons.length - 1;
                                return (
                                    <div
                                        key={lesson.lessonId}
                                        ref={isLastItem ? lastElementRef : null}
                                    >
                                        <LessonItem
                                            lesson={lesson}
                                            isSelected={selectedLessonId === lesson.lessonId}
                                            onSelect={() => onSelectLesson(lesson.lessonId)}
                                            onAddLearningItem={onAddLearningItem}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Loading more indicator */}
                        {loading && currentPage > 1 && (
                            <div className="flex items-center justify-center py-4 border-t border-border">
                                <LoaderCircle className="animate-spin text-primary mr-2" size={20} />
                                <span className="text-sm text-muted-foreground">Đang tải thêm...</span>
                            </div>
                        )}

                        {/* End of list */}
                        {!pagination.hasNext && allLessons.length > 0 && (
                            <div className="text-center py-4 border-t border-border">
                                <span className="text-sm text-muted-foreground">
                                    Đã hiển thị tất cả {pagination.total} bài học
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
