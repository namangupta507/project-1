
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const ReportMailSlice = createSlice({
    name: "reportMail",
    initialState,
    reducers: {
        reportMailRequest(state) {
            state.loading = true;
        },
        reportMailRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        reportMailRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    reportMailRequest,
    reportMailRequestSuccess,
    reportMailRequestError,
} = ReportMailSlice.actions;

export default ReportMailSlice.reducer;
