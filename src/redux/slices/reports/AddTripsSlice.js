import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const AddTripsToReportSlice = createSlice({
    name: "addTripsToReport",
    initialState,
    reducers: {
        addTripsToReportRequest(state) {
            state.loading = true;
        },
        addTripsToReportRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        addTripsToReportRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        addTripsToReportStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    addTripsToReportRequest,
    addTripsToReportRequestSuccess,
    addTripsToReportRequestError,
    addTripsToReportStateReset,
} = AddTripsToReportSlice.actions;

export default AddTripsToReportSlice.reducer;
