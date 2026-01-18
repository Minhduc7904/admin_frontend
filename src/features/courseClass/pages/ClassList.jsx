import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components';
import { ClassFilters, ClassTable, AddClass } from '../components';
import { Pagination } from '../../../shared/components/ui/Pagination';

/**
 * ClassList - Presentational component (no logic)
 */
export const ClassList = ({
    title = 'Quản lý lớp học',
    subtitle = 'Quản lý danh sách lớp học trong hệ thống.',
    isMyClasses = false,

    loadClasses,

    // data
    classes,
    loading,
    pagination,

    // filter state
    search,
    isActive,

    // pagination state
    currentPage,
    itemsPerPage,

    // ui state
    openAddClass,

    // handlers
    onSearchChange,
    onIsActiveChange,
    onPageChange,
    onItemsPerPageChange,
    onView,
    onEdit,
    onDelete,
    onOpenAddClass,
    onCloseAddClass,

    // add class props
    defaultInstructorId = null,
    canSelectInstructor = true,
    filterCourseTeacherId = null,
    defaultCourseId = null,
    canSelectCourse = true,
}) => {
    // Calculate stats
    const now = new Date();
    const activeCount = classes.filter(c => {
        const startDate = c.startDate ? new Date(c.startDate) : null;
        const endDate = c.endDate ? new Date(c.endDate) : null;
        return startDate && startDate <= now && (!endDate || endDate >= now);
    }).length;
    const upcomingCount = classes.filter(c => {
        const startDate = c.startDate ? new Date(c.startDate) : null;
        return startDate && startDate > now;
    }).length;
    const completedCount = classes.filter(c => {
        const endDate = c.endDate ? new Date(c.endDate) : null;
        return endDate && endDate < now;
    }).length;

    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            {subtitle}
                        </p>
                    </div>
                    <Button onClick={onOpenAddClass}>
                        <Plus size={16} />
                        {isMyClasses ? 'Tạo lớp học mới' : 'Thêm lớp học mới'}
                    </Button>
                </div>

                {/* Filter and Search */}
                <ClassFilters
                    search={search}
                    onSearchChange={onSearchChange}
                    isActive={isActive}
                    onIsActiveChange={onIsActiveChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <ClassTable
                    classes={classes}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loading={loading}
                />

                {/* Pagination */}
                <div className="p-4 border-t border-border">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={onPageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                    />
                </div>
            </div>

            {/* Add Class Right Panel */}
            <RightPanel
                isOpen={openAddClass}
                onClose={onCloseAddClass}
                title={isMyClasses ? 'Tạo lớp học mới' : 'Thêm lớp học mới'}
            >
                <AddClass
                    onClose={onCloseAddClass}
                    defaultInstructorId={defaultInstructorId}
                    canSelectInstructor={canSelectInstructor}
                    filterCourseTeacherId={filterCourseTeacherId}
                    defaultCourseId={defaultCourseId}
                    canSelectCourse={canSelectCourse}
                    loadClasses={loadClasses}
                />
            </RightPanel>
        </>
    );
};
