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

import {
    EnrollmentTable,
    EnrollmentFilters,
    EnrollmentForm,
    EnrollmentDeleteModal,
} from '../components';

import { useSearch } from '../../../shared/hooks';

import {
    getAllEnrollmentsAsync,
    createEnrollmentAsync,
    updateEnrollmentAsync,
    deleteEnrollmentAsync,
    selectEnrollments,
    selectEnrollmentPagination,
    selectEnrollmentFilters,
    selectEnrollmentLoadingGet,
    selectEnrollmentLoadingCreate,
    selectEnrollmentLoadingUpdate,
    selectEnrollmentLoadingDelete,
    setFilters,
} from '../../courseEnrollment/store/courseEnrollmentSlice';

/* ===================== ENUM MAP ===================== */
const ENROLLMENT_STATUS = {
    ACTIVE: 'Đang học',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Hủy',
};

export const CourseEnrollment = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const courseId = Number(id);

    /* ===================== VALIDATE COURSE ID ===================== */
    if (isNaN(courseId) || courseId <= 0) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID khóa học không hợp lệ. Check lại URL đi bro 🧯
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

    const [formData, setFormData] = useState({
        studentId: '',
        status: 'ACTIVE',
    });

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadEnrollments();
    }, [courseId, currentPage, itemsPerPage, debouncedSearch, filters.status]);

    const loadEnrollments = () => {
        dispatch(
            getAllEnrollmentsAsync({
                courseId,
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

    /* ===================== FORM ===================== */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /* ===================== CREATE ===================== */
    const handleOpenCreate = () => {
        setFormData({
            studentId: '',
            status: 'ACTIVE',
        });
        setIsCreatePanelOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                createEnrollmentAsync({
                    courseId,
                    studentId: Number(formData.studentId),
                    status: formData.status || undefined,
                })
            ).unwrap();

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
            status: enrollment.status,
        });
        setIsEditPanelOpen(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                updateEnrollmentAsync({
                    id: selectedEnrollment.enrollmentId,
                    data: {
                        status: formData.status,
                    },
                })
            ).unwrap();

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
                        <h1 className="text-2xl font-bold">Quản lý ghi danh</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách học viên tham gia khóa học
                        </p>
                    </div>
                    <Button onClick={handleOpenCreate}>
                        <Plus size={16} />
                        Thêm học viên
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
                <StatsCard label="Tổng ghi danh" value={pagination.total} loading={loadingGet} />
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
                <EnrollmentTable
                    enrollments={enrollments}
                    loading={loadingGet}
                    statusMap={ENROLLMENT_STATUS}
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
                title="Thêm học viên vào khóa học"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <EnrollmentForm
                    mode="create"
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    loading={loadingCreate}
                />
            </RightPanel>

            {/* ===== EDIT PANEL ===== */}
            <RightPanel
                isOpen={isEditPanelOpen}
                title="Cập nhật trạng thái ghi danh"
                onClose={() => setIsEditPanelOpen(false)}
            >
                <EnrollmentForm
                    mode="edit"
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    loading={loadingUpdate}
                />
            </RightPanel>
        </>
    );
};
