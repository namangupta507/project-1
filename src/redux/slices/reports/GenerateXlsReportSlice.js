import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const GenerateXlsReportSlice = createSlice({
    name: "generateXlsReport",
    initialState,
    reducers: {
        generateXlsReportRequest(state) {
            state.loading = true;
        },
        generateXlsReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        generateXlsReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    generateXlsReportRequest,
    generateXlsReportRequestSuccess,
    generateXlsReportRequestError,
} = GenerateXlsReportSlice.actions;

export default GenerateXlsReportSlice.reducer;
