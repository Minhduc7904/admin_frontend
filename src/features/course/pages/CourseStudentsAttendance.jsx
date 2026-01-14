import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';

import {
    Button,
    Pagination,
    RightPanel,
} from '../../../shared/components/ui';

import {
    getStudentsAttendanceAsync,
    exportStudentsAttendanceAsync,
    selectStudentsAttendance,
    selectStudentsAttendancePagination,
    selectLoadingStudentsAttendance,
    selectLoadingExportStudentsAttendance,
    selectStudentsAttendanceFilters,
    setStudentsAttendanceFilters,
} from '../store/courseSlice';

import { CourseStudentsAttendanceFilters } from '../components/CourseStudentsAttendanceFilters';
import { CourseStudentsAttendanceTable } from '../components/CourseStudentsAttendanceTable';
import { StudentAttendanceDetail } from '../components/StudentAttendanceDetail';
import { ExportCourseStudentsAttendanceModal } from '../components/ExportCourseStudentsAttendanceModal';
import { useSearch } from '../../../shared/hooks';
import { getDateRange } from '../../../shared/utils';

/**
 * CourseStudentsAttendance - Điểm danh học sinh trong khóa học
 */
export const CourseStudentsAttendance = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const courseId = Number(id);

    /* ===================== VALIDATE COURSE ID ===================== */
    if (isNaN(courseId) || courseId <= 0) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID khóa học không hợp lệ. Vui lòng kiểm tra lại URL.
            </div>
        );
    }

    /* ===================== STORE ===================== */
    const studentsAttendance = useSelector(selectStudentsAttendance);
    const pagination = useSelector(selectStudentsAttendancePagination);
    const filters = useSelector(selectStudentsAttendanceFilters);

    const loadingGet = useSelector(selectLoadingStudentsAttendance);
    const loadingExport = useSelector(selectLoadingExportStudentsAttendance);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [fromDate, setFromDate] = useState(filters.fromDate || '');
    const [toDate, setToDate] = useState(filters.toDate || '');

    // Initialize with this week if filters are empty
    useEffect(() => {
        if (!filters.fromDate && !filters.toDate) {
            const { fromDate: from, toDate: to } = getDateRange('thisWeek');
            setFromDate(from);
            setToDate(to);
            dispatch(setStudentsAttendanceFilters({ fromDate: from, toDate: to }));
        }
    }, []);

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        // Only load if we have dates
        if (fromDate && toDate) {
            loadStudentsAttendance();
        }
    }, [courseId, currentPage, itemsPerPage, debouncedSearch, statusFilter, fromDate, toDate]);

    const loadStudentsAttendance = () => {
        dispatch(
            getStudentsAttendanceAsync({
                courseId,
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: debouncedSearch || undefined,
                    status: statusFilter || undefined,
                    fromDate,
                    toDate,
                },
            })
        );
    };

    /* ===================== FILTER ===================== */
    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1);
        dispatch(setStudentsAttendanceFilters({ search: value }));
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
        dispatch(setStudentsAttendanceFilters({ status: value }));
    };

    const handleFromDateChange = (value) => {
        setFromDate(value);
        setCurrentPage(1);
        dispatch(setStudentsAttendanceFilters({ fromDate: value }));
    };

    const handleToDateChange = (value) => {
        setToDate(value);
        setCurrentPage(1);
        dispatch(setStudentsAttendanceFilters({ toDate: value }));
    };

    /* ===================== VIEW STUDENT ===================== */
    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setIsDetailPanelOpen(true);
    };

    /* ===================== EXPORT ===================== */
    const handleOpenExportModal = () => {
        setIsExportModalOpen(true);
    };

    const handleExport = async (exportData) => {
        try {
            await dispatch(
                exportStudentsAttendanceAsync({
                    courseId,
                    params: {
                        fromDate: exportData.fromDate,
                        toDate: exportData.toDate,
                        status: exportData.status,
                        search: debouncedSearch || undefined,
                        // Flatten options into query params
                        includeSchool: exportData.options.includeSchool,
                        includeParentPhone: exportData.options.includeParentPhone,
                        includeStudentPhone: exportData.options.includeStudentPhone,
                        includeGrade: exportData.options.includeGrade,
                        includeEmail: exportData.options.includeEmail,
                    },
                })
            ).unwrap();
            setIsExportModalOpen(false);
        } catch (err) {
            console.error('Export students attendance failed:', err);
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
                        <h1 className="text-2xl font-bold">Điểm danh học sinh</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách học sinh và lịch sử điểm danh trong khóa học
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleOpenExportModal}
                            disabled={loadingExport}
                        >
                            <Download size={16} />
                            Xuất Excel
                        </Button>
                    </div>
                </div>

                <CourseStudentsAttendanceFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={statusFilter}
                    onStatusChange={handleStatusChange}
                    fromDate={fromDate}
                    onFromDateChange={handleFromDateChange}
                    toDate={toDate}
                    onToDateChange={handleToDateChange}
                />
            </div>

            {/* ===== INFO MESSAGE ===== */}
            {(!fromDate || !toDate) && (
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-4">
                    <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Vui lòng chọn khoảng thời gian để xem dữ liệu điểm danh.
                    </p>
                </div>
            )}

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <CourseStudentsAttendanceTable
                    studentsAttendance={studentsAttendance}
                    loading={loadingGet}
                    onViewStudent={handleViewStudent}
                    hasDateFilter={!!(fromDate && toDate)}
                />

                {fromDate && toDate && (
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
                )}
            </div>

            {/* ===== DETAIL PANEL ===== */}
            <RightPanel
                isOpen={isDetailPanelOpen}
                title="Chi tiết điểm danh học sinh"
                onClose={() => setIsDetailPanelOpen(false)}
            >
                <StudentAttendanceDetail
                    student={selectedStudent}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            </RightPanel>

            {/* ===== EXPORT MODAL ===== */}
            <ExportCourseStudentsAttendanceModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={handleExport}
                loading={loadingExport}
                initialFilters={{
                    fromDate,
                    toDate,
                    status: statusFilter,
                }}
            />
        </>
    );
};
