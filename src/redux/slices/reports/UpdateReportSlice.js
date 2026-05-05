import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateReportSlice = createSlice({
    name: "UpdateReport",
    initialState,
    reducers: {
        UpdateReportRequest(state) {
            state.loading = true;
        },
        UpdateReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        UpdateReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        UpdateReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    UpdateReportRequest,
    UpdateReportRequestSuccess,
    UpdateReportRequestError,
    UpdateReportStateReset,
} = UpdateReportSlice.actions;

export default UpdateReportSlice.reducer;
