import { Plus } from 'lucide-react'
import { Button, RightPanel } from '../../../shared/components'
import { CompetitionFilters, CompetitionTable, AddCompetition, EditCompetition, CompetitionLeaderboard } from '../components'
import { Pagination } from '../../../shared/components/ui/Pagination'

export const CompetitionList = ({
    title = 'Quản lý cuộc thi',
    subtitle = 'Quản lý danh sách cuộc thi trong hệ thống.',

    loadCompetitions,

    // data
    competitions,
    loading,
    pagination,

    // filter state
    search,
    visibility,
    examId,

    // pagination state
    currentPage,
    itemsPerPage,

    // ui state
    openAddCompetition,
    openEditCompetition,
    openLeaderboard,
    selectedCompetitionId,
    selectedCompetitionForLeaderboard,

    // handlers
    onSearchChange,
    onVisibilityChange,
    onExamIdChange,
    onPageChange,
    onItemsPerPageChange,
    onView,
    onEdit,
    onDelete,
    onViewLeaderboard,
    onOpenAddCompetition,
    onCloseAddCompetition,
    onCloseEditCompetition,
    onCloseLeaderboard,
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
                    <Button onClick={onOpenAddCompetition}>
                        <Plus size={16} />
                        Thêm cuộc thi mới
                    </Button>
                </div>

                {/* Filters */}
                <CompetitionFilters
                    search={search}
                    onSearchChange={onSearchChange}
                    visibility={visibility}
                    onVisibilityChange={onVisibilityChange}
                    examId={examId}
                    onExamIdChange={onExamIdChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <CompetitionTable
                    competitions={competitions}
                    onViewLeaderboard={onViewLeaderboard}
                    loading={loading}
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

            {/* Add Competition */}
            <RightPanel
                isOpen={openAddCompetition}
                onClose={onCloseAddCompetition}
                title="Thêm cuộc thi mới"
            >
                <AddCompetition
                    onClose={onCloseAddCompetition}
                    loadCompetitions={loadCompetitions}
                />
            </RightPanel>

            {/* Edit Competition */}
            <RightPanel
                isOpen={openEditCompetition}
                onClose={onCloseEditCompetition}
                title="Chỉnh sửa cuộc thi"
            >
                {selectedCompetitionId && (
                    <EditCompetition
                        competitionId={selectedCompetitionId}
                        onClose={onCloseEditCompetition}
                        onSuccess={loadCompetitions}
                    />
                )}
            </RightPanel>

            {/* Competition Leaderboard */}
            <RightPanel
                isOpen={openLeaderboard}
                onClose={onCloseLeaderboard}
                title="Bảng xếp hạng"
            >
                {selectedCompetitionForLeaderboard && (
                    <CompetitionLeaderboard
                        competition={selectedCompetitionForLeaderboard}
                    />
                )}
            </RightPanel>
        </>
    )
}
