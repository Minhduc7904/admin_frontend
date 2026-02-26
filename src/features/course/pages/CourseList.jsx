import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, RightPanel } from '../../../shared/components'
import { CourseFilters, CourseTable, AddCourse, EditCourse } from '../components'
import { Pagination } from '../../../shared/components/ui/Pagination'

export const CourseList = ({
    title = 'Quản lý khóa học',
    subtitle = 'Quản lý danh sách khóa học trong hệ thống.',
    isMyCourses = false,

    loadCourses,

    // data
    courses,
    loading,
    pagination,

    // filter state
    search,
    grade,
    visibility,
    academicYear,

    // pagination state
    currentPage,
    itemsPerPage,

    // ui state
    openAddCourse,

    // handlers
    onSearchChange,
    onGradeChange,
    onVisibilityChange,
    onAcademicYearChange,
    onPageChange,
    onItemsPerPageChange,
    onView,
    onDelete,
    onOpenAddCourse,
    onCloseAddCourse,

    // add course
    teacherId,
    canSelectTeacher = true,
}) => {
    const [editCourse, setEditCourse] = useState(null)
    const [openEditCourse, setOpenEditCourse] = useState(false)

    const handleEditOpen = (course) => {
        // Enrich list item with nested subject/teacher objects for SearchSelect display
        const enriched = {
            ...course,
            subject: course.subjectId
                ? { subjectId: course.subjectId, name: course.subjectName }
                : null,
            teacher: course.teacherId
                ? { adminId: course.teacherId, fullName: course.teacherName }
                : null,
        }
        setEditCourse(enriched)
        setOpenEditCourse(true)
    }

    const handleEditClose = () => {
        setOpenEditCourse(false)
        setEditCourse(null)
        loadCourses()
    }

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
                    <Button onClick={onOpenAddCourse}>
                        <Plus size={16} />
                        {isMyCourses ? 'Tạo khóa học mới' : 'Thêm khóa học mới'}
                    </Button>
                </div>

                {/* Filters */}
                <CourseFilters
                    search={search}
                    onSearchChange={onSearchChange}
                    grade={grade}
                    onGradeChange={onGradeChange}
                    visibility={visibility}
                    onVisibilityChange={onVisibilityChange}
                    academicYear={academicYear}
                    onAcademicYearChange={onAcademicYearChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <CourseTable
                    courses={courses}
                    loading={loading}
                    onView={onView}
                    onEdit={handleEditOpen}
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

            {/* Add Course */}
            <RightPanel
                isOpen={openAddCourse}
                onClose={onCloseAddCourse}
                title={isMyCourses ? 'Tạo khóa học mới' : 'Thêm khóa học mới'}
            >
                <AddCourse
                    onClose={onCloseAddCourse}
                    defaultTeacherId={teacherId}
                    canSelectTeacher={canSelectTeacher}
                    loadCourses={loadCourses}
                />
            </RightPanel>

            {/* Edit Course */}
            <RightPanel
                isOpen={openEditCourse}
                onClose={handleEditClose}
                title="Chỉnh sửa khóa học"
            >
                <EditCourse
                    course={editCourse}
                    onClose={handleEditClose}
                    disableTeacherEdit={isMyCourses}
                />
            </RightPanel>
        </>
    )
}
