// src/features/course/components/LessonList.jsx
import { useEffect, useCallback, useReducer, useRef } from 'react';
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

const getLessonId = (lesson) => lesson?.lessonId;

const deduplicateLessons = (lessons) => {
    const seenLessonIds = new Set();

    return lessons.filter((lesson) => {
        const lessonId = getLessonId(lesson);
        if (seenLessonIds.has(lessonId)) {
            return false;
        }

        seenLessonIds.add(lessonId);
        return true;
    });
};

const mergeLessonPage = (existingLessons, incomingLessons) => {
    const incomingById = new Map(
        incomingLessons.map((lesson) => [getLessonId(lesson), lesson])
    );
    const seenLessonIds = new Set();
    const mergedLessons = [];

    existingLessons.forEach((lesson) => {
        const lessonId = getLessonId(lesson);
        if (seenLessonIds.has(lessonId)) {
            return;
        }

        seenLessonIds.add(lessonId);
        mergedLessons.push(incomingById.get(lessonId) || lesson);
    });

    incomingLessons.forEach((lesson) => {
        const lessonId = getLessonId(lesson);
        if (!seenLessonIds.has(lessonId)) {
            seenLessonIds.add(lessonId);
            mergedLessons.push(lesson);
        }
    });

    return mergedLessons;
};

const updateLoadedLessons = (existingLessons, updatedLessons) => {
    const updatedById = new Map(
        updatedLessons.map((lesson) => [getLessonId(lesson), lesson])
    );
    let hasUpdate = false;

    const nextLessons = existingLessons.map((lesson) => {
        const updatedLesson = updatedById.get(getLessonId(lesson));
        if (updatedLesson && updatedLesson !== lesson) {
            hasUpdate = true;
            return updatedLesson;
        }

        return lesson;
    });

    return hasUpdate ? nextLessons : existingLessons;
};

const lessonListReducer = (currentLessons, action) => {
    switch (action.type) {
        case 'reset':
            return [];
        case 'loadPage':
            return action.page === 1
                ? deduplicateLessons(action.lessons)
                : mergeLessonPage(currentLessons, action.lessons);
        case 'syncUpdates':
            return updateLoadedLessons(currentLessons, action.lessons);
        default:
            return currentLessons;
    }
};

const currentPageReducer = (currentPage, action) => {
    switch (action.type) {
        case 'reset':
            return 1;
        case 'set':
            return action.page;
        default:
            return currentPage;
    }
};

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

    const [currentPage, dispatchCurrentPage] = useReducer(currentPageReducer, 1);
    const [allLessons, dispatchAllLessons] = useReducer(lessonListReducer, []);
    const latestPaginationRef = useRef(pagination);

    // Load lessons
    const loadLessons = useCallback((page = 1, reset = false) => {
        if (!courseId) return;

        if (reset) {
            dispatchAllLessons({ type: 'reset' });
            dispatchCurrentPage({ type: 'reset' });
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

    // A fulfilled list request replaces `pagination` with the response metadata.
    // Other successful actions (edit/add/delete learning items) can change `lessons`
    // too, but must only update their matching lesson instead of appending the page.
    useEffect(() => {
        const receivedNewPage = pagination !== latestPaginationRef.current;

        if (receivedNewPage) {
            latestPaginationRef.current = pagination;
            dispatchAllLessons({
                type: 'loadPage',
                page: Number(pagination?.page) || 1,
                lessons,
            });
        } else {
            dispatchAllLessons({ type: 'syncUpdates', lessons });
        }
    }, [lessons, pagination]);

    // Fetch lessons when component mounts or filters change
    useEffect(() => {
        if (courseId) {
            loadLessons(1, true);
        }

        // Cleanup filters on unmount
        return () => {
            dispatch(resetFilters());
        };
    }, [dispatch, courseId, loadLessons]);

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    // Load more function for infinite scroll
    const loadMore = useCallback(() => {
        if (pagination.hasNext && !loading) {
            const nextPage = currentPage + 1;
            dispatchCurrentPage({ type: 'set', page: nextPage });
            loadLessons(nextPage, false);
        }
    }, [pagination.hasNext, loading, currentPage, loadLessons]);

    // Infinite scroll hook
    const lastElementRef = useInfiniteScroll(loadMore, pagination.hasNext, loading);

    if (loading && currentPage === 1) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-info" />
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
                                <LoaderCircle className="animate-spin text-info mr-2" size={16} />
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
