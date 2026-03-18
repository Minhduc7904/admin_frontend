import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Users, Download, Calendar } from 'lucide-react';

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
    AttendanceExport,
} from '../../attendance/components';

import { useSearch } from '../../../shared/hooks';

import {
    getAllAttendancesAsync,
    createAttendanceAsync,
    updateAttendanceAsync,
    updateAttendanceStatusAsync,
    deleteAttendanceAsync,
    createBulkAttendanceBySessionAsync,
    getStatisticsBySessionAsync,
    exportAttendanceBySessionAsync,
    toggleParentNotifiedAsync,
    selectAttendances,
    selectAttendancePagination,
    selectAttendanceFilters,
    selectAttendanceStatistics,
    selectAttendanceLoadingGet,
    selectAttendanceLoadingCreate,
    selectAttendanceLoadingUpdate,
    selectAttendanceLoadingUpdateStatus,
    selectAttendanceLoadingDelete,
    selectAttendanceLoadingBulkCreate,
    selectAttendanceLoadingStatistics,
    selectAttendanceLoadingExport,
    selectAttendanceLoadingToggleParentNotified,
    setFilters,
} from '../../attendance/store/attendanceSlice';
import { ROUTES } from '../../../core/constants';
import {
    selectCurrentCourseClass,
} from '../store/courseClassSlice';
import {
    getHomeworkContentsByCourseAsync,
    clearByCourseHomeworkContents,
    selectByCourseHomeworkContents,
    selectHomeworkContentLoadingGetByCourse,
} from '../../homeworkContent/store/homeworkContentSlice';
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
    const loadingUpdateStatus = useSelector(selectAttendanceLoadingUpdateStatus);
    const loadingDelete = useSelector(selectAttendanceLoadingDelete);
    const loadingBulkCreate = useSelector(selectAttendanceLoadingBulkCreate);
    const loadingStatistics = useSelector(selectAttendanceLoadingStatistics);
    const loadingExport = useSelector(selectAttendanceLoadingExport);
    const loadingToggleParentNotified = useSelector(selectAttendanceLoadingToggleParentNotified);

    /* homework filter */
    const courseClass = useSelector(selectCurrentCourseClass);
    const byCourseHomeworkContents = useSelector(selectByCourseHomeworkContents);
    const loadingGetByCourse = useSelector(selectHomeworkContentLoadingGetByCourse);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isExportPanelOpen, setIsExportPanelOpen] = useState(false);
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
    const [statusUpdatingAttendanceId, setStatusUpdatingAttendanceId] = useState(null);

    /* tuition / homework filter — persisted in slice */
    const showTuition = filters.showTuition;
    const tuitionMonth = filters.tuitionMonth;
    const tuitionYear = filters.tuitionYear;
    const tuitionStatus = filters.tuitionStatus || '';
    const showHomework = filters.showHomework;
    const selectedHomeworkId = filters.selectedHomeworkId;

    // Find selected homework object from ID for SearchableSelect
    const selectedHomework = selectedHomeworkId
        ? byCourseHomeworkContents.find(hw => hw.homeworkContentId === selectedHomeworkId)
        : null;

    // Stable key: non-empty only when both month AND year are selected
    const tuitionFilterKey = (showTuition && tuitionMonth && tuitionYear)
        ? `${tuitionMonth}-${tuitionYear}`
        : '';

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadAttendances();
    // Only re-fetch for tuition when BOTH month and year are chosen (or both cleared)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId, currentPage, itemsPerPage, debouncedSearch, statusFilter, selectedSession, tuitionFilterKey, tuitionStatus, selectedHomeworkId]);

    // Fetch homework list when showHomework is toggled on and list is not yet loaded
    useEffect(() => {
        if (showHomework && courseClass?.courseId && byCourseHomeworkContents.length === 0) {
            dispatch(getHomeworkContentsByCourseAsync(courseClass.courseId));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showHomework, courseClass?.courseId]);

    useEffect(() => {
        if (selectedSession?.sessionId) {
            dispatch(getStatisticsBySessionAsync(selectedSession.sessionId));
        }
    }, [selectedSession?.sessionId]);

    const loadAttendances = () => {
        if (!selectedSession) return;
        dispatch(
            getAllAttendancesAsync({
                classId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
                sessionId: selectedSession?.sessionId || undefined,
                month: showTuition ? tuitionMonth : undefined,
                year: showTuition ? tuitionYear : undefined,
                tuitionStatus: (showTuition && tuitionStatus) ? tuitionStatus : undefined,
                homeworkContentId: (showHomework && selectedHomeworkId) ? selectedHomeworkId : undefined,
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

    const handleShowTuitionChange = (val) => {
        dispatch(setFilters({ showTuition: val }));
        if (!val) {
            dispatch(setFilters({
                tuitionMonth: new Date().getMonth() + 1,
                tuitionYear: new Date().getFullYear(),
                tuitionStatus: '',
            }));
        }
    };
    const handleTuitionMonthChange = (val) => { dispatch(setFilters({ tuitionMonth: val })); setCurrentPage(1); };
    const handleTuitionYearChange  = (val) => { dispatch(setFilters({ tuitionYear: val }));  setCurrentPage(1); };
    const handleTuitionStatusChange = (val) => { dispatch(setFilters({ tuitionStatus: val })); setCurrentPage(1); };

    const handleShowHomeworkChange = (val) => {
        dispatch(setFilters({ showHomework: val }));
        if (!val) {
            dispatch(setFilters({ selectedHomeworkId: null }));
            dispatch(clearByCourseHomeworkContents());
        }
        setCurrentPage(1);
    };
    const handleHomeworkChange = (homeworkObject) => {
        dispatch(setFilters({ selectedHomeworkId: homeworkObject?.homeworkContentId || null }));
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

    const handleExportAttendance = (attendance) => {
        setSelectedAttendance(attendance);
        setIsExportPanelOpen(true);
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

    /* ===================== TOGGLE PARENT NOTIFIED ===================== */
    const handleToggleParentNotified = async (attendance) => {
        try {
            await dispatch(toggleParentNotifiedAsync(attendance.attendanceId)).unwrap();
        } catch (err) {
            console.error('Toggle parent notified failed:', err);
        }
    };

    /* ===================== UPDATE STATUS ===================== */
    const handleAttendanceStatusChange = async (attendance, newStatus) => {
        // Không cập nhật nếu status giống nhau
        if (attendance.status === newStatus) return;

        setStatusUpdatingAttendanceId(attendance.attendanceId);
        try {
            await dispatch(updateAttendanceStatusAsync({
                id: attendance.attendanceId,
                status: newStatus,
            })).unwrap();
        } catch (err) {
            console.error('Update status failed:', err);
        } finally {
            setStatusUpdatingAttendanceId((prev) =>
                prev === attendance.attendanceId ? null : prev
            );
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
                    showTuition={showTuition}
                    onShowTuitionChange={handleShowTuitionChange}
                    tuitionMonth={tuitionMonth}
                    tuitionYear={tuitionYear}
                    onTuitionMonthChange={handleTuitionMonthChange}
                    onTuitionYearChange={handleTuitionYearChange}
                    tuitionStatus={tuitionStatus}
                    onTuitionStatusChange={handleTuitionStatusChange}
                    /* homework */
                    hasClass={!!courseClass}
                    showHomework={showHomework}
                    onShowHomeworkChange={handleShowHomeworkChange}
                    homeworkContents={byCourseHomeworkContents}
                    selectedHomework={selectedHomework}
                    onHomeworkChange={handleHomeworkChange}
                    loadingHomework={loadingGetByCourse}
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
                {!selectedSession ? (
                    <div className="flex flex-col items-center justify-center py-16 text-foreground-light">
                        <Calendar size={48} className="mb-3 text-gray-300" />
                        <p className="text-base font-medium">Vui lòng chọn buổi học</p>
                        <p className="text-sm mt-1">Chọn một buổi học ở bộ lọc phía trên để xem điểm danh.</p>
                    </div>
                ) : (
                    <>
                        <AttendanceTable
                            attendances={attendances}
                            loading={loadingGet}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onExport={handleExportAttendance}
                            onToggleParentNotified={handleToggleParentNotified}
                            onStatusChange={handleAttendanceStatusChange}
                            statusLoading={loadingUpdateStatus}
                            statusUpdatingAttendanceId={statusUpdatingAttendanceId}
                            tuitionMonth={(showTuition && tuitionMonth && tuitionYear) ? tuitionMonth : undefined}
                            tuitionYear={(showTuition && tuitionMonth && tuitionYear) ? tuitionYear : undefined}
                            showHomework={showHomework && !!selectedHomeworkId}
                            homeworkTitle={selectedHomework?.content}
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
                    </>
                )}
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

            {/* ===== EXPORT PANEL ===== */}
            <RightPanel
                isOpen={isExportPanelOpen}
                title="Xuất phiếu điểm danh"
                onClose={() => setIsExportPanelOpen(false)}
                width="w-[700px]"
            >
                <AttendanceExport attendance={selectedAttendance} />
            </RightPanel>
        </>
    );
};
