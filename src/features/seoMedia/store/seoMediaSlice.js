import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { seoMediaApi } from '../../../core/api/seoMediaApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  slots: [],
  slotsByPageKey: {},
  items: [],
  currentSlot: null,
  currentItem: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  },
  loading: false,
  loadingItem: false,
  loadingUpload: false,
  error: null,
  filters: {
    search: '',
    isActive: null,
  },
  pageMedia: {
    activePageKey: 'home',
    selectedSlotId: null,
    viewMode: 'desktop',
  },
};

// Slots
export const createSlotAsync = createAsyncThunk(
  'seoMedia/createSlot',
  async (data, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.createSlot(data), thunkAPI, {
      successTitle: 'Tạo slot thành công',
      successMessage: 'SEO media slot created successfully',
      errorTitle: 'Tạo slot thất bại',
    });
  }
);

export const getSlotsAsync = createAsyncThunk(
  'seoMedia/getSlots',
  async (params = {}, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.getSlots(params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi lấy danh sách slot',
    });
  }
);

export const getSlotsByCodeAsync = createAsyncThunk(
  'seoMedia/getSlotsByCode',
  async ({ code, params = {} }, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.getSlotsByCode(code, params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi lấy slot theo code',
    });
  }
);

export const getSlotByIdAsync = createAsyncThunk(
  'seoMedia/getSlotById',
  async ({ slotId, params = {} }, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.getSlotById(slotId, params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi lấy thông tin slot',
    });
  }
);

export const updateSlotAsync = createAsyncThunk(
  'seoMedia/updateSlot',
  async ({ slotId, data }, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.updateSlot(slotId, data), thunkAPI, {
      successTitle: 'Cập nhật slot',
      successMessage: 'SEO media slot updated successfully',
      errorTitle: 'Cập nhật slot thất bại',
    });
  }
);

export const deleteSlotAsync = createAsyncThunk(
  'seoMedia/deleteSlot',
  async (slotId, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.deleteSlot(slotId), thunkAPI, {
      successTitle: 'Xóa slot',
      successMessage: 'SEO media slot deleted successfully',
      errorTitle: 'Xóa slot thất bại',
    });
  }
);

// Items
export const createItemAsync = createAsyncThunk(
  'seoMedia/createItem',
  async (data, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.createItem(data), thunkAPI, {
      successTitle: 'Tạo item',
      successMessage: 'SEO media item created successfully',
      errorTitle: 'Tạo item thất bại',
    });
  }
);

export const getItemsBySlotAsync = createAsyncThunk(
  'seoMedia/getItemsBySlot',
  async ({ slotId, params = {} }, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.getItemsBySlot(slotId, params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi lấy danh sách items',
    });
  }
);

export const updateItemAsync = createAsyncThunk(
  'seoMedia/updateItem',
  async ({ itemId, data }, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.updateItem(itemId, data), thunkAPI, {
      successTitle: 'Cập nhật item',
      successMessage: 'SEO media item updated successfully',
      errorTitle: 'Cập nhật item thất bại',
    });
  }
);

export const reorderItemsAsync = createAsyncThunk(
  'seoMedia/reorderItems',
  async ({ slotId, data }, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.reorderItems(slotId, data), thunkAPI, {
      successTitle: 'Sắp xếp lại items',
      successMessage: 'SEO media items reordered successfully',
      errorTitle: 'Sắp xếp thất bại',
    });
  }
);

export const deleteItemAsync = createAsyncThunk(
  'seoMedia/deleteItem',
  async (itemId, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.deleteItem(itemId), thunkAPI, {
      successTitle: 'Xóa item',
      successMessage: 'SEO media item deleted successfully',
      errorTitle: 'Xóa item thất bại',
    });
  }
);

export const uploadSeoMediaAsync = createAsyncThunk(
  'seoMedia/uploadMedia',
  async (formData, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.uploadMedia(formData), thunkAPI, {
      successTitle: 'Tải media',
      successMessage: 'SEO media uploaded successfully',
      errorTitle: 'Tải media thất bại',
    });
  }
);

export const getSeoBucketMediaAsync = createAsyncThunk(
  'seoMedia/getBucketMedia',
  async (params = {}, thunkAPI) => {
    return handleAsyncThunk(() => seoMediaApi.getBucketMedia(params), thunkAPI, {
      showSuccess: false,
      errorTitle: 'Lỗi lấy media trong bucket SEO',
    });
  }
);

const seoMediaSlice = createSlice({
  name: 'seoMedia',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentSlot: (state) => {
      state.currentSlot = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSeoPageMediaActivePageKey: (state, action) => {
      state.pageMedia.activePageKey = action.payload;
      state.pageMedia.selectedSlotId = null;
      state.items = [];
    },
    setSeoPageMediaSelectedSlotId: (state, action) => {
      state.pageMedia.selectedSlotId = action.payload;
      state.items = [];
    },
    setSeoPageMediaViewMode: (state, action) => {
      state.pageMedia.viewMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get slots
      .addCase(getSlotsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSlotsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const slots = action.payload.data || [];
        const pageKey = action.meta.arg?.pageKey;

        if (pageKey) {
          state.slotsByPageKey[pageKey] = slots;
        } else {
          state.slots = slots;
        }
        if (action.payload.meta) {
          state.pagination = { ...state.pagination, ...action.payload.meta };
        }
      })
      .addCase(getSlotsAsync.rejected, (state, action) => {
        state.loading = false;
        const pageKey = action.meta.arg?.pageKey;
        if (pageKey) {
          state.slotsByPageKey[pageKey] = [];
        } else {
          state.slots = [];
        }
        state.error = action.payload;
      })

      // Create slot
      .addCase(createSlotAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSlotAsync.fulfilled, (state, action) => {
        state.loading = false;
        const slot = action.payload?.data;
        if (slot) {
          state.slots.unshift(slot);
          if (slot.pageKey) {
            state.slotsByPageKey[slot.pageKey] = [
              slot,
              ...(state.slotsByPageKey[slot.pageKey] || []),
            ];
          }
        }
      })
      .addCase(createSlotAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get slot by id
      .addCase(getSlotByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSlotByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSlot = action.payload.data;
      })
      .addCase(getSlotByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.currentSlot = null;
        state.error = action.payload;
      })

      // Update slot
      .addCase(updateSlotAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSlotAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          const slot = action.payload.data;
          const idx = state.slots.findIndex((s) => s.slotId === slot.slotId);
          if (idx !== -1) state.slots[idx] = slot;

          Object.keys(state.slotsByPageKey).forEach((pageKey) => {
            state.slotsByPageKey[pageKey] = state.slotsByPageKey[pageKey].filter(
              (item) => item.slotId !== slot.slotId
            );
          });
          if (slot.pageKey) {
            const pageSlots = state.slotsByPageKey[slot.pageKey] || [];
            const pageIdx = pageSlots.findIndex((item) => item.slotId === slot.slotId);
            if (pageIdx !== -1) {
              pageSlots[pageIdx] = slot;
              state.slotsByPageKey[slot.pageKey] = pageSlots;
            } else {
              state.slotsByPageKey[slot.pageKey] = [slot, ...pageSlots];
            }
          }

          if (state.currentSlot?.slotId === slot.slotId) state.currentSlot = slot;
        }
      })
      .addCase(updateSlotAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete slot
      .addCase(deleteSlotAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSlotAsync.fulfilled, (state, action) => {
        state.loading = false;
        // optionally remove from list depending on API response
        if (action.meta?.arg) {
          state.slots = state.slots.filter((s) => s.slotId !== action.meta.arg);
          Object.keys(state.slotsByPageKey).forEach((pageKey) => {
            state.slotsByPageKey[pageKey] = state.slotsByPageKey[pageKey].filter(
              (slot) => slot.slotId !== action.meta.arg
            );
          });
        }
      })
      .addCase(deleteSlotAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Items
      .addCase(getItemsBySlotAsync.pending, (state) => {
        state.loadingItem = true;
        state.error = null;
      })
      .addCase(getItemsBySlotAsync.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.items = action.payload.data || [];
        if (action.payload.meta) {
          state.pagination = { ...state.pagination, ...action.payload.meta };
        }
      })
      .addCase(getItemsBySlotAsync.rejected, (state, action) => {
        state.loadingItem = false;
        state.items = [];
        state.error = action.payload;
      })

      .addCase(createItemAsync.pending, (state) => {
        state.loadingItem = true;
        state.error = null;
      })
      .addCase(createItemAsync.fulfilled, (state, action) => {
        state.loadingItem = false;
        if (action.payload?.data) state.items.unshift(action.payload.data);
      })
      .addCase(createItemAsync.rejected, (state, action) => {
        state.loadingItem = false;
        state.error = action.payload;
      })

      .addCase(updateItemAsync.pending, (state) => {
        state.loadingItem = true;
        state.error = null;
      })
      .addCase(updateItemAsync.fulfilled, (state, action) => {
        state.loadingItem = false;
        if (action.payload?.data) {
          const idx = state.items.findIndex((i) => i.itemId === action.payload.data.itemId);
          if (idx !== -1) state.items[idx] = action.payload.data;
        }
      })
      .addCase(updateItemAsync.rejected, (state, action) => {
        state.loadingItem = false;
        state.error = action.payload;
      })

      .addCase(reorderItemsAsync.pending, (state) => {
        state.loadingItem = true;
        state.error = null;
      })
      .addCase(reorderItemsAsync.fulfilled, (state, action) => {
        state.loadingItem = false;
        // replace items if returned
        if (action.payload?.data?.data) state.items = action.payload.data.data;
      })
      .addCase(reorderItemsAsync.rejected, (state, action) => {
        state.loadingItem = false;
        state.error = action.payload;
      })

      .addCase(deleteItemAsync.pending, (state) => {
        state.loadingItem = true;
        state.error = null;
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        state.loadingItem = false;
        if (action.meta?.arg) state.items = state.items.filter((i) => i.itemId !== action.meta.arg);
      })
      .addCase(deleteItemAsync.rejected, (state, action) => {
        state.loadingItem = false;
        state.error = action.payload;
      })

      // Upload SEO media
      .addCase(uploadSeoMediaAsync.pending, (state) => {
        state.loadingUpload = true;
        state.error = null;
      })
      .addCase(uploadSeoMediaAsync.fulfilled, (state) => {
        state.loadingUpload = false;
        // return metadata only, user will create item using returned metadata
      })
      .addCase(uploadSeoMediaAsync.rejected, (state, action) => {
        state.loadingUpload = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearCurrentSlot,
  clearCurrentItem,
  clearError,
  setSeoPageMediaActivePageKey,
  setSeoPageMediaSelectedSlotId,
  setSeoPageMediaViewMode,
} = seoMediaSlice.actions;

// Selectors
export const selectSeoSlots = (state) => state.seoMedia.slots;
export const selectSeoSlotsByPageKey = (state) => state.seoMedia.slotsByPageKey;
export const selectSeoItems = (state) => state.seoMedia.items;
export const selectSeoCurrentSlot = (state) => state.seoMedia.currentSlot;
export const selectSeoCurrentItem = (state) => state.seoMedia.currentItem;
export const selectSeoPagination = (state) => state.seoMedia.pagination;
export const selectSeoLoading = (state) => state.seoMedia.loading;
export const selectSeoLoadingItem = (state) => state.seoMedia.loadingItem;
export const selectSeoUploadLoading = (state) => state.seoMedia.loadingUpload;
export const selectSeoError = (state) => state.seoMedia.error;
export const selectSeoPageMediaState = (state) => state.seoMedia.pageMedia;
export const selectSeoPageMediaActivePageKey = (state) => state.seoMedia.pageMedia.activePageKey;
export const selectSeoPageMediaSelectedSlotId = (state) => state.seoMedia.pageMedia.selectedSlotId;
export const selectSeoPageMediaViewMode = (state) => state.seoMedia.pageMedia.viewMode;

export default seoMediaSlice.reducer;
