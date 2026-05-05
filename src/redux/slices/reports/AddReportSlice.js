import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddReportSlice = createSlice({
    name: "addReport",
    initialState,
    reducers: {
        addReportRequest(state) {
            state.loading = true;
        },
        addReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addReportRequest,
    addReportRequestSuccess,
    addReportRequestError,
    addReportStateReset,
} = AddReportSlice.actions;

export default AddReportSlice.reducer;
