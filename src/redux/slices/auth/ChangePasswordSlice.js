import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const ChangePasswordSlice = createSlice({
    name: "changePasswordRequest",
    initialState,
    reducers: {
        changePasswordRequest(state) {
            state.loading = true;
        },
        changePasswordRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        changePasswordRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        changePasswordStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    changePasswordRequest,
    changePasswordRequestSuccess,
    changePasswordRequestError,
    changePasswordStateReset,
} = ChangePasswordSlice.actions;

export default ChangePasswordSlice.reducer;
