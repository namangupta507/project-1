import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    response: undefined,
    error: undefined,
};

export const UpdateLoginSlice = createSlice({
    name: "updateLogin",
    initialState,
    reducers: {
        updateLoginRequest(state) {
            state.loading = true;
        },
        updateLoginRequestSuccess(state, action) {
            state.loading = false;
            state.response = action.payload;
            state.error = undefined;
        },
        updateLoginRequestError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.response = undefined;
        },
        updateLoginStateReset(state) {
            state.loading = false;
            state.error = undefined;
            state.response = undefined;
        },
    },
});

export const {
    updateLoginRequest,
    updateLoginRequestSuccess,
    updateLoginRequestError,
    updateLoginStateReset,
} = UpdateLoginSlice.actions;

export default UpdateLoginSlice.reducer;
