import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components';
import {
    getAllCoursesAsync,
    deleteCourseAsync,
    setFilters,
    selectCourses,
    selectCourseLoadingGet,
    selectCoursePagination,
} from '../store/courseSlice';
import { useSearch } from '../../../shared/hooks';
import { CourseFilters, CourseTable, AddCourse } from '../components';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { ROUTES } from '../../../core/constants';

/**
 * CourseList - Reusable course list component
 * @param {Object} props
 * @param {number} props.teacherId - Filter courses by teacher (for "My Courses" view)
 * @param {boolean} props.isMyCourses - Whether this is "My Courses" view
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 */
export const CourseList = ({
    teacherId = null,
    isMyCourses = false,
    title = "Quản lý khóa học",
    subtitle = "Quản lý danh sách khóa học trong hệ thống."
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courses = useSelector(selectCourses);
    const loadingGet = useSelector(selectCourseLoadingGet);
    const pagination = useSelector(selectCoursePagination);
    const filters = useSelector((state) => state.course.filters);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedVisibility, setSelectedVisibility] = useState('');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const [openAddCourseRightPanel, setOpenAddCourseRightPanel] = useState(false);

    useEffect(() => {
        loadCourses();
    }, [currentPage, itemsPerPage, debouncedSearch, selectedGrade, selectedVisibility, selectedAcademicYear, teacherId]);

    const loadCourses = () => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            grade: selectedGrade || undefined,
            visibility: selectedVisibility || undefined,
            academicYear: selectedAcademicYear || undefined,
            teacherId: teacherId || undefined, // Add teacher filter
        };

        dispatch(getAllCoursesAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1);
        dispatch(setFilters({ search: value }));
    };

    const handleGradeChange = (value) => {
        setSelectedGrade(value);
        setCurrentPage(1);
        dispatch(setFilters({ grade: value }));
    };

    const handleVisibilityChange = (value) => {
        setSelectedVisibility(value);
        setCurrentPage(1);
        dispatch(setFilters({ visibility: value }));
    };

    const handleAcademicYearChange = (value) => {
        setSelectedAcademicYear(value);
        setCurrentPage(1);
        dispatch(setFilters({ academicYear: value }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleView = (course) => {
        const path = ROUTES.COURSE_DETAIL(course.courseId);
        // Add query param to identify source
        const searchParams = isMyCourses ? '?from=my-courses' : '';
        navigate(path + searchParams);
    };

    const handleEdit = (course) => {
        // Navigate to course edit page when route is available
        // navigate(ROUTES.COURSE_EDIT(course.courseId));
    };

    const handleDelete = async (course) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}"?`)) {
            return;
        }

        try {
            await dispatch(deleteCourseAsync(course.courseId)).unwrap();
            loadCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleOpenAddCourse = () => {
        setOpenAddCourseRightPanel(true);
    };

    const handleCloseAddCourse = () => {
        setOpenAddCourseRightPanel(false);
    };

    // Calculate stats
    const publishedCount = courses.filter(c => c.visibility === 'PUBLISHED').length;
    const draftCount = courses.filter(c => c.visibility === 'DRAFT').length;

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
                    <Button onClick={handleOpenAddCourse}>
                        <Plus size={16} />
                        {isMyCourses ? 'Tạo khóa học mới' : 'Thêm khóa học mới'}
                    </Button>
                </div>

                {/* Filter and Search */}
                <CourseFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    grade={selectedGrade}
                    onGradeChange={handleGradeChange}
                    visibility={selectedVisibility}
                    onVisibilityChange={handleVisibilityChange}
                    academicYear={selectedAcademicYear}
                    onAcademicYearChange={handleAcademicYearChange}
                />
            </div>

            {/* Stats Grid */}
            <StatsGrid cols={3} className="mb-4">
                <StatsCard
                    label="Tổng khóa học"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Đã xuất bản"
                    value={publishedCount}
                    variant="success"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Bản nháp"
                    value={draftCount}
                    variant="warning"
                    loading={loadingGet}
                />
            </StatsGrid>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <CourseTable
                    courses={courses}
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

            {/* Add Course Right Panel */}
            <RightPanel
                isOpen={openAddCourseRightPanel}
                onClose={handleCloseAddCourse}
                title={isMyCourses ? "Tạo khóa học mới" : "Thêm khóa học mới"}
            >
                <AddCourse
                    onClose={handleCloseAddCourse}
                    defaultTeacherId={teacherId}
                    canSelectTeacher={!isMyCourses}
                />
            </RightPanel>
        </>
    );
};
