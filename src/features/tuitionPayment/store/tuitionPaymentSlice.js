import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tuitionPaymentApi } from "../../../core/api";
import { handleAsyncThunk } from "../../../shared/utils/asyncThunkHelper";

/* =========================
   Initial State
========================= */
const initialState = {
  payments: [],
  currentPayment: null,
  statsByMoney: {
    collected: 0,
    uncollected: 0,
    expected: 0,
  },
  statsByStatus: {
    paid: 0,
    unpaid: 0,
  },

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  },

  loadingGet: false,
  loadingExport: false,
  loadingImport: false,
  loadingGetStatsMoney: false,
  loadingGetStatsStatus: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,

  error: null,

  filters: {
    studentId: "",
    courseId: "",
    month: "",
    year: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  exportExample: {
    month: "",
    year: "",
  },

  importPreview: {
    summary: {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      exitingPayments: 0,
      newPayments: 0,
    },

    existingPayments: [],
    newPayments: [],
    invalidRows: [],
  },
};

/* =========================
   Async Thunks
========================= */

// ===== LIST =====
export const getTuitionPaymentsAsync = createAsyncThunk(
  "tuitionPayment/getAll",
  async (params, thunkAPI) => {
    return handleAsyncThunk(() => tuitionPaymentApi.getAll(params), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi tải danh sách học phí",
    });
  }
);

// ===== DETAIL =====
export const getTuitionPaymentByIdAsync = createAsyncThunk(
  "tuitionPayment/getById",
  async (id, thunkAPI) => {
    return handleAsyncThunk(() => tuitionPaymentApi.getById(id), thunkAPI, {
      showSuccess: false,
      errorTitle: "Lỗi tải chi tiết học phí",
    });
  }
);

// ===== STATS =====
export const getTuitionPaymentStatsByMoneyAsync = createAsyncThunk(
  "tuitionPayment/statsByMoney",
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => tuitionPaymentApi.getStatsByMoney(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: "Lỗi thống kê học phí theo tiền",
      }
    );
  }
);

export const getTuitionPaymentStatsByStatusAsync = createAsyncThunk(
  "tuitionPayment/statsByStatus",
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => tuitionPaymentApi.getStatsByStatus(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: "Lỗi thống kê học phí theo trạng thái",
      }
    );
  }
);

// ===== CREATE =====
export const createTuitionPaymentAsync = createAsyncThunk(
  "tuitionPayment/create",
  async (data, thunkAPI) => {
    return handleAsyncThunk(() => tuitionPaymentApi.create(data), thunkAPI, {
      showSuccess: true,
      successTitle: "Tạo học phí thành công",
      errorTitle: "Lỗi tạo học phí",
    });
  }
);

// ===== UPDATE =====
export const updateTuitionPaymentAsync = createAsyncThunk(
  "tuitionPayment/update",
  async ({ id, data }, thunkAPI) => {
    return handleAsyncThunk(
      () => tuitionPaymentApi.update(id, data),
      thunkAPI,
      {
        showSuccess: true,
        successTitle: "Cập nhật học phí thành công",
        errorTitle: "Lỗi cập nhật học phí",
      }
    );
  }
);

// ===== DELETE =====
export const deleteTuitionPaymentAsync = createAsyncThunk(
  "tuitionPayment/delete",
  async (id, thunkAPI) => {
    return handleAsyncThunk(() => tuitionPaymentApi.delete(id), thunkAPI, {
      showSuccess: true,
      successTitle: "Xóa học phí thành công",
      errorTitle: "Lỗi xóa học phí",
    });
  }
);

export const exportTuitionPaymentExcelExampleAsync = createAsyncThunk(
  "tuitionPayment/exportExcelExample",
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      async () => {
        const response = await tuitionPaymentApi.exportExcelExample(params);

        const blob = response.data || response;

        // Extract filename from content-disposition header
        const contentDisposition = response.headers["content-disposition"];
        let filename = `ThuHocPhiMau${params.month}_${params.year}.xlsx`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = decodeURIComponent(
              filenameMatch[1].replace(/['"]/g, "")
            );
          }
        }
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
      },
      thunkAPI,
      {
        successTitle: "Xuất danh sách học sinh thành công",
        errorTitle: "Lỗi xuất danh sách học sinh",
      }
    );
  }
);

export const importTuitionPaymentExcelPreviewAsync = createAsyncThunk(
  "tuitionPayment/importExcelPreview",
  async (formData, thunkAPI) => {
    return handleAsyncThunk(
      () => tuitionPaymentApi.importExcelPreview(formData),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: "Lỗi tải xem trước file Excel học phí",
      }
    );
  }
);

/* =========================
   Slice
========================= */
export const tuitionPaymentSlice = createSlice({
  name: "tuitionPayment",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
    setExportExample: (state, action) => {
      state.exportExample = { ...state.exportExample, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== LIST =====
      .addCase(getTuitionPaymentsAsync.pending, (state) => {
        state.loadingGet = true;
        state.payments = [];
        state.error = null;
      })
      .addCase(getTuitionPaymentsAsync.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.payments = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(getTuitionPaymentsAsync.rejected, (state, action) => {
        state.loadingGet = false;
        state.error = action.payload;
      })

      // ===== DETAIL =====
      .addCase(getTuitionPaymentByIdAsync.pending, (state) => {
        state.currentPayment = null;
        state.loadingGet = true;
      })
      .addCase(getTuitionPaymentByIdAsync.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.currentPayment = action.payload.data;
      })
      .addCase(getTuitionPaymentByIdAsync.rejected, (state, action) => {
        state.loadingGet = false;
        state.error = action.payload;
      })

      // ===== STATS BY MONEY =====
      .addCase(getTuitionPaymentStatsByMoneyAsync.pending, (state) => {
        state.loadingGetStatsMoney = true;
      })
      .addCase(
        getTuitionPaymentStatsByMoneyAsync.fulfilled,
        (state, action) => {
          state.loadingGetStatsMoney = false;
          state.statsByMoney = action.payload.data;
        }
      )
      .addCase(getTuitionPaymentStatsByMoneyAsync.rejected, (state, action) => {
        state.loadingGetStatsMoney = false;
        state.error = action.payload;
      })

      // ===== STATS BY STATUS =====
      .addCase(getTuitionPaymentStatsByStatusAsync.pending, (state) => {
        state.loadingGetStatsStatus = true;
      })
      .addCase(
        getTuitionPaymentStatsByStatusAsync.fulfilled,
        (state, action) => {
          state.loadingGetStatsStatus = false;
          state.statsByStatus = action.payload.data;
        }
      )
      .addCase(
        getTuitionPaymentStatsByStatusAsync.rejected,
        (state, action) => {
          state.loadingGetStatsStatus = false;
          state.error = action.payload;
        }
      )

      // ===== CREATE =====
      .addCase(createTuitionPaymentAsync.pending, (state) => {
        state.loadingCreate = true;
      })
      .addCase(createTuitionPaymentAsync.fulfilled, (state) => {
        state.loadingCreate = false;
      })
      .addCase(createTuitionPaymentAsync.rejected, (state, action) => {
        state.loadingCreate = false;
        state.error = action.payload;
      })

      // ===== UPDATE =====
      .addCase(updateTuitionPaymentAsync.pending, (state) => {
        state.loadingUpdate = true;
      })
      .addCase(updateTuitionPaymentAsync.fulfilled, (state) => {
        state.loadingUpdate = false;
      })
      .addCase(updateTuitionPaymentAsync.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
      })

      // ===== DELETE =====
      .addCase(deleteTuitionPaymentAsync.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteTuitionPaymentAsync.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.payments = state.payments.filter(
          (p) => p.paymentId !== action.meta.arg
        );
      })
      .addCase(deleteTuitionPaymentAsync.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      })
      // ===== EXPORT EXCEL EXAMPLE =====
      .addCase(exportTuitionPaymentExcelExampleAsync.pending, (state) => {
        state.loadingExport = true;
      })
      .addCase(exportTuitionPaymentExcelExampleAsync.fulfilled, (state) => {
        state.loadingExport = false;
      })
      .addCase(
        exportTuitionPaymentExcelExampleAsync.rejected,
        (state, action) => {
          state.loadingExport = false;
          state.error = action.payload;
        }
      )
      // ===== IMPORT EXCEL PREVIEW =====
      .addCase(importTuitionPaymentExcelPreviewAsync.pending, (state) => {
        state.loadingImport = true;
      })
      .addCase(importTuitionPaymentExcelPreviewAsync.fulfilled, (state, action) => {
        state.loadingImport = false;
        state.importPreview = action.payload.data;
      })
      .addCase(
        importTuitionPaymentExcelPreviewAsync.rejected,
        (state, action) => {
          state.loadingImport = false;
          state.error = action.payload;
        }
      );
  },
});

/* =========================
   Actions & Selectors
========================= */
export const {
  setFilters,
  resetFilters,
  clearCurrentPayment,
  setPagination,
  resetPagination,
  setExportExample,
} = tuitionPaymentSlice.actions;

export const selectTuitionPayments = (state) => state.tuitionPayment.payments;
export const selectCurrentTuitionPayment = (state) =>
  state.tuitionPayment.currentPayment;

export const selectTuitionPaymentStatsByMoney = (state) =>
  state.tuitionPayment.statsByMoney;
export const selectTuitionPaymentStatsByStatus = (state) =>
  state.tuitionPayment.statsByStatus;

export const selectTuitionPaymentPagination = (state) =>
  state.tuitionPayment.pagination;
export const selectTuitionPaymentFilters = (state) =>
  state.tuitionPayment.filters;
export const selectExportExample = (state) =>
  state.tuitionPayment.exportExample;
export const selectImportPreview = (state) =>
  state.tuitionPayment.importPreview;

export const selectTuitionPaymentLoadingGet = (state) =>
  state.tuitionPayment.loadingGet;
export const selectTuitionPaymentLoadingCreate = (state) =>
  state.tuitionPayment.loadingCreate;
export const selectTuitionPaymentLoadingStatsMoney = (state) =>
  state.tuitionPayment.loadingGetStatsMoney;
export const selectTuitionPaymentLoadingStatsStatus = (state) =>
  state.tuitionPayment.loadingGetStatsStatus;
export const selectTuitionPaymentLoadingUpdate = (state) =>
  state.tuitionPayment.loadingUpdate;
export const selectTuitionPaymentLoadingDelete = (state) =>
  state.tuitionPayment.loadingDelete;
export const selectTuitionPaymentLoadingExport = (state) =>
  state.tuitionPayment.loadingExport;
export const selectTuitionPaymentLoadingImport = (state) =>
  state.tuitionPayment.loadingImport;
export const selectTuitionPaymentError = (state) => state.tuitionPayment.error;

export default tuitionPaymentSlice.reducer;
