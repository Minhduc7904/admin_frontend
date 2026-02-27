import { Plus } from 'lucide-react'
import { Button, RightPanel, ConfirmModal } from '../../../shared/components'
import { ExamFilters, ExamTable, AddExam } from '../components'
import { Pagination } from '../../../shared/components/ui/Pagination'

export const ExamList = ({
    title = 'Quản lý đề thi',
    subtitle = 'Quản lý danh sách đề thi trong hệ thống.',

    loadExams,

    // data
    exams,
    loading,
    pagination,

    // filter state
    search,
    grade,
    visibility,
    subjectId,

    // pagination state
    currentPage,
    itemsPerPage,

    // ui state
    openAddExam,
    showSubject = true,

    // handlers
    onSearchChange,
    onGradeChange,
    onVisibilityChange,
    onSubjectIdChange,
    onPageChange,
    onItemsPerPageChange,
    onView,
    onEdit,
    onDelete,
    onOpenAddExam,
    onCloseAddExam,
    // delete modal props
    deleteTarget,
    openDeleteModal,
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
                    <Button onClick={onOpenAddExam}>
                        <Plus size={16} />
                        Thêm đề thi mới
                    </Button>
                </div>

                {/* Filters */}
                <ExamFilters
                    search={search}
                    onSearchChange={onSearchChange}
                    grade={grade}
                    onGradeChange={onGradeChange}
                    visibility={visibility}
                    onVisibilityChange={onVisibilityChange}
                    subjectId={subjectId}
                    onSubjectIdChange={onSubjectIdChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <ExamTable
                    exams={exams}
                    loading={loading}
                    showSubject={showSubject}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
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

            {/* Add Exam */}
            <RightPanel
                isOpen={openAddExam}
                onClose={onCloseAddExam}
                title="Thêm đề thi mới"
            >
                <AddExam
                    onClose={onCloseAddExam}
                    loadExams={loadExams}
                />
            </RightPanel>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={openDeleteModal}
                onClose={onCloseDeleteModal}
                onConfirm={onConfirmDelete}
                title="Xóa đề thi"
                message={`Bạn có chắc chắn muốn xóa đề thi "${deleteTarget?.title}"? Thao tác này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={loading}
            />
        </>
    )
}
