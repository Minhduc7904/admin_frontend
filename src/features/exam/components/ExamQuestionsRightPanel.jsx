import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter } from 'lucide-react';
import {
    searchQuestionsAsync,
    selectQuestionLoadingSearch,
    addQuestionToExamAsync,
    selectSearchResults,
    selectSearchFilters,
    selectSearchPagination,
    setSearchFilters,
    setSearchPagination,
    clearSearchResults,
    selectQuestionLoadingAddToExam,
    addQuestionToExamLocally,
    removeQuestionFromSearchResults,
} from '../../question/store/questionSlice';
import { ExamQuestionsList } from './ExamQuestionsList';
import { Button, Input, Select, ConfirmModal } from '../../../shared/components';
import { SubjectSearchSelect } from '../../subject/components/SubjectSearchSelect';
import { ChapterSearchMultiSelect } from '../../chapter/components/ChapterSearchMultiSelect';
import { useSearch, useInfiniteScroll } from '../../../shared/hooks';
import { ExamQuestionCard } from './ExamQuestionCard';
import {
    DIFFICULTY_OPTIONS as BASE_DIFFICULTY_OPTIONS,
    QUESTION_TYPE_OPTIONS as BASE_TYPE_OPTIONS
} from '../../../core/constants/question-constants';
import { GRADE_OPTIONS as BASE_GRADE_OPTIONS } from '../../../core/constants/grade-constants';

// Add "All" option to the beginning of each list
const DIFFICULTY_OPTIONS = [
    { value: '', label: 'Tất cả độ khó' },
    ...BASE_DIFFICULTY_OPTIONS,
];

const TYPE_OPTIONS = [
    { value: '', label: 'Tất cả loại câu hỏi' },
    ...BASE_TYPE_OPTIONS,
];

const GRADE_OPTIONS = [
    { value: '', label: 'Tất cả khối' },
    ...BASE_GRADE_OPTIONS.filter(opt => opt.value !== ''),
];

export const ExamQuestionsRightPanel = ({
    examId,
    uncategorizedQuestions,
    allQuestionsInExam, // All questions in the exam (to exclude from search)
    loading,
    draggedQuestion,
    onQuestionDragStart,
    onQuestionDragEnd,
    dragSource,
    onEditQuestion,
    onRemoveQuestion,
    isDragOverAllQuestions,
    onAllQuestionsDragOver,
    onAllQuestionsDragLeave,
    onAllQuestionsDrop,
    onQuestionAdded,
}) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('uncategorized'); // 'uncategorized' | 'search'

    // Confirm modal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [questionToAdd, setQuestionToAdd] = useState(null);

    // Redux state for search
    const searchResults = useSelector(selectSearchResults);
    const searchFilters = useSelector(selectSearchFilters);
    const searchPagination = useSelector(selectSearchPagination);
    const searchLoading = useSelector(selectQuestionLoadingSearch);
    const addToExamLoading = useSelector(selectQuestionLoadingAddToExam);

    // Use search hook for debounce
    const { search, debouncedSearch, handleSearchChange } = useSearch(searchFilters.search, 1000);

    // Infinite scroll - load more search results
    const loadMoreSearchResults = () => {
        if (searchPagination.hasNext && !searchLoading) {
            dispatch(setSearchPagination({ page: searchPagination.page + 1 }));
        }
    };

    const lastElementRef = useInfiniteScroll(
        loadMoreSearchResults,
        searchPagination.hasNext,
        searchLoading
    );

    // Auto search when debounced search or filters change
    useEffect(() => {
        if (activeTab === 'search') {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        debouncedSearch,
        searchFilters.difficulty,
        searchFilters.type,
        searchFilters.grade,
        searchFilters.subjectId,
        searchFilters.chapterIds,
        searchPagination.page,
        activeTab,
    ]);

    // Handle search
    const handleSearch = async () => {
        try {
            // Clean up empty values before sending to backend
            const cleanFilters = {};

            if (debouncedSearch) cleanFilters.content = debouncedSearch;
            if (searchFilters.difficulty) cleanFilters.difficulty = searchFilters.difficulty;
            if (searchFilters.type) cleanFilters.type = searchFilters.type;
            if (searchFilters.grade) cleanFilters.grade = parseInt(searchFilters.grade);
            if (searchFilters.subjectId) cleanFilters.subjectId = searchFilters.subjectId;
            if (searchFilters.chapterIds && searchFilters.chapterIds.length > 0) {
                cleanFilters.chapterIds = searchFilters.chapterIds.map(ch => ch.chapterId);
            }

            // Exclude questions already in the exam
            if (allQuestionsInExam && allQuestionsInExam.length > 0) {
                cleanFilters.excludeQuestionIds = allQuestionsInExam.map(q => q.questionId);
            }

            await dispatch(searchQuestionsAsync({
                ...cleanFilters,
                page: searchPagination.page,
                limit: searchPagination.limit,
            })).unwrap();
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleFilterChange = (field, value) => {
        dispatch(setSearchFilters({ [field]: value }));

        // Reset to page 1 when filters change
        if (field !== 'search') {
            dispatch(setSearchPagination({ page: 1 }));
        }
    };

    const handleAddQuestionToExam = async (questionId) => {
        try {
            // Get the full question data before adding
            const questionToAddData = searchResults.find(q => q.questionId === questionId);
            if (!questionToAddData) {
                console.error('Question not found in search results');
                return;
            }

            await dispatch(addQuestionToExamAsync({
                examId: parseInt(examId),
                questionId,
            })).unwrap();

            // Close confirm modal
            setIsConfirmModalOpen(false);
            setQuestionToAdd(null);

            // Update local state without API calls
            // Add question to exam questions list (uncategorized)
            dispatch(addQuestionToExamLocally({
                question: {
                    ...questionToAddData,
                    sectionId: null, // Not assigned to any section
                }
            }));

            // Remove from search results
            dispatch(removeQuestionFromSearchResults({ questionId }));

        } catch (error) {
            console.error('Failed to add question to exam:', error);
        }
    };

    const handleConfirmAddQuestion = (question) => {
        setQuestionToAdd(question);
        setIsConfirmModalOpen(true);
    };

    const handleCancelAdd = () => {
        setIsConfirmModalOpen(false);
        setQuestionToAdd(null);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-border mb-4">
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'uncategorized'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('uncategorized')}
                >
                    Chưa phân loại ({uncategorizedQuestions.length})
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'search'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('search')}
                >
                    <Search className="inline w-4 h-4 mr-1" />
                    Tìm kiếm
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'uncategorized' ? (
                <div
                    className={`
                        flex-1 bg-primary border-2 rounded-lg p-4 transition-colors
                        ${isDragOverAllQuestions && dragSource === 'section'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-border'
                        }
                    `}
                    onDragOver={onAllQuestionsDragOver}
                    onDragLeave={onAllQuestionsDragLeave}
                    onDrop={onAllQuestionsDrop}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Câu hỏi chưa phân loại
                    </h3>
                    <ExamQuestionsList
                        questions={uncategorizedQuestions}
                        loading={loading}
                        draggedQuestionId={draggedQuestion?.questionId}
                        onQuestionDragStart={onQuestionDragStart}
                        onQuestionDragEnd={onQuestionDragEnd}
                        dragSource={dragSource}
                        isAllQuestions={true}
                        height="h-[700px]"
                        onEditQuestion={onEditQuestion}
                        onRemoveQuestion={onRemoveQuestion}
                    />
                </div>
            ) : (
                <div className="flex flex-col flex-1 gap-4">
                    {/* Search Filters */}
                    <div className="bg-primary border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <h4 className="font-semibold text-gray-900">Bộ lọc tìm kiếm</h4>
                        </div>

                        <div className="space-y-3">
                            {/* Search Input */}
                            <div>
                                <Input
                                    placeholder="Tìm kiếm nội dung câu hỏi..."
                                    value={search}
                                    onChange={(e) => {
                                        handleSearchChange(e.target.value);
                                        dispatch(setSearchFilters({ search: e.target.value }));
                                        dispatch(setSearchPagination({ page: 1 }));
                                    }}
                                    icon={<Search className="w-4 h-4" />}
                                />
                            </div>

                            {/* Subject Filter */}
                            <div>
                                <SubjectSearchSelect
                                    placeholder="Chọn môn học..."
                                    value={searchFilters.subjectId}
                                    onSelect={(subject) => {
                                        handleFilterChange('subjectId', subject?.subjectId || null);
                                        // Reset chapters when subject changes
                                        handleFilterChange('chapterIds', []);
                                    }}
                                />
                            </div>

                            {/* Chapter Filter */}
                            <div>
                                <ChapterSearchMultiSelect
                                    placeholder="Chọn chương..."
                                    value={searchFilters.chapterIds}
                                    onChange={(chapters) => handleFilterChange('chapterIds', chapters)}
                                    filterSubjectId={searchFilters.subjectId}
                                />
                            </div>

                            {/* Filters Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <Select
                                    value={searchFilters.difficulty}
                                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                    options={DIFFICULTY_OPTIONS}
                                />

                                <Select
                                    value={searchFilters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    options={TYPE_OPTIONS}
                                />

                                <Select
                                    value={searchFilters.grade}
                                    onChange={(e) => handleFilterChange('grade', e.target.value)}
                                    options={GRADE_OPTIONS}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="flex-1 bg-primary border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Kết quả tìm kiếm
                                {searchResults.length > 0 && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({searchResults.length} câu hỏi)
                                    </span>
                                )}
                            </h3>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="space-y-2 overflow-y-auto h-[500px]">
                                {searchResults.map((question, index) => (
                                    <div
                                        key={question.questionId}
                                        ref={index === searchResults.length - 1 ? lastElementRef : null}
                                    >
                                        <ExamQuestionCard
                                            question={question}
                                            index={index}
                                            onAddToExam={handleConfirmAddQuestion}
                                        />
                                    </div>
                                ))}
                                {searchLoading && (
                                    <div className="text-center text-gray-500 py-4">
                                        Đang tải thêm...
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">
                                {searchLoading ? 'Đang tìm kiếm...' : 'Không tìm thấy câu hỏi nào'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirm Modal for Adding Question */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={handleCancelAdd}
                onConfirm={() => handleAddQuestionToExam(questionToAdd?.questionId)}
                title="Thêm câu hỏi vào đề thi"
                message={`Bạn có chắc chắn muốn thêm câu hỏi "${questionToAdd?.content?.substring(0, 50)}..." vào đề thi này không?`}
                confirmText="Thêm câu hỏi"
                cancelText="Hủy"
                variant="info"
                isLoading={addToExamLoading}
            />
        </div>
    );
};
