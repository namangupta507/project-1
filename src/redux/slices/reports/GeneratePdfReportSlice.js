import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const GeneratePdfReportSlice = createSlice({
    name: "generatePdfReport",
    initialState,
    reducers: {
        generatePdfReportRequest(state) {
            state.loading = true;
        },
        generatePdfReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        generatePdfReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    generatePdfReportRequest,
    generatePdfReportRequestSuccess,
    generatePdfReportRequestError,
} = GeneratePdfReportSlice.actions;

export default GeneratePdfReportSlice.reducer;
