import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const ExportDataSlice = createSlice({
    name: "export",
    initialState,
    reducers: {
        getExportRequest(state) {
            state.loading = true;
        },
        getExportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getExportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getExportRequest,
    getExportRequestSuccess,
    getExportRequestError,
} = ExportDataSlice.actions;

export default ExportDataSlice.reducer;
