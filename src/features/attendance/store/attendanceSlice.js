import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { attendanceApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

const initialState = {
    attendances: [],
    currentAttendance: null,
    statistics: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingUpdateStatus: false,
    loadingDelete: false,
    loadingBulkCreate: false,
    loadingStatistics: false,
    loadingExport: false,
    loadingExportImage: false,
    loadingToggleParentNotified: false,
    error: null,
    filters: {
        search: "",
        sessionId: null,
        studentId: null,
        classId: null,
        status: "",
        sortBy: "markedAt",
        sortOrder: "desc",
        showTuition: false,
        tuitionMonth: new Date().getMonth() + 1,
        tuitionYear: new Date().getFullYear(),
        tuitionStatus: '',
    },
    exportOptions: {
        format: 'jpeg',
        quality: 30,
        width: 800,
        includePhoto: true,
        includeParentPhone: true,
        includeStudentPhone: false,
        includeEmail: true,
        includeNotes: true,
        includeQRCode: false,
        includeTeacherName: true,
        includeMarkerName: true,
        includeStartTime: true,
        includeEndTime: true,
        includeStudentId: true,
        includeClassName: true,
        includeCourseName: true,
        includeMarkedAt: true,
        includeGradeSchool: true,
        includeTuition: true,
        tuitionMonth: new Date().getMonth() + 1,
        tuitionYear: new Date().getFullYear(),
    },
    showExportSettings: false,
    exportExcelOptions: {
        includeSchool: true,
        includeParentPhone: true,
        includeStudentPhone: false,
        includeGrade: true,
        includeEmail: true,
        includeMarkedAt: true,
        includeNotes: true,
        includeMakeupNote: false,
        includeMarkerName: true,
    },
    quickAttendance: {
        coursesSelection: [],
        classesSelection: [],
        sessionsSelection: [],
        autoAddToCourse: false,
        autoAddToClass: false,
        status: 'PRESENT',
    },
};

// ======================
// Async thunks
// ======================

export const getAllAttendancesAsync = createAsyncThunk(
    "attendance/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách điểm danh",
        });
    }
);

export const getAttendanceByIdAsync = createAsyncThunk(
    "attendance/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin điểm danh",
        });
    }
);

export const createAttendanceAsync = createAsyncThunk(
    "attendance/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Điểm danh thành công",
            errorTitle: "Lỗi điểm danh",
        });
    }
);

export const createBulkAttendanceBySessionAsync = createAsyncThunk(
    "attendance/createBulkBySession",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.createBulkBySession(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Điểm danh hàng loạt thành công",
            errorTitle: "Lỗi điểm danh hàng loạt",
        });
    }
);

export const updateAttendanceAsync = createAsyncThunk(
    "attendance/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật điểm danh thành công",
            errorTitle: "Lỗi cập nhật điểm danh",
        });
    }
);

export const deleteAttendanceAsync = createAsyncThunk(
    "attendance/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa điểm danh thành công",
            errorTitle: "Lỗi xóa điểm danh",
        });
    }
);

export const getStatisticsBySessionAsync = createAsyncThunk(
    "attendance/getStatisticsBySession",
    async (sessionId, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.getStatisticsBySession(sessionId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thống kê điểm danh",
        });
    }
);

export const exportAttendanceBySessionAsync = createAsyncThunk(
    "attendance/exportBySession",
    async ({ sessionId, options = {} }, thunkAPI) => {
        try {
            const response = await attendanceApi.exportBySession(sessionId, options);

            // Response.data is the blob
            const blob = response.data || response;

            // Extract filename from Content-Disposition header or use default
            const contentDisposition = response.headers?.['content-disposition'];
            let filename = `DanhSach_DiemDanh_${sessionId}_${new Date().getTime()}.xlsx`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi xuất Excel');
        }
    }
);

export const toggleParentNotifiedAsync = createAsyncThunk(
    "attendance/toggleParentNotified",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.toggleParentNotified(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật trạng thái thông báo phụ huynh thành công",
            errorTitle: "Lỗi cập nhật trạng thái thông báo phụ huynh",
        });
    }
);

export const updateAttendanceStatusAsync = createAsyncThunk(
    "attendance/updateStatus",
    async ({ id, status }, thunkAPI) => {
        return handleAsyncThunk(() => attendanceApi.update(id, { status }), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi cập nhật trạng thái điểm danh",
        });
    }
);

export const exportAttendanceImageAsync = createAsyncThunk(
    "attendance/exportImage",
    async ({ id, options = {} }, thunkAPI) => {
        try {
            const response = await attendanceApi.exportImage(id, options);

            // Response.data is the blob
            const blob = response.data || response;

            // Extract filename from Content-Disposition header or use default
            const contentDisposition = response.headers?.['content-disposition'];
            const format = options.format || 'png';
            let filename = `PhieuDiemDanh_${id}_${new Date().getTime()}.${format}`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
                }
            }

            // Check mode: download or view
            const mode = options.mode || 'download';

            if (mode === 'view') {
                // Open in new tab for viewing
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
                // Clean up after a delay
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            } else {
                // Download file
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }

            return { success: true, mode };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Lỗi xuất ảnh');
        }
    }
);

// ======================
// Slice
// ======================

export const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentAttendance: (state) => {
            state.currentAttendance = null;
        },
        clearAttendances: (state) => {
            state.attendances = [];
        },
        clearStatistics: (state) => {
            state.statistics = null;
        },
        setExportOptions: (state, action) => {
            state.exportOptions = { ...state.exportOptions, ...action.payload };
        },
        resetExportOptions: (state) => {
            state.exportOptions = initialState.exportOptions;
        },
        toggleShowExportSettings: (state) => {
            state.showExportSettings = !state.showExportSettings;
        },
        setExportExcelOptions: (state, action) => {
            state.exportExcelOptions = { ...state.exportExcelOptions, ...action.payload };
        },
        resetExportExcelOptions: (state) => {
            state.exportExcelOptions = initialState.exportExcelOptions;
        },
        setQuickAttendanceCoursesSelection: (state, action) => {
            state.quickAttendance.coursesSelection = action.payload;
        },
        setQuickAttendanceClassesSelection: (state, action) => {
            state.quickAttendance.classesSelection = action.payload;
        },
        setQuickAttendanceSessionsSelection: (state, action) => {
            state.quickAttendance.sessionsSelection = action.payload;
        },
        setQuickAttendanceAutoAddToCourse: (state, action) => {
            state.quickAttendance.autoAddToCourse = action.payload;
        },
        setQuickAttendanceAutoAddToClass: (state, action) => {
            state.quickAttendance.autoAddToClass = action.payload;
        },
        setQuickAttendanceStatus: (state, action) => {
            state.quickAttendance.status = action.payload;
        },
        resetQuickAttendanceSelection: (state) => {
            state.quickAttendance = initialState.quickAttendance;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllAttendancesAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllAttendancesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.attendances = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllAttendancesAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getAttendanceByIdAsync.pending, (state) => {
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAttendanceByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentAttendance = action.payload.data;
            })
            .addCase(getAttendanceByIdAsync.rejected, (state, action) => {
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createAttendanceAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createAttendanceAsync.fulfilled, (state, action) => {
                state.loadingCreate = false;
                state.attendances.push(action.payload.data);
                state.pagination.total += 1;
            })
            .addCase(createAttendanceAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Create bulk by session
            .addCase(createBulkAttendanceBySessionAsync.pending, (state) => {
                state.loadingBulkCreate = true;
                state.error = null;
            })
            .addCase(createBulkAttendanceBySessionAsync.fulfilled, (state, action) => {
                state.loadingBulkCreate = false;
                // Add all created attendances to the list
                if (Array.isArray(action.payload.data)) {
                    state.attendances = [...state.attendances, ...action.payload.data];
                    state.pagination.total += action.payload.data.length;
                }
            })
            .addCase(createBulkAttendanceBySessionAsync.rejected, (state, action) => {
                state.loadingBulkCreate = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateAttendanceAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateAttendanceAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.attendances.findIndex(
                    (att) => att.attendanceId === action.payload.data.attendanceId
                );
                if (index !== -1) {
                    state.attendances[index] = action.payload.data;
                }
                if (
                    state.currentAttendance &&
                    state.currentAttendance.attendanceId === action.payload.data.attendanceId
                ) {
                    state.currentAttendance = action.payload.data;
                }
            })
            .addCase(updateAttendanceAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteAttendanceAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteAttendanceAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.attendances = state.attendances.filter(
                    (att) => att.attendanceId !== action.meta.arg
                );
                state.pagination.total = Math.max(0, state.pagination.total - 1);
            })
            .addCase(deleteAttendanceAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            // Get statistics by session
            .addCase(getStatisticsBySessionAsync.pending, (state) => {
                state.loadingStatistics = true;
                state.error = null;
            })
            .addCase(getStatisticsBySessionAsync.fulfilled, (state, action) => {
                state.loadingStatistics = false;
                state.statistics = action.payload.data;
            })
            .addCase(getStatisticsBySessionAsync.rejected, (state, action) => {
                state.loadingStatistics = false;
                state.error = action.payload;
            })

            // Export by session
            .addCase(exportAttendanceBySessionAsync.pending, (state) => {
                state.loadingExport = true;
                state.error = null;
            })
            .addCase(exportAttendanceBySessionAsync.fulfilled, (state) => {
                state.loadingExport = false;
            })
            .addCase(exportAttendanceBySessionAsync.rejected, (state, action) => {
                state.loadingExport = false;
                state.error = action.payload;
            })

            // Export image
            .addCase(exportAttendanceImageAsync.pending, (state) => {
                state.loadingExportImage = true;
                state.error = null;
            })
            .addCase(exportAttendanceImageAsync.fulfilled, (state) => {
                state.loadingExportImage = false;
            })
            .addCase(exportAttendanceImageAsync.rejected, (state, action) => {
                state.loadingExportImage = false;
                state.error = action.payload;
            })

            // Toggle parent notified
            .addCase(toggleParentNotifiedAsync.pending, (state) => {
                state.loadingToggleParentNotified = true;
                state.error = null;
            })
            .addCase(toggleParentNotifiedAsync.fulfilled, (state, action) => {
                state.loadingToggleParentNotified = false;
                const { attendanceId, parentNotified } = action.payload.data;
                const index = state.attendances.findIndex(
                    (att) => att.attendanceId === attendanceId
                );
                if (index !== -1) {
                    state.attendances[index].parentNotified = parentNotified;
                }
                if (state.currentAttendance?.attendanceId === attendanceId) {
                    state.currentAttendance.parentNotified = parentNotified;
                }
            })
            .addCase(toggleParentNotifiedAsync.rejected, (state, action) => {
                state.loadingToggleParentNotified = false;
                state.error = action.payload;
            })

            // Update attendance status (quick update without refetch)
            .addCase(updateAttendanceStatusAsync.pending, (state) => {
                state.loadingUpdateStatus = true;
                state.error = null;
            })
            .addCase(updateAttendanceStatusAsync.fulfilled, (state, action) => {
                state.loadingUpdateStatus = false;
                const updatedAttendance = action.payload.data;

                // Update in attendances array
                const index = state.attendances.findIndex(
                    (att) => att.attendanceId === updatedAttendance.attendanceId
                );
                if (index !== -1) {
                    state.attendances[index] = updatedAttendance;
                }

                // Update current attendance if it's the same one
                if (
                    state.currentAttendance &&
                    state.currentAttendance.attendanceId === updatedAttendance.attendanceId
                ) {
                    state.currentAttendance = updatedAttendance;
                }
            })
            .addCase(updateAttendanceStatusAsync.rejected, (state, action) => {
                state.loadingUpdateStatus = false;
                state.error = action.payload;
            });
    },
});

// ======================
// Selectors
// ======================

export const {
    setFilters,
    resetFilters,
    clearCurrentAttendance,
    clearAttendances,
    clearStatistics,
    setExportOptions,
    resetExportOptions,
    toggleShowExportSettings,
    setExportExcelOptions,
    resetExportExcelOptions,
    setQuickAttendanceCoursesSelection,
    setQuickAttendanceClassesSelection,
    setQuickAttendanceSessionsSelection,
    setQuickAttendanceAutoAddToCourse,
    setQuickAttendanceAutoAddToClass,
    setQuickAttendanceStatus,
    resetQuickAttendanceSelection,
} = attendanceSlice.actions;

export const selectAttendances = (state) => state.attendance.attendances;
export const selectCurrentAttendance = (state) => state.attendance.currentAttendance;
export const selectAttendanceStatistics = (state) => state.attendance.statistics;
export const selectAttendancePagination = (state) => state.attendance.pagination;
export const selectAttendanceLoadingGet = (state) => state.attendance.loadingGet;
export const selectAttendanceLoadingCreate = (state) => state.attendance.loadingCreate;
export const selectAttendanceLoadingUpdate = (state) => state.attendance.loadingUpdate;
export const selectAttendanceLoadingUpdateStatus = (state) => state.attendance.loadingUpdateStatus;
export const selectAttendanceLoadingDelete = (state) => state.attendance.loadingDelete;
export const selectAttendanceLoadingBulkCreate = (state) => state.attendance.loadingBulkCreate;
export const selectAttendanceLoadingStatistics = (state) => state.attendance.loadingStatistics;
export const selectAttendanceLoadingExport = (state) => state.attendance.loadingExport;
export const selectAttendanceLoadingExportImage = (state) => state.attendance.loadingExportImage;
export const selectAttendanceLoadingToggleParentNotified = (state) => state.attendance.loadingToggleParentNotified;
export const selectAttendanceError = (state) => state.attendance.error;
export const selectAttendanceFilters = (state) => state.attendance.filters;
export const selectAttendanceExportOptions = (state) => state.attendance.exportOptions;
export const selectShowExportSettings = (state) => state.attendance.showExportSettings;
export const selectAttendanceExportExcelOptions = (state) => state.attendance.exportExcelOptions;
export const selectQuickAttendanceCoursesSelection = (state) => state.attendance.quickAttendance.coursesSelection;
export const selectQuickAttendanceClassesSelection = (state) => state.attendance.quickAttendance.classesSelection;
export const selectQuickAttendanceSessionsSelection = (state) => state.attendance.quickAttendance.sessionsSelection;
export const selectQuickAttendanceAutoAddToCourse = (state) => state.attendance.quickAttendance.autoAddToCourse;
export const selectQuickAttendanceAutoAddToClass = (state) => state.attendance.quickAttendance.autoAddToClass;
export const selectQuickAttendanceStatus = (state) => state.attendance.quickAttendance.status;

export default attendanceSlice.reducer;
