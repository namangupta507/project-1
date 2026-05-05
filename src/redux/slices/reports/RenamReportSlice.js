import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const RenameReportSlice = createSlice({
    name: "renameReport",
    initialState,
    reducers: {
        renameReportRequest(state) {
            state.loading = true;
        },
        renameReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        renameReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        renameReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    renameReportRequest,
    renameReportRequestSuccess,
    renameReportRequestError,
    renameReportStateReset,
} = RenameReportSlice.actions;

export default RenameReportSlice.reducer;
