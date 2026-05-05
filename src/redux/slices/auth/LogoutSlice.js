import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const LogoutSlice = createSlice({
    name: "logoutRequest",
    initialState,
    reducers: {
        logoutRequest(state) {
            state.loading = true;
        },
        logoutRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        logoutRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        logoutStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    logoutRequest,
    logoutRequestSuccess,
    logoutRequestError,
    logoutStateReset,
} = LogoutSlice.actions;

export default LogoutSlice.reducer;
