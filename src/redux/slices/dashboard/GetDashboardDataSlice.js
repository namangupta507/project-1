import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const DashboardDataSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        getDashboardDataRequest(state) {
            state.loading = true;
        },
        getDashboardDataRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        getDashboardDataRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
    },
});

export const {
    getDashboardDataRequest,
    getDashboardDataRequestSuccess,
    getDashboardDataRequestError,
} = DashboardDataSlice.actions;

export default DashboardDataSlice.reducer;
