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
    ClassSessionTable,
    ClassSessionFilters,
    ClassSessionForm,
    ClassSessionDeleteModal,
} from '../../classSesssion/components';

import { useSearch } from '../../../shared/hooks';

import {
    getAllClassSessionsAsync,
    createClassSessionAsync,
    updateClassSessionAsync,
    deleteClassSessionAsync,
    selectClassSessions,
    selectClassSessionPagination,
    selectClassSessionFilters,
    selectClassSessionLoadingGet,
    selectClassSessionLoadingCreate,
    selectClassSessionLoadingUpdate,
    selectClassSessionLoadingDelete,
    setFilters,
} from '../../classSesssion/store/classSesssionSlice';

/**
 * ClassSessions - Danh sách buổi học của một lớp
 */
export const ClassSessions = () => {
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
    const sessions = useSelector(selectClassSessions);
    const pagination = useSelector(selectClassSessionPagination);
    const filters = useSelector(selectClassSessionFilters);

    const loadingGet = useSelector(selectClassSessionLoadingGet);
    const loadingCreate = useSelector(selectClassSessionLoadingCreate);
    const loadingUpdate = useSelector(selectClassSessionLoadingUpdate);
    const loadingDelete = useSelector(selectClassSessionLoadingDelete);

    /* ===================== LOCAL STATE ===================== */
    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedSession, setSelectedSession] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        sessionDate: '',
        startTime: '',
        endTime: '',
        makeupNote: '',
    });

    const [errors, setErrors] = useState({});

    const [statusFilter, setStatusFilter] = useState('');

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadSessions();
    }, [classId, currentPage, itemsPerPage, debouncedSearch, statusFilter]);

    const loadSessions = () => {
        dispatch(
            getAllClassSessionsAsync({
                classId,
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                status: statusFilter || undefined,
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

        if (!formData.name || !formData.name.trim()) {
            newErrors.name = 'Tên buổi học không được để trống';
        } else if (formData.name.length > 200) {
            newErrors.name = 'Tên buổi học không được vượt quá 200 ký tự';
        }

        if (!formData.sessionDate) {
            newErrors.sessionDate = 'Ngày học không được để trống';
        }

        if (!formData.startTime) {
            newErrors.startTime = 'Giờ bắt đầu không được để trống';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'Giờ kết thúc không được để trống';
        }

        // Validate time range
        if (formData.startTime && formData.endTime && formData.sessionDate) {
            const start = new Date(`${formData.sessionDate}T${formData.startTime}`);
            const end = new Date(`${formData.sessionDate}T${formData.endTime}`);
            
            if (end <= start) {
                newErrors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ===================== CREATE ===================== */
    const handleOpenCreate = () => {
        setFormData({
            name: '',
            sessionDate: '',
            startTime: '',
            endTime: '',
            makeupNote: '',
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
            // Combine date and time into ISO strings
            const sessionDate = new Date(formData.sessionDate).toISOString();
            const startTime = new Date(`${formData.sessionDate}T${formData.startTime}`).toISOString();
            const endTime = new Date(`${formData.sessionDate}T${formData.endTime}`).toISOString();

            await dispatch(
                createClassSessionAsync({
                    classId,
                    name: formData.name,
                    sessionDate,
                    startTime,
                    endTime,
                    makeupNote: formData.makeupNote || undefined,
                })
            ).unwrap();

            setIsCreatePanelOpen(false);
            loadSessions();
        } catch (err) {
            console.error('Create session failed:', err);
        }
    };

    /* ===================== EDIT ===================== */
    const handleEdit = (session) => {
        setSelectedSession(session);
        
        // Extract date and time from ISO strings
        const sessionDate = new Date(session.sessionDate).toISOString().split('T')[0];
        const startTime = new Date(session.startTime).toTimeString().substring(0, 5);
        const endTime = new Date(session.endTime).toTimeString().substring(0, 5);

        setFormData({
            name: session.name || '',
            sessionDate,
            startTime,
            endTime,
            makeupNote: session.makeupNote || '',
        });
        setErrors({});
        setIsEditPanelOpen(true);
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // Combine date and time into ISO strings
            const sessionDate = new Date(formData.sessionDate).toISOString();
            const startTime = new Date(`${formData.sessionDate}T${formData.startTime}`).toISOString();
            const endTime = new Date(`${formData.sessionDate}T${formData.endTime}`).toISOString();

            await dispatch(
                updateClassSessionAsync({
                    id: selectedSession.sessionId,
                    data: {
                        name: formData.name,
                        sessionDate,
                        startTime,
                        endTime,
                        makeupNote: formData.makeupNote || undefined,
                    },
                })
            ).unwrap();

            setIsEditPanelOpen(false);
            loadSessions();
        } catch (err) {
            console.error('Update session failed:', err);
        }
    };

    /* ===================== DELETE ===================== */
    const handleDelete = (session) => {
        setSelectedSession(session);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteClassSessionAsync(selectedSession.sessionId)).unwrap();
            setIsDeleteModalOpen(false);
            loadSessions();
        } catch (err) {
            console.error('Delete session failed:', err);
        }
    };

    /* ===================== PAGINATION ===================== */
    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    /* ===================== STATS ===================== */
    const pastSessions = sessions.filter(s => s.status === 'past').length;
    const todaySessions = sessions.filter(s => s.status === 'today').length;
    const upcomingSessions = sessions.filter(s => s.status === 'upcoming').length;

    /* ===================== RENDER ===================== */
    return (
        <>
            {/* ===== HEADER ===== */}
            <div className="mb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý buổi học</h1>
                        <p className="text-sm text-foreground-light">
                            Danh sách các buổi học của lớp
                        </p>
                    </div>
                    <Button onClick={handleOpenCreate}>
                        <Plus size={16} />
                        Tạo buổi học
                    </Button>
                </div>

                <ClassSessionFilters
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    status={statusFilter}
                    onStatusChange={handleStatusChange}
                />
            </div>

            {/* ===== STATS ===== */}
            <StatsGrid cols={4} className="mb-4">
                <StatsCard 
                    label="Tổng buổi học" 
                    value={pagination.total} 
                    loading={loadingGet} 
                />
                <StatsCard
                    label="Đã qua"
                    value={pastSessions}
                    variant="default"
                />
                <StatsCard
                    label="Hôm nay"
                    value={todaySessions}
                    variant="info"
                />
                <StatsCard
                    label="Sắp tới"
                    value={upcomingSessions}
                    variant="success"
                />
            </StatsGrid>

            {/* ===== TABLE ===== */}
            <div className="bg-white border border-border rounded-sm">
                <ClassSessionTable
                    sessions={sessions}
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
            <ClassSessionDeleteModal
                isOpen={isDeleteModalOpen}
                session={selectedSession}
                loading={loadingDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* ===== CREATE PANEL ===== */}
            <RightPanel
                isOpen={isCreatePanelOpen}
                title="Tạo buổi học mới"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <ClassSessionForm
                    mode="create"
                    formData={formData}
                    errors={errors}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                    loading={loadingCreate}
                />
            </RightPanel>

            {/* ===== EDIT PANEL ===== */}
            <RightPanel
                isOpen={isEditPanelOpen}
                title="Cập nhật buổi học"
                onClose={() => setIsEditPanelOpen(false)}
            >
                <ClassSessionForm
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
