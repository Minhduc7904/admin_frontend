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
    ClassStudentTable,
    ClassStudentFilters,
    ClassStudentForm,
    ClassStudentDeleteModal,
} from '../../classStudent/components';

import { useSearch } from '../../../shared/hooks';

import {
    getAllClassStudentsAsync,
    addStudentToClassAsync,
    removeStudentFromClassAsync,
    selectClassStudents,
    selectClassStudentPagination,
    selectClassStudentFilters,
    selectClassStudentLoadingGet,
    selectClassStudentLoadingCreate,
    selectClassStudentLoadingDelete,
    setFilters,
} from '../../classStudent/store/classStudentSlice';

/**
 * ClassStudents - Danh sách học sinh của một lớp học
 */
export const ClassStudents = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const classId = Number(id);

    /* ===================== VALIDATE CLASS ID ===================== */
    if (isNaN(classId) || classId <= 0) {
        return (
            <div className="bg-white border border-error rounded-sm p-6 text-error">
                ID lớp học không hợp lệ. Vui lòng kiểm tra lại URL.
            </div>
        );
    }

    /* ===================== STORE ===================== */
    const classStudents = useSelector(selectClassStudents);
    const pagination = useSelector(selectClassStudentPagination);
    const filters = useSelector(selectClassStudentFilters);

    const loadingGet = useSelector(selectClassStudentLoadingGet);
    const loadingCreate = useSelector(selectClassStudentLoadingCreate);
    const loadingDelete = useSelector(selectClassStudentLoadingDelete);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedClassStudent, setSelectedClassStudent] = useState(null);

    const [formData, setFormData] = useState({
        studentId: '',
    });

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadClassStudents();
    }, [classId, currentPage, itemsPerPage, debouncedSearch]);

    const loadClassStudents = () => {
        dispatch(
            getAllClassStudentsAsync({
                classId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
            })
        );
    };

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
                    <Button onClick={handleOpenCreate}>
                        <Plus size={16} />
                        Thêm học sinh
                    </Button>
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
