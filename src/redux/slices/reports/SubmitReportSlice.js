import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const SubmitReportSlice = createSlice({
    name: "submitReport",
    initialState,
    reducers: {
        submitReportRequest(state) {
            state.loading = true;
        },
        submitReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        submitReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        submitReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    submitReportRequest,
    submitReportRequestSuccess,
    submitReportRequestError,
    submitReportStateReset,
} = SubmitReportSlice.actions;

export default SubmitReportSlice.reducer;
