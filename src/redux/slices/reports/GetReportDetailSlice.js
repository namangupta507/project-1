
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined, // NEW: stores 'trip' or 'expense'
};

export const ReportsDetailSlice = createSlice({
    name: "reportDetail",
    initialState,
    reducers: {
        getReportDetailRequest(state) {
            state.loading = true;
        },
        getReportDetailRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getReportDetailRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getReportDetailRequest,
    getReportDetailRequestSuccess,
    getReportDetailRequestError,
} = ReportsDetailSlice.actions;

export default ReportsDetailSlice.reducer;
