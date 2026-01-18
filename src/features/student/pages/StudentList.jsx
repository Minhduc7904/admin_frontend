import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, StatsCard, StatsGrid, RightPanel } from '../../../shared/components';
import {
    getAllStudentsAsync,
    setFilters,
    selectStudents,
    selectStudentLoadingGet,
    selectStudentPagination,
} from '../store/studentSlice';
import { useSearch } from '../../../shared/hooks';
import { StudentFilters, StudentTable, AddStudent } from '../components';
import { Pagination } from '../../../shared/components/ui/Pagination';
import { ROUTES } from '../../../core/constants';
import {
    toggleUserActivationAsync
} from '../../user/store/userSlice';

export const StudentList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const students = useSelector(selectStudents);
    const loadingGet = useSelector(selectStudentLoadingGet);
    const pagination = useSelector(selectStudentPagination);
    const filters = useSelector((state) => state.student.filters);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedIsActive, setSelectedIsActive] = useState('');
    const [openAddStudentRightPanel, setOpenAddStudentRightPanel] = useState(false);

    useEffect(() => {
        loadStudents();
    }, [currentPage, itemsPerPage, debouncedSearch, selectedGrade, selectedIsActive]);

    const loadStudents = () => {

        const params = {
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch || undefined,
            grade: selectedGrade || undefined,
        };

        if (selectedIsActive === 'true') {
            params.isActive = true;
        } else if (selectedIsActive === 'false') {
            params.isActive = false;
        }

        dispatch(getAllStudentsAsync(params));
    };

    const handleSearchChangeWrapper = (value) => {
        handleSearchChange(value);
        setCurrentPage(1); // Reset to first page on search
        dispatch(setFilters({ search: value }));
    };

    const handleGradeChange = (value) => {
        setSelectedGrade(value);
        setCurrentPage(1); // Reset to first page on filter change
        dispatch(setFilters({ grade: value }));
    };

    const handleIsActiveChange = (value) => {
        setSelectedIsActive(value);
        setCurrentPage(1); // Reset to first page on filter change
        dispatch(setFilters({ isActive: value }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleView = (student) => {
        navigate(ROUTES.STUDENT_DETAIL(student.studentId));
    };
    const handleOpenAddStudent = () => {
        setOpenAddStudentRightPanel(true);
    }
    const handleToggleActivation = async (student) => {
        await dispatch(toggleUserActivationAsync(student.userId)).unwrap();
        loadStudents();
    }

    const handleCloseAddStudent = async () => {
        setOpenAddStudentRightPanel(false);
    }
    return (
        <>
            {/* Header */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý học sinh</h1>
                        <p className="text-foreground-light text-sm mt-1">
                            Quản lý danh sách học sinh trong hệ thống.
                        </p>
                    </div>
                    <Button onClick={handleOpenAddStudent}>
                        <Plus size={16} />
                        Thêm học sinh mới
                    </Button>
                </div>

                {/* Filter and Search */}
                <StudentFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    grade={selectedGrade}
                    onGradeChange={handleGradeChange}
                    isActive={selectedIsActive}
                    onIsActiveChange={handleIsActiveChange}
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-border rounded-sm">
                <StudentTable
                    students={students}
                    onView={handleView}
                    loading={loadingGet}
                    onToggleActivation={handleToggleActivation}
                />

                {/* Pagination */}
                <div className="p-4 border-t border-border">

                    <RightPanel
                        isOpen={openAddStudentRightPanel}
                        onClose={handleCloseAddStudent}
                        title="Thêm học sinh mới"
                    >
                        <AddStudent onClose={handleCloseAddStudent} />
                    </RightPanel>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        totalItems={pagination.total}
                        hasNext={pagination.hasNext}
                        hasPrevious={pagination.hasPrevious}
                    />
                </div>
            </div>
        </>
    );
}
