import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const SendOtpSlice = createSlice({
    name: "sendOtpRequest",
    initialState,
    reducers: {
        sendOtpRequest(state) {
            state.loading = true;
        },
        sendOtpRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        sendOtpRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        sendOtpStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    sendOtpRequest,
    sendOtpRequestSuccess,
    sendOtpRequestError,
    sendOtpStateReset,
} = SendOtpSlice.actions;

export default SendOtpSlice.reducer;
