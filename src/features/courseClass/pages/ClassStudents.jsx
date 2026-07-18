import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Plus } from 'lucide-react';

import {
    Button,
    StatsCard,
    StatsGrid,
    Pagination,
    RightPanel,
} from '../../../shared/components/ui';

import {
    ClassStudentTable,
    ClassStudentFilters,
    ClassStudentForm,
    ClassStudentDeleteModal,
    ExportClassStudentExcelModal,
} from '../../classStudent/components';

import { useSearch } from '../../../shared/hooks';
import { CanAccess } from '../../../shared/components/permissions';
import { PERMISSIONS } from '../../../core/constants';

import {
    getAllClassStudentsAsync,
    addStudentToClassAsync,
    removeStudentFromClassAsync,
    exportClassStudentsExcelAsync,
    selectClassStudents,
    selectClassStudentPagination,
    selectClassStudentFilters,
    selectClassStudentLoadingGet,
    selectClassStudentLoadingCreate,
    selectClassStudentLoadingDelete,
    selectClassStudentLoadingExport,
    setFilters,
} from '../../classStudent/store/classStudentSlice';

/**
 * ClassStudents - Danh sách học sinh của một lớp học
 */
export const ClassStudents = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const classId = Number(id);

    /* ===================== STORE ===================== */
    const classStudents = useSelector(selectClassStudents);
    const pagination = useSelector(selectClassStudentPagination);
    const filters = useSelector(selectClassStudentFilters);

    const loadingGet = useSelector(selectClassStudentLoadingGet);
    const loadingCreate = useSelector(selectClassStudentLoadingCreate);
    const loadingDelete = useSelector(selectClassStudentLoadingDelete);
    const loadingExport = useSelector(selectClassStudentLoadingExport);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [selectedClassStudent, setSelectedClassStudent] = useState(null);

    const [formData, setFormData] = useState({
        studentId: '',
    });

    const loadClassStudents = useCallback(() => {
        dispatch(
            getAllClassStudentsAsync({
                classId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
            })
        );
    }, [classId, currentPage, debouncedSearch, dispatch, itemsPerPage]);

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadClassStudents();
    }, [loadClassStudents]);

    /* ===================== FILTER ===================== */
    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1);
        dispatch(setFilters({ search: value }));
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
        });
        setIsCreatePanelOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                addStudentToClassAsync({
                    classId,
                    studentId: Number(formData.studentId),
                })
            ).unwrap();

            setIsCreatePanelOpen(false);
            loadClassStudents();
        } catch (err) {
            console.error('Add student to class failed:', err);
        }
    };

    /* ===================== DELETE ===================== */
    const handleDelete = (classStudent) => {
        setSelectedClassStudent(classStudent);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(
                removeStudentFromClassAsync({
                    classId: selectedClassStudent.classId,
                    studentId: selectedClassStudent.studentId,
                })
            ).unwrap();
            setIsDeleteModalOpen(false);
            loadClassStudents();
        } catch (err) {
            console.error('Remove student from class failed:', err);
        }
    };

    /* ===================== EXPORT ===================== */
    const handleExport = async (options) => {
        try {
            await dispatch(
                exportClassStudentsExcelAsync({
                    ...options,
                    classId,
                })
            ).unwrap();

            setIsExportModalOpen(false);
        } catch (err) {
            console.error('Export class students failed:', err);
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
                        <h1 className="text-2xl font-bold">Danh sách học sinh</h1>
                        <p className="text-sm text-foreground-light">
                            Quản lý học sinh trong lớp học
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <CanAccess permission={PERMISSIONS.CLASS_STUDENT.EXPORT_EXCEL}>
                            <Button
                                variant="outline"
                                onClick={() => setIsExportModalOpen(true)}
                                disabled={loadingExport}
                                loading={loadingExport}
                            >
                                <Download size={16} />
                                Xuất Excel
                            </Button>
                        </CanAccess>

                        <Button onClick={handleOpenCreate}>
                            <Plus size={16} />
                            Thêm học sinh
                        </Button>
                    </div>
                </div>

                <ClassStudentFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                />
            </div>

            {/* ===== STATS ===== */}
            <StatsGrid cols={2} className="mb-4">
                <StatsCard
                    label="Tổng số học sinh"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Học sinh trong trang"
                    value={classStudents.length}
                    variant="info"
                />
            </StatsGrid>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <ClassStudentTable
                    classStudents={classStudents}
                    loading={loadingGet}
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
            <ClassStudentDeleteModal
                isOpen={isDeleteModalOpen}
                classStudent={selectedClassStudent}
                loading={loadingDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* ===== EXPORT MODAL ===== */}
            <ExportClassStudentExcelModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onConfirm={handleExport}
                loading={loadingExport}
                classId={classId}
            />

            {/* ===== CREATE PANEL ===== */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                title="Thêm học sinh vào lớp"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <ClassStudentForm
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                    loading={loadingCreate}
                />
            </RightPanel>
        </>
    );
};
