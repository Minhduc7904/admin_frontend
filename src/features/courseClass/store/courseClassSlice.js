import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseClassApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";
import {
    MAKEUP_GROUP_CONFLICT_MESSAGE,
    buildMakeupGroupPayload,
    getSelectedClassIds,
    isMakeupGroupConflictError,
    isSameIdSet,
} from "../utils/makeupGroup";

const initialState = {
    classes: [],
    myClasses: [],
    currentClass: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    myClassesPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
    },
    loadingGet: false,
    loadingGetMyClasses: false,
    loadingCreate: false,
    loadingUpdate: false,
    loadingDelete: false,
    loadingSwitchLessonVisibilityClassIds: [],
    // Nhóm lớp học bù: state độc lập với loading/error của thông tin CourseClass.
    makeupSourceClassId: null,
    makeupGroupId: null,
    makeupGetRequestId: null,
    loadingGetMakeupGroup: false,
    loadingUpdateMakeupGroup: false,
    makeupCandidates: [],
    selectedMakeupClassIds: [],
    savedMakeupClassIds: [],
    makeupError: null,
    makeupConflict: false,
    isMakeupDirty: false,
    error: null,
    filters: {
        search: "",
        courseId: "",
        instructorId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
    myClassesFilters: {
        search: "",
        courseId: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

// ======================
// Async thunks
// ======================

export const getAllCourseClassesAsync = createAsyncThunk(
    "courseClass/getAll",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getAll(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách lớp học",
        });
    }
);

export const searchCourseClassesAsync = createAsyncThunk(
    "courseClass/search",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.search(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tìm kiếm lớp học",
        });
    }
);

export const getMyCourseClassesAsync = createAsyncThunk(
    "courseClass/getMyClasses",
    async (params, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getMyClasses(params), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải danh sách lớp học của tôi",
        });
    }
);

export const getCourseClassByIdAsync = createAsyncThunk(
    "courseClass/getById",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getById(id), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải thông tin lớp học",
        });
    }
);

export const createCourseClassAsync = createAsyncThunk(
    "courseClass/create",
    async (data, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.create(data), thunkAPI, {
            showSuccess: true,
            successTitle: "Tạo lớp học thành công",
            errorTitle: "Lỗi tạo lớp học",
        });
    }
);

export const updateCourseClassAsync = createAsyncThunk(
    "courseClass/update",
    async ({ id, data }, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.update(id, data), thunkAPI, {
            showSuccess: true,
            successTitle: "Cập nhật lớp học thành công",
            errorTitle: "Lỗi cập nhật lớp học",
        });
    }
);

export const deleteCourseClassAsync = createAsyncThunk(
    "courseClass/delete",
    async (id, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.delete(id), thunkAPI, {
            showSuccess: true,
            successTitle: "Xóa lớp học thành công",
            errorTitle: "Lỗi xóa lớp học",
        });
    }
);

export const switchCourseClassLessonVisibilityAsync = createAsyncThunk(
    "courseClass/switchLessonVisibility",
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => courseClassApi.switchLessonVisibility(data),
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Cập nhật hiển thị bài học thành công",
                errorTitle: "Lỗi cập nhật hiển thị bài học",
            }
        );
    }
);

export const getCourseClassMakeupGroupAsync = createAsyncThunk(
    "courseClass/getMakeupGroup",
    async (classId, thunkAPI) => {
        return handleAsyncThunk(() => courseClassApi.getMakeupGroup(classId), thunkAPI, {
            showSuccess: false,
            errorTitle: "Lỗi tải nhóm lớp học bù",
        });
    }
);

export const updateCourseClassMakeupGroupAsync = createAsyncThunk(
    "courseClass/updateMakeupGroup",
    async ({ classId, makeupClassIds }, thunkAPI) => {
        return handleAsyncThunk(
            async () => {
                try {
                    return await courseClassApi.updateMakeupGroup(classId, buildMakeupGroupPayload(makeupClassIds));
                } catch (error) {
                    if (isMakeupGroupConflictError(error)) {
                        // 409: dữ liệu nhóm đã đổi; báo người dùng tải lại thay vì hiện lỗi kỹ thuật của backend.
                        const conflict = new Error(MAKEUP_GROUP_CONFLICT_MESSAGE);
                        conflict.response = { status: 409, data: { message: MAKEUP_GROUP_CONFLICT_MESSAGE } };
                        throw conflict;
                    }
                    throw error;
                }
            },
            thunkAPI,
            {
                showSuccess: true,
                successTitle: "Lưu nhóm lớp học bù thành công",
                errorTitle: "Lỗi lưu nhóm lớp học bù",
            }
        );
    }
);

const resetMakeupState = (state) => {
    state.makeupSourceClassId = null;
    state.makeupGroupId = null;
    state.makeupGetRequestId = null;
    state.loadingGetMakeupGroup = false;
    state.loadingUpdateMakeupGroup = false;
    state.makeupCandidates = [];
    state.selectedMakeupClassIds = [];
    state.savedMakeupClassIds = [];
    state.makeupError = null;
    state.makeupConflict = false;
    state.isMakeupDirty = false;
};

// Server là nguồn sự thật: lưu candidate và lấy tập đã chọn từ response, đồng thời xóa trạng thái "chưa lưu".
const applyServerMakeupGroup = (state, data) => {
    const selectedIds = getSelectedClassIds(data.candidates);

    state.makeupGroupId = data.groupId ?? null;
    state.makeupCandidates = data.candidates;
    state.selectedMakeupClassIds = [...selectedIds];
    state.savedMakeupClassIds = [...selectedIds];
    state.isMakeupDirty = false;
};

// ======================
// Slice
// ======================

export const courseClassSlice = createSlice({
    name: "courseClass",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentClass: (state) => {
            state.currentClass = null;
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setMyFilters: (state, action) => {
            state.myClassesFilters = { ...state.myClassesFilters, ...action.payload };
        },
        resetMyFilters: (state) => {
            state.myClassesFilters = initialState.myClassesFilters;
        },
        setMyPagination: (state, action) => {
            state.myClassesPagination = { ...state.myClassesPagination, ...action.payload };
        },
        toggleMakeupClass: (state, action) => {
            if (state.loadingUpdateMakeupGroup) {
                return;
            }

            const classId = action.payload;
            const candidate = state.makeupCandidates.find((item) => item.classId === classId);

            if (!candidate) {
                return;
            }

            if (state.selectedMakeupClassIds.includes(classId)) {
                // Lớp đã chọn luôn được bỏ chọn, kể cả khi đã kết thúc.
                state.selectedMakeupClassIds = state.selectedMakeupClassIds.filter((id) => id !== classId);
            } else if (!candidate.disabled) {
                state.selectedMakeupClassIds.push(classId);
            } else {
                return;
            }

            state.isMakeupDirty = !isSameIdSet(state.selectedMakeupClassIds, state.savedMakeupClassIds);
        },
        resetMakeupSelection: (state) => {
            state.selectedMakeupClassIds = [...state.savedMakeupClassIds];
            state.isMakeupDirty = false;
            state.makeupError = null;
            state.makeupConflict = false;
        },
        clearMakeupGroup: (state) => {
            resetMakeupState(state);
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all
            .addCase(getAllCourseClassesAsync.pending, (state) => {
                state.classes = [];
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getAllCourseClassesAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.classes = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(getAllCourseClassesAsync.rejected, (state, action) => {
                state.classes = [];
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Get my classes
            .addCase(getMyCourseClassesAsync.pending, (state) => {
                state.myClasses = [];
                state.loadingGetMyClasses = true;
                state.error = null;
            })
            .addCase(getMyCourseClassesAsync.fulfilled, (state, action) => {
                state.loadingGetMyClasses = false;
                state.myClasses = action.payload.data;
                state.myClassesPagination = action.payload.meta;
            })
            .addCase(getMyCourseClassesAsync.rejected, (state, action) => {
                state.myClasses = [];
                state.loadingGetMyClasses = false;
                state.error = action.payload;
            })

            // Get by ID
            .addCase(getCourseClassByIdAsync.pending, (state) => {
                state.currentClass = null;
                state.loadingGet = true;
                state.error = null;
            })
            .addCase(getCourseClassByIdAsync.fulfilled, (state, action) => {
                state.loadingGet = false;
                state.currentClass = action.payload.data;
            })
            .addCase(getCourseClassByIdAsync.rejected, (state, action) => {
                state.currentClass = null;
                state.loadingGet = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createCourseClassAsync.pending, (state) => {
                state.loadingCreate = true;
                state.error = null;
            })
            .addCase(createCourseClassAsync.fulfilled, (state) => {
                state.loadingCreate = false;
            })
            .addCase(createCourseClassAsync.rejected, (state, action) => {
                state.loadingCreate = false;
                state.error = action.payload;
            })

            // Update
            .addCase(updateCourseClassAsync.pending, (state) => {
                state.loadingUpdate = true;
                state.error = null;
            })
            .addCase(updateCourseClassAsync.fulfilled, (state, action) => {
                state.loadingUpdate = false;
                const index = state.classes.findIndex(
                    (cls) => cls.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.classes[index] = action.payload.data;
                }
                if (
                    state.currentClass &&
                    state.currentClass.id === action.payload.data.id
                ) {
                    state.currentClass = action.payload.data;
                }
            })
            .addCase(updateCourseClassAsync.rejected, (state, action) => {
                state.loadingUpdate = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteCourseClassAsync.pending, (state) => {
                state.loadingDelete = true;
                state.error = null;
            })
            .addCase(deleteCourseClassAsync.fulfilled, (state, action) => {
                state.loadingDelete = false;
                state.classes = state.classes.filter(
                    (cls) => cls.id !== action.meta.arg
                );
            })
            .addCase(deleteCourseClassAsync.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })
            // Switch class-lesson visibility
            .addCase(switchCourseClassLessonVisibilityAsync.pending, (state, action) => {
                const classId = action.meta.arg.classId;
                state.loadingSwitchLessonVisibilityClassIds.push(classId);
                state.error = null;
            })
            .addCase(switchCourseClassLessonVisibilityAsync.fulfilled, (state, action) => {
                const classId = action.meta.arg.classId;

                state.loadingSwitchLessonVisibilityClassIds =
                    state.loadingSwitchLessonVisibilityClassIds.filter((id) => id !== classId);
            })
            .addCase(switchCourseClassLessonVisibilityAsync.rejected, (state, action) => {
                const classId = action.meta.arg.classId;
                state.loadingSwitchLessonVisibilityClassIds =
                    state.loadingSwitchLessonVisibilityClassIds.filter((id) => id !== classId);
                state.error = action.payload;
            })

            // Get makeup group (bỏ response của request cũ khi đổi lớp hoặc gọi lại)
            .addCase(getCourseClassMakeupGroupAsync.pending, (state, action) => {
                resetMakeupState(state);
                state.makeupSourceClassId = action.meta.arg;
                state.makeupGetRequestId = action.meta.requestId;
                state.loadingGetMakeupGroup = true;
            })
            .addCase(getCourseClassMakeupGroupAsync.fulfilled, (state, action) => {
                if (state.makeupGetRequestId !== action.meta.requestId) {
                    return;
                }
                state.loadingGetMakeupGroup = false;
                applyServerMakeupGroup(state, action.payload.data);
            })
            .addCase(getCourseClassMakeupGroupAsync.rejected, (state, action) => {
                if (state.makeupGetRequestId !== action.meta.requestId) {
                    return;
                }
                state.loadingGetMakeupGroup = false;
                state.makeupError = action.payload || "Không thể tải nhóm lớp học bù";
            })

            // Update makeup group (giữ nguyên lựa chọn đang sửa khi lỗi để người dùng sửa lại)
            .addCase(updateCourseClassMakeupGroupAsync.pending, (state) => {
                state.loadingUpdateMakeupGroup = true;
                state.makeupError = null;
                state.makeupConflict = false;
            })
            .addCase(updateCourseClassMakeupGroupAsync.fulfilled, (state, action) => {
                state.loadingUpdateMakeupGroup = false;
                if (state.makeupSourceClassId !== action.meta.arg.classId) {
                    return;
                }
                applyServerMakeupGroup(state, action.payload.data);
            })
            .addCase(updateCourseClassMakeupGroupAsync.rejected, (state, action) => {
                state.loadingUpdateMakeupGroup = false;
                if (state.makeupSourceClassId !== action.meta.arg.classId) {
                    return;
                }
                state.makeupError = action.payload || "Không thể lưu nhóm lớp học bù";
                state.makeupConflict = action.payload === MAKEUP_GROUP_CONFLICT_MESSAGE;
            })

            // Dữ liệu theo phiên đăng nhập không được sống sót sau khi đăng xuất.
            .addCase("auth/logout/fulfilled", resetMakeupState)
            .addCase("auth/logout/rejected", resetMakeupState)
            .addCase("auth/clearAuth", resetMakeupState);
    },
});

// ======================
// Selectors
// ======================

export const {
    setFilters,
    resetFilters,
    clearCurrentClass,
    setPagination,
    setMyFilters,
    resetMyFilters,
    setMyPagination,
    toggleMakeupClass,
    resetMakeupSelection,
    clearMakeupGroup,
} = courseClassSlice.actions;

export const selectCourseClasses = (state) => state.courseClass.classes;
export const selectCurrentCourseClass = (state) => state.courseClass.currentClass;
export const selectCourseClassPagination = (state) => state.courseClass.pagination;
export const selectCourseClassLoadingGet = (state) => state.courseClass.loadingGet;
export const selectCourseClassLoadingCreate = (state) => state.courseClass.loadingCreate;
export const selectCourseClassLoadingUpdate = (state) => state.courseClass.loadingUpdate;
export const selectCourseClassLoadingDelete = (state) => state.courseClass.loadingDelete;
export const selectCourseClassError = (state) => state.courseClass.error;
export const selectCourseClassFilters = (state) => state.courseClass.filters;
export const selectMyCourseClasses = (state) => state.courseClass.myClasses;
export const selectMyCourseClassPagination = (state) => state.courseClass.myClassesPagination;
export const selectMyCourseClassLoadingGet = (state) => state.courseClass.loadingGet;
export const selectMyCourseClassFilters = (state) => state.courseClass.myClassesFilters;
export const selectSwitchLessonVisibilityClassIds = (state) =>
    state.courseClass.loadingSwitchLessonVisibilityClassIds;
export const selectMakeupSourceClassId = (state) => state.courseClass.makeupSourceClassId;
export const selectMakeupGroupId = (state) => state.courseClass.makeupGroupId;
export const selectLoadingGetMakeupGroup = (state) => state.courseClass.loadingGetMakeupGroup;
export const selectLoadingUpdateMakeupGroup = (state) => state.courseClass.loadingUpdateMakeupGroup;
export const selectMakeupCandidates = (state) => state.courseClass.makeupCandidates;
export const selectSelectedMakeupClassIds = (state) => state.courseClass.selectedMakeupClassIds;
export const selectSavedMakeupClassIds = (state) => state.courseClass.savedMakeupClassIds;
export const selectMakeupConflict = (state) => state.courseClass.makeupConflict;
export const selectMakeupError = (state) => state.courseClass.makeupError;
export const selectIsMakeupDirty = (state) => state.courseClass.isMakeupDirty;

export default courseClassSlice.reducer;
