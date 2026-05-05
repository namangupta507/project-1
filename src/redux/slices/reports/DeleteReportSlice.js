import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DeleteReportSlice = createSlice({
    name: "deleteReport",
    initialState,
    reducers: {
        deleteReportRequest(state) {
            state.loading = true;
        },
        deleteReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        deleteReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        deleteReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    deleteReportRequest,
    deleteReportRequestSuccess,
    deleteReportRequestError,
    deleteReportStateReset,
} = DeleteReportSlice.actions;

export default DeleteReportSlice.reducer;
