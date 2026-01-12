import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';

import {
    Button,
    StatsCard,
    StatsGrid,
    Pagination,
    RightPanel,
} from '../../../shared/components/ui';

import { EnrollmentFilters, EnrollmentDeleteModal } from '../../course/components';
import { StudentCoursesTable, StudentCoursesForm } from '../components';
import { useSearch } from '../../../shared/hooks';

import {
    getAllEnrollmentsAsync,
    createEnrollmentAsync,
    updateEnrollmentAsync,
    selectEnrollments,
    selectEnrollmentPagination,
    selectEnrollmentFilters,
    selectEnrollmentLoadingGet,
    selectEnrollmentLoadingCreate,
    selectEnrollmentLoadingUpdate,
    selectEnrollmentLoadingDelete,
    setFilters,
    deleteEnrollmentAsync,
} from '../../courseEnrollment/store/courseEnrollmentSlice';

/**
 * StudentCourses - Danh sách các khóa học mà học sinh tham gia
 */
export const StudentCourses = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const studentId = Number(id);

    /* ===================== VALIDATE STUDENT ID ===================== */
    if (isNaN(studentId) || studentId <= 0) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID học sinh không hợp lệ. Vui lòng kiểm tra lại URL.
            </div>
        );
    }

    /* ===================== STORE ===================== */
    const enrollments = useSelector(selectEnrollments);
    const pagination = useSelector(selectEnrollmentPagination);
    const filters = useSelector(selectEnrollmentFilters);

    const loadingGet = useSelector(selectEnrollmentLoadingGet);
    const loadingCreate = useSelector(selectEnrollmentLoadingCreate);
    const loadingUpdate = useSelector(selectEnrollmentLoadingUpdate);
    const loadingDelete = useSelector(selectEnrollmentLoadingDelete);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [formData, setFormData] = useState({ courseId: '', status: 'ACTIVE' });
    const [errors, setErrors] = useState({});

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadEnrollments();
    }, [studentId, currentPage, itemsPerPage, debouncedSearch, filters.status]);

    const loadEnrollments = () => {
        dispatch(
            getAllEnrollmentsAsync({
                studentId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                status: filters.status || undefined,
            })
        );
    };

    /* ===================== FILTER ===================== */
    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1);
        dispatch(setFilters({ search: value }));
    };

    const handleStatusChange = (value) => {
        setCurrentPage(1);
        dispatch(setFilters({ status: value }));
    };

    /* ===================== CREATE ===================== */
    const handleOpenCreate = () => {
        setFormData({ courseId: '', status: 'ACTIVE' });
        setErrors({});
        setIsCreatePanelOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        
        if (!formData.courseId) {
            setErrors({ courseId: 'Vui lòng chọn khóa học' });
            return;
        }

        try {
            await dispatch(createEnrollmentAsync({
                courseId: parseInt(formData.courseId),
                studentId: studentId,
                status: formData.status,
            })).unwrap();
            setIsCreatePanelOpen(false);
            loadEnrollments();
        } catch (err) {
            console.error('Create enrollment failed:', err);
        }
    };

    /* ===================== EDIT ===================== */
    const handleEdit = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setFormData({
            courseId: enrollment.courseId,
            status: enrollment.status,
        });
        setErrors({});
        setIsEditPanelOpen(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(updateEnrollmentAsync({
                id: selectedEnrollment.enrollmentId,
                data: {
                    status: formData.status,
                },
            })).unwrap();
            setIsEditPanelOpen(false);
            loadEnrollments();
        } catch (err) {
            console.error('Update enrollment failed:', err);
        }
    };

    /* ===================== DELETE ===================== */
    const handleDelete = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteEnrollmentAsync(selectedEnrollment.enrollmentId)).unwrap();
            setIsDeleteModalOpen(false);
            loadEnrollments();
        } catch (err) {
            console.error('Delete enrollment failed:', err);
        }
    };

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    /* ===================== RENDER ===================== */
    return (
        <>
            {/* ===== HEADER ===== */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Khóa học tham gia</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách các khóa học mà học sinh đang tham gia
                        </p>
                    </div>
                    <Button onClick={handleOpenCreate}>
                        <Plus size={16} />
                        Thêm khóa học
                    </Button>
                </div>

                <EnrollmentFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={filters.status}
                    onStatusChange={handleStatusChange}
                />
            </div>

            {/* ===== STATS ===== */}
            <StatsGrid cols={3} className="mb-4">
                <StatsCard 
                    label="Tổng khóa học" 
                    value={pagination.total} 
                    loading={loadingGet} 
                />
                <StatsCard
                    label="Đang học"
                    value={enrollments.filter(e => e.status === 'ACTIVE').length}
                    variant="info"
                />
                <StatsCard
                    label="Hoàn thành"
                    value={enrollments.filter(e => e.status === 'COMPLETED').length}
                    variant="success"
                />
            </StatsGrid>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <StudentCoursesTable
                    enrollments={enrollments}
                    loading={loadingGet}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <div className="p-4 border-t border-border">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            </div>

            {/* ===== DELETE MODAL ===== */}
            <EnrollmentDeleteModal
                isOpen={isDeleteModalOpen}
                enrollment={selectedEnrollment}
                loading={loadingDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* ===== CREATE PANEL ===== */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                title="Thêm khóa học cho học sinh"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <StudentCoursesForm
                    mode="create"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSelect={(course) => {
                        setFormData(prev => ({ ...prev, courseId: course?.courseId || '' }));
                        setErrors({});
                    }}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                    loading={loadingCreate}
                />
            </RightPanel>

            {/* ===== EDIT PANEL ===== */}
            <RightPanel
                isOpen={isEditPanelOpen}
                title="Cập nhật trạng thái khóa học"
                onClose={() => setIsEditPanelOpen(false)}
            >
                <StudentCoursesForm
                    mode="edit"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={() => setIsEditPanelOpen(false)}
                    loading={loadingUpdate}
                />
            </RightPanel>
        </>
    );
};
