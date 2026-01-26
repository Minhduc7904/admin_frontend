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
    AttendanceTable,
    AttendanceDeleteModal,
    AttendanceDetail,
} from '../../attendance/components';

import { StudentAttendanceFilters } from '../components/StudentAttendanceFilters';
import { StudentAttendanceTable } from '../components/StudentAttendanceTable';
import { StudentAttendanceForm } from '../components/StudentAttendanceForm';

import { useSearch } from '../../../shared/hooks';

import {
    getAllAttendancesAsync,
    createAttendanceAsync,
    updateAttendanceAsync,
    deleteAttendanceAsync,
    selectAttendances,
    selectAttendancePagination,
    selectAttendanceFilters,
    selectAttendanceLoadingGet,
    selectAttendanceLoadingCreate,
    selectAttendanceLoadingUpdate,
    selectAttendanceLoadingDelete,
    setFilters,
} from '../../attendance/store/attendanceSlice';

/**
 * StudentAttendance - Điểm danh của học sinh
 */
export const StudentAttendance = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const studentId = Number(id);

    /* ===================== STORE ===================== */
    const attendances = useSelector(selectAttendances);
    const pagination = useSelector(selectAttendancePagination);
    const filters = useSelector(selectAttendanceFilters);

    const loadingGet = useSelector(selectAttendanceLoadingGet);
    const loadingCreate = useSelector(selectAttendanceLoadingCreate);
    const loadingUpdate = useSelector(selectAttendanceLoadingUpdate);
    const loadingDelete = useSelector(selectAttendanceLoadingDelete);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedAttendance, setSelectedAttendance] = useState(null);

    const [formData, setFormData] = useState({
        sessionId: null,
        studentId: null,
        status: '',
        notes: '',
    });

    const [formClass, setFormClass] = useState(null);

    const [errors, setErrors] = useState({});

    const [statusFilter, setStatusFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadAttendances();
    }, [studentId, currentPage, itemsPerPage, debouncedSearch, statusFilter, fromDate, toDate, selectedClass, selectedSession]);

    const loadAttendances = () => {
        dispatch(
            getAllAttendancesAsync({
                studentId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
                classId: selectedClass?.classId || undefined,
                sessionId: selectedSession?.sessionId || undefined,
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
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleFromDateChange = (value) => {
        setFromDate(value);
        setCurrentPage(1);
    };

    const handleToDateChange = (value) => {
        setToDate(value);
        setCurrentPage(1);
    };

    const handleClassChange = (courseClass) => {
        setSelectedClass(courseClass);
        setCurrentPage(1);
    };

    const handleSessionChange = (session) => {
        setSelectedSession(session);
        setCurrentPage(1);
    };

    /* ===================== FORM ===================== */
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleFormClassChange = (courseClass) => {
        setFormClass(courseClass);
        // Reset sessionId when class changes
        setFormData((prev) => ({ ...prev, sessionId: null }));
        // Clear errors
        if (errors.classId) {
            setErrors((prev) => ({ ...prev, classId: '' }));
        }
        if (errors.sessionId) {
            setErrors((prev) => ({ ...prev, sessionId: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formClass) {
            newErrors.classId = 'Vui lòng chọn lớp học';
        }

        if (!formData.sessionId) {
            newErrors.sessionId = 'Vui lòng chọn buổi học';
        }

        if (!formData.status) {
            newErrors.status = 'Vui lòng chọn trạng thái';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ===================== CREATE ===================== */
    const handleOpenCreate = () => {
        setFormData({
            sessionId: null,
            studentId: studentId,
            status: 'PRESENT',
            notes: '',
        });
        setFormClass(null);
        setErrors({});
        setIsCreatePanelOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(
                createAttendanceAsync({
                    sessionId: formData.sessionId,
                    studentId: studentId,
                    status: formData.status,
                    notes: formData.notes || undefined,
                })
            ).unwrap();

            setIsCreatePanelOpen(false);
            loadAttendances();
        } catch (err) {
            console.error('Create attendance failed:', err);
        }
    };

    /* ===================== EDIT ===================== */
    const handleView = (attendance) => {
        setSelectedAttendance(attendance);
        setIsDetailPanelOpen(true);
    };

    const handleEdit = (attendance) => {
        setSelectedAttendance(attendance);

        setFormData({
            sessionId: attendance.sessionId,
            studentId: attendance.studentId,
            status: attendance.status,
            notes: attendance.notes || '',
        });
        
        // Set class from session if available
        if (attendance.session?.courseClass) {
            setFormClass(attendance.session.courseClass);
        } else {
            setFormClass(null);
        }
        
        setErrors({});
        setIsEditPanelOpen(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!formData.status) {
            setErrors({ status: 'Vui lòng chọn trạng thái' });
            return;
        }

        try {
            await dispatch(
                updateAttendanceAsync({
                    id: selectedAttendance.attendanceId,
                    data: {
                        status: formData.status,
                        notes: formData.notes || undefined,
                    },
                })
            ).unwrap();

            setIsEditPanelOpen(false);
            loadAttendances();
        } catch (err) {
            console.error('Update attendance failed:', err);
        }
    };

    /* ===================== DELETE ===================== */
    const handleDelete = (attendance) => {
        setSelectedAttendance(attendance);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteAttendanceAsync(selectedAttendance.attendanceId)).unwrap();
            setIsDeleteModalOpen(false);
            loadAttendances();
        } catch (err) {
            console.error('Delete attendance failed:', err);
        }
    };

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    /* ===================== STATS ===================== */
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendances.filter(a => a.status === 'LATE').length;
    const makeupCount = attendances.filter(a => a.status === 'MAKEUP').length;

    /* ===================== RENDER ===================== */
    return (
        <>
            {/* ===== HEADER ===== */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Lịch sử điểm danh</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách điểm danh của học sinh
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleOpenCreate}>
                            <Plus size={16} />
                            Điểm danh
                        </Button>
                    </div>
                </div>

                <StudentAttendanceFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={statusFilter}
                    onStatusChange={handleStatusChange}
                    fromDate={fromDate}
                    onFromDateChange={handleFromDateChange}
                    toDate={toDate}
                    onToDateChange={handleToDateChange}
                    selectedClass={selectedClass}
                    onClassChange={handleClassChange}
                    selectedSession={selectedSession}
                    onSessionChange={handleSessionChange}
                />
            </div>

            {/* ===== STATS ===== */}
            <StatsGrid cols={5} className="mb-4">
                <StatsCard
                    label="Tổng điểm danh"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Có mặt"
                    value={presentCount}
                    variant="success"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Vắng"
                    value={absentCount}
                    variant="danger"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Muộn"
                    value={lateCount}
                    variant="warning"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Học bù"
                    value={makeupCount}
                    variant="info"
                    loading={loadingGet}
                />
            </StatsGrid>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <StudentAttendanceTable
                    attendances={attendances}
                    loading={loadingGet}
                    onView={handleView}
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
            <AttendanceDeleteModal
                isOpen={isDeleteModalOpen}
                attendance={selectedAttendance}
                loading={loadingDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* ===== CREATE PANEL ===== */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                title="Điểm danh mới"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <StudentAttendanceForm
                    mode="create"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                    loading={loadingCreate}
                    onClassChange={handleFormClassChange}
                    selectedClass={formClass}
                />
            </RightPanel>

            {/* ===== EDIT PANEL ===== */}
            <RightPanel
                isOpen={isEditPanelOpen}
                title="Cập nhật điểm danh"
                onClose={() => setIsEditPanelOpen(false)}
            >
                <StudentAttendanceForm
                    mode="edit"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={() => setIsEditPanelOpen(false)}
                    loading={loadingUpdate}
                    onClassChange={handleFormClassChange}
                    selectedClass={formClass}
                />
            </RightPanel>

            {/* ===== DETAIL PANEL ===== */}
            <RightPanel
                isOpen={isDetailPanelOpen}
                title="Chi tiết điểm danh"
                onClose={() => setIsDetailPanelOpen(false)}
            >
                <AttendanceDetail attendance={selectedAttendance} />
            </RightPanel>
        </>
    );
};
