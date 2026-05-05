import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const RegisterSlice = createSlice({
    name: "registerRequest",
    initialState,
    reducers: {
        registerRequest(state) {
            state.loading = true;
        },
        registerRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        registerRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        registerStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    registerRequest,
    registerRequestSuccess,
    registerRequestError,
    registerStateReset,
} = RegisterSlice.actions;

export default RegisterSlice.reducer;
