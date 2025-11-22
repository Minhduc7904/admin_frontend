import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ManagementModuleType, SubjectType } from '../types/module.types';

interface ModuleState {
    selectedModule: ManagementModuleType | null;
    selectedSubject: SubjectType | null;
}

const initialState: ModuleState = {
    selectedModule: (localStorage.getItem('selectedModule') as ManagementModuleType) || null,
    selectedSubject: (localStorage.getItem('selectedSubject') as SubjectType) || null,
};

const moduleSlice = createSlice({
    name: 'module',
    initialState,
    reducers: {
        setSelectedModule: (state, action: PayloadAction<ManagementModuleType>) => {
            state.selectedModule = action.payload;
            localStorage.setItem('selectedModule', action.payload);
        },
        setSelectedSubject: (state, action: PayloadAction<SubjectType>) => {
            state.selectedSubject = action.payload;
            localStorage.setItem('selectedSubject', action.payload);
        },
        clearModuleSelection: (state) => {
            state.selectedModule = null;
            state.selectedSubject = null;
            localStorage.removeItem('selectedModule');
            localStorage.removeItem('selectedSubject');
        },
    },
});

export const { setSelectedModule, setSelectedSubject, clearModuleSelection } = moduleSlice.actions;
export default moduleSlice.reducer;
