import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components';
import { ROUTES } from '../../../core/constants';
import {
    getAllCourseClassesAsync,
    deleteCourseClassAsync,
    setFilters,
    selectCourseClasses,
    selectCourseClassLoadingGet,
    selectCourseClassPagination,
} from '../store/courseClassSlice';
import { useSearch } from '../../../shared/hooks';
import { ClassFilters, ClassTable, AddClass } from '../components';
import { Pagination } from '../../../shared/components/ui/Pagination';

/**
 * ClassList - Reusable class list component
 * @param {Object} props
 * @param {number} props.teacherId - Filter classes by course teacher (for "My Classes" view)
 * @param {boolean} props.isMyClasses - Whether this is "My Classes" view
 * @param {number} props.courseId - Filter classes by course (for course detail view)
 * @param {number} props.defaultCourseId - Default course ID when creating new class
 * @param {boolean} props.canSelectCourse - Allow selecting course when creating class
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 */
export const ClassList = ({ 
    teacherId = null,
    isMyClasses = false,
    courseId = null,
    defaultCourseId = null,
    canSelectCourse = true,
    title = "Quản lý lớp học",
    subtitle = "Quản lý danh sách lớp học trong hệ thống."
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useSelector(selectCourseClasses);
    const loadingGet = useSelector(selectCourseClassLoadingGet);
    const pagination = useSelector(selectCourseClassPagination);
    const filters = useSelector((state) => state.courseClass.filters);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedIsActive, setSelectedIsActive] = useState('');
    const [openAddClassRightPanel, setOpenAddClassRightPanel] = useState(false);

    useEffect(() => {
        loadClasses();
    }, [currentPage, itemsPerPage, debouncedSearch, selectedIsActive, teacherId, courseId]);

    const loadClasses = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            isActive: selectedIsActive === 'true' ? true : selectedIsActive === 'false' ? false : undefined,
            teacherId: teacherId || undefined, // Filter by course teacher
            courseId: courseId || undefined, // Filter by course
        };

        dispatch(getAllCourseClassesAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1);
        dispatch(setFilters({ search: value }));
    };

    const handleIsActiveChange = (value) => {
        setSelectedIsActive(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleView = (classItem) => {
        if (!classItem) return;
        
        // Build query string based on where we are
        let queryString = '';
        if (isMyClasses) {
            queryString = '?from=my-classes';
        } else if (courseId) {
            // From CourseClasses tab
            queryString = `?from=course-${courseId}`;
        }
        
        navigate(ROUTES.CLASS_DETAIL(classItem.classId) + queryString);
    };

    const handleEdit = (classItem) => {
        // Navigate to class edit page when route is available
        // navigate(ROUTES.CLASS_EDIT(classItem.classId));
    };

    const handleDelete = async (classItem) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa lớp học "${classItem.className}"?`)) {
            return;
        }

        try {
            await dispatch(deleteCourseClassAsync(classItem.classId)).unwrap();
            loadClasses();
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    const handleOpenAddClass = () => {
        setOpenAddClassRightPanel(true);
    };

    const handleCloseAddClass = () => {
        setOpenAddClassRightPanel(false);
    };

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
                    <Button onClick={handleOpenAddClass}>
                        <Plus size={16} />
                        {isMyClasses ? 'Tạo lớp học mới' : 'Thêm lớp học mới'}
                    </Button>
                </div>

                {/* Filter and Search */}
                <ClassFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    isActive={selectedIsActive}
                    onIsActiveChange={handleIsActiveChange}
                />
            </div>

            {/* Stats Grid */}
            <StatsGrid cols={4} className="mb-4">
                <StatsCard
                    label="Tổng lớp học"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Đang hoạt động"
                    value={activeCount}
                    variant="success"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Sắp diễn ra"
                    value={upcomingCount}
                    variant="info"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Đã kết thúc"
                    value={completedCount}
                    variant="secondary"
                    loading={loadingGet}
                />
            </StatsGrid>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <ClassTable
                    classes={classes}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loadingGet}
                />

                {/* Pagination */}
                <div className="p-4 border-t border-border">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                    />
                </div>
            </div>

            {/* Add Class Right Panel */}
            <RightPanel
                isOpen={openAddClassRightPanel}
                onClose={handleCloseAddClass}
                title={isMyClasses ? "Tạo lớp học mới" : "Thêm lớp học mới"}
            >
                <AddClass 
                    onClose={handleCloseAddClass}
                    defaultInstructorId={teacherId}
                    canSelectInstructor={!isMyClasses}
                    filterCourseTeacherId={teacherId}
                    defaultCourseId={defaultCourseId}
                    canSelectCourse={canSelectCourse}
                />
            </RightPanel>
        </>
    );
};
