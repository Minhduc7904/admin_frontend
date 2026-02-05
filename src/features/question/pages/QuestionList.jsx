import { Plus } from 'lucide-react'
import { Button, RightPanel } from '../../../shared/components'
import { QuestionFilters, QuestionTable, AddQuestion, ViewQuestion, EditQuestion, QuestionDeleteModal } from '../components'
import { Pagination } from '../../../shared/components/ui/Pagination'

export const QuestionList = ({
    title = 'Quản lý câu hỏi',
    subtitle = 'Quản lý danh sách câu hỏi trong hệ thống.',

    loadQuestions,

    // data
    questions,
    loading,
    pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },

    // filter state
    search,
    grade,
    visibility,
    difficulty,
    type,
    subjectId,

    // pagination state
    currentPage,
    itemsPerPage,

    // ui state
    openAddQuestion,
    openViewQuestion,
    viewQuestionId,
    openEditQuestion,
    editQuestionId,
    openDeleteModal,
    deleteQuestion,

    // handlers
    onSearchChange,
    onGradeChange,
    onVisibilityChange,
    onDifficultyChange,
    onTypeChange,
    onSubjectIdChange,
    onPageChange,
    onItemsPerPageChange,
    onView,
    onEdit,
    onDelete,
    onOpenAddQuestion,
    onCloseAddQuestion,
    onCloseViewQuestion,
    onCloseEditQuestion,
    onCloseDeleteModal,
    onConfirmDelete,
}) => {
    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {title}
                        </h1>
                        <p className="text-foreground-light text-sm mt-1">
                            {subtitle}
                        </p>
                    </div>
                    <Button onClick={onOpenAddQuestion}>
                        <Plus size={16} />
                        Thêm câu hỏi mới
                    </Button>
                </div>

                {/* Filters */}
                <QuestionFilters
                    search={search}
                    onSearchChange={onSearchChange}
                    grade={grade}
                    onGradeChange={onGradeChange}
                    visibility={visibility}
                    onVisibilityChange={onVisibilityChange}
                    difficulty={difficulty}
                    onDifficultyChange={onDifficultyChange}
                    type={type}
                    onTypeChange={onTypeChange}
                    subjectId={subjectId}
                    onSubjectIdChange={onSubjectIdChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <QuestionTable
                    questions={questions}
                    loading={loading}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isViewPanelOpen={openViewQuestion}
                />

                {/* Pagination */}
                <div className="p-4 border-t border-border">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                        onItemsPerPageChange={onItemsPerPageChange}
                    />
                </div>
            </div>

            {/* Add Question */}
            <RightPanel
                isOpen={openAddQuestion}
                onClose={onCloseAddQuestion}
                title="Thêm câu hỏi mới"
                width='w-[800px]'
            >
                <AddQuestion
                    onClose={onCloseAddQuestion}
                    loadQuestions={loadQuestions}
                />
            </RightPanel>

            {/* View Question */}
            <RightPanel
                isOpen={openViewQuestion}
                onClose={onCloseViewQuestion}
                title="Chi tiết câu hỏi"
                width='w-[800px]'
            >
                {viewQuestionId && <ViewQuestion questionId={viewQuestionId} />}
            </RightPanel>

            {/* Edit Question */}
            <RightPanel
                isOpen={openEditQuestion}
                onClose={onCloseEditQuestion}
                title="Chỉnh sửa câu hỏi"
                width='w-[800px]'
            >
                {editQuestionId && (
                    <EditQuestion 
                        questionId={editQuestionId} 
                        onClose={onCloseEditQuestion}
                        loadQuestions={loadQuestions}
                    />
                )}
            </RightPanel>

            {/* Delete Confirmation Modal */}
            <QuestionDeleteModal
                isOpen={openDeleteModal}
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDelete}
                question={deleteQuestion}
                loading={loading}
            />
        </>
    )
}
