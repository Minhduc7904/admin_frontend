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

import { ClassStudentFilters, ClassStudentDeleteModal } from '../../classStudent/components';
import { StudentClassesTable, StudentClassesForm } from '../components';
import { useSearch } from '../../../shared/hooks';

import {
    getAllClassStudentsAsync,
    addStudentToClassAsync,
    selectClassStudents,
    selectClassStudentPagination,
    selectClassStudentFilters,
    selectClassStudentLoadingGet,
    selectClassStudentLoadingCreate,
    selectClassStudentLoadingDelete,
    setFilters,
    removeStudentFromClassAsync,
} from '../../classStudent/store/classStudentSlice';

/**
 * StudentClasses - Danh sách các lớp học mà học sinh tham gia
 */
export const StudentClasses = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const studentId = Number(id);
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
    const [formData, setFormData] = useState({ classId: '' });
    const [errors, setErrors] = useState({});

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadClassStudents();
    }, [studentId, currentPage, itemsPerPage, debouncedSearch]);

    const loadClassStudents = () => {
        dispatch(
            getAllClassStudentsAsync({
                studentId,
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

    /* ===================== CREATE ===================== */
    const handleOpenCreate = () => {
        setFormData({ classId: '' });
        setErrors({});
        setIsCreatePanelOpen(true);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        
        if (!formData.classId) {
            setErrors({ classId: 'Vui lòng chọn lớp học' });
            return;
        }

        try {
            await dispatch(addStudentToClassAsync({
                classId: parseInt(formData.classId),
                studentId: studentId,
            })).unwrap();
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
                        <h1 className="text-2xl font-bold">Lớp học tham gia</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách các lớp học mà học sinh đang tham gia
                        </p>
                    </div>
                    <Button onClick={handleOpenCreate}>
                        <Plus size={16} />
                        Thêm lớp học
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
                    label="Tổng số lớp"
                    value={pagination.total}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Lớp trong trang"
                    value={classStudents.length}
                    variant="info"
                />
            </StatsGrid>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <StudentClassesTable
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
                <StudentClassesForm
                    formData={formData}
                    errors={errors}
                    onSelect={(courseClass) => {
                        setFormData(prev => ({ ...prev, classId: courseClass?.classId || '' }));
                        setErrors({});
                    }}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                    loading={loadingCreate}
                />
            </RightPanel>
        </>
    );
};
