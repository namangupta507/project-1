import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const VerifyOtpSlice = createSlice({
    name: "verifyOtpRequest",
    initialState,
    reducers: {
        verifyOtpRequest(state) {
            state.loading = true;
        },
        verifyOtpRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        verifyOtpRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        verifyOtpStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    verifyOtpRequest,
    verifyOtpRequestSuccess,
    verifyOtpRequestError,
    verifyOtpStateReset,
} = VerifyOtpSlice.actions;

export default VerifyOtpSlice.reducer;
