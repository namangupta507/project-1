import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const GenerateSummaryReportSlice = createSlice({
    name: "generateSummaryReport",
    initialState,
    reducers: {
        generateSummaryReportRequest(state) {
            state.loading = true;
        },
        generateSummaryReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        generateSummaryReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        generateSummaryReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    generateSummaryReportRequest,
    generateSummaryReportRequestSuccess,
    generateSummaryReportRequestError,
    generateSummaryReportStateReset,
} = GenerateSummaryReportSlice.actions;

export default GenerateSummaryReportSlice.reducer;
