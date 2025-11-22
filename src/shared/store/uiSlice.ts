import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    sidebarOpen: boolean;
}

const initialState: UiState = {
    sidebarOpen: localStorage.getItem('sidebarOpen') === 'false' ? false : true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
            localStorage.setItem('sidebarOpen', action.payload.toString());
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
            localStorage.setItem('sidebarOpen', state.sidebarOpen.toString());
        },
    },
});

export const { setSidebarOpen, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
