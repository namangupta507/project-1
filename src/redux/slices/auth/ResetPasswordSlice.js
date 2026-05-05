import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const ResetPasswordSlice = createSlice({
    name: "resetPasswordRequest",
    initialState,
    reducers: {
        resetPasswordRequest(state) {
            state.loading = true;
        },
        resetPasswordRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        resetPasswordRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        resetPasswordStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    resetPasswordRequest,
    resetPasswordRequestSuccess,
    resetPasswordRequestError,
    resetPasswordStateReset,
} = ResetPasswordSlice.actions;

export default ResetPasswordSlice.reducer;
