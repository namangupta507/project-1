import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const LoginSlice = createSlice({
    name: "loginRequest",
    initialState,
    reducers: {
        loginRequest(state) {
            state.loading = true;
        },
        loginRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        loginRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        loginStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    loginRequest,
    loginRequestSuccess,
    loginRequestError,
    loginStateReset,
} = LoginSlice.actions;

export default LoginSlice.reducer;
