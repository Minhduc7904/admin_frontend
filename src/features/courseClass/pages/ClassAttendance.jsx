import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Users, Download } from 'lucide-react';

import {
    Button,
    StatsCard,
    StatsGrid,
    Pagination,
    RightPanel,
} from '../../../shared/components/ui';

import {
    AttendanceTable,
    AttendanceFilters,
    AttendanceForm,
    AttendanceDeleteModal,
    BulkAttendanceModal,
    ExportAttendanceModal,
    AttendanceDetail,
} from '../../attendance/components';

import { useSearch } from '../../../shared/hooks';

import {
    getAllAttendancesAsync,
    createAttendanceAsync,
    updateAttendanceAsync,
    deleteAttendanceAsync,
    createBulkAttendanceBySessionAsync,
    getStatisticsBySessionAsync,
    exportAttendanceBySessionAsync,
    selectAttendances,
    selectAttendancePagination,
    selectAttendanceFilters,
    selectAttendanceStatistics,
    selectAttendanceLoadingGet,
    selectAttendanceLoadingCreate,
    selectAttendanceLoadingUpdate,
    selectAttendanceLoadingDelete,
    selectAttendanceLoadingBulkCreate,
    selectAttendanceLoadingStatistics,
    selectAttendanceLoadingExport,
    setFilters,
} from '../../attendance/store/attendanceSlice';
import { ROUTES } from '../../../core/constants';
/**
 * ClassAttendance - Điểm danh của một lớp
 */
export const ClassAttendance = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const classId = Number(id);

    /* ===================== STORE ===================== */
    const attendances = useSelector(selectAttendances);
    const pagination = useSelector(selectAttendancePagination);
    const filters = useSelector(selectAttendanceFilters);
    const statistics = useSelector(selectAttendanceStatistics);

    const loadingGet = useSelector(selectAttendanceLoadingGet);
    const loadingCreate = useSelector(selectAttendanceLoadingCreate);
    const loadingUpdate = useSelector(selectAttendanceLoadingUpdate);
    const loadingDelete = useSelector(selectAttendanceLoadingDelete);
    const loadingBulkCreate = useSelector(selectAttendanceLoadingBulkCreate);
    const loadingStatistics = useSelector(selectAttendanceLoadingStatistics);
    const loadingExport = useSelector(selectAttendanceLoadingExport);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [selectedAttendance, setSelectedAttendance] = useState(null);

    const [formData, setFormData] = useState({
        sessionId: null,
        studentId: null,
        status: '',
        notes: '',
    });

    const [errors, setErrors] = useState({});

    const [statusFilter, setStatusFilter] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadAttendances();
    }, [classId, currentPage, itemsPerPage, debouncedSearch, statusFilter, selectedSession]);

    useEffect(() => {
        if (selectedSession?.sessionId) {
            dispatch(getStatisticsBySessionAsync(selectedSession.sessionId));
        }
    }, [selectedSession?.sessionId]);

    const loadAttendances = () => {
        dispatch(
            getAllAttendancesAsync({
                classId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.sessionId) {
            newErrors.sessionId = 'Vui lòng chọn buổi học';
        }

        if (!formData.studentId) {
            newErrors.studentId = 'Vui lòng chọn học sinh';
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
            sessionId: selectedSession?.sessionId || null,
            studentId: null,
            status: 'PRESENT',
            notes: '',
        });
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
                    studentId: formData.studentId,
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

    /* ===================== BULK CREATE ===================== */
    const handleOpenBulkModal = () => {
        setIsBulkModalOpen(true);
    };

    const handleBulkCreate = async (bulkData) => {
        try {
            await dispatch(
                createBulkAttendanceBySessionAsync({
                    sessionId: bulkData.sessionId,
                    status: bulkData.status,
                    notes: bulkData.notes || undefined,
                })
            ).unwrap();

            setIsBulkModalOpen(false);
            loadAttendances();
        } catch (err) {
            console.error('Bulk create attendance failed:', err);
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

    /* ===================== EXPORT ===================== */
    const handleOpenExportModal = () => {
        setIsExportModalOpen(true);
    };

    const handleExport = async (exportData) => {
        try {
            await dispatch(exportAttendanceBySessionAsync({
                sessionId: exportData.sessionId,
                options: exportData.options,
            })).unwrap();
            setIsExportModalOpen(false);
        } catch (err) {
            console.error('Export attendance failed:', err);
        }
    };

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    /* ===================== STATS ===================== */
    const presentCount = statistics?.present || 0;
    const absentCount = statistics?.absent || 0;
    const lateCount = statistics?.late || 0;
    const makeupCount = statistics?.makeup || 0;
    const statisticsTotal = statistics?.total || 0;

    /* ===================== RENDER ===================== */
    return (
        <>
            {/* ===== HEADER ===== */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý điểm danh</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách điểm danh của lớp
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleOpenExportModal}
                            variant="outline"
                            disabled={loadingExport}
                            loading={loadingExport}
                        >
                            <Download size={16} />
                            Xuất Excel
                        </Button>
                        <Button
                            onClick={handleOpenBulkModal}
                            variant="outline"
                            disabled={loadingBulkCreate}
                            loading={loadingBulkCreate}
                        >
                            <Users size={16} />
                            Điểm danh hàng loạt
                        </Button>
                        <Button onClick={handleOpenCreate}>
                            <Plus size={16} />
                            Điểm danh
                        </Button>
                    </div>
                </div>

                <AttendanceFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={statusFilter}
                    onStatusChange={handleStatusChange}
                    selectedSession={selectedSession}
                    onSessionChange={handleSessionChange}
                    classId={classId}
                />
            </div>

            {/* ===== STATS ===== */}
            <StatsGrid cols={5} className="mb-4">
                <StatsCard
                    label="Tổng điểm danh"
                    value={selectedSession ? statisticsTotal : pagination.total}
                    loading={selectedSession ? loadingStatistics : loadingGet}
                />
                <StatsCard
                    label="Có mặt"
                    value={presentCount}
                    variant="success"
                    loading={selectedSession ? loadingStatistics : false}
                />
                <StatsCard
                    label="Vắng"
                    value={absentCount}
                    variant="danger"
                    loading={selectedSession ? loadingStatistics : false}
                />
                <StatsCard
                    label="Muộn"
                    value={lateCount}
                    variant="warning"
                    loading={selectedSession ? loadingStatistics : false}
                />
                <StatsCard
                    label="Học bù"
                    value={makeupCount}
                    variant="info"
                    loading={selectedSession ? loadingStatistics : false}
                />
            </StatsGrid>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <AttendanceTable
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

            {/* ===== BULK ATTENDANCE MODAL ===== */}
            <BulkAttendanceModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onConfirm={handleBulkCreate}
                loading={loadingBulkCreate}
                classId={classId}
                selectedSession={selectedSession}
            />

            {/* ===== EXPORT ATTENDANCE MODAL ===== */}
            <ExportAttendanceModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={handleExport}
                loading={loadingExport}
                classId={classId}
                selectedSession={selectedSession}
            />

            {/* ===== CREATE PANEL ===== */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                title="Điểm danh mới"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <AttendanceForm
                    mode="create"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                    loading={loadingCreate}
                    classId={classId}
                />
            </RightPanel>

            {/* ===== EDIT PANEL ===== */}
            <RightPanel
                isOpen={isEditPanelOpen}
                title="Cập nhật điểm danh"
                onClose={() => setIsEditPanelOpen(false)}
            >
                <AttendanceForm
                    mode="edit"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={() => setIsEditPanelOpen(false)}
                    loading={loadingUpdate}
                    classId={classId}
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
