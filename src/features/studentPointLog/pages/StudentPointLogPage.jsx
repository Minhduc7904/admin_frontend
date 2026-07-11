import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";

import {
    Button,
    Pagination,
    RightPanel,
    StatsCard,
    StatsGrid,
} from "../../../shared/components/ui";
import { useSearch } from "../../../shared/hooks";
import { formatNumber } from "../../../shared/utils";
import { getStudentByIdAsync } from "../../student/store/studentSlice";
import {
    createStudentPointLogAsync,
    deleteStudentPointLogAsync,
    getStudentPointLogsByStudentAsync,
    resetStudentPointLogFilters,
    selectStudentPointLogFilters,
    selectStudentPointLogLoadingCreate,
    selectStudentPointLogLoadingDelete,
    selectStudentPointLogLoadingGet,
    selectStudentPointLogLoadingUpdate,
    selectStudentPointLogPagination,
    selectStudentPointLogs,
    selectStudentPointLogTotalPoint,
    setStudentPointLogFilters,
    updateStudentPointLogAsync,
} from "../store/studentPointLogSlice";
import {
    StudentPointLogDeleteModal,
    StudentPointLogDetail,
    StudentPointLogFilters,
    StudentPointLogForm,
    StudentPointLogTable,
} from "../components";

const DEFAULT_FORM = {
    type: "BONUS",
    points: "1",
    source: "ADMIN_ADJUST",
    referenceType: "MANUAL",
    referenceId: "",
    note: "",
    metadataText: "",
};

const stringifyMetadata = (metadata) => {
    if (!metadata || typeof metadata !== "object") return "";
    return JSON.stringify(metadata, null, 2);
};

const parseMetadata = (metadataText) => {
    if (!metadataText?.trim()) return undefined;
    const parsed = JSON.parse(metadataText);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Metadata phải là JSON object hợp lệ");
    }
    return parsed;
};

export const StudentPointLogPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const studentId = Number(id);

    const logs = useSelector(selectStudentPointLogs);
    const pagination = useSelector(selectStudentPointLogPagination);
    const filters = useSelector(selectStudentPointLogFilters);
    const totalPoint = useSelector(selectStudentPointLogTotalPoint);

    const loadingGet = useSelector(selectStudentPointLogLoadingGet);
    const loadingCreate = useSelector(selectStudentPointLogLoadingCreate);
    const loadingUpdate = useSelector(selectStudentPointLogLoadingUpdate);
    const loadingDelete = useSelector(selectStudentPointLogLoadingDelete);

    const { search, debouncedSearch, handleSearchChange } = useSearch(filters.search, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedLog, setSelectedLog] = useState(null);
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [errors, setErrors] = useState({});

    const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const filterPayload = useMemo(() => ({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        type: filters.type || undefined,
        source: filters.source || undefined,
        referenceType: filters.referenceType || undefined,
        referenceId: filters.referenceId ? Number(filters.referenceId) : undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc",
    }), [
        currentPage,
        itemsPerPage,
        debouncedSearch,
        filters.type,
        filters.source,
        filters.referenceType,
        filters.referenceId,
        filters.fromDate,
        filters.toDate,
        filters.sortBy,
        filters.sortOrder,
    ]);

    const loadLogs = useCallback(() => {
        if (!studentId || Number.isNaN(studentId)) return;
        dispatch(getStudentPointLogsByStudentAsync({ studentId, params: filterPayload }));
    }, [dispatch, studentId, filterPayload]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    useEffect(() => {
        return () => {
            dispatch(resetStudentPointLogFilters());
        };
    }, [dispatch]);

    const handleFilterChange = (nextFilters) => {
        setCurrentPage(1);
        dispatch(setStudentPointLogFilters(nextFilters));
    };

    const handleSearchChangeWrapper = (value) => {
        setCurrentPage(1);
        handleSearchChange(value);
        dispatch(setStudentPointLogFilters({ search: value }));
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const resetForm = () => {
        setFormData(DEFAULT_FORM);
        setErrors({});
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsCreatePanelOpen(true);
    };

    const handleView = (log) => {
        setSelectedLog(log);
        setIsDetailPanelOpen(true);
    };

    const handleEdit = (log) => {
        setSelectedLog(log);
        setFormData({
            type: log.type || "BONUS",
            points: log.points ?? "",
            source: log.source || "ADMIN_ADJUST",
            referenceType: log.referenceType || "",
            referenceId: log.referenceId || "",
            note: log.note || "",
            metadataText: stringifyMetadata(log.metadata),
        });
        setErrors({});
        setIsEditPanelOpen(true);
    };

    const handleDelete = (log) => {
        setSelectedLog(log);
        setIsDeleteModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleTypeChange = (value) => {
        setFormData((prev) => ({ ...prev, type: value }));
        if (errors.type) {
            setErrors((prev) => ({ ...prev, type: "" }));
        }
    };

    const buildPayload = () => {
        const nextErrors = {};
        const points = Number(formData.points);
        const referenceId = formData.referenceId === "" ? undefined : Number(formData.referenceId);
        let metadata;

        if (!formData.type) nextErrors.type = "Vui lòng chọn loại điểm";
        if (formData.points === "" || Number.isNaN(points) || points < 0) {
            nextErrors.points = "Điểm phải là số lớn hơn hoặc bằng 0";
        }
        if (!formData.source?.trim()) nextErrors.source = "Vui lòng nhập nguồn điểm";
        if (formData.referenceId !== "" && (Number.isNaN(referenceId) || referenceId < 1)) {
            nextErrors.referenceId = "ID tham chiếu phải lớn hơn 0";
        }

        try {
            metadata = parseMetadata(formData.metadataText);
        } catch (error) {
            nextErrors.metadataText = error.message;
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return null;

        return {
            type: formData.type,
            points,
            source: formData.source.trim(),
            referenceType: formData.referenceType?.trim() || undefined,
            referenceId,
            note: formData.note?.trim() || undefined,
            metadata,
        };
    };

    const reloadStudentOverview = () => {
        dispatch(getStudentByIdAsync(studentId));
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        const payload = buildPayload();
        if (!payload) return;

        try {
            await dispatch(createStudentPointLogAsync({ ...payload, studentId })).unwrap();
            setIsCreatePanelOpen(false);
            reloadStudentOverview();
            loadLogs();
        } catch (error) {
            console.error("Create student point log failed:", error);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const payload = buildPayload();
        if (!payload || !selectedLog) return;

        try {
            await dispatch(updateStudentPointLogAsync({
                pointLogId: selectedLog.pointLogId,
                data: payload,
            })).unwrap();
            setIsEditPanelOpen(false);
            reloadStudentOverview();
            loadLogs();
        } catch (error) {
            console.error("Update student point log failed:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedLog) return;

        try {
            await dispatch(deleteStudentPointLogAsync(selectedLog.pointLogId)).unwrap();
            setIsDeleteModalOpen(false);
            reloadStudentOverview();
            loadLogs();
        } catch (error) {
            console.error("Delete student point log failed:", error);
        }
    };

    const bonusCount = logs.filter((log) => log.type === "BONUS").length;
    const penaltyCount = logs.filter((log) => log.type === "PENALTY").length;

    return (
        <>
            <div className="mb-2">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Lịch sử điểm</h1>
                        <p className="text-sm text-foreground-light">
                            Quản lý các log cộng/trừ điểm của học sinh.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={loadLogs} disabled={loadingGet}>
                            <RefreshCw size={16} />
                            Tải lại
                        </Button>
                        <Button onClick={handleOpenCreate}>
                            <Plus size={16} />
                            Thêm log điểm
                        </Button>
                    </div>
                </div>

                <StudentPointLogFilters
                    filters={filters}
                    search={search}
                    onSearchChange={handleSearchChangeWrapper}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <StatsGrid cols={4} className="mb-4">
                <StatsCard
                    label="Tổng điểm hiện tại"
                    value={formatNumber(totalPoint)}
                    variant={totalPoint < 0 ? "danger" : "success"}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Tổng log"
                    value={formatNumber(pagination.total)}
                    loading={loadingGet}
                />
                <StatsCard
                    label="Cộng điểm (trang này)"
                    value={formatNumber(bonusCount)}
                    variant="success"
                    loading={loadingGet}
                />
                <StatsCard
                    label="Trừ điểm (trang này)"
                    value={formatNumber(penaltyCount)}
                    variant="danger"
                    loading={loadingGet}
                />
            </StatsGrid>

            <div className="bg-white border border-border rounded-sm">
                <StudentPointLogTable
                    logs={logs}
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

            <StudentPointLogDeleteModal
                isOpen={isDeleteModalOpen}
                log={selectedLog}
                loading={loadingDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            <RightPanel
                isOpen={isCreatePanelOpen}
                title="Thêm log điểm"
                onClose={() => setIsCreatePanelOpen(false)}
            >
                <StudentPointLogForm
                    mode="create"
                    formData={formData}
                    errors={errors}
                    loading={loadingCreate}
                    onChange={handleFormChange}
                    onTypeChange={handleTypeChange}
                    onSubmit={handleSubmitCreate}
                    onCancel={() => setIsCreatePanelOpen(false)}
                />
            </RightPanel>

            <RightPanel
                isOpen={isEditPanelOpen}
                title="Cập nhật log điểm"
                onClose={() => setIsEditPanelOpen(false)}
            >
                <StudentPointLogForm
                    mode="edit"
                    formData={formData}
                    errors={errors}
                    loading={loadingUpdate}
                    onChange={handleFormChange}
                    onTypeChange={handleTypeChange}
                    onSubmit={handleSubmitEdit}
                    onCancel={() => setIsEditPanelOpen(false)}
                />
            </RightPanel>

            <RightPanel
                isOpen={isDetailPanelOpen}
                title="Chi tiết log điểm"
                onClose={() => setIsDetailPanelOpen(false)}
            >
                <StudentPointLogDetail log={selectedLog} />
            </RightPanel>
        </>
    );
};
