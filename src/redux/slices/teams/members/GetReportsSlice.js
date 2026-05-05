
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
    type: undefined,
};

export const ReportsDataSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
        getReportsRequest(state) {
            state.loading = true;
        },
        getReportsRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.type = action.payload.type;
            state.error = undefined;
        },
        getReportsRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getReportsRequest,
    getReportsRequestSuccess,
    getReportsRequestError,
} = ReportsDataSlice.actions;

export default ReportsDataSlice.reducer;
